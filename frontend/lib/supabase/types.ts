export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'platform_admin' | 'place_incharge'

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          description: string | null
          category: string
          address: string
          latitude: number | null
          longitude: number | null
          photos: string[]
          contact_phone: string | null
          contact_email: string | null
          opening_hours: Json | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          description?: string | null
          category: string
          address: string
          latitude?: number | null
          longitude?: number | null
          photos?: string[]
          contact_phone?: string | null
          contact_email?: string | null
          opening_hours?: Json | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          description?: string | null
          category?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          photos?: string[]
          contact_phone?: string | null
          contact_email?: string | null
          opening_hours?: Json | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          check_user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
    }
  }
}
