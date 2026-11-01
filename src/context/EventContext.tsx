import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventModel, Task, Expense, Vendor, ChatMessage } from '../types';
import { loadStoredEvent, saveStoredEvent, resetStoredEvent, loadStoredChat, saveStoredChat } from '../lib/storage';
import { DEFAULT_EVENT, DEFAULT_VENDORS, INITIAL_CHAT_MESSAGES } from '../data/defaultData';
import { eventApi, taskApi, budgetApi, vendorApi } from '../lib/api';

interface EventContextType {
  event: EventModel;
  updateEvent: (updates: Partial<EventModel>) => void;
  createEvent: (brief: {
    name: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    theme: string;
    dietary?: string;
    notes?: string;
  }) => Promise<string>;
  resetEventToDefault: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expenseId: string, updates: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  updateVendorStatus: (vendorId: string, status: Vendor['status']) => void;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  removeVendor: (vendorId: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [event, setEventState] = useState<EventModel>(() => loadStoredEvent());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStoredChat());

  // Save to localStorage whenever event changes
  useEffect(() => {
    saveStoredEvent(event);
  }, [event]);

  // Save to localStorage whenever chatMessages change
  useEffect(() => {
    saveStoredChat(chatMessages);
  }, [chatMessages]);

  // Attempt to sync from backend on initial mount
  useEffect(() => {
    eventApi
      .getEvent(event.id)
      .then((serverEvent) => {
        if (serverEvent && serverEvent.id) {
          setEventState((prev) => ({
            ...prev,
            ...serverEvent,
            // Keep local tasks/expenses if server returned empty
            tasks: serverEvent.tasks && serverEvent.tasks.length > 0 ? serverEvent.tasks : prev.tasks,
            expenses: serverEvent.expenses && serverEvent.expenses.length > 0 ? serverEvent.expenses : prev.expenses,
            vendors: serverEvent.vendors && serverEvent.vendors.length > 0 ? serverEvent.vendors : prev.vendors,
          }));
        }
      })
      .catch(() => {
        // Backend offline or local fallback active; seamlessly continue with local storage
      });
  }, []);

  const updateEvent = (updates: Partial<EventModel>) => {
    setEventState((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    eventApi.updateEvent(event.id, updates).catch(() => {});
  };

  const createEvent = async (brief: {
    name: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    theme: string;
    dietary?: string;
    notes?: string;
  }): Promise<string> => {
    // 1. Call real backend API to create event
    const serverEvent = await eventApi.createEvent(brief);

    if (!serverEvent || !serverEvent.id) {
      throw new Error('Backend failed to return valid created event ID.');
    }

    // 2. Assemble complete event model with server tasks, expenses, and fallback vendors
    const completeEvent: EventModel = {
      schemaVersion: 1,
      id: serverEvent.id,
      name: serverEvent.name,
      type: serverEvent.type,
      date: serverEvent.date,
      location: serverEvent.location,
      guestCount: serverEvent.guestCount,
      budget: serverEvent.budget,
      currency: serverEvent.currency || 'INR',
      theme: serverEvent.theme,
      dietary: serverEvent.dietary || 'Standard luxury service',
      notes: serverEvent.notes || '',
      tasks: serverEvent.tasks && serverEvent.tasks.length > 0 ? serverEvent.tasks : [],
      expenses: serverEvent.expenses && serverEvent.expenses.length > 0 ? serverEvent.expenses : [],
      vendors: serverEvent.vendors && serverEvent.vendors.length > 0 ? serverEvent.vendors : DEFAULT_VENDORS,
      createdAt: serverEvent.createdAt || new Date().toISOString(),
      updatedAt: serverEvent.updatedAt || new Date().toISOString(),
    };

    // 3. Persist to state and localStorage
    setEventState(completeEvent);
    saveStoredEvent(completeEvent);

    return serverEvent.id;
  };

  const resetEventToDefault = () => {
    const def = resetStoredEvent();
    setEventState(def);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setEventState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    taskApi.addTask(event.id, {
      title: task.title,
      category: task.category,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done,
    }).catch(() => {});
  };

  const toggleTask = (taskId: string) => {
    const current = event.tasks.find((t) => t.id === taskId);
    const newDone = current ? !current.done : true;

    setEventState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, done: newDone } : t)),
    }));
    taskApi.toggleTaskStatus(taskId, newDone, event.id).catch(() => {});
  };

  const deleteTask = (taskId: string) => {
    setEventState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    taskApi.deleteTask(taskId, event.id).catch(() => {});
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setEventState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
    taskApi.updateTask(taskId, updates, event.id).catch(() => {});
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setEventState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }));
    budgetApi.addExpense(event.id, {
      category: expense.category,
      description: expense.description,
      estimated: expense.estimated,
      actual: expense.actual,
      status: expense.status,
    }).catch(() => {});
  };

  const updateExpense = (expenseId: string, updates: Partial<Expense>) => {
    setEventState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === expenseId ? { ...e, ...updates } : e)),
    }));
    budgetApi.updateExpense(expenseId, updates, event.id).catch(() => {});
  };

  const deleteExpense = (expenseId: string) => {
    setEventState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
    budgetApi.deleteExpense(expenseId, event.id).catch(() => {});
  };

  const updateVendorStatus = (vendorId: string, status: Vendor['status']) => {
    setEventState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === vendorId ? { ...v, status } : v)),
    }));
    vendorApi.updateVendorStatus(event.id, vendorId, status).catch(() => {});
  };

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`,
      isDemo: false,
    };
    setEventState((prev) => ({
      ...prev,
      vendors: [newVendor, ...prev.vendors],
    }));
    vendorApi.addVendorToEvent(event.id, newVendor).catch(() => {});
  };

  const removeVendor = (vendorId: string) => {
    setEventState((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== vendorId),
    }));
    vendorApi.removeVendorFromEvent(event.id, vendorId).catch(() => {});
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
  };

  return (
    <EventContext.Provider
      value={{
        event,
        updateEvent,
        createEvent,
        resetEventToDefault,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        addExpense,
        updateExpense,
        deleteExpense,
        updateVendorStatus,
        addVendor,
        removeVendor,
        chatMessages,
        addChatMessage,
        clearChat
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

