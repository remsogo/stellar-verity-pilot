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
      attachments: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      defects: {
        Row: {
          assignee: string | null
          created_at: string
          description: string | null
          id: string
          project_id: string
          reporter: string
          severity: string
          status: string
          test_execution_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_id: string
          reporter: string
          severity?: string
          status?: string
          test_execution_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string
          reporter?: string
          severity?: string
          status?: string
          test_execution_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "defects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defects_test_execution_id_fkey"
            columns: ["test_execution_id"]
            isOneToOne: false
            referencedRelation: "test_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_steps: {
        Row: {
          actual_result: string | null
          created_at: string
          execution_id: string
          id: string
          status: string
          step_order: number
          test_step_id: string
          updated_at: string
        }
        Insert: {
          actual_result?: string | null
          created_at?: string
          execution_id: string
          id?: string
          status: string
          step_order: number
          test_step_id: string
          updated_at?: string
        }
        Update: {
          actual_result?: string | null
          created_at?: string
          execution_id?: string
          id?: string
          status?: string
          step_order?: number
          test_step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_steps_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "test_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_steps_test_step_id_fkey"
            columns: ["test_step_id"]
            isOneToOne: false
            referencedRelation: "test_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      parameter_values: {
        Row: {
          context_type: string
          created_at: string
          entity_id: string
          id: string
          parameter_id: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          context_type: string
          created_at?: string
          entity_id: string
          id?: string
          parameter_id: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          context_type?: string
          created_at?: string
          entity_id?: string
          id?: string
          parameter_id?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      project_parameters: {
        Row: {
          created_at: string
          default_value: Json | null
          description: string | null
          id: string
          name: string
          param_type: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name: string
          param_type: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name?: string
          param_type?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_parameters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_users: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      requirements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          priority: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          priority?: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          priority?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      system_parameters: {
        Row: {
          created_at: string
          default_value: Json | null
          description: string | null
          id: string
          name: string
          param_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name: string
          param_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name?: string
          param_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_cases: {
        Row: {
          author: string
          automated: boolean | null
          created_at: string
          data_driven: boolean | null
          description: string | null
          estimate_time: number | null
          id: string
          is_parent: boolean | null
          parent_id: string | null
          preconditions: string | null
          priority: string
          project_id: string
          requirements: string[] | null
          status: string
          tags: string[] | null
          test_data: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          automated?: boolean | null
          created_at?: string
          data_driven?: boolean | null
          description?: string | null
          estimate_time?: number | null
          id?: string
          is_parent?: boolean | null
          parent_id?: string | null
          preconditions?: string | null
          priority?: string
          project_id: string
          requirements?: string[] | null
          status?: string
          tags?: string[] | null
          test_data?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          automated?: boolean | null
          created_at?: string
          data_driven?: boolean | null
          description?: string | null
          estimate_time?: number | null
          id?: string
          is_parent?: boolean | null
          parent_id?: string | null
          preconditions?: string | null
          priority?: string
          project_id?: string
          requirements?: string[] | null
          status?: string
          tags?: string[] | null
          test_data?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_cases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_collections: {
        Row: {
          created_at: string
          criteria: Json | null
          description: string | null
          id: string
          is_smart_collection: boolean
          name: string
          project_id: string
          test_case_ids: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          is_smart_collection?: boolean
          name: string
          project_id: string
          test_case_ids?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          is_smart_collection?: boolean
          name?: string
          project_id?: string
          test_case_ids?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_collections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cycles: {
        Row: {
          build_version: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          environment: string
          id: string
          name: string
          project_id: string
          start_date: string
          status: string
          test_plan_id: string
          updated_at: string
        }
        Insert: {
          build_version?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          environment: string
          id?: string
          name: string
          project_id: string
          start_date: string
          status?: string
          test_plan_id: string
          updated_at?: string
        }
        Update: {
          build_version?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          environment?: string
          id?: string
          name?: string
          project_id?: string
          start_date?: string
          status?: string
          test_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_cycles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_cycles_test_plan_id_fkey"
            columns: ["test_plan_id"]
            isOneToOne: false
            referencedRelation: "test_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      test_executions: {
        Row: {
          build_version: string | null
          created_at: string
          defects: string[] | null
          end_time: string | null
          environment: string
          executor: string
          id: string
          notes: string | null
          start_time: string
          status: string
          test_case_id: string
          test_cycle_id: string | null
          test_suite_id: string | null
          updated_at: string
        }
        Insert: {
          build_version?: string | null
          created_at?: string
          defects?: string[] | null
          end_time?: string | null
          environment: string
          executor: string
          id?: string
          notes?: string | null
          start_time: string
          status: string
          test_case_id: string
          test_cycle_id?: string | null
          test_suite_id?: string | null
          updated_at?: string
        }
        Update: {
          build_version?: string | null
          created_at?: string
          defects?: string[] | null
          end_time?: string | null
          environment?: string
          executor?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: string
          test_case_id?: string
          test_cycle_id?: string | null
          test_suite_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_executions_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_executions_test_cycle_id_fkey"
            columns: ["test_cycle_id"]
            isOneToOne: false
            referencedRelation: "test_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_executions_test_suite_id_fkey"
            columns: ["test_suite_id"]
            isOneToOne: false
            referencedRelation: "test_suites"
            referencedColumns: ["id"]
          },
        ]
      }
      test_plans: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          project_id: string
          status: string
          test_cases: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          project_id: string
          status?: string
          test_cases?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          project_id?: string
          status?: string
          test_cases?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_plans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      test_steps: {
        Row: {
          created_at: string
          description: string
          expected_result: string
          id: string
          step_order: number
          test_case_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          expected_result: string
          id?: string
          step_order: number
          test_case_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          expected_result?: string
          id?: string
          step_order?: number
          test_case_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_steps_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      test_suite_cases: {
        Row: {
          created_at: string
          id: string
          test_case_id: string
          test_suite_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          test_case_id: string
          test_suite_id: string
        }
        Update: {
          created_at?: string
          id?: string
          test_case_id?: string
          test_suite_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_suite_cases_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_suite_cases_test_suite_id_fkey"
            columns: ["test_suite_id"]
            isOneToOne: false
            referencedRelation: "test_suites"
            referencedColumns: ["id"]
          },
        ]
      }
      test_suites: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_suites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_project_owner: {
        Args: { project_id: string; owner_id: string }
        Returns: undefined
      }
      admin_query_with_return: {
        Args: { query_text: string }
        Returns: string
      }
      check_user_project_admin: {
        Args: { user_uuid: string; project_uuid: string }
        Returns: boolean
      }
      check_user_project_membership: {
        Args: { user_uuid: string; project_uuid: string }
        Returns: boolean
      }
      create_project_bypass: {
        Args: { p_name: string; p_description: string }
        Returns: string
      }
      create_project_users_policy: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_test_cycle: {
        Args: { cycle_data: Json }
        Returns: {
          build_version: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          environment: string
          id: string
          name: string
          project_id: string
          start_date: string
          status: string
          test_plan_id: string
          updated_at: string
        }
      }
      delete_test_cycle: {
        Args: { p_cycle_id: string }
        Returns: undefined
      }
      drop_policy_if_exists: {
        Args: { policy_name: string; table_name: string }
        Returns: undefined
      }
      get_project_parameters: {
        Args: { p_project_id: string }
        Returns: {
          created_at: string
          default_value: Json | null
          description: string | null
          id: string
          name: string
          param_type: string
          project_id: string
          updated_at: string
        }[]
      }
      get_project_test_cycles: {
        Args: { p_project_id: string }
        Returns: {
          build_version: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          environment: string
          id: string
          name: string
          project_id: string
          start_date: string
          status: string
          test_plan_id: string
          updated_at: string
        }[]
      }
      get_project_users: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          user_id: string
          email: string
          full_name: string
          role: string
        }[]
      }
      get_system_parameters: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          default_value: Json | null
          description: string | null
          id: string
          name: string
          param_type: string
          updated_at: string
        }[]
      }
      get_test_cycle_by_id: {
        Args: { p_cycle_id: string }
        Returns: {
          build_version: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          environment: string
          id: string
          name: string
          project_id: string
          start_date: string
          status: string
          test_plan_id: string
          updated_at: string
        }[]
      }
      get_test_cycle_stats: {
        Args: { p_cycle_id: string }
        Returns: Json
      }
      get_user_projects: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      is_member_of_project: {
        Args: { project_id: string }
        Returns: boolean
      }
      is_project_admin: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      is_project_admin_secure: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { project_id: string; user_id: string }
        Returns: boolean
      }
      is_project_member_secure: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      remove_user_from_project: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      safe_add_user_to_project: {
        Args: { p_project_id: string; p_user_id: string; p_role: string }
        Returns: string
      }
      update_test_cycle: {
        Args: { cycle_data: Json }
        Returns: {
          build_version: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          environment: string
          id: string
          name: string
          project_id: string
          start_date: string
          status: string
          test_plan_id: string
          updated_at: string
        }
      }
      update_user_role: {
        Args: { p_project_id: string; p_user_id: string; p_role: string }
        Returns: boolean
      }
      validate_parameter_value: {
        Args: { p_param_type: string; p_value: Json }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
