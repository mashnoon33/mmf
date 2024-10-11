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
      game_secret_codes: {
        Row: {
          game_id: string
          id: number
          secret_code: string
        }
        Insert: {
          game_id: string
          id?: number
          secret_code: string
        }
        Update: {
          game_id?: string
          id?: number
          secret_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_secret_codes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_states: {
        Row: {
          active_row: number
          board_state: string[][]
          created_at: string
          game_id: string
          hints: number[][]
          id: string
          player_id: string
          status: string
          updated_at: string
        }
        Insert: {
          active_row?: number
          board_state?: string[][]
          created_at?: string
          game_id: string
          hints?: number[][]
          id: string
          player_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          active_row?: number
          board_state?: string[][]
          created_at?: string
          game_id?: string
          hints?: number[][]
          id?: string
          player_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_states_game_id_fkey1"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_states_player_id_fkey1"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      game_states_obfuscated: {
        Row: {
          active_row: number
          board_state: string[][]
          created_at: string
          game_id: string
          hints: number[][]
          id: string
          player_id: string
          status: string
          updated_at: string
        }
        Insert: {
          active_row?: number
          board_state?: string[][]
          created_at?: string
          game_id: string
          hints?: number[][]
          id: string
          player_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          active_row?: number
          board_state?: string[][]
          created_at?: string
          game_id?: string
          hints?: number[][]
          id?: string
          player_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_states_obfuscated_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_states_obfuscated_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          joiner_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          joiner_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          joiner_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_joiner_id_fkey"
            columns: ["joiner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          connected: boolean | null
          created_at: string
          game_id: number | null
          id: string
          last_active: string | null
          name: string | null
        }
        Insert: {
          connected?: boolean | null
          created_at?: string
          game_id?: number | null
          id: string
          last_active?: string | null
          name?: string | null
        }
        Update: {
          connected?: boolean | null
          created_at?: string
          game_id?: number | null
          id?: string
          last_active?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      scan_rows: {
        Args: {
          "": number[]
        }
        Returns: undefined
      }
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
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
