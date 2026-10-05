export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      client_details: {
        Row: {
          client_ack_date: string | null
          client_ack_flag: string | null
          client_agent_code: string | null
          client_agreement_date: string | null
          client_bank_type: string | null
          client_brokerage_model_flag: string | null
          client_category_employee_code: string | null
          client_code: string | null
          client_customer_nri_flag: string | null
          client_customer_type_change_date: string | null
          client_demat_mandate_category: string | null
          client_details_entered_by: string | null
          client_details_entry_date: string | null
          client_details_modified_by: string | null
          client_details_modified_date: string | null
          client_eba_upload_date: string | null
          client_eba_upload_flag: string | null
          client_education_code: string | null
          client_form_60_flag: string | null
          client_form_version: string | null
          client_holding_range_code: string | null
          client_icici_emp_number: string | null
          client_income_category_code: string | null
          client_inward_accept_date: string | null
          client_inward_date: string | null
          client_inward_status: string | null
          client_last_flag: string | null
          client_marital_status: string | null
          client_non_isec_agent_code: string | null
          client_nri_base_scheme: string | null
          client_nri_category_type: string | null
          client_nri_current_scheme: string | null
          client_pan_number: string | null
          client_product_type: string | null
          client_receipt_date: string | null
          client_rejection_mail_remarks: string | null
          client_rm_code: string | null
          client_scheme_type: string | null
          client_send_mail_flag: string | null
          client_settlement_type: string | null
          client_sub_agent_code: string | null
          client_tax_assesse_flag: string | null
          client_user_id: string | null
          client_verification_date: string | null
          client_verify_status: string | null
          client_web_user_id: string | null
          created_at: string
          customer_type_individual_huf: string | null
          data: Json
          form_number: number | null
          is_valid: boolean
          row_id: number
          validation_issues: string
        }
        Insert: {
          client_ack_date?: string | null
          client_ack_flag?: string | null
          client_agent_code?: string | null
          client_agreement_date?: string | null
          client_bank_type?: string | null
          client_brokerage_model_flag?: string | null
          client_category_employee_code?: string | null
          client_code?: string | null
          client_customer_nri_flag?: string | null
          client_customer_type_change_date?: string | null
          client_demat_mandate_category?: string | null
          client_details_entered_by?: string | null
          client_details_entry_date?: string | null
          client_details_modified_by?: string | null
          client_details_modified_date?: string | null
          client_eba_upload_date?: string | null
          client_eba_upload_flag?: string | null
          client_education_code?: string | null
          client_form_60_flag?: string | null
          client_form_version?: string | null
          client_holding_range_code?: string | null
          client_icici_emp_number?: string | null
          client_income_category_code?: string | null
          client_inward_accept_date?: string | null
          client_inward_date?: string | null
          client_inward_status?: string | null
          client_last_flag?: string | null
          client_marital_status?: string | null
          client_non_isec_agent_code?: string | null
          client_nri_base_scheme?: string | null
          client_nri_category_type?: string | null
          client_nri_current_scheme?: string | null
          client_pan_number?: string | null
          client_product_type?: string | null
          client_receipt_date?: string | null
          client_rejection_mail_remarks?: string | null
          client_rm_code?: string | null
          client_scheme_type?: string | null
          client_send_mail_flag?: string | null
          client_settlement_type?: string | null
          client_sub_agent_code?: string | null
          client_tax_assesse_flag?: string | null
          client_user_id?: string | null
          client_verification_date?: string | null
          client_verify_status?: string | null
          client_web_user_id?: string | null
          created_at?: string
          customer_type_individual_huf?: string | null
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          validation_issues?: string
        }
        Update: {
          client_ack_date?: string | null
          client_ack_flag?: string | null
          client_agent_code?: string | null
          client_agreement_date?: string | null
          client_bank_type?: string | null
          client_brokerage_model_flag?: string | null
          client_category_employee_code?: string | null
          client_code?: string | null
          client_customer_nri_flag?: string | null
          client_customer_type_change_date?: string | null
          client_demat_mandate_category?: string | null
          client_details_entered_by?: string | null
          client_details_entry_date?: string | null
          client_details_modified_by?: string | null
          client_details_modified_date?: string | null
          client_eba_upload_date?: string | null
          client_eba_upload_flag?: string | null
          client_education_code?: string | null
          client_form_60_flag?: string | null
          client_form_version?: string | null
          client_holding_range_code?: string | null
          client_icici_emp_number?: string | null
          client_income_category_code?: string | null
          client_inward_accept_date?: string | null
          client_inward_date?: string | null
          client_inward_status?: string | null
          client_last_flag?: string | null
          client_marital_status?: string | null
          client_non_isec_agent_code?: string | null
          client_nri_base_scheme?: string | null
          client_nri_category_type?: string | null
          client_nri_current_scheme?: string | null
          client_pan_number?: string | null
          client_product_type?: string | null
          client_receipt_date?: string | null
          client_rejection_mail_remarks?: string | null
          client_rm_code?: string | null
          client_scheme_type?: string | null
          client_send_mail_flag?: string | null
          client_settlement_type?: string | null
          client_sub_agent_code?: string | null
          client_tax_assesse_flag?: string | null
          client_user_id?: string | null
          client_verification_date?: string | null
          client_verify_status?: string | null
          client_web_user_id?: string | null
          created_at?: string
          customer_type_individual_huf?: string | null
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          validation_issues?: string
        }
        Relationships: []
      }
      user_account_information: {
        Row: {
          client_code: string | null
          created_at: string
          data: Json
          form_number: number | null
          is_valid: boolean
          row_id: number
          user_bank_account_flag: string | null
          user_bank_account_number: string | null
          user_bank_account_open_date: string | null
          user_bank_account_type_self_joint: string | null
          user_bank_brnch_code: string | null
          user_bank_customer_id: string | null
          user_bank_type: string | null
          user_demat_account_open_date: string | null
          user_info_entered_by: string | null
          user_info_modified_by: string | null
          user_info_modified_date: string | null
          user_type_residential_nri: string | null
          validation_issues: string
        }
        Insert: {
          client_code?: string | null
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_bank_account_flag?: string | null
          user_bank_account_number?: string | null
          user_bank_account_open_date?: string | null
          user_bank_account_type_self_joint?: string | null
          user_bank_brnch_code?: string | null
          user_bank_customer_id?: string | null
          user_bank_type?: string | null
          user_demat_account_open_date?: string | null
          user_info_entered_by?: string | null
          user_info_modified_by?: string | null
          user_info_modified_date?: string | null
          user_type_residential_nri?: string | null
          validation_issues?: string
        }
        Update: {
          client_code?: string | null
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_bank_account_flag?: string | null
          user_bank_account_number?: string | null
          user_bank_account_open_date?: string | null
          user_bank_account_type_self_joint?: string | null
          user_bank_brnch_code?: string | null
          user_bank_customer_id?: string | null
          user_bank_type?: string | null
          user_demat_account_open_date?: string | null
          user_info_entered_by?: string | null
          user_info_modified_by?: string | null
          user_info_modified_date?: string | null
          user_type_residential_nri?: string | null
          validation_issues?: string
        }
        Relationships: []
      }
      user_address_details: {
        Row: {
          address_1: string | null
          address_2: string | null
          address_type_correspondance_permanent: string | null
          created_at: string
          data: Json
          form_number: number | null
          is_valid: boolean
          row_id: number
          user_address_same_as_correspondance: string | null
          user_city: string | null
          user_country: string | null
          user_details_entered_by: string | null
          user_details_entry_date: string | null
          user_details_modified_by: string | null
          user_details_modified_date: string | null
          user_ip: string | null
          user_mail_address_flag: string | null
          user_mobile_number: string | null
          user_mobile_relation: string | null
          user_office_number: string | null
          user_pin: string | null
          user_rm_preferred_location_pin: string | null
          user_state: string | null
          user_telephone_number: string | null
          validation_issues: string
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          address_type_correspondance_permanent?: string | null
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_address_same_as_correspondance?: string | null
          user_city?: string | null
          user_country?: string | null
          user_details_entered_by?: string | null
          user_details_entry_date?: string | null
          user_details_modified_by?: string | null
          user_details_modified_date?: string | null
          user_ip?: string | null
          user_mail_address_flag?: string | null
          user_mobile_number?: string | null
          user_mobile_relation?: string | null
          user_office_number?: string | null
          user_pin?: string | null
          user_rm_preferred_location_pin?: string | null
          user_state?: string | null
          user_telephone_number?: string | null
          validation_issues?: string
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          address_type_correspondance_permanent?: string | null
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_address_same_as_correspondance?: string | null
          user_city?: string | null
          user_country?: string | null
          user_details_entered_by?: string | null
          user_details_entry_date?: string | null
          user_details_modified_by?: string | null
          user_details_modified_date?: string | null
          user_ip?: string | null
          user_mail_address_flag?: string | null
          user_mobile_number?: string | null
          user_mobile_relation?: string | null
          user_office_number?: string | null
          user_pin?: string | null
          user_rm_preferred_location_pin?: string | null
          user_state?: string | null
          user_telephone_number?: string | null
          validation_issues?: string
        }
        Relationships: []
      }
      user_details: {
        Row: {
          client_code: string | null
          created_at: string
          data: Json
          is_valid: boolean
          row_id: number
          user_account_status_flag: string | null
          user_commodity_allowed: string | null
          user_equity_allowed: string | null
          user_first_active_date: string | null
          user_fno_allowed: string | null
          user_id: string | null
          user_ipo_allowed: string | null
          user_loan_allowed: string | null
          user_mf_allowed: string | null
          user_update_date: string | null
          validation_issues: string
        }
        Insert: {
          client_code?: string | null
          created_at?: string
          data?: Json
          is_valid?: boolean
          row_id?: number
          user_account_status_flag?: string | null
          user_commodity_allowed?: string | null
          user_equity_allowed?: string | null
          user_first_active_date?: string | null
          user_fno_allowed?: string | null
          user_id?: string | null
          user_ipo_allowed?: string | null
          user_loan_allowed?: string | null
          user_mf_allowed?: string | null
          user_update_date?: string | null
          validation_issues?: string
        }
        Update: {
          client_code?: string | null
          created_at?: string
          data?: Json
          is_valid?: boolean
          row_id?: number
          user_account_status_flag?: string | null
          user_commodity_allowed?: string | null
          user_equity_allowed?: string | null
          user_first_active_date?: string | null
          user_fno_allowed?: string | null
          user_id?: string | null
          user_ipo_allowed?: string | null
          user_loan_allowed?: string | null
          user_mf_allowed?: string | null
          user_update_date?: string | null
          validation_issues?: string
        }
        Relationships: []
      }
      user_personal_details: {
        Row: {
          created_at: string
          data: Json
          form_number: number | null
          is_valid: boolean
          row_id: number
          user_aadhar_consent_flag: string | null
          user_aadhar_last_4_digit: string | null
          user_aadhar_status: string | null
          user_country_birth: string | null
          user_customer_type: string | null
          user_designation: string | null
          user_details_entered_date: string | null
          user_details_modified_employee_number: string | null
          user_dob: string | null
          user_email: string | null
          user_email_relation: string | null
          user_entered_employee_number: string | null
          user_first_name: string | null
          user_income_category: string | null
          user_inperson_verification_date: string | null
          user_last_name: string | null
          user_marital_status: string | null
          user_middle_name: string | null
          user_minor_flag: string | null
          user_name_as_per_aadhar: string | null
          user_nationality: string | null
          user_place_of_birth: string | null
          user_political_connect: string | null
          user_relation: string | null
          user_sex: string | null
          user_tax_filing_country: string | null
          user_type_applicant_permanent: string | null
          user_update_channel: string | null
          user_update_ip: string | null
          user_us_person: string | null
          user_user_id: string | null
          userd_details_modified_date: string | null
          validation_issues: string
        }
        Insert: {
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_aadhar_consent_flag?: string | null
          user_aadhar_last_4_digit?: string | null
          user_aadhar_status?: string | null
          user_country_birth?: string | null
          user_customer_type?: string | null
          user_designation?: string | null
          user_details_entered_date?: string | null
          user_details_modified_employee_number?: string | null
          user_dob?: string | null
          user_email?: string | null
          user_email_relation?: string | null
          user_entered_employee_number?: string | null
          user_first_name?: string | null
          user_income_category?: string | null
          user_inperson_verification_date?: string | null
          user_last_name?: string | null
          user_marital_status?: string | null
          user_middle_name?: string | null
          user_minor_flag?: string | null
          user_name_as_per_aadhar?: string | null
          user_nationality?: string | null
          user_place_of_birth?: string | null
          user_political_connect?: string | null
          user_relation?: string | null
          user_sex?: string | null
          user_tax_filing_country?: string | null
          user_type_applicant_permanent?: string | null
          user_update_channel?: string | null
          user_update_ip?: string | null
          user_us_person?: string | null
          user_user_id?: string | null
          userd_details_modified_date?: string | null
          validation_issues?: string
        }
        Update: {
          created_at?: string
          data?: Json
          form_number?: number | null
          is_valid?: boolean
          row_id?: number
          user_aadhar_consent_flag?: string | null
          user_aadhar_last_4_digit?: string | null
          user_aadhar_status?: string | null
          user_country_birth?: string | null
          user_customer_type?: string | null
          user_designation?: string | null
          user_details_entered_date?: string | null
          user_details_modified_employee_number?: string | null
          user_dob?: string | null
          user_email?: string | null
          user_email_relation?: string | null
          user_entered_employee_number?: string | null
          user_first_name?: string | null
          user_income_category?: string | null
          user_inperson_verification_date?: string | null
          user_last_name?: string | null
          user_marital_status?: string | null
          user_middle_name?: string | null
          user_minor_flag?: string | null
          user_name_as_per_aadhar?: string | null
          user_nationality?: string | null
          user_place_of_birth?: string | null
          user_political_connect?: string | null
          user_relation?: string | null
          user_sex?: string | null
          user_tax_filing_country?: string | null
          user_type_applicant_permanent?: string | null
          user_update_channel?: string | null
          user_update_ip?: string | null
          user_us_person?: string | null
          user_user_id?: string | null
          userd_details_modified_date?: string | null
          validation_issues?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
