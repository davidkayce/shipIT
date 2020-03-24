# shipIT - shipIT

This awesome project was created automatically with <a href="https://github.com/worldsibu/convector-cli" target="_blank">Convector CLI</a>.
By default new Convector projects locally include <a href="https://github.com/worldsibu/hurley">Hurley</a> to manage your development environment seamlessly, so you don't have to worry about setting up the network and hard ways to install  and upgrade your chaincodes.

## Start

```
# Install dependencies - From the root of your project
npm install
# Create a new development blockchain network 
The default network is created with five organizations but you can change it in the package.json 
From the root of your project:

npm run env:restart

# Install your smart contract
npm run cc:start -- shipIT

# Make a testing call to create a record in the ledger
# Beware that the first call may fail with a timeout! Just happens the first time
hurl invoke shipIT shipIT_create "{\"name\":\"my first request\",\"id\":\"0001\",\"created\":0,\"modified\":0}"
```

