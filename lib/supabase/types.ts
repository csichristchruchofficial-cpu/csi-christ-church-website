export type AnnouncementCategory = "Announcement" | "Prayer" | "Event";
export type AnnouncementStatus = "pending" | "approved" | "rejected";

export type Announcement = {
  id: string;
  message: string;
  category: AnnouncementCategory;
  status: AnnouncementStatus;
  created_at: string;
  published_at: string | null;
  created_by: string | null;
};

export type Admin = {
  id: string;
  user_id: string;
  email: string | null;
  created_at: string;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          user_id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      announcements: {
        Row: {
          id: string;
          message: string;
          category: AnnouncementCategory;
          status: AnnouncementStatus;
          created_at: string;
          published_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          message: string;
          category: AnnouncementCategory;
          status?: AnnouncementStatus;
          created_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          message?: string;
          category?: AnnouncementCategory;
          status?: AnnouncementStatus;
          created_at?: string;
          published_at?: string | null;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
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

