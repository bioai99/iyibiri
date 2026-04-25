export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

/* ─────────────────────────────────────────────────────────────
 *  MembershipFeeConfig — ADR-007 parametric fee jsonb shape
 *  Migration 009_parametric_ngo_fee.sql
 * ───────────────────────────────────────────────────────────── */

export type FeePeriod = 'annual' | 'monthly' | 'one_time'

export interface FeeTier {
  id: string
  name: string
  amount: number
  period?: FeePeriod
  age_min?: number
  age_max?: number
  region?: 'metropolitan' | 'other' | string
  display_order?: number
  impact_statement?: string
  meta_label?: string
  recommended?: boolean
}

export interface RegistrationFee {
  amount: number
  one_time: boolean
  description?: string | null
}

export interface DonationBased {
  min_amount: number | null
  suggested_amounts?: number[]
  note?: string | null
}

export interface MembershipFeeConfig {
  mode: 'annual' | 'monthly' | 'one_time' | 'donation_based' | 'age_tiered'
  currency: 'TRY' | string
  tiers: FeeTier[]
  registration_fee?: RegistrationFee | null
  donation_based?: DonationBased | null
  cooling_off_days?: number
  auto_renew_default?: boolean
  has_installments?: boolean
}


export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          full_name: string | null
          first_name: string | null
          avatar_url: string | null
          avatar_type: 'cat' | 'dog' | 'fox' | 'robot' | 'party' | null
          karma_total: number
          karma: number
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
          onboarding_completed: boolean
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
          onboarding_completed?: boolean
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
          onboarding_completed?: boolean
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
          membership_enabled: boolean
          membership_form_fields: any
          membership_approval_required: boolean
          membership_description: string | null
          membership_terms_url: string | null
          // Migration 009 — ADR-007 parametric fee
          membership_fee_config: MembershipFeeConfig | null
          // Migration 010 — ADR-008 payment routing
          payment_mode: 'embedded' | 'passthrough' | 'marketplace'
          payment_processor: 'iyzico' | 'paytr' | 'fonzip' | 'custom' | 'none'
          payment_merchant_key_ref: string | null
          donation_url: string | null
          membership_url: string | null
          referral_webhook_url: string | null
          embed_config: Json
          tax_exempt: boolean
          // Migration 016 — yasal doküman URL'leri
          kvkk_document_url: string | null
          membership_contract_url: string | null
          volunteer_consent_url: string | null
          // Migration 021 — admin profil + sosyal linker
          email: string | null
          phone: string | null
          social_instagram: string | null
          social_twitter: string | null
          social_linkedin: string | null
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
          membership_enabled?: boolean
          membership_form_fields?: any
          membership_approval_required?: boolean
          membership_description?: string | null
          membership_terms_url?: string | null
          membership_fee_config?: MembershipFeeConfig | null
          payment_mode?: 'embedded' | 'passthrough' | 'marketplace'
          payment_processor?: 'iyzico' | 'paytr' | 'fonzip' | 'custom' | 'none'
          payment_merchant_key_ref?: string | null
          donation_url?: string | null
          membership_url?: string | null
          referral_webhook_url?: string | null
          embed_config?: Json
          tax_exempt?: boolean
          kvkk_document_url?: string | null
          membership_contract_url?: string | null
          volunteer_consent_url?: string | null
          email?: string | null
          phone?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_linkedin?: string | null
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
          membership_enabled?: boolean
          membership_form_fields?: any
          membership_approval_required?: boolean
          membership_description?: string | null
          membership_terms_url?: string | null
          membership_fee_config?: MembershipFeeConfig | null
          payment_mode?: 'embedded' | 'passthrough' | 'marketplace'
          payment_processor?: 'iyzico' | 'paytr' | 'fonzip' | 'custom' | 'none'
          payment_merchant_key_ref?: string | null
          donation_url?: string | null
          membership_url?: string | null
          referral_webhook_url?: string | null
          embed_config?: Json
          tax_exempt?: boolean
          kvkk_document_url?: string | null
          membership_contract_url?: string | null
          volunteer_consent_url?: string | null
          email?: string | null
          phone?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_linkedin?: string | null
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
          domain: 'nature' | 'education' | 'social' | 'health' | 'animals' | 'arts' | 'sports' | 'advocacy' | 'economic' | 'emergency' | null
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
          // Migration 013 — state machine additions
          status: 'draft' | 'active' | 'cancelled' | 'completed'
          event_date: string | null
          prep_checklist: Json | null
          // Migration 015 — per-mission visibility (Yol D)
          access_level: 'public' | 'members_only'
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
          domain?: 'nature' | 'education' | 'social' | 'health' | 'animals' | 'arts' | 'sports' | 'advocacy' | 'economic' | 'emergency' | null
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
          status?: 'draft' | 'active' | 'cancelled' | 'completed'
          event_date?: string | null
          prep_checklist?: Json | null
          access_level?: 'public' | 'members_only'
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
          domain?: 'nature' | 'education' | 'social' | 'health' | 'animals' | 'arts' | 'sports' | 'advocacy' | 'economic' | 'emergency' | null
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
          status?: 'draft' | 'active' | 'cancelled' | 'completed'
          event_date?: string | null
          prep_checklist?: Json | null
          access_level?: 'public' | 'members_only'
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
          // Migration 013: 'cancelled' eklendi
          status: 'taken' | 'completed' | 'cancelled'
          taken_at: string
          completed_at: string | null
          verification_data: Json | null
          karma_awarded: number | null
          // Migration 013 admin moderation
          admin_review_status:
            | 'auto_approved'
            | 'pending_review'
            | 'approved'
            | 'rejected'
          admin_feedback: string | null
          // Migration 022 — proof columns
          proof_type: 'photo' | 'code' | 'qr' | 'auto' | null
          proof_url: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          status?: 'taken' | 'completed' | 'cancelled'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
          admin_review_status?:
            | 'auto_approved'
            | 'pending_review'
            | 'approved'
            | 'rejected'
          admin_feedback?: string | null
          proof_type?: 'photo' | 'code' | 'qr' | 'auto' | null
          proof_url?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mission_id?: string
          status?: 'taken' | 'completed' | 'cancelled'
          taken_at?: string
          completed_at?: string | null
          verification_data?: Json | null
          karma_awarded?: number | null
          admin_review_status?:
            | 'auto_approved'
            | 'pending_review'
            | 'approved'
            | 'rejected'
          admin_feedback?: string | null
          proof_type?: 'photo' | 'code' | 'qr' | 'auto' | null
          proof_url?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      karma_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption' | 'ngo_membership'
          reference_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'mission_complete' | 'reward_redemption' | 'ngo_membership'
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
      posts: {
        Row: {
          id: string
          ngo_id: string
          title: string
          summary: string | null
          content: string | null
          cover_image_url: string | null
          category: 'article' | 'update' | 'story' | 'tip' | null
          read_time: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          title: string
          summary?: string | null
          content?: string | null
          cover_image_url?: string | null
          category?: 'article' | 'update' | 'story' | 'tip' | null
          read_time?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          title?: string
          summary?: string | null
          content?: string | null
          cover_image_url?: string | null
          category?: 'article' | 'update' | 'story' | 'tip' | null
          read_time?: number
          published?: boolean
          created_at?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: { id: string; user_id: string; post_id: string; created_at: string }
        Insert: { id?: string; user_id: string; post_id: string; created_at?: string }
        Update: { id?: string; user_id?: string; post_id?: string; created_at?: string }
        Relationships: []
      }
      ngo_memberships: {
        Row: {
          id: string
          user_id: string
          ngo_id: string
          status: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
          tier: 'free' | 'basic' | 'premium'
          form_data: any
          joined_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ngo_id: string
          status?: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
          tier?: 'free' | 'basic' | 'premium'
          form_data?: any
          joined_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ngo_id?: string
          status?: 'pending' | 'active' | 'rejected' | 'expired' | 'cancelled'
          tier?: 'free' | 'basic' | 'premium'
          form_data?: any
          joined_at?: string
          expires_at?: string | null
        }
        Relationships: []
      }
      ngo_admin_users: {
        // Migration 019 — ADR-010 STK admin rol sistemi
        Row: {
          id: string
          user_id: string
          ngo_id: string
          role: 'admin' | 'editor' | 'viewer'
          permissions: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ngo_id: string
          role?: 'admin' | 'editor' | 'viewer'
          permissions?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ngo_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          permissions?: Json
          created_at?: string
        }
        Relationships: []
      }
      referrals: {
        // Migration 010_payment_routing.sql — ADR-008 payment attribution
        Row: {
          id: string
          user_id: string
          ngo_id: string
          referral_type: 'membership' | 'donation' | 'subscription'
          amount_try: number | null
          status:
            | 'pending'
            | 'confirmed'
            | 'failed'
            | 'cancelled'
            | 'refunded'
          external_transaction_id: string | null
          external_order_id: string | null
          metadata: Json
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ngo_id: string
          referral_type: 'membership' | 'donation' | 'subscription'
          amount_try?: number | null
          status?:
            | 'pending'
            | 'confirmed'
            | 'failed'
            | 'cancelled'
            | 'refunded'
          external_transaction_id?: string | null
          external_order_id?: string | null
          metadata?: Json
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ngo_id?: string
          referral_type?: 'membership' | 'donation' | 'subscription'
          amount_try?: number | null
          status?:
            | 'pending'
            | 'confirmed'
            | 'failed'
            | 'cancelled'
            | 'refunded'
          external_transaction_id?: string | null
          external_order_id?: string | null
          metadata?: Json
          created_at?: string
          confirmed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      // Migration 011_make_analytics_views.sql
      make_monthly: {
        Row: {
          month: string
          make_count: number
          total_mission_completions: number
          total_karma_awarded: number
        }
        Relationships: []
      }
      make_rolling_30d: {
        Row: {
          make_count: number
          total_mission_completions: number
          window_start: string
          window_end: string
        }
        Relationships: []
      }
      karma_per_make: {
        Row: {
          month: string
          make_count: number
          total_karma: number
          avg_karma_per_make: number
        }
        Relationships: []
      }
      w4_retention_cohort: {
        Row: {
          cohort_month: string
          cohort_size: number
          retained_w4: number
          w4_retention_pct: number
        }
        Relationships: []
      }
      first_mission_time: {
        Row: {
          user_id: string
          signup_at: string
          first_mission_at: string | null
          hours_to_first_mission: number | null
        }
        Relationships: []
      }
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
export type NgoMembership = Database['public']['Tables']['ngo_memberships']['Row']
export type Referral = Database['public']['Tables']['referrals']['Row']

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
export type Post = Database['public']['Tables']['posts']['Row']
export type PostLike = Database['public']['Tables']['post_likes']['Row']
export type PostWithNGO = Post & { ngos: NGOBrief | null }
