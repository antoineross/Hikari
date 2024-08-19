export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          author_id: string;
          content: Json | null;
          created_at: string;
          id: string;
          published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content?: Json | null;
          created_at?: string;
          id?: string;
          published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: Json | null;
          created_at?: string;
          id?: string;
          published?: boolean;
          title?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          created_at: string | null;
          email: string | null;
          email_verified: string | null;
          id: string;
          image: string | null;
          name: string | null;
          stripe_current_period_end: string | null;
          stripe_customer_id: string | null;
          stripe_price_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          email_verified?: string | null;
          id: string;
          image?: string | null;
          name?: string | null;
          stripe_current_period_end?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          email_verified?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          stripe_current_period_end?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
