export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          capacity_kw: number
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          images: string[]
          installation_date: string | null
          status: 'active' | 'completed' | 'pending'
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          capacity_kw: number
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          images?: string[]
          installation_date?: string | null
          status?: 'active' | 'completed' | 'pending'
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          capacity_kw?: number
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          images?: string[]
          installation_date?: string | null
          status?: 'active' | 'completed' | 'pending'
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          project_id: string | null
          reviewer_name: string
          rating: number
          comment: string
          is_approved: boolean
          admin_response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          reviewer_name: string
          rating: number
          comment: string
          is_approved?: boolean
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          reviewer_name?: string
          rating?: number
          comment?: string
          is_approved?: boolean
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          project_id: string | null
          name: string
          email: string
          phone: string
          message: string
          status: 'new' | 'in_progress' | 'resolved' | 'archived'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          name: string
          email: string
          phone: string
          message: string
          status?: 'new' | 'in_progress' | 'resolved' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          name?: string
          email?: string
          phone?: string
          message?: string
          status?: 'new' | 'in_progress' | 'resolved' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: number
          org_name: string
          contact_email: string
          contact_phone: string
          org_address: string
          kwh_per_kw_per_month: number
          tariff_per_kwh: number
          system_cost_per_kw: number
          subsidy_percentage: number
          maintenance_cost_per_kw_year: number
          carousel_speed: number
          map_center_lat: number
          map_center_lng: number
          map_zoom: number
          updated_at: string
        }
        Insert: {
          id?: number
          org_name?: string
          contact_email?: string
          contact_phone?: string
          org_address?: string
          kwh_per_kw_per_month?: number
          tariff_per_kwh?: number
          system_cost_per_kw?: number
          subsidy_percentage?: number
          maintenance_cost_per_kw_year?: number
          carousel_speed?: number
          map_center_lat?: number
          map_center_lng?: number
          map_zoom?: number
          updated_at?: string
        }
        Update: {
          id?: number
          org_name?: string
          contact_email?: string
          contact_phone?: string
          org_address?: string
          kwh_per_kw_per_month?: number
          tariff_per_kwh?: number
          system_cost_per_kw?: number
          subsidy_percentage?: number
          maintenance_cost_per_kw_year?: number
          carousel_speed?: number
          map_center_lat?: number
          map_center_lng?: number
          map_zoom?: number
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          is_admin: boolean
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          is_admin?: boolean
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_admin?: boolean
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
