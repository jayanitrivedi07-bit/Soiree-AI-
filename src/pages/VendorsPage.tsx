import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { Vendor } from '../types';
import { formatINR } from '../lib/formatters';
import { Search, Star, ShieldCheck, Plus, ArrowRight, Trash2, Mail, Phone, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export const VendorsPage: React.FC = () => {
  const { event, updateVendorStatus, addVendor, removeVendor } = useEvent();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Vendor Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Florals');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState<number>(200000);
  const [status, setStatus] = useState<Vendor['status']>('shortlisted');
  const [location, setLocation] = useState('Udaipur / Mumbai');
  const [formError, setFormError] = useState('');

  const categories = ['All', 'Catering', 'Florals', 'Photography', 'Entertainment', 'Decor', 'Venue'];

  const filteredVendors = event.vendors.filter(vendor => {
    if (selectedCategory !== 'All' && vendor.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && vendor.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = vendor.name.toLowerCase().includes(q);
      const matchCat = vendor.category.toLowerCase().includes(q);
      const matchLoc = (vendor.location || '').toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchLoc) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter artisan / vendor name');
      return;
    }

    addVendor({
      name: name.trim(),
      category,
      contact: contact.trim() || 'concierge@soireeai.com',
      phone: phone.trim() || '+91 98000 00000',
      price: Number(price) || 100000,
      status,
      rating: 4.9,
      reviewsCount: 12,
      location,
      tagline: 'Artisanal Celebration Specialist',
      description: 'Handcrafted bespoke event services tailored to luxury celebrations.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN'
    });

    setName('');
    setContact('');
    setPhone('');
    setPrice(200000);
    setFormError('');
    setShowAddModal(false);
    showToast(`Added ${name} to vendor roster`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-5 py-3 rounded-full shadow-2xl text-xs font-semibold tracking-wide flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-secondary text-xs uppercase font-semibold tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Curated Artisan Network</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary font-medium tracking-tight">
            Artisan & Vendor Marketplace
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-1">
            Discover, track quotes, and contract master culinary sommeliers, floral architects, and cinematic photographers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-[#5b1a2b] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Vendor</span>
        </button>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-start gap-3 text-xs text-on-secondary-container">
        <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold uppercase tracking-wider text-primary">Prototype Demonstration Roster</span>
          <p>
            All suppliers below represent high-fidelity sample records for your {event.name} brief. Quotations, contact triggers, and status updates persist locally in your browser prototype.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisans by name, specialty, or city..."
              className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low rounded-full text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary border-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['All', 'booked', 'contracted', 'inquiry', 'shortlisted'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {st === 'All' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-outline-variant/20">
          <span className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider shrink-0">Discipline:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-outline-variant/40">
            <ShieldCheck className="w-10 h-10 text-secondary mx-auto mb-2" />
            <h3 className="font-headline text-lg font-bold text-primary">No Artisans Found</h3>
            <p className="text-xs text-on-surface-variant mt-1">Try relaxing your search terms or add a custom vendor.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Vendor Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                  <img
                    src={vendor.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy4UU-sxKduE7IjApp0a9jrpJhS4dqrTTAZM5VN1UzBVxHeiYvzZuRkStPdR3TpAOy2830WhRnopKr3VVA94hJztpWDW-dyiNmWvq1O4ynSC3fpMCPN97cZZtnlhK86rieRvuZtOX2JBVA9xlJaL9iBwbltcpy99S3U-jHY8icH0DQ8O_1X7Oj55cGDNS73q17-5ofp7qEPWqDmXMDoAtTdiDQDdvI0WHKV3dGvraN'}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category & Demo Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-primary font-bold text-[10px] uppercase tracking-wider shadow-sm">
                      {vendor.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 font-bold text-[9px] uppercase tracking-wider">
                      Demo Record
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#fed798] text-[#fed798]" />
                    <span className="font-bold">{vendor.rating || 4.9}</span>
                    <span className="text-white/70 text-[10px]">({vendor.reviewsCount || 20})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-headline text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-xs text-secondary font-medium mt-0.5">{vendor.tagline}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-xs">
                    <span className="text-on-surface-variant">Estimated Fee:</span>
                    <span className="font-headline text-base font-bold text-primary">{formatINR(vendor.price)}</span>
                  </div>

                  {/* Status Selector */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-on-surface-variant font-medium">Booking Status:</span>
                    <select
                      value={vendor.status}
                      onChange={(e) => {
                        updateVendorStatus(vendor.id, e.target.value as Vendor['status']);
                        showToast(`Updated ${vendor.name} status to ${e.target.value}`);
                      }}
                      className="px-2.5 py-1 rounded-full border border-outline-variant bg-surface-container-low text-primary font-bold text-[11px] uppercase focus:outline-none"
                    >
                      <option value="booked">Booked (Locked)</option>
                      <option value="contracted">Contracted</option>
                      <option value="inquiry">In Inquiry</option>
                      <option value="shortlisted">Shortlisted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-surface-container-low/50 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                <Link
                  to={`/vendors/${vendor.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary uppercase tracking-wider transition-colors"
                >
                  <span>Artisan Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => showToast(`Simulated inquiry email sent to ${vendor.name} (${vendor.contact})`)}
                    className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                    title="Send Prototype Inquiry"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeVendor(vendor.id);
                      showToast(`Removed ${vendor.name} from roster`);
                    }}
                    className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                    title="Remove from Roster"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add Custom Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-headline text-lg font-bold text-primary">Add Artisan to Roster</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <p className="text-xs text-error bg-error-container p-2 rounded-lg">{formError}</p>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Artisan / Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jaipur Royal Sound & Symphony"
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Discipline</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  >
                    <option value="Catering">Catering</option>
                    <option value="Florals">Florals</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Decor">Decor</option>
                    <option value="Venue">Venue</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Estimated Fee (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Email Contact</label>
                  <input
                    type="email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="artisan@studio.in"
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Vendor['status'])}
                  className="w-full p-2.5 rounded-lg border border-outline-variant bg-white text-on-surface"
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="inquiry">In Inquiry</option>
                  <option value="contracted">Contracted</option>
                  <option value="booked">Booked (Locked)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary hover:bg-[#5b1a2b] text-white font-semibold uppercase tracking-wider shadow-md"
                >
                  Add Artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

