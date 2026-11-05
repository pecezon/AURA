output "resource_group_name" {
  description = "Name of the created Resource Group"
  value       = azurerm_resource_group.rg.name
}

# 1. PUBLIC FRONTEND URL (Browser access)
output "frontend_url" {
  description = "Public URL for the AURA application (Frontend)"
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

# 2. PUBLIC BACKEND URL (API testing and healthcheck)
output "backend_url" {
  description = "Public URL for the AURA REST API (Backend)"
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

# 3. DATABASE CONNECTION
output "postgres_fqdn" {
  description = "FQDN host of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.postgres.fqdn
}

# 4. STORAGE BUCKET ENDPOINT
output "storage_account_name" {
  description = "Name of the Storage Account (Bucket)"
  value       = azurerm_storage_account.storage.name
}

output "storage_blob_endpoint" {
  description = "Base endpoint for downloading simulation assets"
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}

# SUPPORT: DOCKER CONTAINER REGISTRY
output "acr_login_server" {
  description = "ACR login server for docker tag and push"
  value       = azurerm_container_registry.acr.login_server
}
