/**
 * Soirée AI Frontend API Client
 * Seamlessly interfaces with the Express.js Backend & Gemini AI integration.
 */

import { EventModel, Task, Expense, Vendor, ChatMessage } from '../types';

function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

  if (envUrl) {
    // Strip trailing slashes
    const cleanUrl = envUrl.replace(/\/+$/, '');
    // Ensure we do not duplicate /api
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // Development fallback only when running in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }

  // Production fallback to relative /api (compatible with reverse proxies and custom domains)
  return '/api';
}

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: any;
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const payload: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: `HTTP error ${response.status}: ${response.statusText}`,
    data: null as any,
  }));

  if (!response.ok || !payload.success) {
    const errorMsg = payload.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    (err as any).error = payload.error;
    throw err;
  }

  return payload.data;
}

// -----------------------------------------------------------------------------
// Events API
// -----------------------------------------------------------------------------
export const eventApi = {
  getEvents: () => request<EventModel[]>('/events'),
  getEvent: (id: string) => request<EventModel>(`/events/${id}`),
  createEvent: (data: {
    name: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    theme: string;
    dietary?: string;
    notes?: string;
  }) =>
    request<EventModel>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEvent: (id: string, updates: Partial<EventModel>) =>
    request<EventModel>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteEvent: (id: string) =>
    request<{ deleted: boolean }>(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// -----------------------------------------------------------------------------
// Budget & Expenses API
// -----------------------------------------------------------------------------
export const budgetApi = {
  getBudget: (eventId: string) =>
    request<{ expenses: Expense[]; summary: any }>(`/events/${eventId}/budget`),
  addExpense: (
    eventId: string,
    expense: { category: string; description: string; estimated: number; actual?: number | null; status?: string }
  ) =>
    request<Expense>(`/events/${eventId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expense),
    }),
  updateExpense: (expenseId: string, updates: Partial<Expense>, eventId?: string) =>
    request<Expense>(`/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updates, eventId }),
    }),
  deleteExpense: (expenseId: string, eventId?: string) =>
    request<{ deleted: boolean }>(`/expenses/${expenseId}${eventId ? `?eventId=${eventId}` : ''}`, {
      method: 'DELETE',
    }),
};

// -----------------------------------------------------------------------------
// Tasks API
// -----------------------------------------------------------------------------
export const taskApi = {
  getTasks: (eventId: string) =>
    request<{ tasks: Task[]; progress: { total: number; completed: number; percentage: number } }>(
      `/events/${eventId}/tasks`
    ),
  addTask: (
    eventId: string,
    task: { title: string; category: string; dueDate: string; priority: Task['priority']; done?: boolean }
  ) =>
    request<Task>(`/events/${eventId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  updateTask: (taskId: string, updates: Partial<Task>, eventId?: string) =>
    request<Task>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updates, eventId }),
    }),
  deleteTask: (taskId: string, eventId?: string) =>
    request<{ deleted: boolean }>(`/tasks/${taskId}${eventId ? `?eventId=${eventId}` : ''}`, {
      method: 'DELETE',
    }),
  toggleTaskStatus: (taskId: string, done: boolean, eventId?: string) =>
    request<Task>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ done, eventId }),
    }),
};

// -----------------------------------------------------------------------------
// Vendors API
// -----------------------------------------------------------------------------
export const vendorApi = {
  getAllVendors: (category?: string) =>
    request<Vendor[]>(`/vendors${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getVendorById: (id: string) => request<Vendor>(`/vendors/${id}`),
  getEventVendors: (eventId: string) => request<Vendor[]>(`/events/${eventId}/vendors`),
  addVendorToEvent: (eventId: string, vendor: Partial<Vendor>) =>
    request<Vendor>(`/events/${eventId}/vendors`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    }),
  removeVendorFromEvent: (eventId: string, vendorId: string) =>
    request<{ removed: boolean }>(`/events/${eventId}/vendors/${vendorId}`, {
      method: 'DELETE',
    }),
  updateVendorStatus: (eventId: string, vendorId: string, status: Vendor['status']) =>
    request<Vendor>(`/events/${eventId}/vendors/${vendorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// -----------------------------------------------------------------------------
// Gemini AI API
// -----------------------------------------------------------------------------
export const aiApi = {
  generatePlan: (eventId: string) =>
    request<any>('/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    }),
  chat: (eventId: string, message: string, history?: { role: 'user' | 'assistant'; text: string }[]) =>
    request<{ reply: string; suggestions: string[] }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ eventId, message, history }),
    }),
  getBudgetSuggestions: (eventId: string, customBudget?: number, guestCount?: number) =>
    request<any>('/ai/budget-suggestions', {
      method: 'POST',
      body: JSON.stringify({ eventId, customBudget, guestCount }),
    }),
  generateTimeline: (eventId: string) =>
    request<any>('/ai/generate-timeline', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    }),
  getChatHistory: (eventId: string) => request<ChatMessage[]>(`/ai/chat-history/${eventId}`),
};

