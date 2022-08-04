$rg = 'arm-deploymant-01'

New-AzResourceGroup -Name $rg -Location eastus -Force

New-AzResourceGroupDeployment `
 -ResourceGroupName $rg`
  -TemplateFile './communicationSerivces01.json'