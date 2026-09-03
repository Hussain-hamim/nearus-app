export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      blocks: {
        Row: { blocked_id: string; blocker_id: string; created_at: string };
        Insert: { blocked_id: string; blocker_id: string; created_at?: string };
        Update: { blocked_id?: string; blocker_id?: string; created_at?: string };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string;
          helper_id: string;
          id: string;
          last_message_at: string | null;
          last_message_preview: string | null;
          requester_id: string;
          task_id: string;
        };
        Insert: {
          created_at?: string;
          helper_id: string;
          id?: string;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          requester_id: string;
          task_id: string;
        };
        Update: {
          created_at?: string;
          helper_id?: string;
          id?: string;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          requester_id?: string;
          task_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          body: string;
          conversation_id: string;
          created_at: string;
          id: string;
          read_at: string | null;
          sender_id: string;
        };
        Insert: {
          body: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id: string;
        };
        Update: {
          body?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          read_at?: string | null;
          sender_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          data: Json;
          id: string;
          read_at: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          data?: Json;
          id?: string;
          read_at?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          data?: Json;
          id?: string;
          read_at?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          created_at: string;
          helper_id: string;
          id: string;
          message: string;
          status: string;
          task_id: string;
        };
        Insert: {
          created_at?: string;
          helper_id: string;
          id?: string;
          message: string;
          status?: string;
          task_id: string;
        };
        Update: {
          created_at?: string;
          helper_id?: string;
          id?: string;
          message?: string;
          status?: string;
          task_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          area: string | null;
          avatar_url: string | null;
          average_rating: number;
          bio: string | null;
          city: string | null;
          created_at: string;
          display_name: string;
          id: string;
          intent: string | null;
          lat: number | null;
          lng: number | null;
          locality: string | null;
          onboarding_completed_at: string | null;
          review_count: number;
          updated_at: string;
        };
        Insert: {
          area?: string | null;
          avatar_url?: string | null;
          average_rating?: number;
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          display_name?: string;
          id: string;
          intent?: string | null;
          lat?: number | null;
          lng?: number | null;
          locality?: string | null;
          onboarding_completed_at?: string | null;
          review_count?: number;
          updated_at?: string;
        };
        Update: {
          area?: string | null;
          avatar_url?: string | null;
          average_rating?: number;
          bio?: string | null;
          city?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          intent?: string | null;
          lat?: number | null;
          lng?: number | null;
          locality?: string | null;
          onboarding_completed_at?: string | null;
          review_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          reason: string;
          reported_user_id: string;
          reporter_id: string;
          task_id: string | null;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: string;
          reported_user_id: string;
          reporter_id: string;
          task_id?: string | null;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: string;
          reported_user_id?: string;
          reporter_id?: string;
          task_id?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          rating: number;
          reviewee_id: string;
          reviewer_id: string;
          task_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          rating: number;
          reviewee_id: string;
          reviewer_id: string;
          task_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          rating?: number;
          reviewee_id?: string;
          reviewer_id?: string;
          task_id?: string;
        };
        Relationships: [];
      };
      saved_tasks: {
        Row: { created_at: string; task_id: string; user_id: string };
        Insert: { created_at?: string; task_id: string; user_id: string };
        Update: { created_at?: string; task_id?: string; user_id?: string };
        Relationships: [];
      };
      task_addresses: {
        Row: { formatted_address: string; task_id: string };
        Insert: { formatted_address: string; task_id: string };
        Update: { formatted_address?: string; task_id?: string };
        Relationships: [];
      };
      tasks: {
        Row: {
          area: string;
          budget_amount: number;
          category: string;
          city: string;
          completed_at: string | null;
          created_at: string;
          currency: string;
          description: string;
          helper_id: string | null;
          id: string;
          lat: number;
          lng: number;
          locality: string;
          requester_id: string;
          scheduled_at: string | null;
          status: string;
          title: string;
          updated_at: string;
          visibility_radius_km: number;
        };
        Insert: {
          area: string;
          budget_amount: number;
          category: string;
          city: string;
          completed_at?: string | null;
          created_at?: string;
          currency?: string;
          description: string;
          helper_id?: string | null;
          id?: string;
          lat: number;
          lng: number;
          locality: string;
          requester_id: string;
          scheduled_at?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
          visibility_radius_km: number;
        };
        Update: {
          area?: string;
          budget_amount?: number;
          category?: string;
          city?: string;
          completed_at?: string | null;
          created_at?: string;
          currency?: string;
          description?: string;
          helper_id?: string | null;
          id?: string;
          lat?: number;
          lng?: number;
          locality?: string;
          requester_id?: string;
          scheduled_at?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
          visibility_radius_km?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_task_address: { Args: { p_task_id: string }; Returns: string };
      haversine_km: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number };
        Returns: number;
      };
      is_blocked: { Args: { a: string; b: string }; Returns: boolean };
      nearby_tasks: {
        Args: {
          p_category?: string;
          p_lat: number;
          p_lng: number;
          p_radius_km?: number;
          p_search?: string;
        };
        Returns: {
          area: string;
          budget_amount: number;
          category: string;
          city: string;
          completed_at: string | null;
          created_at: string;
          currency: string;
          description: string;
          distance_km: number;
          helper_id: string | null;
          id: string;
          lat: number;
          lng: number;
          locality: string;
          offer_count: number;
          requester_avatar_url: string | null;
          requester_display_name: string;
          requester_id: string;
          scheduled_at: string | null;
          status: string;
          title: string;
          updated_at: string;
          visibility_radius_km: number;
        }[];
      };
      notify_user: {
        Args: {
          p_body: string;
          p_data?: Json;
          p_title: string;
          p_type: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      select_helper: {
        Args: { p_offer_id: string; p_task_id: string };
        Returns: string;
      };
      unread_counts: {
        Args: Record<PropertyKey, never>;
        Returns: { messages: number; notifications: number }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Offer = Database["public"]["Tables"]["offers"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NearbyTask = Database["public"]["Functions"]["nearby_tasks"]["Returns"][number];

export type TaskStatus =
  | "open"
  | "offer_received"
  | "helper_selected"
  | "in_progress"
  | "completed"
  | "cancelled";
export type TaskCategory =
  | "services"
  | "rentals"
  | "study"
  | "fashion"
  | "food"
  | "tech"
  | "errands"
  | "other";
export type OfferStatus = "pending" | "accepted" | "declined" | "withdrawn";
export type OnboardingIntent = "need_help" | "want_to_earn" | "skipped";
export type NotificationType =
  | "offer_received"
  | "offer_accepted"
  | "offer_declined"
  | "helper_selected"
  | "task_status"
  | "new_message"
  | "new_review";
export type ReportReason =
  | "spam"
  | "harassment"
  | "scam"
  | "inappropriate"
  | "other";
