import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { formatINR } from '../lib/formatters';
import { ArrowLeft, Star, ShieldCheck, Mail, Phone, Calendar, Sparkles, CheckCircle, Heart, Share2, AlertCircle } from 'lucide-react';

export const VendorDetailPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { event, updateVendorStatus } = useEvent();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryNotes, setInquiryNotes] = useState(`Requesting availability for ${event.name} on ${event.date} (${event.guestCount} guests).`);

  const vendor = event.vendors.find(v => v.id === vendorId) || event.vendors[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookingConfirm = () => {
    updateVendorStatus(vendor.id, 'booked');
    setShowInquiryModal(false);
    showToast(`Confirmed booking for ${vendor.name}! Status updated to Booked.`);
  };

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-headline text-2xl text-primary font-bold">Artisan Dossier Not Found</h2>
        <p className="text-xs text-on-surface-variant">The requested artisan profile could not be located.</p>
        <Link to="/vendors" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white text-xs uppercase font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-full shadow-2xl text-xs font-semibold tracking-wide flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artisan Marketplace</span>
        </Link>
      </div>

      {/* Hero Dossier Header */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-outline-variant/50 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={vendor.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGl6QCSUkb5ShvtE3ZZzogJp1_JuRh8cx32xC98C0lsDj_m7B6aew6o4UAJD7dL4KsStodI45FVJumkRg4PBaHjx_qwKjre6mxolrDwDV8ePtkkXKsDOdImw_kAmSyzeZGsu84OQxvReHJRsq7bf-kNkokj-9BuYvL40d_d3bhNgNrqJl2ERIQZWnWBPkCiowH2cfaEp_I3Vr31J_LOJ4nAMHyxphS61sm9ttpUasy'}
            alt={vendor.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-secondary/30 shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-bold tracking-wider">
                {vendor.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Demo Profile
              </span>
              <span className="text-xs text-on-surface-variant">• {vendor.location || 'Rajasthan'}</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-primary font-bold">
              {vendor.name}
            </h1>
            <p className="text-xs sm:text-sm text-secondary font-medium">
              {vendor.tagline || 'Master Artisan & Luxury Event Specialist'}
            </p>
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1 text-on-surface">
                <Star className="w-3.5 h-3.5 fill-[#fed798] text-[#fed798]" />
                <span className="font-bold">{vendor.rating || 4.9}</span>
                <span className="text-on-surface-variant">({vendor.reviewsCount || 38} reviews)</span>
              </div>
              <span className="text-outline-variant">|</span>
              <span className="text-on-surface-variant font-medium">Lead Time: {vendor.leadTime || '4 weeks'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsFavorited(!isFavorited);
              showToast(isFavorited ? 'Removed from favorites' : 'Saved to favorites');
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
              isFavorited ? 'bg-primary text-white border-primary' : 'bg-surface-container text-on-surface border-outline-variant hover:bg-surface-variant'
            }`}
            title="Save to shortlist"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowInquiryModal(true)}
            className="px-6 py-3 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Reserve via Concierge</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Analysis, Bio, Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Synergy Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-container/10 via-white to-secondary-container/20 border border-secondary/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Soirée AI Match Analysis</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wider">
                99% Synergy Score
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/90 rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Target Capacity</span>
                <span className="font-headline text-lg font-bold text-primary">{event.guestCount} Guests</span>
                <p className="text-[11px] text-on-surface-variant mt-1">Full artisan brigade mobilized for {event.location.split(',')[0]}.</p>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Style Alignment</span>
                <span className="font-headline text-lg font-bold text-secondary">Heritage Classic</span>
                <p className="text-[11px] text-on-surface-variant mt-1">Directly matches your {event.theme} motif.</p>
              </div>
              <div className="p-3 bg-white/90 rounded-xl border border-outline-variant/30">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Venue Logistics</span>
                <span className="font-headline text-lg font-bold text-primary">Pre-Approved</span>
                <p className="text-[11px] text-on-surface-variant mt-1">Existing security access to property grounds.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-on-surface pt-2 border-t border-secondary/20">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span>Recommended exclusively for hosts seeking uncompromising craftsmanship with verified heritage provenance.</span>
            </div>
          </div>

          {/* Biography & Mission */}
          <div className="p-6 bg-white rounded-2xl border border-outline-variant/40 shadow-sm space-y-3">
            <h3 className="font-headline text-xl text-primary font-bold">Artisan Dossier & Philosophy</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {vendor.description}
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Every detail is meticulously planned through private tastings and design iterations. All supplier agreements incorporate standard bespoke grace periods, weather postponement protection riders, and non-disclosure clauses.
            </p>
          </div>

          {/* Curated Service Packages */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Artisan Offerings</span>
                <h3 className="font-headline text-2xl text-primary font-bold mt-0.5">Curated Packages & Rates</h3>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">All figures quoted in INR</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(vendor.services && vendor.services.length > 0 ? vendor.services : [
                { title: 'Standard Signature Master Service', price: vendor.price, description: 'Comprehensive coverage, artisan staffing, and bespoke consultation for your celebration.' },
                { title: 'Elevated VIP Concierge Package', price: Math.round(vendor.price * 1.35), description: 'Dedicated on-site director, premium ingredient/asset sourcing, and afterparty extension.' }
              ]).map((srv, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-headline text-base font-bold text-primary">{srv.title}</h4>
                      <span className="font-headline text-base font-bold text-secondary whitespace-nowrap">{formatINR(srv.price)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{srv.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInquiryModal(true);
                        setInquiryNotes(`Interested in package: ${srv.title} (${formatINR(srv.price)}) for ${event.name}`);
                      }}
                      className="px-4 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-primary text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Inquire Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Imagery */}
          {vendor.gallery && vendor.gallery.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block">Portfolio Showcase</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {vendor.gallery.map((imgUrl, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm group">
                    <img
                      src={imgUrl}
                      alt={`Portfolio image ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2 left-3 text-[10px] text-white font-medium">Archive Plate {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Retainer & Fast Contact (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-outline-variant/50 shadow-md space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">Estimated Investment</span>
              <span className="font-headline text-3xl font-bold text-primary block mt-1">{formatINR(vendor.price)}</span>
              <span className="text-xs text-on-surface-variant mt-1 block">Includes full staffing & coordination</span>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Current Status:</span>
                <span className="font-bold text-primary uppercase">{vendor.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Assigned Event:</span>
                <span className="font-semibold text-on-surface">{event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Celebration Date:</span>
                <span className="font-semibold text-on-surface">{event.date}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleBookingConfirm()}
                className="w-full py-3 rounded-full bg-primary hover:bg-[#5b1a2b] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 text-center"
              >
                Lock Booking in Roster
              </button>

              <button
                type="button"
                onClick={() => setShowInquiryModal(true)}
                className="w-full py-2.5 rounded-full bg-surface-container hover:bg-surface-variant text-primary font-semibold text-xs uppercase tracking-wider transition-colors text-center border border-outline-variant"
              >
                Send Prototype Dispatch
              </button>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 space-y-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-secondary" />
                <span>{vendor.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-secondary" />
                <span>{vendor.phone}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Inquiry / Booking Prototype Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-headline text-lg font-bold text-primary">Prototype Concierge Dispatch</h3>
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                className="text-on-surface-variant hover:text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-secondary-container/20 rounded-xl text-xs text-on-secondary-container">
              <span className="font-bold">Prototype Notice:</span> This action simulates dispatching an official inquiry brief to {vendor.name} and updating your event tracker.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">To Artisan</label>
                <input
                  type="text"
                  readOnly
                  value={`${vendor.name} (${vendor.contact})`}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Inquiry Specifications</label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                ></textarea>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                className="px-4 py-2 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateVendorStatus(vendor.id, 'contracted');
                  setShowInquiryModal(false);
                  showToast(`Inquiry dispatched to ${vendor.name}! Status updated to Contracted.`);
                }}
                className="px-6 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-white font-semibold uppercase tracking-wider shadow-md"
              >
                Send Prototype Brief
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

