# 1. Configuración de versión de Terraform y proveedores requeridos
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.116.0"
    }
  }
}

# 2. Configuración del proveedor de Azure (azurerm)
provider "azurerm" {
  features {}
}

# 3. El Resource Group: el contenedor padre de todos los 4 servicios de AURA
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "production"
    Project     = "AURA"
    ManagedBy   = "Terraform"
  }
}