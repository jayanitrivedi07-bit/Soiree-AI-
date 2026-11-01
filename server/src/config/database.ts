import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { EventModel, Expense, Task, Vendor, ChatMessage } from '../types/index.js';
import fs from 'fs';
import path from 'path';

let supabaseClient: SupabaseClient | null = null;
const isSupabaseConfigured = Boolean(env.SUPABASE_URL && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY));

if (isSupabaseConfigured) {
  try {
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
    supabaseClient = createClient(env.SUPABASE_URL, key);
    console.log('[Database] Connected to Supabase PostgreSQL at:', env.SUPABASE_URL);
  } catch (error) {
    console.error('[Database] Failed to initialize Supabase client:', error);
    supabaseClient = null;
  }
} else {
  console.log('[Database] Supabase credentials not set in environment. Running with high-performance local persistent store.');
}

export function getSupabase(): SupabaseClient | null {
  return supabaseClient;
}

// -----------------------------------------------------------------------------
// High-Performance Local Persistent Store (Used when Supabase is not configured)
// -----------------------------------------------------------------------------

const DEFAULT_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Kiran Caterers & Atelier Banquet',
    category: 'Catering',
    contact: 'kiran@kirancaterers.in',
    phone: '+91 98765 43210',
    price: 690000,
    status: 'booked',
    rating: 4.9,
    reviewsCount: 38,
    location: 'Udaipur & Mumbai',
    tagline: 'Master Sommelier & Haute Cuisine Specialist',
    description: 'Renowned for orchestrating royal Rajputana feasts with Michelin-grade contemporary culinary art. Specializes in multi-course pairing menus, artisanal mocktail lounges, and organic heritage recipes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGl6QCSUkb5ShvtE3ZZzogJp1_JuRh8cx32xC98C0lsDj_m7B6aew6o4UAJD7dL4KsStodI45FVJumkRg4PBaHjx_qwKjre6mxolrDwDV8ePtkkXKsDOdImw_kAmSyzeZGsu84OQxvReHJRsq7bf-kNkokj-9BuYvL40d_d3bhNgNrqJl2ERIQZWnWBPkCiowH2cfaEp_I3Vr31J_LOJ4nAMHyxphS61sm9ttpUasy',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN'
    ],
    services: [
      { title: 'Five-Course Royal Tasting Menu', price: 450000, description: 'Personalized curation of authentic regal dishes paired with bespoke non-alcoholic distillates.' },
      { title: 'Artisanal Dessert & Patisserie Bar', price: 140000, description: 'Live dessert station featuring saffron-infused delicacies, French macarons, and Belgian chocolate domes.' }
    ],
    leadTime: '3 months advance booking',
    isDemo: true
  },
  {
    id: 'v2',
    name: 'Garden & Bloom Floral Studio',
    category: 'Florals',
    contact: 'hello@gardenbloom.in',
    phone: '+91 98765 12345',
    price: 300000,
    status: 'contracted',
    rating: 4.8,
    reviewsCount: 24,
    location: 'Jaipur & Udaipur',
    tagline: 'Sculptural Botanical Architecture & Candlelit Canopy',
    description: 'Bespoke botanical installations featuring English garden roses, Dutch hydrangeas, and traditional Indian marigolds elevated with atmospheric candlelight chandeliers.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN',
    leadTime: '6 weeks advance booking',
    isDemo: true
  },
  {
    id: 'v3',
    name: 'Prism Lens Co. Cinematography',
    category: 'Photography',
    contact: 'shoots@prismlens.in',
    phone: '+91 99001 23456',
    price: 250000,
    status: 'contracted',
    rating: 5.0,
    reviewsCount: 42,
    location: 'Delhi & Udaipur',
    tagline: 'Vogue & Architectural Style Celebration Imagery',
    description: 'Fine art wedding imagery captured in medium format film and 4K cinema cameras. Editorial framing that transforms spontaneous moments into timeless heirlooms.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATsTxY-tA_IIfEhKA6irQ8aFM_dcyG3m26E1PTmzcQCqiZg2gThHc5SkOqld2-wPETDXpQm4FDb8yiNRRrb3LuWx7dPjA5YDPO93fpfGmwMJUfpZTLqHKpr-8Jnen9CJepm39ysLUEzfG2GQ2D9j3nXHlsKlDc1BQUOWuXWTRgnZu6CFDqKflrJBIfikjusZD6WwX_Y4g0M8LRbanHYWUoJV6wpa_2gSwK2RouVgB2',
    leadTime: '2 months advance booking',
    isDemo: true
  },
  {
    id: 'v4',
    name: 'Raga & Strings Ensemble',
    category: 'Entertainment',
    contact: 'bookings@ragastrings.in',
    phone: '+91 97890 56789',
    price: 150000,
    status: 'inquiry',
    rating: 4.9,
    reviewsCount: 19,
    location: 'Rajasthan',
    tagline: 'Classical Sitar, Santoor & Acoustic String Quartet',
    description: 'Bridging timeless Indian ragas with contemporary orchestral compositions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg2DJOWmrgVidC4VwH36kIXW0LZfOPEbwoh443TlhiNoYD155WP1Ulgm2oRqGpTUtrfLLX1znjap02sHd0KUmu1k-Xm2BR4iJD_5Jdd-f4Pn6-3j1Bd-tywZ4ZshLKQTwiv7kqpW2iurxClOJrtOR1FWwggv-uyMyeCyaEvyhMQkY866L724B88IoyJINy_mImeeVz9aTsWyriW1g079lCNFYAsLITe8XUBEmIziGq',
    isDemo: true
  },
  {
    id: 'v5',
    name: 'Royal Drapery & Lighting Co.',
    category: 'Decor',
    contact: 'info@royaldrapery.in',
    phone: '+91 96543 21000',
    price: 200000,
    status: 'inquiry',
    rating: 4.7,
    reviewsCount: 31,
    location: 'Udaipur',
    tagline: 'Warm Ambient Illumination & Rich Velvet Canopies',
    description: 'Transforming ballrooms into intimate candlelit sanctuaries.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzMILR1OfAldtluTRo7w0_MNx8rCEtMGmZFOdg93-3nreBNWYi_uaqZlwW2-RvHShgMKrXZbD02KBQmcb7CXhpPCkM4dTvYgSecg5L6wkLdhsCNuqEGfpkDN4_rt2yMzi7KvULlv5YNXr345WZD7bmqdcR1q3q-q6BQqFVgEf_6vYqImnRlG301FTwoMsJcFs4LMH9xLzBjcPyOGRHHWSJWlvjs4zAxro7a6XNKxzz',
    isDemo: true
  },
  {
    id: 'v6',
    name: 'The Leela Palace Heritage Grounds',
    category: 'Venue',
    contact: 'events@theleela.com',
    phone: '+91 294 670 1234',
    price: 800000,
    status: 'booked',
    rating: 5.0,
    reviewsCount: 88,
    location: 'Lake Pichola, Udaipur',
    tagline: 'Palatial Lakeside Setting with Panoramic Lake Pichola Views',
    description: 'An iconic palace hotel overlooking Lake Pichola and the City Palace.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr5sZ_7GFrFL0RkCD5PzfUZP9s9jM3ilGf35lVWxC52DMJV3omvNgAGe3WsICvZz48uhVwuf33v56g7FELHAhDjmB5b83NC6ztvb3xzon1vOqLHUtX5lx5MYdH3rnTGpkAelnhNtajDNETGp9Yf-h7Dg50fLxf-KM7DKQAiZOaOBKgkexjX19tO6rQWCNBEHQOWy7wLpx8fS2I3ZLfkEXAdoTU3Qr3Keb0uEitx9xP',
    isDemo: true
  }
];

