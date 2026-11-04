output "resource_group_name" {
  description = "Nombre del Resource Group creado"
  value       = azurerm_resource_group.rg.name
}

# 1. URL PÚBLICA DEL FRONTEND (Para entrar en el navegador)
output "frontend_url" {
  description = "URL pública de la aplicación AURA (Frontend)"
  value       = "https://${azurerm_container_app.frontend.ingress[0].fqdn}"
}

# 2. URL PÚBLICA DEL BACKEND (Para probar la API y healthcheck)
output "backend_url" {
  description = "URL pública del API REST de AURA (Backend)"
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

# 3. CONEXIÓN DE LA BASE DE DATOS
output "postgres_fqdn" {
  description = "Host FQDN del servidor de PostgreSQL"
  value       = azurerm_postgresql_flexible_server.postgres.fqdn
}

# 4. ENDPOINT DEL BUCKET DE ALMACENAMIENTO
output "storage_account_name" {
  description = "Nombre del Storage Account (Bucket)"
  value       = azurerm_storage_account.storage.name
}

output "storage_blob_endpoint" {
  description = "Endpoint base para descargar imágenes de simulación"
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}

# SOPORTE: REGISTRO DE DOCKER
output "acr_login_server" {
  description = "Servidor de ACR para hacer docker push"
  value       = azurerm_container_registry.acr.login_server
}