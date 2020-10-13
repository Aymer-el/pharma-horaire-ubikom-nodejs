Config:
- version: NodeJS 13
- endpoint: http://localhost:3800

For development
  build the server with `npm start``
For production
  build the server with docker, cf: below


**Production OPERATIONS**

**BUILD DOCKER** 
` docker build --tag <DockerHubUsername>/pharma-horaire-ubikom-nodejs:latest . `

TO CREATE AND PUSH IMAGES IN AZURE Follow these 3 tutorials:
https://docs.microsoft.com/fr-fr/azure/container-instances/container-instances-tutorial-prepare-app

**CONFIGURING AZURE**
In a first configuration of the Azure global account:
- Create the resource-group:
` az group create --location westeurope --resource-group ubikomResourceGroup `

- Create the container registry, where the images are held:
` az acr create --resource-group ubikomResourceGroup --name ubikomimages --sku Basic `
` az acr login --name ubikomimages `

- Create a local docker image
`docker tag <DockerHubUsername>/pharma-horaire-ubikom-nodejs ubikomimages.azurecr.io/pharma-horaire-ubikom-nodejs:v1`

- Push the container in Azure
`docker push ubikomimages.azurecr.io/pharma-horaire-ubikom-nodejs:v1`
note: the .io is taking care of the hosting hub.

- TO RUN THE IMAGE:
` az container create  --resource-group ubikomResourceGroup  --name ubikomimages   --image ubikomimages.azurecr.io/pharma-horaire-ubikom-nodejs:v1 --ports 3800   --dns-name-label ubikomhellopharma --location westeurope `

- TO CHECK AND SEE IP ADDRESS:
` az container show --resource-group ubikomResourceGroup --name ubikomimages --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" --out table `
