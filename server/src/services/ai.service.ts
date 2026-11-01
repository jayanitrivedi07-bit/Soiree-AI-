import { callGemini } from '../config/gemini.js';
import { localDb } from '../config/database.js';
import { ChatMessage, AIGeneratedPlan } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import { randomUUID } from 'crypto';

const SYSTEM_INSTRUCTION = `You are Soirée AI, an intelligent and practical Indian event-planning assistant. Your responsibility is to help users organize meaningful celebrations within their stated budgets, preferences and constraints in Indian Rupees (INR). Never invent confirmed vendor availability, actual quotations, or bookings. Clearly distinguish estimated costs from verified costs. Respect the user's budget and dietary requirements. Return structured JSON when endpoints require structured output.`;

function safeParseJSON<T>(text: string, fallback: T): T {
  // Strip markdown code fences if present
  const stripped = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(stripped) as T;
  } catch {
    try {
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  }
}

export class AIService {
  public async generateEventPlan(eventId: string): Promise<AIGeneratedPlan> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const prompt = `Generate a comprehensive event plan for the following celebration in JSON format.

Event Details:
- Name: ${event.name}
- Type: ${event.type}
- Date: ${event.date}
- Location: ${event.location}
- Guest Count: ${event.guestCount}
- Budget: ₹${event.budget.toLocaleString('en-IN')} INR
- Theme: ${event.theme}
- Dietary Preferences: ${event.dietary || 'Standard'}
- Additional Notes: ${event.notes || 'None'}

Return ONLY a valid JSON object (no markdown, no extra text) matching this exact structure:
{
  "eventConcept": "string - 2-3 sentence evocative concept description",
  "themeIdeas": ["array of 4 theme enhancement ideas"],
  "decorationIdeas": ["array of 5 decoration ideas specific to the theme and location"],
  "foodSuggestions": ["array of 5 food/beverage suggestions matching dietary preferences"],
  "entertainmentIdeas": ["array of 4 entertainment ideas"],
  "budgetAllocation": [
    { "category": "string", "percentage": number, "amount": number, "reasoning": "string" }
  ],
  "timeline": [
    { "phase": "string", "timing": "string", "action": "string" }
  ],
  "vendorCategories": ["list of vendor categories needed"],
  "personalizedTips": ["array of 4 personalized planning tips"]
}`;

    const raw = await callGemini(prompt, SYSTEM_INSTRUCTION, 0.8);
    const plan = safeParseJSON<AIGeneratedPlan>(raw, {
      eventConcept: `A magnificent ${event.type} celebration at ${event.location} for ${event.guestCount} guests with a budget of ₹${event.budget.toLocaleString('en-IN')}.`,
      themeIdeas: [
        'Candlelit ambiance with floral arches',
        'Live classical music during arrival',
        'Handcrafted artisanal centerpieces',
        'Heritage-inspired textiles and drapery',
      ],
      decorationIdeas: [
        'Marigold garlands at entrance',
        'Rose petal aisles',
        'Brass diyas along tables',
        'Silk canopies in theme colors',
        'Fresh botanical table centerpieces',
      ],
      foodSuggestions: [
        'Five-course heritage menu',
        'Live chaat station',
        'Artisanal dessert bar',
        'Welcome mocktail reception',
        'Regional specialty main course',
      ],
      entertainmentIdeas: [
        'Live classical music ensemble',
        'Folk dance performance',
        'Interactive photo booth',
        'Fireworks finale',
      ],
      budgetAllocation: [
        { category: 'Venue', percentage: 35, amount: Math.round(event.budget * 0.35), reasoning: 'Primary venue cost including service staff' },
        { category: 'Catering', percentage: 28, amount: Math.round(event.budget * 0.28), reasoning: 'Multi-course meals and beverage service' },
        { category: 'Florals & Decor', percentage: 15, amount: Math.round(event.budget * 0.15), reasoning: 'Floral installations and thematic decor' },
        { category: 'Photography', percentage: 10, amount: Math.round(event.budget * 0.10), reasoning: 'Professional photo and video coverage' },
        { category: 'Entertainment', percentage: 7, amount: Math.round(event.budget * 0.07), reasoning: 'Live performances and sound' },
        { category: 'Contingency', percentage: 5, amount: Math.round(event.budget * 0.05), reasoning: 'Emergency buffer and miscellaneous' },
      ],
      timeline: [
        { phase: 'Planning', timing: '6 months before', action: 'Book venue and primary vendors' },
        { phase: 'Preparation', timing: '3 months before', action: 'Finalize menu and send invitations' },
        { phase: 'Coordination', timing: '1 month before', action: 'Confirm all vendor logistics' },
        { phase: 'Final', timing: '1 week before', action: 'Rehearsal and run-of-show finalization' },
      ],
      vendorCategories: ['Venue', 'Catering', 'Photography', 'Florals', 'Entertainment', 'Decor'],
      personalizedTips: [
        `For ${event.guestCount} guests, book the catering team at least 3 months in advance.`,
        `The ${event.theme} theme pairs beautifully with warm ambient lighting.`,
        'Create a detailed vendor communication schedule to avoid last-minute surprises.',
        'Maintain a contingency buffer for unexpected expenses.',
      ],
    });

