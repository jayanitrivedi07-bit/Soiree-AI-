import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Soirée AI API Test Suite', () => {
  let createdEventId: string;

  // 1. Health check
  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  // 2. Initial event retrieval
  it('GET /api/events should return initial events list', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // 3. Create Event
  it('POST /api/events should create a new event with initial tasks and expenses', async () => {
    const newEvent = {
      name: 'Jaipur Palace Royal Sangeet',
      type: 'Sangeet & Cocktail',
      date: '2026-12-15',
      location: 'Rambagh Palace, Jaipur, Rajasthan',
      guestCount: 200,
      budget: 3500000,
      theme: 'Royal Emerald & Gold Elegance',
      dietary: 'Rajasthani Heritage Vegetarian & Continental',
      notes: 'Sufi night musical performance, fire dancers',
    };

    const res = await request(app).post('/api/events').send(newEvent);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(newEvent.name);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
    expect(res.body.data.expenses.length).toBeGreaterThan(0);

    createdEventId = res.body.data.id;
  });

  // 4. Retrieve Created Event
  it('GET /api/events/:id should return created event details', async () => {
    const res = await request(app).get(`/api/events/${createdEventId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdEventId);
  });

  // 5. Validation error on bad input
  it('POST /api/events with invalid budget should return 400', async () => {
    const invalidEvent = {
      name: 'Test Event',
      type: 'Birthday',
      date: 'not-a-date',
      location: 'Delhi',
      guestCount: -5,
      budget: -100,
      theme: 'Theme',
    };

    const res = await request(app).post('/api/events').send(invalidEvent);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // 6. Budget calculation & Expense persistence
  it('GET /api/events/:id/budget should return calculated budget summary', async () => {
    const res = await request(app).get(`/api/events/${createdEventId}/budget`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.summary.totalBudget).toBe(3500000);
    expect(typeof res.body.data.summary.remainingBudget).toBe('number');
  });

  it('POST /api/events/:id/expenses should add an expense and recalculate', async () => {
    const expense = {
      category: 'Florals',
      description: 'Marigold & Jasmine Royal Mandap',
      estimated: 250000,
      status: 'pending',
    };

    const res = await request(app).post(`/api/events/${createdEventId}/expenses`).send(expense);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.estimated).toBe(250000);
  });

  // 7. Tasks management & status toggle
  it('POST /api/events/:id/tasks should add a task', async () => {
    const task = {
      title: 'Order bespoke silk turbans for groom entourage',
      category: 'Wardrobe',
      dueDate: '2026-11-20',
      priority: 'high',
      done: false,
    };

    const res = await request(app).post(`/api/events/${createdEventId}/tasks`).send(task);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(task.title);

    // Toggle status
    const taskId = res.body.data.id;
    const patchRes = await request(app).patch(`/api/tasks/${taskId}/status`).send({ done: true, eventId: createdEventId });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.done).toBe(true);
  });

  // 8. Vendors list & add to event
  it('GET /api/vendors should return catalog vendors', async () => {
    const res = await request(app).get('/api/vendors');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/events/:id/vendors should add vendor to event', async () => {
    const vendor = {
      name: 'Shehnai Heritage Troupe',
      category: 'Entertainment',
      contact: 'shehnai@heritage.in',
      phone: '+91 98111 22334',
      price: 85000,
      status: 'shortlisted',
    };

    const res = await request(app).post(`/api/events/${createdEventId}/vendors`).send(vendor);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(vendor.name);
  });

  // 9. Gemini AI Chat & Planning Integration
  it('POST /api/ai/chat should return intelligent response with suggestions', async () => {
    const res = await request(app).post('/api/ai/chat').send({
      eventId: createdEventId,
      message: 'What are the top 3 priorities for our royal sangeet budget?',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toBeDefined();
    expect(typeof res.body.data.reply).toBe('string');
    expect(Array.isArray(res.body.data.suggestions)).toBe(true);
  }, 25000);

  it('POST /api/ai/generate-plan should return structured celebration plan', async () => {
    const res = await request(app).post('/api/ai/generate-plan').send({
      eventId: createdEventId,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.eventConcept).toBeDefined();
    expect(Array.isArray(res.body.data.budgetAllocation)).toBe(true);
  }, 25000);
});

