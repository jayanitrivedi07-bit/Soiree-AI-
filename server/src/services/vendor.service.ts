import { localDb, getSupabase } from '../config/database.js';
import { Vendor } from '../types/index.js';
import { NotFoundError } from '../utils/errors.js';
import { randomUUID } from 'crypto';

export class VendorService {
  public async getAllVendors(category?: string): Promise<Vendor[]> {
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase.from('vendors').select('*');
      if (category) query = query.eq('category', category);
      const { data } = await query;
      if (data && data.length > 0) {
        return data.map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category,
          contact: v.contact_email || '',
          phone: v.phone || '',
          price: Number(v.price_range || 0),
          status: v.status || 'inquiry',
          rating: v.rating,
          reviewsCount: v.reviews_count,
          location: v.location,
          tagline: v.tagline,
          description: v.description,
          image: v.image_url,
          gallery: v.gallery_urls,
          services: v.services,
          leadTime: v.lead_time,
          isDemo: v.is_demo,
        }));
      }
    }

    const all = Array.from(localDb.vendors.values());
    if (category) return all.filter((v) => v.category.toLowerCase() === category.toLowerCase());
    return all;
  }

  public async getVendorById(id: string): Promise<Vendor> {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase.from('vendors').select('*').eq('id', id).single();
      if (data) {
        return {
          id: data.id,
          name: data.name,
          category: data.category,
          contact: data.contact_email || '',
          phone: data.phone || '',
          price: Number(data.price_range || 0),
          status: data.status || 'inquiry',
          rating: data.rating,
          reviewsCount: data.reviews_count,
          location: data.location,
          tagline: data.tagline,
          description: data.description,
          image: data.image_url,
          gallery: data.gallery_urls,
          services: data.services,
          leadTime: data.lead_time,
          isDemo: data.is_demo,
        };
      }
    }

    const vendor = localDb.vendors.get(id);
    if (!vendor) throw new NotFoundError(`Vendor "${id}" not found.`);
    return vendor;
  }

  public async getEventVendors(eventId: string): Promise<Vendor[]> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);
    return event.vendors;
  }

  public async addVendorToEvent(
    eventId: string,
    input: {
      name: string;
      category: string;
      contact?: string;
      phone?: string;
      price?: number;
      status?: Vendor['status'];
      rating?: number;
      reviewsCount?: number;
      location?: string;
      tagline?: string;
      description?: string;
      image?: string;
      gallery?: string[];
      services?: any[];
      leadTime?: string;
    }
  ): Promise<Vendor> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const id = randomUUID();
    const vendor: Vendor = {
      id,
      name: input.name,
      category: input.category,
      contact: input.contact ?? '',
      phone: input.phone ?? '',
      price: input.price ?? 0,
      status: input.status ?? 'shortlisted',
      rating: input.rating ?? 4.9,
      reviewsCount: input.reviewsCount ?? 1,
      location: input.location ?? 'India',
      tagline: input.tagline ?? 'Artisanal Celebration Specialist',
      description: input.description ?? 'Bespoke celebration services.',
      image: input.image,
      gallery: input.gallery,
      services: input.services,
      leadTime: input.leadTime ?? '4 weeks advance booking',
      isDemo: false,
    };

    event.vendors.push(vendor);
    event.updatedAt = new Date().toISOString();
    localDb.events.set(eventId, event);

    // Also add to global vendor pool
    localDb.vendors.set(id, vendor);

    return vendor;
  }

  public async removeVendorFromEvent(eventId: string, vendorId: string): Promise<boolean> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const before = event.vendors.length;
    event.vendors = event.vendors.filter((v) => v.id !== vendorId);
    const removed = event.vendors.length < before;

    if (removed) {
      event.updatedAt = new Date().toISOString();
      localDb.events.set(eventId, event);
    }
    return removed;
  }

  public async updateVendorStatus(eventId: string, vendorId: string, status: Vendor['status']): Promise<Vendor> {
    const event = localDb.events.get(eventId);
    if (!event) throw new NotFoundError(`Event "${eventId}" not found.`);

    const idx = event.vendors.findIndex((v) => v.id === vendorId);
    if (idx === -1) throw new NotFoundError(`Vendor "${vendorId}" not found for event "${eventId}".`);

    event.vendors[idx] = { ...event.vendors[idx], status };
    event.updatedAt = new Date().toISOString();
    localDb.events.set(eventId, event);

    // Update global vendor pool too
    const global = localDb.vendors.get(vendorId);
    if (global) localDb.vendors.set(vendorId, { ...global, status });

    return event.vendors[idx];
  }
}

export const vendorService = new VendorService();