export const INITIAL_EVENT: EventModel = {
  schemaVersion: 1,
  id: 'demo-event-001',
  name: 'Udaipur Heritage Gala',
  type: 'Wedding',
  date: '2025-10-18',
  location: 'The Leela Palace, Udaipur, Rajasthan',
  guestCount: 135,
  budget: 2500000,
  currency: 'INR',
  theme: 'Burgundy & Candlelight Romance',
  dietary: 'Gourmet Vegetarian & Awadhi Royal Non-Veg, Nut-Free Dessert Bar',
  notes: 'Live classical music during cocktail hour, rose petal pathway, traditional royal boat arrival for couple.',
  tasks: [
    { id: 't1', title: 'Book palatial venue — The Leela Palace lakeside terrace', category: 'Venue', dueDate: '2025-06-15', done: true, priority: 'high' },
    { id: 't2', title: 'Finalize bespoke menu with Kiran Caterers', category: 'Catering', dueDate: '2025-07-01', done: true, priority: 'high' },
    { id: 't3', title: 'Send embossed calligraphy invitations to 135 guests', category: 'Stationery', dueDate: '2025-07-20', done: true, priority: 'medium' },
    { id: 't4', title: 'Floral design walkthrough with Garden & Bloom Studio', category: 'Florals', dueDate: '2025-08-10', done: true, priority: 'high' },
    { id: 't5', title: 'Approve lighting plan & candelabras with Royal Drapery', category: 'Decor', dueDate: '2025-08-25', done: false, priority: 'medium' },
    { id: 't6', title: 'Confirm arrival boat arrangements and lakeside permits', category: 'Logistics', dueDate: '2025-09-05', done: false, priority: 'high' },
    { id: 't7', title: 'Curate acoustic string setlist with Raga & Strings', category: 'Entertainment', dueDate: '2025-09-18', done: false, priority: 'medium' },
    { id: 't8', title: 'Rehearsal dinner run-of-show & vendor coordination', category: 'Coordination', dueDate: '2025-10-15', done: false, priority: 'high' }
  ],
  expenses: [
    { id: 'e1', category: 'Venue', description: 'The Leela Palace — lakeside pavilion & grand hall', estimated: 800000, actual: 820000, status: 'paid' },
    { id: 'e2', category: 'Catering', description: 'Kiran Caterers — royal 5-course banquet for 135', estimated: 675000, actual: 690000, status: 'paid' },
    { id: 'e3', category: 'Florals', description: 'Garden & Bloom — rose arches & candlelight canopy', estimated: 300000, actual: null, status: 'contracted' },
    { id: 'e4', category: 'Photography', description: 'Prism Lens Co. — medium format film & cinema reel', estimated: 250000, actual: null, status: 'contracted' },
    { id: 'e5', category: 'Entertainment', description: 'Raga & Strings — sitar, santoor & quartet', estimated: 150000, actual: null, status: 'pending' },
    { id: 'e6', category: 'Decor', description: 'Royal Drapery — silk drapery & brass lanterns', estimated: 200000, actual: null, status: 'pending' },
    { id: 'e7', category: 'Contingency', description: 'Weather backup & guest concierge fund', estimated: 125000, actual: null, status: 'reserved' }
  ],
  vendors: DEFAULT_VENDORS,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// In-Memory Database State
class LocalStore {
  public events: Map<string, EventModel> = new Map();
  public vendors: Map<string, Vendor> = new Map();
  public chatMessages: Map<string, ChatMessage[]> = new Map(); // eventId -> messages

  constructor() {
    this.events.set(INITIAL_EVENT.id, { ...INITIAL_EVENT });
    DEFAULT_VENDORS.forEach(v => this.vendors.set(v.id, { ...v }));
    this.chatMessages.set(INITIAL_EVENT.id, [
      {
        id: 'msg-init-1',
        role: 'assistant',
        text: 'Welcome to Soirée AI. I am your bespoke celebration concierge. I can analyze your Udaipur Heritage Gala, optimize your ₹ 25,00,000 budget allocations, suggest culinary pairings, or draft an hour-by-hour run of show.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'How should I split ₹ 25 Lakhs for 135 guests?',
          'Suggest a 5-course royal dinner menu',
          'Draft a timeline for sunset cocktail hour',
          'Are we at risk of exceeding our floral budget?'
        ],
        isDemo: true
      }
    ]);
  }
}

export const localDb = new LocalStore();

