resource "azurerm_container_registry" "acr" {
  name                = "acraura${random_string.storage_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic" # Most cost-effective tier (~$0.16 USD per day)
  admin_enabled       = true    # Enables admin credentials so Container Apps can pull container images

  tags = {
    Environment = var.environment
    Service     = "ContainerRegistry"
  }
}
