#create resource group
az group create --name arm-vscode-02 --location eastus
#create Azure Communication Services
az deployment group create --resource-group arm-vscode-01 --template-file communicationSerivces01.json
