# 1. Workspace to aggregate container logs
resource "azurerm_log_analytics_workspace" "logs" {
  name                = "log-aura-${random_string.storage_suffix.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# 2. Shared Container App Environment
resource "azurerm_container_app_environment" "env" {
  name                       = "cae-aura-${random_string.storage_suffix.result}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
}

# ==========================================
# 3. SERVICE 2: BACKEND (Node.js + Express + Prisma)
# ==========================================
resource "azurerm_container_app" "backend" {
  name                         = "aura-backend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  # Connection to private ACR registry
  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  secret {
    name  = "db-password"
    value = var.db_password
  }

  # Backend network ingress configuration
  ingress {
    external_enabled = true # Expose API via public HTTPS
    target_port      = 4000 # Express application port
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    # Cost optimization: Scale to 0 when there is no traffic
    min_replicas = 0
    max_replicas = 2

    container {
      name   = "aura-backend"
      image  = "${azurerm_container_registry.acr.login_server}/aura-backend:v1"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "PORT"
        value = "4000"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      # Dynamically compose Postgres URL with Azure-mandated SSL mode
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${azurerm_postgresql_flexible_server.postgres.administrator_login}:${var.db_password}@${azurerm_postgresql_flexible_server.postgres.fqdn}:5432/${azurerm_postgresql_flexible_server_database.db.name}?sslmode=require"
      }
      env {
        name  = "DIRECT_URL"
        value = "postgresql://${azurerm_postgresql_flexible_server.postgres.administrator_login}:${var.db_password}@${azurerm_postgresql_flexible_server.postgres.fqdn}:5432/${azurerm_postgresql_flexible_server_database.db.name}?sslmode=require"
      }
      env {
        name  = "SUPABASE_URL"
        value = var.supabase_url
      }
      env {
        name  = "SUPABASE_SERVICE_ROLE_KEY"
        value = var.supabase_service_role_key
      }
      env {
        name  = "OPENAI_API_KEY"
        value = var.openai_api_key
      }
    }
  }
}

# ==========================================
# 4. SERVICE 1: FRONTEND (React SPA + Nginx)
# ==========================================
resource "azurerm_container_app" "frontend" {
  name                         = "aura-frontend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  ingress {
    external_enabled = true # Public URL for end users
    target_port      = 80   # Internal Nginx port
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    min_replicas = 0
    max_replicas = 2

    container {
      name   = "aura-frontend"
      image  = "${azurerm_container_registry.acr.login_server}/aura-frontend:v1"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }
}
