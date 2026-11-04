# 1. El Servidor Administrado de PostgreSQL
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                = "psql-aura-${random_string.storage_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  version             = "16" # Misma versión de Postgres que probamos en Docker

  administrator_login    = "aura_admin"
  administrator_password = var.db_password

  storage_mb = 32768             # 32 GB (mínimo permitido por Azure)
  sku_name   = "B_Standard_B1ms" # Tier Burstable económico para estudiantes

  # Configuración de backup
  backup_retention_days = 7

  tags = {
    Environment = var.environment
    Service     = "Database"
  }
}

# 2. La Base de Datos interna llamada 'aura_db'
resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "aura_db"
  server_id = azurerm_postgresql_flexible_server.postgres.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# 3. Regla de Firewall: Permitir tráfico desde los servicios de Azure (Backend)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0" # IP mágica de Azure para servicios internos
}

# 4. Regla de Firewall opcional: Permitir que te conectes desde tu Mac para pruebas locales
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  name             = "AllowAllForDev"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}