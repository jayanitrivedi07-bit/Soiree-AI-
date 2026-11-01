import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { formatINR } from '../lib/formatters';
import { Sparkles, Calendar, Users, IndianRupee, MapPin, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createEvent } = useEvent();

  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<string>(searchParams.get('type') || 'Wedding');
  const [eventName, setEventName] = useState('Udaipur Heritage Gala');
  const [eventDate, setEventDate] = useState('2025-10-18');
  const [location, setLocation] = useState('The Leela Palace, Udaipur, Rajasthan');
  const [guestCount, setGuestCount] = useState(135);
  const [budget, setBudget] = useState(2500000);
  const [theme, setTheme] = useState('Burgundy & Candlelight Romance');
  const [dietary, setDietary] = useState('Gourmet Vegetarian & Awadhi Royal Non-Veg, Nut-Free Dessert Bar');
  const [notes, setNotes] = useState('Live classical sitar during cocktail hour, rose petal pathway, lakeside royal boat arrival.');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const eventTypes = [
    'Wedding',
    'Milestone Birthday',
    'Charity Gala',
    'Autumn Soirée',
    'Anniversary',
    'Artisan Reception'
  ];

  const themes = [
    'Burgundy & Candlelight Romance',
    'Palatial Royal Heritage',
    'Modernist Champagne Minimalist',
    'Botanical Glasshouse Twilight',
    'Vintage Sommelier Cellar'
  ];

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!eventName.trim()) errs.eventName = 'Event name is required';
    if (!eventType) errs.eventType = 'Please select an occasion type';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!eventDate) errs.eventDate = 'Celebration date is required';
    if (!location.trim()) errs.location = 'Celebration location / venue is required';
    if (!guestCount || guestCount <= 0) errs.guestCount = 'Guest count must be at least 1';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!budget || budget <= 0) errs.budget = 'Budget must be greater than ₹ 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createEvent({
        name: eventName.trim(),
        type: eventType,
        date: eventDate,
        location: location.trim(),
        guestCount: Number(guestCount),
        budget: Number(budget),
        theme,
        dietary,
        notes,
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('[CreateEventPage] Failed to create event on backend:', err);
      setSubmitError(err?.message || 'Failed to initialize event on the backend server. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
      
      {/* Editorial Header */}
      <div className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Interactive Onboarding Studio</span>
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
          Craft Your Bespoke Celebration Brief
        </h1>
        <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
          Provide your event vision. Soirée AI will immediately synthesize your comprehensive ₹ INR budget allocations, milestone checklist, and artisan matches.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="mb-10 max-w-4xl">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          <span className={step >= 1 ? 'text-primary font-bold' : ''}>1. Occasion & Theme</span>
          <span className={step >= 2 ? 'text-primary font-bold' : ''}>2. Date, Venue & Guests</span>
          <span className={step >= 3 ? 'text-primary font-bold' : ''}>3. Budget & Banquet</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Form Body */}
        <div className="lg:col-span-8 bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-sm">
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Udaipur Heritage Gala or Meera's 30th Jubilee"
                  className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
                {errors.eventName && <p className="text-error text-xs mt-1">{errors.eventName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Occasion Archetype
                </label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                        eventType === type
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white text-on-surface-variant border border-outline-variant/60 hover:bg-surface-container-high'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Design Motif & Atmosphere
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {themes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`p-3 rounded-xl text-left text-xs font-medium transition-all border ${
                        theme === t
                          ? 'bg-white border-primary text-primary shadow-sm ring-1 ring-primary'
                          : 'bg-white/70 border-outline-variant/60 text-on-surface hover:bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Continue to Logistics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Celebration Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    />
                  </div>
                  {errors.eventDate && <p className="text-error text-xs mt-1">{errors.eventDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Anticipated Guest Count
                  </label>
                  <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-outline-variant">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(10, guestCount - 5))}
                      className="w-8 h-8 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-headline text-xl text-primary font-bold">
                      {guestCount} <span className="text-xs font-body text-on-surface-variant font-normal">Patrons</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(guestCount + 5)}
                      className="w-8 h-8 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                  {errors.guestCount && <p className="text-error text-xs mt-1">{errors.guestCount}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Destination / Selected Venue
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. The Leela Palace, Udaipur or Taj Mahal Palace, Mumbai"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                  <MapPin className="w-4 h-4 text-secondary absolute right-4 top-3.5" />
                </div>
                {errors.location && <p className="text-error text-xs mt-1">{errors.location}</p>}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-outline-variant text-on-surface text-xs font-semibold uppercase tracking-wider hover:bg-surface-container transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <span>Continue to Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary">
                    Target Budget (in INR ₹)
                  </label>
                  <span className="font-headline text-xl text-primary font-semibold">
                    {formatINR(budget)}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="50000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-container-high rounded-full cursor-pointer"
                />
                
                <div className="flex justify-between text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">
                  <span>₹ 5 Lakh (Intimate)</span>
                  <span>₹ 25 Lakh (Bespoke Gala)</span>
                  <span>₹ 1 Crore+ (Grand Palatial)</span>
                </div>
                {errors.budget && <p className="text-error text-xs mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Culinary & Dietary Preferences
                </label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g. Royal Awadhi non-veg with organic Jain options"
                  className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Special Notes & Musical Curation
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Acoustic string quartet during cocktail hour, rose petal welcome..."
                  className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                ></textarea>
              </div>

              {submitError && (
                <div className="p-3.5 bg-[#ffdad9] text-[#41000b] rounded-xl text-xs flex items-center gap-2.5 border border-[#ffb4ab]">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] flex-shrink-0" />
                  <span className="font-medium">{submitError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-outline-variant text-on-surface text-xs font-semibold uppercase tracking-wider hover:bg-surface-container transition-all disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Event...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#ffd9de]" />
                      <span>Generate Event Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Live Estimation Blueprint Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-md space-y-6">
          <div className="border-b border-outline-variant/40 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Blueprint Overview</span>
            <h3 className="font-headline text-xl text-primary font-semibold mt-1">{eventName || 'Untitled Soirée'}</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{eventType} • {guestCount} Patrons</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Target Budget</span>
              <span className="font-semibold text-primary">{formatINR(budget)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Venue & Banquet (63%)</span>
              <span className="font-semibold text-on-surface">{formatINR(budget * 0.63)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Floral & Ambience (12%)</span>
              <span className="font-semibold text-on-surface">{formatINR(budget * 0.12)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Photo & Cinema (10%)</span>
              <span className="font-semibold text-on-surface">{formatINR(budget * 0.10)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Entertainment (7%)</span>
              <span className="font-semibold text-on-surface">{formatINR(budget * 0.07)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d8c1c3]/20">
              <span className="text-on-surface-variant">Contingency Buffer (8%)</span>
              <span className="font-semibold text-secondary">{formatINR(budget * 0.08)}</span>
            </div>
          </div>

          <div className="p-3 bg-secondary-container/20 rounded-xl text-[11px] text-on-secondary-container leading-relaxed">
            <span className="font-bold">Concierge Note:</span> Upon submitting, Soirée AI configures your full planning suite, initializing tasks, expense sheets, and artisan contracts automatically.
          </div>
        </div>

      </div>

    </div>
  );
};

