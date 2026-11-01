import { EventModel, ChatMessage } from '../types';
import { DEFAULT_EVENT, INITIAL_CHAT_MESSAGES } from '../data/defaultData';

const EVENT_STORAGE_KEY = 'soiree_ai_event_v1';
const CHAT_STORAGE_KEY = 'soiree_ai_chat_v1';
const CURRENT_SCHEMA_VERSION = 1;

export function loadStoredEvent(): EventModel {
  try {
    const raw = localStorage.getItem(EVENT_STORAGE_KEY);
    if (!raw) return DEFAULT_EVENT;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      console.warn('[Soirée AI] Stale schema version detected. Resetting to default event.');
      return DEFAULT_EVENT;
    }
    // Ensure all critical arrays exist
    return {
      ...DEFAULT_EVENT,
      ...parsed,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : DEFAULT_EVENT.tasks,
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : DEFAULT_EVENT.expenses,
      vendors: Array.isArray(parsed.vendors) ? parsed.vendors : DEFAULT_EVENT.vendors,
    };
  } catch (error) {
    console.error('[Soirée AI] Error reading stored event data:', error);
    return DEFAULT_EVENT;
  }
}

export function saveStoredEvent(event: EventModel): void {
  try {
    const updated = {
      ...event,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[Soirée AI] Error persisting event data:', error);
  }
}

export function resetStoredEvent(): EventModel {
  try {
    localStorage.removeItem(EVENT_STORAGE_KEY);
  } catch (error) {
    console.error('[Soirée AI] Error resetting stored event:', error);
  }
  return DEFAULT_EVENT;
}

export function loadStoredChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return INITIAL_CHAT_MESSAGES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CHAT_MESSAGES;
  } catch {
    return INITIAL_CHAT_MESSAGES;
  }
}

export function saveStoredChat(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('[Soirée AI] Error persisting chat history:', error);
  }
}

