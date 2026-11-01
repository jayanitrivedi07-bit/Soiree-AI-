import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { APP_LOGO, APP_AVATAR } from '../../data/defaultData';
import { Sparkles, Menu, X, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Event Brief', path: '/create-event' },
    { label: 'Budget', path: '/budget' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Vendors', path: '/vendors' },
    { label: 'AI Assistant', path: '/assistant' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#d8c1c3]/40 shadow-[0_1px_8px_rgba(91,26,43,0.05)]">
        <div className="h-20 w-full px-4 md:px-8 lg:px-12 mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              alt="Soirée AI Brand Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src={APP_LOGO}
            />
            <div className="flex flex-col">
              <span className="font-headline text-[22px] tracking-tight text-primary leading-none font-semibold">
                Soirée AI
              </span>
              <span className="font-body text-[10px] uppercase tracking-widest text-secondary mt-1 font-semibold">
                Bespoke Celebration Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#f6f3f2]/80 border border-[#d8c1c3]/30">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 font-body text-xs tracking-wider uppercase rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3f0417] text-[#ffffff] font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-[#eae7e7]/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Button */}
            <button
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              type="button"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* AI Assistant Quick Pill */}
            <Link
              to="/assistant"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary-container/40 hover:bg-secondary-container/70 text-secondary border border-secondary/30 transition-all text-xs font-semibold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
              <span>Chat with AI</span>
            </Link>

            {/* Plan My Event Primary CTA */}
            <Link
              to="/create-event"
              className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-on-primary font-body text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_4px_20px_rgba(91,26,43,0.2)] hover:shadow-[0_6px_24px_rgba(91,26,43,0.3)] active:scale-95"
            >
              Plan My Event
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-outline-variant p-4 z-50 text-xs">
                  <div className="flex items-center justify-between border-b pb-2 mb-2 font-semibold text-primary">
                    <span>Notifications</span>
                    <span className="text-[10px] text-secondary">Concierge</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-surface-container-low rounded-lg text-on-surface">
                      <p className="font-medium text-xs">Floral Walkthrough Scheduled</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Garden & Bloom Studio site visit confirmed.</p>
                    </div>
                    <div className="p-2 bg-surface-container-low rounded-lg text-on-surface">
                      <p className="font-medium text-xs">Budget Alert</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Venue deposit paid (₹ 8,20,000).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <Link
              to="/dashboard"
              className="relative flex items-center p-0.5 rounded-full ring-1 ring-secondary/50 hover:ring-secondary transition-all"
              title="View Dashboard"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src={APP_AVATAR}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed top-20 left-0 right-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-xl shadow-xl border-t border-outline-variant px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 font-body text-xs tracking-wider uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-outline-variant my-2"></div>
          <Link
            to="/create-event"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2.5 rounded-full bg-primary text-on-primary font-body text-xs uppercase tracking-wider text-center font-semibold shadow-md"
          >
            Plan My Event
          </Link>
        </div>
      )}
    </>
  );
};

