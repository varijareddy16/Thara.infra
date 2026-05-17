// Types matching the Supabase schema for Thara Infra.

export type UserRole = "admin" | "customer";   // "sales" removed
export type PropertyStatus = "Ready to Move" | "Under Construction";
export type PropertyType = "Apartment" | "Villa" | "Penthouse";
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Site Visit"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";
export type CareerType = "Full-time" | "Part-time" | "Contract";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  bhk: string;
  size: string;
  status: PropertyStatus;
  type: PropertyType;
  image_url: string;
  featured: boolean;
  amenities: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: string | null;
  property_name: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  notes: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  lead_id: string | null;
  property_id: string | null;
  visit_date: string;
  visit_time: string;
  status: BookingStatus;
  notes: string;
  created_at: string;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: CareerType;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Property, "id" | "created_at" | "updated_at">>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at">;
        Update: Partial<Omit<Booking, "id" | "created_at">>;
      };
      careers: {
        Row: Career;
        Insert: Omit<Career, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Career, "id" | "created_at" | "updated_at">>;
      };
      blogs: {
        Row: Blog;
        Insert: Omit<Blog, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Blog, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      property_status: PropertyStatus;
      property_type: PropertyType;
      lead_status: LeadStatus;
      career_type: CareerType;
      booking_status: BookingStatus;
    };
  };
}
