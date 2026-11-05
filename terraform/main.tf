# 1. Terraform version and required providers configuration
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.116.0"
    }
  }
}

# 2. Azure Provider configuration (azurerm)
provider "azurerm" {
  features {}
}

# 3. Resource Group: parent container for all 4 AURA services
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "production"
    Project     = "AURA"
    ManagedBy   = "Terraform"
  }
}
