# Random generator to ensure globally unique names across Azure
resource "random_string" "storage_suffix" {
  length  = 6
  special = false
  upper   = false
}

# 1. Azure Storage Account
resource "azurerm_storage_account" "storage" {
  name                     = "staura${random_string.storage_suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard" # Standard tier (cost-effective compared to Premium)
  account_replication_type = "LRS"      # Locally-Redundant Storage (most cost-effective Azure replication option)

  # Allows web browsers to download simulation assets directly without blocking
  allow_nested_items_to_be_public = true

  tags = {
    Environment = var.environment
    Service     = "MediaStorage"
  }
}

# 2. Blob container for simulation assets and media
resource "azurerm_storage_container" "assets" {
  name                  = "simulation-assets"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "blob" # Allows direct public read access for simulation images
}
