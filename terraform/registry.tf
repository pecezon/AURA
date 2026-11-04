resource "azurerm_container_registry" "acr" {
  name                = "acraura${random_string.storage_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic" # El tier más económico (~$0.16 USD por día)
  admin_enabled       = true    # Genera credenciales para que Container Apps pueda descargar las imágenes

  tags = {
    Environment = var.environment
    Service     = "ContainerRegistry"
  }
}