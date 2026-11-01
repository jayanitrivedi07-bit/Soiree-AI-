import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Calendar, IndianRupee, Users, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [naturalPrompt, setNaturalPrompt] = useState('');
  const navigate = useNavigate();

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalPrompt.trim()) {
      navigate(`/assistant?prompt=${encodeURIComponent(naturalPrompt)}`);
    } else {
      navigate('/create-event');
    }
  };

  const eventCategories = [
    {
      title: 'Weddings',
      tag: 'Signature',
      desc: 'Nuptial weekend retreats, heritage palaces, and vineyard receptions.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPd9G8wXc4aDcwzeA9oYJGYypQjyTaJPIfK6YGIcqP27OMjQiuDC7yEqlaydZ2YhURFpBNJUxHWCJkkGp4O3SyX3nmNIBay9VqnXBbQLOFMGYIEvFag9KGjN-q7VMVhVlZt5WMdWHcTT-ER1yU2kXefHkrhJGe3f6plZL0pjL6iF7jeo3H73DZVoBWkYIBA2sma1MmwKlHtwXoVxoReQj8eEskNLMpzV6EBPoLeJWy',
      type: 'Wedding'
    },
    {
      title: 'Milestone Birthdays',
      tag: 'Private',
      desc: 'Sophisticated 30th, 40th, 50th jubilees with bespoke culinary alchemy.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPRkk_DmJBOg064GsfchAeC-GNcnsa1mmKyHdEzUyGjkTIPD1BLnbOVyUXF7IPq4a0NJ5QJTAWHQFwfaRyUHbpb5WIu9oTj_oHeCfAMjoYEJ8gxPbdWfZeWafsTwhtS42YuX-UBZAH6dgFtStBZ6xpewzVHJwYGbWodlxoFAooQEFdG2fgFHVXQiCHav0yuMKupElbQM841t74ax4o8jGrhlGyRV2Q8ErVMrH7n7U0',
      type: 'Milestone Birthday'
    },
    {
      title: 'Charity & Society Galas',
      tag: '500+ Guests',
      desc: 'Grand botanical ballrooms, live orchestra stages, and luxury auctions.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAypKTsBL5TXBXXjFPJghD0sudjv3TZpTF2oWHNTPfxC6ZjoGgzfU4m5qjH82G3900TUNKwdnhDDg8V5UQxya_K1aV57XmFlGOqLoZud4LSvSF9PtwRzXw1Eb6RjgEjjK83YVYvjFPEPBMUAsZKLek0rmq1w4N6N3giz6vDicAgNO2GVNa2BwvXOMoZL_Eafpk63Okdz2cHDaO98m54t5PFzQ9s5-3w0xNEGeWwVlkj',
      type: 'High-Society Gala'
    },
    {
      title: 'Vineyard Soirées',
      tag: 'Artisanal',
      desc: 'Sunset candlelit dinners with sommelier pairings and acoustic jazz.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr5sZ_7GFrFL0RkCD5PzfUZP9s9jM3ilGf35lVWxC52DMJV3omvNgAGe3WsICvZz48uhVwuf33v56g7FELHAhDjmB5b83NC6ztvb3xzon1vOqLHUtX5lx5MYdH3rnTGpkAelnhNtajDNETGp9Yf-h7Dg50fLxf-KM7DKQAiZOaOBKgkexjX19tO6rQWCNBEHQOWy7wLpx8fS2I3ZLfkEXAdoTU3Qr3Keb0uEitx9xP',
      type: 'Private Vineyard Soirée'
    },
    {
      title: 'Artisan Receptions',
      tag: 'Exclusive',
      desc: 'Sculptural botanical arches, intimate courtyards, and handcrafted banquets.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN',
      type: 'Artisan Reception'
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#f6f3f2] pb-16 pt-8 md:pt-12 border-b border-[#d8c1c3]/30">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#e6c184]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#ffd9de]/30 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          {/* Social Proof Pill */}
          <div className="flex items-center justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[#d8c1c3]/40 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping"></span>
              <span className="font-semibold uppercase tracking-wider text-secondary">Private Studio Concierge</span>
              <span className="text-outline-variant">|</span>
              <span className="text-on-surface-variant font-medium">Over 14,000 unforgettable celebrations orchestrated across India</span>
            </div>
          </div>

          {/* Hero Headline & Interactive Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-primary font-normal leading-[1.1] tracking-tight">
                Plan Every <span className="italic text-secondary">Celebration,</span> Effortlessly.
              </h1>
              <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                From candlelit Udaipur heritage galas to private vineyard banquets and milestone jubilees, Soirée AI orchestrates bespoke INR budgets, run-of-show timelines, and verified artisans in seconds.
              </p>

              {/* Natural Language Prompt Capsule */}
              <form onSubmit={handlePromptSubmit} className="mt-2 p-2 rounded-2xl bg-white shadow-md border border-[#d8c1c3]/50 max-w-xl">
                <div className="flex items-center gap-2 px-3 py-2">
                  <Sparkles className="w-5 h-5 text-secondary shrink-0" />
                  <input
                    type="text"
                    value={naturalPrompt}
                    onChange={(e) => setNaturalPrompt(e.target.value)}
                    placeholder="e.g. Plan a 3-day royal wedding in Udaipur for 150 guests with ₹ 30 Lakh budget..."
                    className="w-full bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-4 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Generate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-on-surface-variant">
                <span className="font-semibold text-secondary">Quick Briefs:</span>
                <button
                  type="button"
                  onClick={() => setNaturalPrompt('135-guest Udaipur lakeside gala with ₹ 25 Lakh budget and classical quartet')}
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[#d8c1c3]/50 transition-colors"
                >
                  Udaipur Lakeside Gala
                </button>
                <button
                  type="button"
                  onClick={() => setNaturalPrompt('Intimate 40th birthday dinner with sommelier tasting menu for 50 guests')}
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[#d8c1c3]/50 transition-colors"
                >
                  Sommelier Dinner
                </button>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 aspect-[4/5] max-h-[500px] w-full">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr5sZ_7GFrFL0RkCD5PzfUZP9s9jM3ilGf35lVWxC52DMJV3omvNgAGe3WsICvZz48uhVwuf33v56g7FELHAhDjmB5b83NC6ztvb3xzon1vOqLHUtX5lx5MYdH3rnTGpkAelnhNtajDNETGp9Yf-h7Dg50fLxf-KM7DKQAiZOaOBKgkexjX19tO6rQWCNBEHQOWy7wLpx8fS2I3ZLfkEXAdoTU3Qr3Keb0uEitx9xP"
                  alt="Udaipur Palatial Celebration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary mb-1">
                    <span>Featured Setting: The Leela Palace</span>
                    <span className="text-secondary">Udaipur</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Lakeside terrace illuminated with hand-hammered brass candelabras and marigold floating petals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold">Haute Concierge Engine</span>
          <h2 className="font-headline text-3xl sm:text-4xl text-primary mt-2">Every Detail Thoughtfully Synchronized</h2>
          <p className="text-sm text-on-surface-variant mt-3">From initial concept to midnight fireworks, Soirée AI keeps all hosts, budgets, and artisans in harmonious alignment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-[#f0eded]/60 border border-[#d8c1c3]/40 flex flex-col justify-between hover:border-secondary transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-4">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl text-primary font-semibold mb-2">Bespoke INR Budget Allocator</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Auto-distribute ₹ 10 Lakhs to ₹ 1 Crore+ with live contingency tracking, category-wise expenditure, and instant recalculations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#d8c1c3]/30 flex items-center justify-between text-xs font-semibold text-secondary">
              <span>View Allocator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#f0eded]/60 border border-[#d8c1c3]/40 flex flex-col justify-between hover:border-secondary transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl text-primary font-semibold mb-2">Run-of-Show Timelines</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Generate phased milestone schedules, sunset synchronizations, priority checklists, and day-of briefing protocols.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#d8c1c3]/30 flex items-center justify-between text-xs font-semibold text-secondary">
              <span>View Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#f0eded]/60 border border-[#d8c1c3]/40 flex flex-col justify-between hover:border-secondary transition-all">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl text-primary font-semibold mb-2">Curated Artisan Network</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Discover master sommeliers, royal culinary banquets, cinematic photojournalists, and botanical floral architects.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#d8c1c3]/30 flex items-center justify-between text-xs font-semibold text-secondary">
              <span>Explore Artisans</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Catalog of Occasions */}
      <section className="w-full bg-[#f6f3f2] py-16 border-y border-[#d8c1c3]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary font-semibold">The Atelier Catalog</span>
              <h2 className="font-headline text-3xl text-primary mt-1">Tailored for Every Milestone</h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-md mt-2 md:mt-0">
              Select an occasion to immediately configure event parameters, guest logistics, and recommended culinary themes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {eventCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/create-event?type=${encodeURIComponent(cat.type)}`)}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#d8c1c3]/30"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 rounded-full bg-white/95 text-primary">
                    {cat.tag}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-headline text-lg text-primary font-semibold mb-1">{cat.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{cat.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-secondary text-xs font-semibold uppercase tracking-wider">
                    <span>Configure</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary CTA Section */}
      <section className="w-full py-20 px-6 lg:px-12 bg-[#3f0417] text-white relative overflow-hidden text-center">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#762f40]/40 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#765a26]/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#ffdea9] text-xs font-semibold uppercase tracking-widest border border-white/20">
            Commence Your Celebration
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-medium tracking-tight">
            Ready to Design Your Unforgettable Evening?
          </h2>
          <p className="font-body text-sm sm:text-base text-[#ffd9de]/80 max-w-xl mx-auto leading-relaxed">
            Create your comprehensive event brief in under two minutes. Receive intelligent budget breakdowns, recommended vendor pairings, and automated milestone tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/create-event')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ffdea9] hover:bg-[#fed798] text-[#3d0316] font-semibold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95"
            >
              Start Event Brief
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white border border-[#ffd9de]/40 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              Explore Demo Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

