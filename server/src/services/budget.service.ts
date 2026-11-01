import { localDb, getSupabase } from '../config/database.js';
import { Expense, BudgetSummary } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import { randomUUID } from 'crypto';

export class BudgetService {
  private computeSummary(event: { budget: number; expenses: Expense[] }): BudgetSummary {
    const expenses = event.expenses || [];
    const totalBudget = event.budget;

    const estimatedTotal = expenses.reduce((sum, e) => sum + e.estimated, 0);
    const actualTotal = expenses.reduce((sum, e) => sum + (e.actual ?? 0), 0);
    // committed = actual if set, else estimated
    const committedTotal = expenses.reduce(
      (sum, e) => sum + (e.actual !== null && e.actual !== undefined ? e.actual : e.estimated),
      0
    );

    const remainingBudget = totalBudget - committedTotal;
    const isOverBudget = remainingBudget < 0;
    const overAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
    const percentageUsed = totalBudget > 0 ? Math.round((committedTotal / totalBudget) * 100) : 0;

    // Per-category breakdown
    const categoryMap = new Map<string, { estimated: number; actual: number; count: number }>();
    for (const e of expenses) {
      const existing = categoryMap.get(e.category) ?? { estimated: 0, actual: 0, count: 0 };
      categoryMap.set(e.category, {
        estimated: existing.estimated + e.estimated,
        actual: existing.actual + (e.actual ?? 0),
        count: existing.count + 1,
      });
    }
    const categories = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));

    return {
      totalBudget,
      estimatedTotal,
      actualTotal,
      committedTotal,
      remainingBudget,
      isOverBudget,
      overAmount,
      percentageUsed,
      categories,
    };
  }

  public async getEventBudget(eventId: string): Promise<{ expenses: Expense[]; summary: BudgetSummary }> {
    const supabase = getSupabase();
    if (supabase) {
      const { data: eventData } = await supabase.from('events').select('total_budget').eq('id', eventId).single();
      const { data: expensesData } = await supabase.from('expenses').select('*').eq('event_id', eventId);
      if (eventData && expensesData) {
        const expenses: Expense[] = expensesData.map((e: any) => ({
          id: e.id,
          eventId: e.event_id,
          category: e.category,
          description: e.description,
          estimated: Number(e.estimated_amount),
          actual: e.actual_amount !== null ? Number(e.actual_amount) : null,
          status: e.status,
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        }));
        const summary = this.computeSummary({ budget: Number(eventData.total_budget), expenses });
        return { expenses, summary };
      }
    }

    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);
    const summary = this.computeSummary(event);
    return { expenses: event.expenses, summary };
  }

  public async addExpense(
    eventId: string,
    input: { category: string; description: string; estimated: number; actual?: number | null; status?: string }
  ): Promise<Expense> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const id = randomUUID();
    const now = new Date().toISOString();
    const expense: Expense = {
      id,
      eventId,
      category: input.category,
      description: input.description,
      estimated: input.estimated,
      actual: input.actual ?? null,
      status: (input.status as Expense['status']) ?? 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('expenses').insert({
          id,
          event_id: eventId,
          category: expense.category,
          description: expense.description,
          estimated_amount: expense.estimated,
          actual_amount: expense.actual,
          status: expense.status,
        });
      } catch (err) {
        console.warn('[Supabase addExpense fallback]', err);
      }
    }

    event.expenses.push(expense);
    event.updatedAt = now;
    localDb.events.set(eventId, event);
    return expense;
  }

  public async updateExpense(
    expenseId: string,
    eventId?: string,
    updates: Partial<Pick<Expense, 'category' | 'description' | 'estimated' | 'actual' | 'status'>> = {}
  ): Promise<Expense> {
    let event = eventId ? localDb.events.get(eventId) : undefined;
    if (!event) {
      for (const ev of localDb.events.values()) {
        if (ev.expenses.some((e) => e.id === expenseId)) {
          event = ev;
          eventId = ev.id;
          break;
        }
      }
    }

    if (!event) throw new NotFoundError(`Expense "${expenseId}" not found in any event.`);

    const idx = event.expenses.findIndex((e) => e.id === expenseId);
    if (idx === -1) throw new NotFoundError(`Expense "${expenseId}" not found.`);

    const now = new Date().toISOString();
    event.expenses[idx] = { ...event.expenses[idx], ...updates, updatedAt: now };
    event.updatedAt = now;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const payload: any = { updated_at: now };
        if (updates.category !== undefined) payload.category = updates.category;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.estimated !== undefined) payload.estimated_amount = updates.estimated;
        if (updates.actual !== undefined) payload.actual_amount = updates.actual;
        if (updates.status !== undefined) payload.status = updates.status;
        await supabase.from('expenses').update(payload).eq('id', expenseId);
      } catch (err) {
        console.warn('[Supabase updateExpense fallback]', err);
      }
    }

    localDb.events.set(event.id, event);
    return event.expenses[idx];
  }

  public async deleteExpense(expenseId: string, eventId?: string): Promise<boolean> {
    let event = eventId ? localDb.events.get(eventId) : undefined;
    if (!event) {
      for (const ev of localDb.events.values()) {
        if (ev.expenses.some((e) => e.id === expenseId)) {
          event = ev;
          eventId = ev.id;
          break;
        }
      }
    }

    if (!event) throw new NotFoundError(`Expense "${expenseId}" not found in any event.`);

    const before = event.expenses.length;
    event.expenses = event.expenses.filter((e) => e.id !== expenseId);
    const deleted = event.expenses.length < before;

    if (deleted) {
      event.updatedAt = new Date().toISOString();
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('expenses').delete().eq('id', expenseId);
        } catch (err) {
          console.warn('[Supabase deleteExpense fallback]', err);
        }
      }
      localDb.events.set(event.id, event);
    }
    return deleted;
  }
}

export const budgetService = new BudgetService();
