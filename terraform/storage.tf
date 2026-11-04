# Generador aleatorio para garantizar que el nombre sea único en todo Azure
resource "random_string" "storage_suffix" {
  length  = 6
  special = false
  upper   = false
}

# 1. La Cuenta de Almacenamiento (Storage Account)
resource "azurerm_storage_account" "storage" {
  name                     = "staura${random_string.storage_suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard" # Standard cuesta centavos (Premium es caro)
  account_replication_type = "LRS"      # Locally-Redundant Storage (la opción más económica de Azure)

  # Permite que el navegador descargue las imágenes de las simulaciones sin bloqueo
  allow_nested_items_to_be_public = true

  tags = {
    Environment = var.environment
    Service     = "MediaStorage"
  }
}

# 2. El Contenedor / Bucket para las imágenes de simulación
resource "azurerm_storage_container" "assets" {
  name                  = "simulation-assets"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "blob" # Permite lectura pública directa de las imágenes
}