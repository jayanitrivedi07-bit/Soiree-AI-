import { localDb, getSupabase } from '../config/database.js';
import { EventModel, Task, Expense, Vendor } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import { randomUUID } from 'crypto';

export class EventService {
  public async getEvents(): Promise<EventModel[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((d: any) => ({
          schemaVersion: 1,
          id: d.id,
          name: d.name,
          type: d.event_type,
          date: d.event_date,
          location: d.location,
          guestCount: d.guest_count,
          budget: Number(d.total_budget),
          currency: d.currency || 'INR',
          theme: d.theme,
          dietary: d.dietary_preferences,
          notes: d.additional_requirements,
          tasks: [],
          expenses: [],
          vendors: [],
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    }
    return Array.from(localDb.events.values());
  }

  public async getEventById(id: string): Promise<EventModel> {
    const supabase = getSupabase();
    if (supabase) {
      const { data: eventData, error: eventErr } = await supabase.from('events').select('*').eq('id', id).single();
      if (!eventErr && eventData) {
        const [expensesRes, tasksRes, eventVendorsRes] = await Promise.all([
          supabase.from('expenses').select('*').eq('event_id', id),
          supabase.from('tasks').select('*').eq('event_id', id),
          supabase.from('event_vendors').select('*, vendors(*)').eq('event_id', id),
        ]);

        const tasks: Task[] = (tasksRes.data || []).map((t: any) => ({
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

        const expenses: Expense[] = (expensesRes.data || []).map((e: any) => ({
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

        const vendors: Vendor[] = (eventVendorsRes.data || []).map((ev: any) => ({
          id: ev.vendor_id,
          name: ev.vendors?.name || 'Artisan',
          category: ev.vendors?.category || 'General',
          contact: ev.vendors?.contact_email || '',
          phone: ev.vendors?.phone || '',
          price: Number(ev.quotation_amount || ev.vendors?.price_range || 0),
          status: ev.booking_status,
          rating: Number(ev.vendors?.rating || 4.9),
          reviewsCount: ev.vendors?.reviews_count || 10,
          location: ev.vendors?.location,
          tagline: ev.vendors?.tagline,
          description: ev.vendors?.description,
          image: ev.vendors?.image_url,
          gallery: ev.vendors?.gallery_urls,
          services: ev.vendors?.services,
          leadTime: ev.vendors?.lead_time,
          isDemo: ev.vendors?.is_demo,
        }));

        return {
          schemaVersion: 1,
          id: eventData.id,
          name: eventData.name,
          type: eventData.event_type,
          date: eventData.event_date,
          location: eventData.location,
          guestCount: eventData.guest_count,
          budget: Number(eventData.total_budget),
          currency: eventData.currency || 'INR',
          theme: eventData.theme,
          dietary: eventData.dietary_preferences,
          notes: eventData.additional_requirements,
          tasks,
          expenses,
          vendors,
          createdAt: eventData.created_at,
          updatedAt: eventData.updated_at,
        };
      }
    }

    const local = localDb.events.get(id);
    if (!local) {
      throw new NotFoundError(`Event with id "${id}" was not found.`);
    }
    return local;
  }

  public async createEvent(brief: {
    name: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    theme: string;
    currency?: string;
    dietary?: string;
    notes?: string;
  }): Promise<EventModel> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const initialTasks: Task[] = [
      { id: randomUUID(), eventId: id, title: `Secure primary venue in ${brief.location.split(',')[0]}`, category: 'Venue', dueDate: brief.date, done: false, priority: 'high' },
      { id: randomUUID(), eventId: id, title: `Finalize culinary tasting & catering for ${brief.guestCount} guests`, category: 'Catering', dueDate: brief.date, done: false, priority: 'high' },
      { id: randomUUID(), eventId: id, title: `Select floral canopy & botanical motif for ${brief.theme}`, category: 'Florals', dueDate: brief.date, done: false, priority: 'medium' },
      { id: randomUUID(), eventId: id, title: 'Send digital save-the-dates & collect patron RSVPs', category: 'Stationery', dueDate: brief.date, done: false, priority: 'medium' },
      { id: randomUUID(), eventId: id, title: 'Contract master photographer & cinematographer', category: 'Photography', dueDate: brief.date, done: false, priority: 'high' },
    ];

    const initialExpenses: Expense[] = [
      { id: randomUUID(), eventId: id, category: 'Venue', description: 'Primary venue & service staffing', estimated: Math.round(brief.budget * 0.35), actual: null, status: 'pending' },
      { id: randomUUID(), eventId: id, category: 'Catering', description: `Bespoke banquet for ${brief.guestCount} guests`, estimated: Math.round(brief.budget * 0.28), actual: null, status: 'pending' },
      { id: randomUUID(), eventId: id, category: 'Florals', description: 'Botanical installations & table styling', estimated: Math.round(brief.budget * 0.12), actual: null, status: 'pending' },
      { id: randomUUID(), eventId: id, category: 'Photography', description: 'Editorial coverage & film reel', estimated: Math.round(brief.budget * 0.10), actual: null, status: 'pending' },
      { id: randomUUID(), eventId: id, category: 'Entertainment', description: 'Live ambient musicians & sound design', estimated: Math.round(brief.budget * 0.07), actual: null, status: 'pending' },
      { id: randomUUID(), eventId: id, category: 'Contingency', description: 'Host emergency buffer & logistical reserve', estimated: Math.round(brief.budget * 0.08), actual: null, status: 'reserved' },
    ];

    const initialVendors = Array.from(localDb.vendors.values());

    const newEvent: EventModel = {
      schemaVersion: 1,
      id,
      name: brief.name,
      type: brief.type,
      date: brief.date,
      location: brief.location,
      guestCount: brief.guestCount,
      budget: brief.budget,
      currency: brief.currency || 'INR',
      theme: brief.theme,
      dietary: brief.dietary || 'Standard luxury service',
      notes: brief.notes || '',
      tasks: initialTasks,
      expenses: initialExpenses,
      vendors: initialVendors,
      createdAt: now,
      updatedAt: now,
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('events').insert({
          id,
          name: brief.name,
          event_type: brief.type,
          event_date: brief.date,
          location: brief.location,
          guest_count: brief.guestCount,
          total_budget: brief.budget,
          currency: brief.currency || 'INR',
          theme: brief.theme,
          dietary_preferences: brief.dietary,
          additional_requirements: brief.notes,
        });

        // Insert initial tasks & expenses
        await Promise.all([
          supabase.from('tasks').insert(initialTasks.map(t => ({
            id: t.id,
            event_id: id,
            title: t.title,
            category: t.category,
            deadline: t.dueDate,
            priority: t.priority,
            is_done: t.done,
          }))),
          supabase.from('expenses').insert(initialExpenses.map(e => ({
            id: e.id,
            event_id: id,
            category: e.category,
            description: e.description,
            estimated_amount: e.estimated,
            status: e.status,
          })))
        ]);
      } catch (err) {
        console.warn('[Supabase Insert Fallback]', err);
      }
    }

    localDb.events.set(id, newEvent);
    return newEvent;
  }

  public async updateEvent(id: string, updates: Partial<EventModel>): Promise<EventModel> {
    const existing = await this.getEventById(id);
    const updated: EventModel = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      const updatePayload: any = {};
      if (updates.name !== undefined) updatePayload.name = updates.name;
      if (updates.type !== undefined) updatePayload.event_type = updates.type;
      if (updates.date !== undefined) updatePayload.event_date = updates.date;
      if (updates.location !== undefined) updatePayload.location = updates.location;
      if (updates.guestCount !== undefined) updatePayload.guest_count = updates.guestCount;
      if (updates.budget !== undefined) updatePayload.total_budget = updates.budget;
      if (updates.theme !== undefined) updatePayload.theme = updates.theme;
      if (updates.dietary !== undefined) updatePayload.dietary_preferences = updates.dietary;
      if (updates.notes !== undefined) updatePayload.additional_requirements = updates.notes;
      updatePayload.updated_at = new Date().toISOString();

      await supabase.from('events').update(updatePayload).eq('id', id);
    }

    localDb.events.set(id, updated);
    return updated;
  }

  public async deleteEvent(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('events').delete().eq('id', id);
    }
    return localDb.events.delete(id);
  }
}

export const eventService = new EventService();

