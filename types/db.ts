export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      plan: {
        Row: {
          description: string | null
          id: number
          interval: string | null
          interval_count: number | null
          is_usage_based: boolean | null
          name: string
          price: string
          product_id: number
          product_name: string | null
          sort: number | null
          trial_interval: string | null
          trial_interval_count: number | null
          variant_id: number
        }
        Insert: {
          description?: string | null
          id?: number
          interval?: string | null
          interval_count?: number | null
          is_usage_based?: boolean | null
          name: string
          price: string
          product_id: number
          product_name?: string | null
          sort?: number | null
          trial_interval?: string | null
          trial_interval_count?: number | null
          variant_id: number
        }
        Update: {
          description?: string | null
          id?: number
          interval?: string | null
          interval_count?: number | null
          is_usage_based?: boolean | null
          name?: string
          price?: string
          product_id?: number
          product_name?: string | null
          sort?: number | null
          trial_interval?: string | null
          trial_interval_count?: number | null
          variant_id?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          email: string
          ends_at: string | null
          id: number
          is_paused: boolean | null
          is_usage_based: boolean | null
          lemon_squeezy_id: string
          name: string
          order_id: number
          plan_id: number
          price: string
          renews_at: string | null
          status: string
          status_formatted: string
          subscription_item_id: number
          trial_ends_at: string | null
          user_id: string
        }
        Insert: {
          email: string
          ends_at?: string | null
          id?: number
          is_paused?: boolean | null
          is_usage_based?: boolean | null
          lemon_squeezy_id: string
          name: string
          order_id: number
          plan_id: number
          price: string
          renews_at?: string | null
          status: string
          status_formatted: string
          subscription_item_id?: number
          trial_ends_at?: string | null
          user_id: string
        }
        Update: {
          email?: string
          ends_at?: string | null
          id?: number
          is_paused?: boolean | null
          is_usage_based?: boolean | null
          lemon_squeezy_id?: string
          name?: string
          order_id?: number
          plan_id?: number
          price?: string
          renews_at?: string | null
          status?: string
          status_formatted?: string
          subscription_item_id?: number
          trial_ends_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          api_version: string | null
          created_at: string
          data: Json
          event_id: string
          event_type: string
          id: number
          payment_provider: string
          processed: boolean
          processing_error: string | null
        }
        Insert: {
          api_version?: string | null
          created_at?: string
          data: Json
          event_id: string
          event_type: string
          id?: number
          payment_provider: string
          processed?: boolean
          processing_error?: string | null
        }
        Update: {
          api_version?: string | null
          created_at?: string
          data?: Json
          event_id?: string
          event_type?: string
          id?: number
          payment_provider?: string
          processed?: boolean
          processing_error?: string | null
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
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

