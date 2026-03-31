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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_published_analysis: {
        Row: {
          analysis_content: string
          id: string
          model: string
          prompt_used: string
          provider: string
          published_at: string | null
          published_by: string | null
          question_key: string | null
          status: string
          target: string
          total_responses: string
        }
        Insert: {
          analysis_content: string
          id?: string
          model: string
          prompt_used: string
          provider: string
          published_at?: string | null
          published_by?: string | null
          question_key?: string | null
          status?: string
          target: string
          total_responses?: string
        }
        Update: {
          analysis_content?: string
          id?: string
          model?: string
          prompt_used?: string
          provider?: string
          published_at?: string | null
          published_by?: string | null
          question_key?: string | null
          status?: string
          target?: string
          total_responses?: string
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          custom_prompt: string | null
          id: string
          openai_api_key: string | null
          openai_model: string | null
          prompt_conclusion: string | null
          prompt_hygiene: string | null
          prompt_q24: string | null
          prompt_q30: string | null
          prompt_q9: string | null
          provider: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          custom_prompt?: string | null
          id?: string
          openai_api_key?: string | null
          openai_model?: string | null
          prompt_conclusion?: string | null
          prompt_hygiene?: string | null
          prompt_q24?: string | null
          prompt_q30?: string | null
          prompt_q9?: string | null
          provider?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          custom_prompt?: string | null
          id?: string
          openai_api_key?: string | null
          openai_model?: string | null
          prompt_conclusion?: string | null
          prompt_hygiene?: string | null
          prompt_q24?: string | null
          prompt_q30?: string | null
          prompt_q9?: string | null
          provider?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      bd_adoc_agents: {
        Row: {
          clinic_id: string
          created_at: string
          guardrails_enabled: boolean
          handoff_enabled: boolean
          id: string
          llm_model: string
          llm_provider: string
          max_tokens: number
          memory_enabled: boolean
          name: string
          rag_enabled: boolean
          security_settings: Json | null
          status: string
          system_prompt: string
          temperature: number
          updated_at: string
        }
        Insert: {
          clinic_id: string
          created_at?: string
          guardrails_enabled?: boolean
          handoff_enabled?: boolean
          id?: string
          llm_model?: string
          llm_provider?: string
          max_tokens?: number
          memory_enabled?: boolean
          name?: string
          rag_enabled?: boolean
          security_settings?: Json | null
          status?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
        }
        Update: {
          clinic_id?: string
          created_at?: string
          guardrails_enabled?: boolean
          handoff_enabled?: boolean
          id?: string
          llm_model?: string
          llm_provider?: string
          max_tokens?: number
          memory_enabled?: boolean
          name?: string
          rag_enabled?: boolean
          security_settings?: Json | null
          status?: string
          system_prompt?: string
          temperature?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_agents_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_chunks: {
        Row: {
          agent_id: string | null
          chunk_index: number
          clinic_id: string
          content: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          agent_id?: string | null
          chunk_index?: number
          clinic_id: string
          content: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          agent_id?: string | null
          chunk_index?: number
          clinic_id?: string
          content?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_chunks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_chunks_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_clinics: {
        Row: {
          brand_logo_url: string | null
          brand_name: string | null
          brand_primary_color: string | null
          brand_secondary_color: string | null
          branding: Json | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          plan: string
          settings: Json | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          brand_logo_url?: string | null
          brand_name?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          branding?: Json | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          plan?: string
          settings?: Json | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          brand_logo_url?: string | null
          brand_name?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          branding?: Json | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string
          settings?: Json | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      bd_adoc_connectors: {
        Row: {
          agent_id: string
          clinic_id: string
          config: Json
          created_at: string
          health_checked_at: string | null
          health_status: string | null
          id: string
          name: string | null
          status: string
          type: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          agent_id: string
          clinic_id: string
          config?: Json
          created_at?: string
          health_checked_at?: string | null
          health_status?: string | null
          id?: string
          name?: string | null
          status?: string
          type: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          agent_id?: string
          clinic_id?: string
          config?: Json
          created_at?: string
          health_checked_at?: string | null
          health_status?: string | null
          id?: string
          name?: string | null
          status?: string
          type?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_connectors_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_connectors_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_conversations: {
        Row: {
          agent_id: string
          channel: string
          clinic_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          external_id: string | null
          id: string
          metadata: Json | null
          status: string
          summarized_at: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          channel?: string
          clinic_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          summarized_at?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          channel?: string
          clinic_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          summarized_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_conversations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_documents: {
        Row: {
          agent_id: string | null
          chunk_count: number | null
          clinic_id: string
          created_at: string
          file_size: number | null
          file_type: string
          file_url: string | null
          id: string
          specialty: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          chunk_count?: number | null
          clinic_id: string
          created_at?: string
          file_size?: number | null
          file_type: string
          file_url?: string | null
          id?: string
          specialty?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          chunk_count?: number | null
          clinic_id?: string
          created_at?: string
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          id?: string
          specialty?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_documents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_documents_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_kb_templates: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          specialty: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          specialty: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          specialty?: string
          title?: string
        }
        Relationships: []
      }
      bd_adoc_messages: {
        Row: {
          clinic_id: string
          content: string
          conversation_id: string
          cost_usd: number | null
          created_at: string
          id: string
          llm_model: string | null
          metadata: Json | null
          role: string
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          clinic_id: string
          content: string
          conversation_id: string
          cost_usd?: number | null
          created_at?: string
          id?: string
          llm_model?: string | null
          metadata?: Json | null
          role: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          clinic_id?: string
          content?: string
          conversation_id?: string
          cost_usd?: number | null
          created_at?: string
          id?: string
          llm_model?: string | null
          metadata?: Json | null
          role?: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_messages_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_patient_memories: {
        Row: {
          category: string
          clinic_id: string
          content: string
          created_at: string
          embedding: string | null
          id: string
          patient_id: string
          source_conversation_id: string | null
          updated_at: string
        }
        Insert: {
          category: string
          clinic_id: string
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          patient_id: string
          source_conversation_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          clinic_id?: string
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          patient_id?: string
          source_conversation_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_patient_memories_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_patient_memories_source_conversation_id_fkey"
            columns: ["source_conversation_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_usage_logs: {
        Row: {
          agent_id: string | null
          clinic_id: string
          conversation_id: string | null
          cost_usd: number
          created_at: string
          id: string
          llm_model: string
          llm_provider: string
          tokens_input: number
          tokens_output: number
        }
        Insert: {
          agent_id?: string | null
          clinic_id: string
          conversation_id?: string | null
          cost_usd?: number
          created_at?: string
          id?: string
          llm_model: string
          llm_provider: string
          tokens_input?: number
          tokens_output?: number
        }
        Update: {
          agent_id?: string | null
          clinic_id?: string
          conversation_id?: string | null
          cost_usd?: number
          created_at?: string
          id?: string
          llm_model?: string
          llm_provider?: string
          tokens_input?: number
          tokens_output?: number
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_usage_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_usage_logs_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_adoc_usage_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_adoc_users: {
        Row: {
          auth_user_id: string | null
          clinic_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          clinic_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          clinic_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_adoc_users_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "bd_adoc_clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_cms_form_submissions_v2: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          lp_key: string
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: string
          lp_key: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          lp_key?: string
        }
        Relationships: []
      }
      bd_cms_history_v2: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          lp_key: string
          saved_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          lp_key: string
          saved_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          lp_key?: string
          saved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_cms_history_v2_lp_key_fkey"
            columns: ["lp_key"]
            isOneToOne: false
            referencedRelation: "bd_cms_lp_v2"
            referencedColumns: ["lp_key"]
          },
        ]
      }
      bd_cms_lp_v2: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          lp_key: string
          name: string
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          id?: string
          lp_key: string
          name: string
          slug: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          lp_key?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hygiene_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          sql_executed: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          sql_executed?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          sql_executed?: string | null
        }
        Relationships: []
      }
      hygiene_staged_changes: {
        Row: {
          affected_count: string
          applied_at: string | null
          applied_by: string | null
          created_at: string | null
          id: string
          new_value: string
          original_value: string
          status: string
          target_column: string
          target_table: string
        }
        Insert: {
          affected_count: string
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          id?: string
          new_value: string
          original_value: string
          status?: string
          target_column: string
          target_table?: string
        }
        Update: {
          affected_count?: string
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          id?: string
          new_value?: string
          original_value?: string
          status?: string
          target_column?: string
          target_table?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          afastamento: string[] | null
          atividades_participacao: string[] | null
          beneficio_valor_real: string | null
          beneficios_pagar: string[] | null
          canais_consumo: string[] | null
          canal_comunicacao: string | null
          capacitacoes_ia: string[] | null
          cidade: string | null
          created_at: string
          crescimento: string | null
          email: string | null
          faixa_etaria: string | null
          falta_comunidade: string | null
          fase: string | null
          formato_aprendizado: string | null
          id: string
          id_crm: string | null
          inspiracao: string | null
          instituicao: string | null
          mensagem_presidencia: string | null
          motivacao: string | null
          nome: string | null
          outra_atividade: string | null
          outra_capacitacao: string | null
          outra_preocupacao: string | null
          outra_regiao: string | null
          outra_visao_carreira: string | null
          outro_afastamento: string | null
          outro_beneficio: string | null
          outro_canal: string | null
          outro_canal_comunicacao: string | null
          outro_criador: string | null
          outro_papel_tecnologia: string | null
          outro_pertencimento: string | null
          outro_reconhecimento: string | null
          outro_valor: string | null
          papel_tecnologia: string[] | null
          perfil: string | null
          perfis_acompanha: string | null
          pertencimento: string[] | null
          preocupacoes: string[] | null
          probabilidade_participacao: string | null
          reconhecimento: string[] | null
          regiao: string | null
          representacao: string | null
          respondido: string | null
          sexo: string | null
          telefone: string | null
          tipo_criador: string | null
          uf: string | null
          updated_at: string
          usaria_ia: string | null
          valor_mensal: string | null
          valores_associacao: string[] | null
          visao_carreira: string | null
        }
        Insert: {
          afastamento?: string[] | null
          atividades_participacao?: string[] | null
          beneficio_valor_real?: string | null
          beneficios_pagar?: string[] | null
          canais_consumo?: string[] | null
          canal_comunicacao?: string | null
          capacitacoes_ia?: string[] | null
          cidade?: string | null
          created_at?: string
          crescimento?: string | null
          email?: string | null
          faixa_etaria?: string | null
          falta_comunidade?: string | null
          fase?: string | null
          formato_aprendizado?: string | null
          id?: string
          id_crm?: string | null
          inspiracao?: string | null
          instituicao?: string | null
          mensagem_presidencia?: string | null
          motivacao?: string | null
          nome?: string | null
          outra_atividade?: string | null
          outra_capacitacao?: string | null
          outra_preocupacao?: string | null
          outra_regiao?: string | null
          outra_visao_carreira?: string | null
          outro_afastamento?: string | null
          outro_beneficio?: string | null
          outro_canal?: string | null
          outro_canal_comunicacao?: string | null
          outro_criador?: string | null
          outro_papel_tecnologia?: string | null
          outro_pertencimento?: string | null
          outro_reconhecimento?: string | null
          outro_valor?: string | null
          papel_tecnologia?: string[] | null
          perfil?: string | null
          perfis_acompanha?: string | null
          pertencimento?: string[] | null
          preocupacoes?: string[] | null
          probabilidade_participacao?: string | null
          reconhecimento?: string[] | null
          regiao?: string | null
          representacao?: string | null
          respondido?: string | null
          sexo?: string | null
          telefone?: string | null
          tipo_criador?: string | null
          uf?: string | null
          updated_at?: string
          usaria_ia?: string | null
          valor_mensal?: string | null
          valores_associacao?: string[] | null
          visao_carreira?: string | null
        }
        Update: {
          afastamento?: string[] | null
          atividades_participacao?: string[] | null
          beneficio_valor_real?: string | null
          beneficios_pagar?: string[] | null
          canais_consumo?: string[] | null
          canal_comunicacao?: string | null
          capacitacoes_ia?: string[] | null
          cidade?: string | null
          created_at?: string
          crescimento?: string | null
          email?: string | null
          faixa_etaria?: string | null
          falta_comunidade?: string | null
          fase?: string | null
          formato_aprendizado?: string | null
          id?: string
          id_crm?: string | null
          inspiracao?: string | null
          instituicao?: string | null
          mensagem_presidencia?: string | null
          motivacao?: string | null
          nome?: string | null
          outra_atividade?: string | null
          outra_capacitacao?: string | null
          outra_preocupacao?: string | null
          outra_regiao?: string | null
          outra_visao_carreira?: string | null
          outro_afastamento?: string | null
          outro_beneficio?: string | null
          outro_canal?: string | null
          outro_canal_comunicacao?: string | null
          outro_criador?: string | null
          outro_papel_tecnologia?: string | null
          outro_pertencimento?: string | null
          outro_reconhecimento?: string | null
          outro_valor?: string | null
          papel_tecnologia?: string[] | null
          perfil?: string | null
          perfis_acompanha?: string | null
          pertencimento?: string[] | null
          preocupacoes?: string[] | null
          probabilidade_participacao?: string | null
          reconhecimento?: string[] | null
          regiao?: string | null
          representacao?: string | null
          respondido?: string | null
          sexo?: string | null
          telefone?: string | null
          tipo_criador?: string | null
          uf?: string | null
          updated_at?: string
          usaria_ia?: string | null
          valor_mensal?: string | null
          valores_associacao?: string[] | null
          visao_carreira?: string | null
        }
        Relationships: []
      }
      survey_responses_dynamic: {
        Row: {
          answers: Json
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          id_crm: string | null
          status: string
          survey_id: string
          updated_at: string
        }
        Insert: {
          answers?: Json
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          id_crm?: string | null
          status?: string
          survey_id: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          id_crm?: string | null
          status?: string
          survey_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_dynamic_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          config_json: Json | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          logos: string[] | null
          slug: string
          status: string
          theme_color: string | null
          title: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          config_json?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          logos?: string[] | null
          slug: string
          status?: string
          theme_color?: string | null
          title: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          config_json?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          logos?: string[] | null
          slug?: string
          status?: string
          theme_color?: string | null
          title?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ut_ai_config: {
        Row: {
          id: number
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: number
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: number
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      ut_conversations: {
        Row: {
          created_at: string | null
          id: string
          is_favorite: boolean
          socio_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean
          socio_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean
          socio_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ut_documents: {
        Row: {
          category: string | null
          chunks_count: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          source_id: string | null
          source_url: string | null
          storage_path: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          chunks_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          source_id?: string | null
          source_url?: string | null
          storage_path?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          chunks_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          source_id?: string | null
          source_url?: string | null
          storage_path?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ut_documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "ut_knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      ut_knowledge_chunks: {
        Row: {
          chunk_index: number | null
          content: string
          created_at: string | null
          document_id: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source_id: string | null
        }
        Insert: {
          chunk_index?: number | null
          content: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
        }
        Update: {
          chunk_index?: number | null
          content?: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ut_knowledge_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "ut_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ut_knowledge_chunks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "ut_knowledge_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      ut_knowledge_sources: {
        Row: {
          chunks_count: number | null
          created_at: string | null
          description: string | null
          file_path: string | null
          id: string
          name: string
          specialty: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          chunks_count?: number | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          name: string
          specialty?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          chunks_count?: number | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          name?: string
          specialty?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      ut_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          model: string | null
          role: string
          source_chunks: string[] | null
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          model?: string | null
          role: string
          source_chunks?: string[] | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          model?: string | null
          role?: string
          source_chunks?: string[] | null
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ut_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ut_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ut_trial_usage: {
        Row: {
          anonymous_id: string
          conversation_id: string | null
          created_at: string | null
          first_question_at: string | null
          id: string
          questions_count: number | null
        }
        Insert: {
          anonymous_id: string
          conversation_id?: string | null
          created_at?: string | null
          first_question_at?: string | null
          id?: string
          questions_count?: number | null
        }
        Update: {
          anonymous_id?: string
          conversation_id?: string | null
          created_at?: string | null
          first_question_at?: string | null
          id?: string
          questions_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ut_trial_usage_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ut_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ut_usage_logs: {
        Row: {
          answer_preview: string | null
          cost_usd: number | null
          created_at: string | null
          id: string
          model: string | null
          question: string | null
          response_time_ms: number | null
          socio_id: string | null
          specialty: string | null
          tokens_total: number | null
          user_id: string | null
        }
        Insert: {
          answer_preview?: string | null
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          model?: string | null
          question?: string | null
          response_time_ms?: number | null
          socio_id?: string | null
          specialty?: string | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Update: {
          answer_preview?: string | null
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          model?: string | null
          question?: string | null
          response_time_ms?: number | null
          socio_id?: string | null
          specialty?: string | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      workspace_accounts_log: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bd_adoc_admin_clinic_stats: {
        Args: never
        Returns: {
          agent_count: number
          clinic_id: string
          conversation_count: number
          created_at: string
          message_count: number
          name: string
          plan: string
          slug: string
          status: string
          total_cost_usd: number
          user_count: number
        }[]
      }
      bd_adoc_is_write_role: { Args: never; Returns: boolean }
      bd_adoc_my_clinic_id: { Args: never; Returns: string }
      bd_adoc_platform_stats: { Args: never; Returns: Json }
      bd_adoc_usage_summary: {
        Args: { p_agent_id?: string; p_clinic_id: string; p_days?: number }
        Returns: Json
      }
      get_dashboard_stats: { Args: never; Returns: Json }
      get_user_role: { Args: { _user_id: string }; Returns: string }
      get_users_with_email: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          role: string
          user_id: string
        }[]
      }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      match_bd_adoc_chunks: {
        Args: {
          match_count?: number
          match_threshold?: number
          p_agent_id?: string
          p_clinic_id: string
          query_embedding: string
        }
        Returns: {
          chunk_index: number
          content: string
          document_id: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      match_bd_adoc_patient_memories: {
        Args: {
          match_count?: number
          match_threshold?: number
          p_clinic_id: string
          p_patient_id: string
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          id: string
          similarity: number
        }[]
      }
      update_survey_contact: {
        Args: { _email: string; _id: string; _nome: string; _telefone: string }
        Returns: undefined
      }
      ut_match_chunks: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          doc_name: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      ut_match_chunks_focused: {
        Args: {
          filter_document_ids?: string[]
          match_count?: number
          query_embedding: string
        }
        Returns: {
          content: string
          doc_name: string
          id: string
          metadata: Json
          similarity: number
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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