    return plan;
  }

  public async generateBudgetSuggestions(
    eventId: string,
    customBudget?: number,
    guestCount?: number
  ): Promise<{
    allocations: { category: string; amount: number; percentage: number; notes: string }[];
    totalBudget: number;
    tips: string[];
  }> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const budget = customBudget ?? event.budget;
    const guests = guestCount ?? event.guestCount;

    const prompt = `You are a budget expert for Indian celebrations. Given a ${event.type} for ${guests} guests with a total budget of ₹${budget.toLocaleString('en-IN')} INR in ${event.location}, return ONLY a valid JSON object:
{
  "allocations": [
    { "category": "string", "amount": number, "percentage": number, "notes": "string - specific practical advice" }
  ],
  "tips": ["array of 5 practical money-saving tips for this specific event type and budget"]
}
Include these categories: Venue, Catering, Florals, Photography, Entertainment, Decor, Stationery, Contingency. All amounts in INR numbers only.`;

    const raw = await callGemini(prompt, SYSTEM_INSTRUCTION, 0.6);
    const result = safeParseJSON(raw, {
      allocations: [
        { category: 'Venue', amount: Math.round(budget * 0.35), percentage: 35, notes: 'Book 6+ months in advance for best rates.' },
        { category: 'Catering', amount: Math.round(budget * 0.28), percentage: 28, notes: `Approx ₹${Math.round((budget * 0.28) / (guests || 1)).toLocaleString('en-IN')} per guest.` },
        { category: 'Florals', amount: Math.round(budget * 0.12), percentage: 12, notes: 'Seasonal flowers reduce cost significantly.' },
        { category: 'Photography', amount: Math.round(budget * 0.10), percentage: 10, notes: 'Book package deals for photo + cinema film.' },
        { category: 'Entertainment', amount: Math.round(budget * 0.07), percentage: 7, notes: 'Live classical music creates lasting impressions.' },
        { category: 'Decor', amount: Math.round(budget * 0.05), percentage: 5, notes: 'Ambient lighting elevates decor naturally.' },
        { category: 'Stationery', amount: Math.round(budget * 0.02), percentage: 2, notes: 'Digital invites save significantly.' },
        { category: 'Contingency', amount: Math.round(budget * 0.01), percentage: 1, notes: 'Always hold a reserve for surprises.' },
      ],
      tips: [
        'Compare at least 3 vendors per category before booking.',
        'Negotiate package deals that combine venue and catering.',
        'Use seasonal flowers to reduce floral costs by up to 30%.',
        'Consider weekday or Sunday events for venue discounts.',
        'Digital RSVPs save stationery budget for higher-impact decor.',
      ],
    });
    return { ...result, totalBudget: budget };
  }

  public async generateTimeline(
    eventId: string
  ): Promise<{ tasks: { title: string; category: string; dueDate: string; priority: 'high' | 'medium' | 'low'; description: string }[] }> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const eventDate = new Date(event.date);
    const validDate = isNaN(eventDate.getTime()) ? new Date() : eventDate;

    const prompt = `Create a detailed planning timeline for a ${event.type} in ${event.location} on ${event.date} for ${event.guestCount} guests with budget ₹${event.budget.toLocaleString('en-IN')} INR.

Return ONLY a valid JSON object:
{
  "tasks": [
    {
      "title": "Specific actionable task title",
      "category": "One of: Venue, Catering, Florals, Photography, Entertainment, Decor, Stationery, Logistics, Coordination, Miscellaneous",
      "dueDate": "YYYY-MM-DD format date before ${event.date}",
      "priority": "high or medium or low",
      "description": "Brief practical description"
    }
  ]
}
Generate 8-10 realistic tasks spread across the planning period.`;

    const raw = await callGemini(prompt, SYSTEM_INSTRUCTION, 0.7);
    return safeParseJSON(raw, {
      tasks: [
        {
          title: 'Book and confirm primary venue',
          category: 'Venue',
          dueDate: new Date(validDate.getTime() - 180 * 86400000).toISOString().split('T')[0],
          priority: 'high',
          description: 'Visit and finalize contract with primary venue.',
        },
        {
          title: 'Hire catering team and finalize menu',
          category: 'Catering',
          dueDate: new Date(validDate.getTime() - 150 * 86400000).toISOString().split('T')[0],
          priority: 'high',
          description: 'Conduct tasting and finalize menu selections.',
        },
        {
          title: 'Book photographer and videographer',
          category: 'Photography',
          dueDate: new Date(validDate.getTime() - 120 * 86400000).toISOString().split('T')[0],
          priority: 'high',
          description: 'Review portfolios and sign contracts.',
        },
        {
          title: 'Design and order floral arrangements',
          category: 'Florals',
          dueDate: new Date(validDate.getTime() - 90 * 86400000).toISOString().split('T')[0],
          priority: 'medium',
          description: 'Meet with florist for design walkthrough.',
        },
        {
          title: 'Send digital invitations',
          category: 'Stationery',
          dueDate: new Date(validDate.getTime() - 75 * 86400000).toISOString().split('T')[0],
          priority: 'medium',
          description: 'Send save-the-dates and collect RSVPs.',
        },
        {
          title: 'Book entertainment acts',
          category: 'Entertainment',
          dueDate: new Date(validDate.getTime() - 60 * 86400000).toISOString().split('T')[0],
          priority: 'medium',
          description: 'Confirm musicians or performers.',
        },
        {
          title: 'Final vendor coordination meeting',
          category: 'Coordination',
          dueDate: new Date(validDate.getTime() - 14 * 86400000).toISOString().split('T')[0],
          priority: 'high',
          description: 'Align all vendors on timeline and logistics.',
        },
        {
          title: 'Event rehearsal and run-of-show',
          category: 'Coordination',
          dueDate: new Date(validDate.getTime() - 7 * 86400000).toISOString().split('T')[0],
          priority: 'high',
          description: 'Walk through the event schedule with core team.',
        },
      ],
    });
  }

  public async chat(
    eventId: string,
    message: string,
    history: { role: 'user' | 'assistant'; text: string }[] = []
  ): Promise<{ reply: string; suggestions: string[] }> {
    const event = localDb.events.get(eventId);

    const eventContext = event
      ? `Event Context:
- Name: ${event.name} (${event.type})
- Date: ${event.date} at ${event.location}
- Guests: ${event.guestCount} | Budget: ₹${event.budget.toLocaleString('en-IN')} INR
- Theme: ${event.theme}
- Dietary: ${event.dietary || 'Standard'}
- Tasks: ${event.tasks.length} total (${event.tasks.filter((t) => t.done).length} done)
- Expenses: ${event.expenses.length} items, estimated total ₹${event.expenses.reduce((s, e) => s + e.estimated, 0).toLocaleString('en-IN')} INR`
      : 'No specific event context available — responding as general event concierge.';

    const recentHistory = history.slice(-10);
    const historyText = recentHistory.map((m) => `${m.role === 'user' ? 'User' : 'Soirée AI'}: ${m.text}`).join('\n');

    const prompt = `${eventContext}

${historyText ? `Recent Conversation:\n${historyText}\n` : ''}
User: ${message}

Respond as Soirée AI — concise (3-5 sentences max), elegant, and practically helpful. After your response, on a new line write "SUGGESTIONS:" followed by 3 short follow-up question suggestions separated by | character.`;

    const raw = await callGemini(prompt, SYSTEM_INSTRUCTION, 0.8);

    const parts = raw.split(/\nSUGGESTIONS:/i);
    const reply = parts[0].trim();
    const suggestionsRaw = parts[1]?.trim() ?? '';
    const suggestions = suggestionsRaw
      ? suggestionsRaw.split('|').map((s) => s.trim()).filter(Boolean).slice(0, 3)
      : [
          'What should I prioritize this week?',
          'How am I tracking against my budget?',
          'Suggest ideas for the welcome experience',
        ];

    if (event) {
      const msgs = localDb.chatMessages.get(eventId) ?? [];
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const userMsg: ChatMessage = { id: randomUUID(), eventId, role: 'user', text: message, timestamp: now };
      const assistantMsg: ChatMessage = { id: randomUUID(), eventId, role: 'assistant', text: reply, timestamp: now, suggestions };
      msgs.push(userMsg, assistantMsg);
      localDb.chatMessages.set(eventId, msgs);
    }

    return { reply, suggestions };
  }

  public async getChatHistory(eventId: string): Promise<ChatMessage[]> {
    return localDb.chatMessages.get(eventId) ?? [];
  }
}

export const aiService = new AIService();

