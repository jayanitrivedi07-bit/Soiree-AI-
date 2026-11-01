export type EventType = 
  | 'Wedding'
  | 'High-Society Gala'
  | 'Milestone Birthday'
  | 'Private Vineyard Soirée'
  | 'Artisan Reception'
  | 'Anniversary Dinner'
  | 'Corporate Retreat'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

export type ExpenseCategory = 
  | 'Venue'
  | 'Catering'
  | 'Florals'
  | 'Photography'
  | 'Entertainment'
  | 'Decor'
  | 'Stationery'
  | 'Contingency'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  category: ExpenseCategory | string;
  description: string;
  estimated: number;
  actual: number | null;
  status: 'paid' | 'contracted' | 'pending' | 'reserved';
}

export interface VendorService {
  title: string;
  price: number;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  price: number;
  status: 'booked' | 'contracted' | 'inquiry' | 'shortlisted';
  rating?: number;
  reviewsCount?: number;
  location?: string;
  tagline?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  services?: VendorService[];
  leadTime?: string;
  isDemo?: boolean;
}

export interface EventModel {
  schemaVersion: number;
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  currency: string;
  theme: string;
  dietary?: string;
  notes?: string;
  tasks: Task[];
  expenses: Expense[];
  vendors: Vendor[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isDemo?: boolean;
}

