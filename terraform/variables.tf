variable "resource_group_name" {
  description = "Azure Resource Group name"
  type        = string
  default     = "rg-aura-cloud"
}

variable "location" {
  description = "Azure region where all services will be deployed"
  type        = string
  default     = "westus"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "db_password" {
  description = "Administrator password for PostgreSQL"
  type        = string
  sensitive   = true
  default     = "AuraSecurePassword2026!"
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  default     = "https://wreyeflwqcinjxsuhpuf.supabase.co"
}

variable "supabase_service_role_key" {
  description = "Supabase Service Role Key for the backend"
  type        = string
  sensitive   = true
  default     = ""
}

variable "openai_api_key" {
  description = "OpenAI API Key for AI behavioral scoring"
  type        = string
  sensitive   = true
  default     = "dummy-key"
}
