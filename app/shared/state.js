/**
 * state.js — Soiree AI shared application state
 * Uses localStorage to persist event data across pages.
 * Schema version: 1
 */

const STORAGE_KEY = 'soiree_ai_event_v1';

const DEFAULT_EVENT = {
  schemaVersion: 1,
  id: 'demo-event-001',
  name: 'Udaipur Heritage Gala',
  type: 'Wedding',
  date: '2025-10-18',
  location: 'The Leela Palace, Udaipur, Rajasthan',
  guestCount: 135,
  budget: 2500000,
  currency: 'INR',
  mood: 'Burgundy & Candlelight Romance',
  notes: 'Live classical music during cocktail hour, rose petal pathway, traditional mehndi setup.',
  tasks: [
    { id: 't1', title: 'Book venue — The Leela Palace', category: 'Venue', dueDate: '2025-07-01', done: true, priority: 'high' },
    { id: 't2', title: 'Confirm catering with Kiran Caterers', category: 'Catering', dueDate: '2025-07-15', done: true, priority: 'high' },
    { id: 't3', title: 'Send save-the-date invitations', category: 'Invitations', dueDate: '2025-07-20', done: true, priority: 'medium' },
    { id: 't4', title: 'Floral design consultation with Garden & Bloom Studio', category: 'Florals', dueDate: '2025-08-01', done: false, priority: 'high' },
    { id: 't5', title: 'Arrange live classical music ensemble', category: 'Entertainment', dueDate: '2025-08-10', done: false, priority: 'medium' },
    { id: 't6', title: 'Coordinate transport for outstation guests', category: 'Logistics', dueDate: '2025-08-20', done: false, priority: 'medium' },
    { id: 't7', title: 'Final guest RSVP confirmation', category: 'Guest Management', dueDate: '2025-09-01', done: false, priority: 'high' },
    { id: 't8', title: 'Print menu cards and place cards', category: 'Stationery', dueDate: '2025-09-15', done: false, priority: 'low' },
    { id: 't9', title: 'Day-of run-of-show briefing with all vendors', category: 'Coordination', dueDate: '2025-10-17', done: false, priority: 'high' },
  ],
  expenses: [
    { id: 'e1', category: 'Venue', description: 'The Leela Palace — banquet hall & grounds', estimated: 800000, actual: 820000, status: 'paid' },
    { id: 'e2', category: 'Catering', description: 'Kiran Caterers — 5-course dinner for 135', estimated: 675000, actual: 690000, status: 'paid' },
    { id: 'e3', category: 'Florals', description: 'Garden & Bloom Studio — floral installations', estimated: 300000, actual: null, status: 'contracted' },
    { id: 'e4', category: 'Photography', description: 'Prism Lens Co. — photography & videography', estimated: 250000, actual: null, status: 'contracted' },
    { id: 'e5', category: 'Entertainment', description: 'Raga & Strings Ensemble — live classical music', estimated: 150000, actual: null, status: 'pending' },
    { id: 'e6', category: 'Decor', description: 'Royal Drapery Co. — lighting & drapery setup', estimated: 200000, actual: null, status: 'pending' },
    { id: 'e7', category: 'Contingency', description: 'Reserve fund', estimated: 125000, actual: null, status: 'reserved' },
  ],
  vendors: [
    { id: 'v1', name: 'Kiran Caterers', category: 'Catering', contact: 'kiran@kirancaterers.in', phone: '+91 98765 43210', price: 690000, status: 'booked', notes: 'Confirmed for Oct 18. Vegetarian & non-veg options.' },
    { id: 'v2', name: 'Garden & Bloom Studio', category: 'Florals', contact: 'hello@gardenbloom.in', phone: '+91 98765 12345', price: 300000, status: 'contracted', notes: 'Rose & marigold theme. Site visit on Aug 1.' },
    { id: 'v3', name: 'Prism Lens Co.', category: 'Photography', contact: 'shoots@prismlens.in', phone: '+91 99001 23456', price: 250000, status: 'contracted', notes: 'Full day photography + cinematic film.' },
    { id: 'v4', name: 'Raga & Strings Ensemble', category: 'Entertainment', contact: 'bookings@ragastrings.in', phone: '+91 97890 56789', price: 150000, status: 'inquiry', notes: 'Awaiting availability confirmation.' },
    { id: 'v5', name: 'Royal Drapery Co.', category: 'Decor', contact: 'info@royaldrapery.in', phone: '+91 96543 21000', price: 200000, status: 'inquiry', notes: 'Soft warm lighting + burgundy draping.' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function getEvent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_EVENT;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== 1) {
      console.warn('[SoireeAI] Stale schema. Resetting to defaults.');
      return DEFAULT_EVENT;
    }
    return parsed;
  } catch (err) {
    console.error('[SoireeAI] Failed to read state:', err);
    return DEFAULT_EVENT;
  }
}

function saveEvent(eventData) {
  try {
    const toSave = { ...eventData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('[SoireeAI] Failed to save state:', err);
  }
}

function clearEvent() {
  localStorage.removeItem(STORAGE_KEY);
}

window.SoireeState = { getEvent, saveEvent, clearEvent, DEFAULT_EVENT };
