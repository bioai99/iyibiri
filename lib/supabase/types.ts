export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          avatar_type: 'cat' | 'dog' | 'fox' | 'robot' | 'party' | null
          karma_total: number
          level: number
          streak: number
          last_active: string | null
          created_at: string
          interests: string[]
          city: string | null
          search_radius: number
          email: string | null
          current_streak: number
          longest_streak: number
          last_mission_week: string | null
          age_range: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          avatar_type?: 'cat' | 'dog' | 'fox' | 'robot' | 'party' | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
          created_at?: string
          interests?: string[]
          city?: string | null
          search_radius?: number
          current_streak?: number
          longest_streak?: number
          last_mission_week?: string | null
          age_range?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          avatar_type?: 'cat' | 'dog' | 'fox' | 'robot' | 'party' | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
          created_at?: string
          interests?: string[]
          city?: string | null
          search_radius?: number
          current_streak?: number
          longest_streak?: number
          last_mission_week?: string | null
          age_range?: string | null
        }
        Relationships: []
      }
      ngos: {
        Row: {
          id: string
          name: string
          short_name: string | null
          tagline: string | null
          description: string | null
          category: string | null
          color_accent: string | null
          logo_url: string | null
          cover_image_url: string | null
          website: string | null
          member_count: number
          volunteer_count: number
          founded: number | null
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          tagline?: string | null
          description?: string | null
          category?: string | null
          color_accent?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          member_count?: number
          volunteer_count?: number
          founded?: number | null
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          tagline?: string | null
          description?: string | null
          category?: string | null
          color_accent?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          website?: string | null
          member_count?: number
          volunteer_count?: number
          founded?: number | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string | null
          long_description: string | null
          ngo_id: string | null
          category: string | null
          difficulty: 'easy' | 'medium' | 'hard' | null
          karma: number
          duration: string | null
          domain: 'nature' | 'education' | 'social' | 'financial' | null
          style: 'remote' | 'outside' | 'both' | null
          verify_method: 'auto' | 'code' | 'photo' | 'qr'
          verify_code: string | null
          verify_hint: string | null
          featured: boolean
          active: boolean
          steps: Json
          impact_statement: string | null
          qr_code_data: string | null
          image_url: string | null
          participants: number
          photo_url: string | null
          location: string | null
          date_label: string | null
          spots_left: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          long_description?: string | null
          ngo_id?: string | null
          category?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          karma?: number
          duration?: string | null
          domain?: 'nature' | 'education' | 'social' | 'financial' | null
          style?: 'remote' | 'outside' | 'both' | null
          verify_method?: 'auto' | 'code' | 'photo' | 'qr'
          verify_code?: string | null
          verify_hint?: string | null
          featured?: boolean
          active?: boolean
          steps?: Json
          impact_statement?: string | null
          qr_code_data?: string | null
          image_url?: string | null
          participants?: number
          photo_url?: string | null
          location?: string | null
          date_label?: string | null
          spots_left?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          long_description?: string | null
          ngo_id?: string | null
          category?: string | null
          difficulty?: 'easy' | 'medium' | 'hard' | null
          karma?: number
          duration?: string | null
          domain?: 'nature' | 'education' | 'social' | 'financial' | null
          style?: 'remote' | 'outside' | 'both' | null
          verify_method?: 'auto' | 'code' | 'photo' | 'qr'
          verify_code?: string | null
          verify_hint?: string | null
          featured?: boolean
          active?: boolean
          steps?: Json
          impact_statement?: string | null
          qr_code_data?: string | null
          image_url?: string | null
          participants?: number
          photo_url?: string | null
          location?: string | null
          date_label?: string | null
          spots_left?: number
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          title: string
          brand: string
          brand_logo: string | null
          description: string | null
          karma_required: number
          category: string | null
          active: boolean
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          brand: string
          brand_logo?: string | null
          description?: string | null
          karma_required: number
          category?: string | null
          active?: boolean
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          brand?: string
          brand_logo?: string | null
          description?: string | null
          karma_required?: number
          category?: string | null
          active?: boolean
          image_url?: string | null
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          status: 'taken' | 'completed'
          taken_at: string
          completed_at: string | null
          verification_data: Json | null
          karma_awarded: number | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          status?: 'taken' | 'completed'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: string
          status?: 'taken' | 'completed'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
        Relationships: []
      }
      karma_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption'
          reference_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption'
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'mission_complete' | 'reward_redemption'
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          karma_spent: number
          status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          karma_spent: number
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          karma_spent?: number
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      user_saved_missions: {
        Row: { id: string; user_id: string; mission_id: string; saved_at: string }
        Insert: { id?: string; user_id: string; mission_id: string; saved_at?: string }
        Update: { id?: string; user_id?: string; mission_id?: string; saved_at?: string }
        Relationships: []
      }
      user_ngo_subscriptions: {
        Row: { id: string; user_id: string; ngo_id: string; subscribed_at: string }
        Insert: { id?: string; user_id: string; ngo_id: string; subscribed_at?: string }
        Update: { id?: string; user_id?: string; ngo_id?: string; subscribed_at?: string }
        Relationships: []
      }
      support_requests: {
        Row: {
          id: string
          email: string | null
          support_type: string[]
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          support_type?: string[]
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          support_type?: string[]
          message?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type NGO = Database['public']['Tables']['ngos']['Row']
export type Mission = Database['public']['Tables']['missions']['Row']
export type Reward = Database['public']['Tables']['rewards']['Row']
export type UserMission = Database['public']['Tables']['user_missions']['Row']
export type KarmaTransaction = Database['public']['Tables']['karma_transactions']['Row']
export type RewardRedemption = Database['public']['Tables']['reward_redemptions']['Row']
export type UserSavedMission = Database['public']['Tables']['user_saved_missions']['Row']
export type UserNgoSubscription = Database['public']['Tables']['user_ngo_subscriptions']['Row']

// Extended types for joined queries
export type NGOBrief = {
  id: string
  name: string
  short_name: string | null
  logo_url: string | null
  color_accent: string | null
  cover_image_url: string | null
}

export type MissionWithNGO = Mission & { ngos: NGOBrief | null }
