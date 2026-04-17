export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          karma_total: number
          level: number
          streak: number
          last_active: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          avatar_url?: string | null
          karma_total?: number
          level?: number
          streak?: number
          last_active?: string | null
        }
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
          website: string | null
          member_count: number
          volunteer_count: number
          founded: number | null
        }
        Insert: Omit<Database['public']['Tables']['ngos']['Row'], never>
        Update: Partial<Database['public']['Tables']['ngos']['Row']>
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
          participants: number
        }
        Insert: Omit<Database['public']['Tables']['missions']['Row'], 'featured' | 'active' | 'steps' | 'participants'> & {
          featured?: boolean
          active?: boolean
          steps?: Json
          participants?: number
        }
        Update: Partial<Database['public']['Tables']['missions']['Row']>
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
        }
        Insert: Omit<Database['public']['Tables']['rewards']['Row'], 'active'> & { active?: boolean }
        Update: Partial<Database['public']['Tables']['rewards']['Row']>
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
          user_id: string
          mission_id: string
          status?: 'taken' | 'completed'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
        Update: {
          status?: 'taken' | 'completed'
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
        }
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
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption'
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: never
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
          user_id: string
          reward_id: string
          karma_spent: number
          status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'completed'
        }
      }
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
