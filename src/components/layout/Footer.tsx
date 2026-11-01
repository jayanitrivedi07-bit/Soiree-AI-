import React from 'react';
import { Link } from 'react-router-dom';
import { APP_LOGO } from '../../data/defaultData';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#3f0417] text-[#ffffff] border-t border-[#762f40]/40 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#762f40]/40">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                alt="Soirée AI Brand Logo"
                className="h-8 w-auto brightness-200"
                src={APP_LOGO}
              />
              <span className="font-headline text-2xl font-semibold tracking-tight text-[#ffdea9]">
                Soirée AI
              </span>
            </div>
            <p className="font-body text-sm text-[#ffd9de]/80 max-w-md leading-relaxed">
              The premier AI celebration studio orchestrating bespoke weddings, milestone galas, and intimate gatherings with timeless elegance and precision.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#e6c184]">
              <Sparkles className="w-4 h-4" />
              <span>Designed for the world's most discerning celebrants.</span>
            </div>
          </div>

          <div>
            <h4 className="font-headline text-sm font-semibold tracking-wider uppercase text-[#ffdea9] mb-4">
              Celebration Suite
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ffd9de]/80">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Planning Dashboard</Link></li>
              <li><Link to="/create-event" className="hover:text-white transition-colors">Event Brief Onboarding</Link></li>
              <li><Link to="/budget" className="hover:text-white transition-colors">INR Budget Allocator</Link></li>
              <li><Link to="/timeline" className="hover:text-white transition-colors">Milestones & Run-of-Show</Link></li>
              <li><Link to="/vendors" className="hover:text-white transition-colors">Artisan Marketplace</Link></li>
              <li><Link to="/assistant" className="hover:text-white transition-colors">AI Concierge Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-sm font-semibold tracking-wider uppercase text-[#ffdea9] mb-4">
              Curated Occasions
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ffd9de]/80">
              <li>Royal Palatial Weddings</li>
              <li>Private Vineyard Dinners</li>
              <li>High-Society Charity Galas</li>
              <li>Milestone Jubilees</li>
              <li>Artisan Cocktail Receptions</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#ffd9de]/60 gap-4">
          <p>© {new Date().getFullYear()} Soirée AI Studio. All rights reserved. English edition.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#ffb2bf] fill-[#ffb2bf]" />
            <span>for bespoke celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

