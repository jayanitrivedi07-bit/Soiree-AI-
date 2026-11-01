import { localDb, getSupabase } from '../config/database.js';
import { Task } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import { randomUUID } from 'crypto';

export interface TaskProgress {
  total: number;
  completed: number;
  percentage: number;
}

export class TaskService {
  private calcProgress(tasks: Task[]): TaskProgress {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }

  public async getTasks(eventId: string): Promise<{ tasks: Task[]; progress: TaskProgress }> {
    const supabase = getSupabase();
    let tasks: Task[] = [];

    if (supabase) {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });
      if (data) {
        tasks = data.map((t: any) => ({
          id: t.id,
          eventId: t.event_id,
          title: t.title,
          category: t.category,
          dueDate: t.deadline,
          done: t.is_done,
          priority: t.priority,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }));
        return { tasks, progress: this.calcProgress(tasks) };
      }
    }

    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);
    tasks = event.tasks;
    return { tasks, progress: this.calcProgress(tasks) };
  }

  public async addTask(
    eventId: string,
    input: { title: string; category: string; dueDate: string; priority: Task['priority']; done?: boolean }
  ): Promise<Task> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const id = randomUUID();
    const now = new Date().toISOString();
    const task: Task = {
      id,
      eventId,
      title: input.title,
      category: input.category,
      dueDate: input.dueDate,
      done: input.done ?? false,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('tasks').insert({
          id,
          event_id: eventId,
          title: task.title,
          category: task.category,
          deadline: task.dueDate,
          priority: task.priority,
          is_done: task.done,
        });
      } catch (err) {
        console.warn('[Supabase addTask fallback]', err);
      }
    }

    event.tasks.push(task);
    event.updatedAt = now;
    localDb.events.set(eventId, event);
    return task;
  }

  public async updateTask(
    taskId: string,
    eventId?: string,
    updates: Partial<Pick<Task, 'title' | 'category' | 'dueDate' | 'done' | 'priority'>> = {}
  ): Promise<Task> {
    let event = eventId ? localDb.events.get(eventId) : undefined;
    if (!event) {
      for (const ev of localDb.events.values()) {
        if (ev.tasks.some((t) => t.id === taskId)) {
          event = ev;
          eventId = ev.id;
          break;
        }
      }
    }

    if (!event) throw new NotFoundError(`Task "${taskId}" not found in any event.`);

    const idx = event.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new NotFoundError(`Task "${taskId}" not found.`);

    const now = new Date().toISOString();
    event.tasks[idx] = { ...event.tasks[idx], ...updates, updatedAt: now };
    event.updatedAt = now;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload: any = { updated_at: now };
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.dueDate !== undefined) payload.deadline = updates.dueDate;
        if (updates.done !== undefined) payload.is_done = updates.done;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        await supabase.from('tasks').update(payload).eq('id', taskId);
      } catch (err) {
        console.warn('[Supabase updateTask fallback]', err);
      }
    }

    localDb.events.set(event.id, event);
    return event.tasks[idx];
  }

  public async deleteTask(taskId: string, eventId?: string): Promise<boolean> {
    let event = eventId ? localDb.events.get(eventId) : undefined;
    if (!event) {
      for (const ev of localDb.events.values()) {
        if (ev.tasks.some((t) => t.id === taskId)) {
          event = ev;
          eventId = ev.id;
          break;
        }
      }
    }

    if (!event) throw new NotFoundError(`Task "${taskId}" not found in any event.`);

    const before = event.tasks.length;
    event.tasks = event.tasks.filter((t) => t.id !== taskId);
    const deleted = event.tasks.length < before;

    if (deleted) {
      event.updatedAt = new Date().toISOString();
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('tasks').delete().eq('id', taskId);
        } catch (err) {
          console.warn('[Supabase deleteTask fallback]', err);
        }
      }
      localDb.events.set(event.id, event);
    }
    return deleted;
  }

  public async toggleTaskStatus(taskId: string, eventId?: string, done = false): Promise<Task> {
    return this.updateTask(taskId, eventId, { done });
  }
}

export const taskService = new TaskService();
