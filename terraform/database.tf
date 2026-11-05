# 1. Managed PostgreSQL Server
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                = "psql-aura-${random_string.storage_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  version             = "16" # Same Postgres version tested in Docker

  administrator_login    = "aura_admin"
  administrator_password = var.db_password

  storage_mb = 32768             # 32 GB (minimum allowed by Azure)
  sku_name   = "B_Standard_B1ms" # Cost-effective Burstable tier for student use

  # Backup configuration
  backup_retention_days = 7

  tags = {
    Environment = var.environment
    Service     = "Database"
  }
}

# 2. Internal database named 'aura_db'
resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "aura_db"
  server_id = azurerm_postgresql_flexible_server.postgres.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# 3. Firewall rule: Allow traffic from Azure services (Backend)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0" # Special Azure IP range representing internal services
}

# 4. Optional firewall rule: Allow connections from local environment for development/testing
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  name             = "AllowAllForDev"
  server_id        = azurerm_postgresql_flexible_server.postgres.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}
