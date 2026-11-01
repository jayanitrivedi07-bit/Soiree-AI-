import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { ChatMessage } from '../types';
import { formatINR } from '../lib/formatters';
import { DEMO_AI_RESPONSES } from '../data/defaultData';
import { aiApi } from '../lib/api';
import { Sparkles, Send, Bot, User, ArrowRight, RotateCcw, AlertCircle, HelpCircle, Flame, Wine, Clock, ShieldCheck } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { event, chatMessages, addChatMessage, clearChat } = useEvent();

  const [inputPrompt, setInputPrompt] = useState(searchParams.get('prompt') || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // If a prompt query was passed in URL, automatically send or prepare it
  useEffect(() => {
    const q = searchParams.get('prompt');
    if (q && q.trim()) {
      handleSendPrompt(q);
    }
  }, []);

  const handleSendPrompt = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: 'Just now'
    };
    addChatMessage(userMsg);
    setInputPrompt('');
    setIsTyping(true);

    // 2. Real Gemini AI Assistant Integration with Heuristic Fallback
    const history = chatMessages.slice(-6).map(m => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const data = await aiApi.chat(event.id, trimmed, history);
      const assistantMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: 'Just now',
        suggestions: data.suggestions,
        isDemo: false,
      };
      addChatMessage(assistantMsg);
    } catch (err) {
      console.warn('[AI Assistant] Live AI call fallback:', err);
      const lower = trimmed.toLowerCase();
      let replyData = DEMO_AI_RESPONSES.default;

      if (lower.includes('budget') || lower.includes('cost') || lower.includes('split') || lower.includes('lakh') || lower.includes('price')) {
        replyData = DEMO_AI_RESPONSES.budget;
      } else if (lower.includes('menu') || lower.includes('food') || lower.includes('dish') || lower.includes('catering') || lower.includes('dinner')) {
        replyData = DEMO_AI_RESPONSES.menu;
      } else if (lower.includes('timeline') || lower.includes('run of show') || lower.includes('sunset') || lower.includes('schedule') || lower.includes('time')) {
        replyData = DEMO_AI_RESPONSES.timeline;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        text: replyData.reply,
        timestamp: 'Just now',
        suggestions: replyData.suggestions,
        isDemo: true,
      };

      addChatMessage(assistantMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const inspirationalPrompts = [
    { title: 'Budget Allocation', text: 'How should I split ₹ 25 Lakhs for 135 guests?', icon: <Sparkles className="w-4 h-4 text-secondary" /> },
    { title: 'Tasting Menu', text: 'Suggest a 5-course royal dinner menu for Udaipur', icon: <Wine className="w-4 h-4 text-secondary" /> },
    { title: 'Sunset Timeline', text: 'Draft a timeline for sunset cocktail hour on Lake Pichola', icon: <Clock className="w-4 h-4 text-secondary" /> },
    { title: 'Contingency Audit', text: 'Are we at risk of exceeding our floral and decor budget?', icon: <ShieldCheck className="w-4 h-4 text-secondary" /> }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Autonomous Haute Concierge</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-primary font-medium tracking-tight">
            AI Planning Assistant Salon
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Real-time sensory guidance, menu pairing, and run-of-show orchestration synchronized with {event.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant bg-white hover:bg-surface-container text-on-surface text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Main Chat Layout (4 cols sidebar, 8 cols messages) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Context & Curated Queries (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Context Card */}
          <div className="p-5 bg-white rounded-2xl border border-outline-variant/50 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Synchronized Brief</span>
              <span className="text-[11px] text-primary font-bold">{event.type}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Occasion:</span>
                <span className="font-semibold text-primary">{event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Target Budget:</span>
                <span className="font-semibold text-primary">{formatINR(event.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Guest Count:</span>
                <span className="font-semibold text-on-surface">{event.guestCount} Patrons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Celebration Date:</span>
                <span className="font-semibold text-on-surface">{event.date}</span>
              </div>
            </div>
          </div>

          {/* Inspirational Inquiries */}
          <div className="p-5 bg-white rounded-2xl border border-outline-variant/50 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Inspirational Queries</span>
              <span className="text-[10px] text-on-surface-variant">Click to ask</span>
            </div>

            <div className="space-y-2">
              {inspirationalPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendPrompt(p.text)}
                  className="w-full text-left p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all text-on-surface text-xs flex items-start gap-2.5 group"
                >
                  <span className="mt-0.5 shrink-0">{p.icon}</span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-primary block group-hover:text-secondary transition-colors">{p.title}</span>
                    <span className="text-on-surface-variant text-[11px] line-clamp-2">{p.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Mode Notice */}
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Prototype Intelligence Active</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Responses are powered by local prototype intelligence tailored to your Indian luxury celebration. Ready for Gemini API connectivity in later phases.
            </p>
          </div>

        </div>

        {/* Right Chat Salon (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-outline-variant/50 shadow-md overflow-hidden flex flex-col h-[700px]">
          
          {/* Chat Header */}
          <div className="px-6 py-4 bg-surface-container-low/60 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-[#fed798]" />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-primary leading-none">Soirée AI Concierge</h3>
                <span className="text-[11px] text-on-surface-variant mt-0.5 block">Autonomous Planning & Sommelier Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-outline-variant/40 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-semibold text-secondary uppercase tracking-wider">Online Concierge</span>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#fcf9f8]/40">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant px-1">
                  <span>{msg.role === 'user' ? 'Host' : 'Soirée AI Concierge'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.isDemo && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold uppercase tracking-wider text-[9px]">
                      Demo
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-xl p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-white text-on-surface border border-outline-variant/40 rounded-tl-sm'
                  }`}
                >
                  {msg.text}

                  {/* Assistant Suggested Prompts */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-outline-variant/30 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary block">
                        Suggested Inquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendPrompt(sug)}
                            className="text-left px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-primary text-[11px] font-medium border border-outline-variant/40 transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant p-3 bg-white rounded-2xl border border-outline-variant/30 w-44">
                <Sparkles className="w-4 h-4 text-secondary animate-spin" />
                <span>Concierge drafting...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Container */}
          <div className="p-4 bg-white border-t border-outline-variant/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputPrompt);
              }}
              className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/40 focus-within:ring-2 focus-within:ring-primary/20"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about budgets, menus, run-of-show, or vendor contracts..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-primary hover:bg-[#5b1a2b] text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex justify-between items-center text-[10px] text-on-surface-variant px-2 pt-2">
              <span>Prototype Demo Intelligence • English Edition</span>
              <span>All changes automatically synchronized</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

