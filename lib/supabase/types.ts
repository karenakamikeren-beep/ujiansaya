export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          education_level: string | null
          referral_code: string
          referred_by: string | null
          has_completed_onboarding: boolean
          free_premium_used: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          education_level?: string | null
          referral_code?: string
          referred_by?: string | null
          has_completed_onboarding?: boolean
          free_premium_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          education_level?: string | null
          referral_code?: string
          referred_by?: string | null
          has_completed_onboarding?: boolean
          free_premium_used?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tryouts: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          category: string
          thumbnail_url: string | null
          is_premium: boolean
          duration_minutes: number
          passing_score: number
          total_questions: number
          total_attempts: number
          average_score: number | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          category: string
          thumbnail_url?: string | null
          is_premium?: boolean
          duration_minutes: number
          passing_score: number
          total_questions?: number
          total_attempts?: number
          average_score?: number | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          category?: string
          thumbnail_url?: string | null
          is_premium?: boolean
          duration_minutes?: number
          passing_score?: number
          total_questions?: number
          total_attempts?: number
          average_score?: number | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tryout_attempts: {
        Row: {
          id: string
          user_id: string
          tryout_id: string
          started_at: string
          submitted_at: string | null
          is_completed: boolean
          score: number | null
          total_correct: number
          total_wrong: number
          total_unanswered: number
          total_questions: number
          time_spent_seconds: number
          is_passed: boolean
          used_free_premium: boolean
          created_at: string
        }
      }
      questions: {
        Row: {
          id: string
          tryout_id: string
          question_number: number
          question_text: string
          question_image_url: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          option_e: string
          correct_answer: string
          explanation: string
          explanation_image_url: string | null
          topic: string
          difficulty: string
          created_at: string
        }
      }
      answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          time_spent_seconds: number
          answered_at: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          order_id: string
          transaction_id: string
          subscription_type: string
          payment_type: string
          gross_amount: number
          transaction_status: string
          snap_token: string | null
          payment_url: string | null
          midtrans_response: any
          paid_at: string | null
          expired_at: string
          created_at: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_type: string
          is_premium: boolean
          premium_start_date: string | null
          premium_end_date: string | null
          auto_renew: boolean
          payment_id: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
