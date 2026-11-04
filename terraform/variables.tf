variable "resource_group_name" {
  description = "Nombre del Resource Group en Azure"
  type        = string
  default     = "rg-aura-cloud"
}

variable "location" {
  description = "Región de Azure donde se desplegarán todos los servicios"
  type        = string
  default     = "westus"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "prod"
}

variable "db_password" {
  description = "Contraseña de administrador para PostgreSQL"
  type        = string
  sensitive   = true
  default     = "AuraSecurePassword2026!"
}

variable "supabase_url" {
  description = "URL del proyecto de Supabase"
  type        = string
  default     = "https://wreyeflwqcinjxsuhpuf.supabase.co"
}

variable "supabase_service_role_key" {
  description = "Service Role Key de Supabase para el backend"
  type        = string
  sensitive   = true
  default     = ""
}

variable "openai_api_key" {
  description = "API Key de OpenAI para el scoring con IA"
  type        = string
  sensitive   = true
  default     = "dummy-key"
}