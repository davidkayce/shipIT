# Ship IT 

This project is a POC for a data management system /application for shippers, customs and other third parties secured by the blockchain. This project is built on hyperledger fabric.

## Scenario

In this POC, we use two organizations, shipIT and agency who trade transactions with each other using 'shipitnet', a Hyperledger Fabric blockchain network.

Once you’ve set up a basic network, you’ll act as Isabella, an employee of shipIT, who will issue a transaction on its behalf. You’ll then switch hats to take the role of Balaji, an employee of agency, who will receive this transaction, and complete it by paying the provisional Bill.

## Setup

You will need a machine with the following

- Docker and docker-compose installed
- Node.js v12 if you want to run JavaScript client applications

It is advised to have 3 console windows open; one to monitor the infrastructure and one each for shipIT and agency. Once you've had the project set up in your editor of choice, change to the shipIT directory in each window.

```bash
$ cd ./shipIT

# To start the basic infrastructure for the network, run in one of the three consoles:

$ ./network-starter.sh

# It is recommended to run a docker container monitoring script. 
# This will let you view what Fabric is doing and help diagnose any failures.
# Do that by running:

$ ./organization/shipIT/configuration/cli/monitordocker.sh net_test
```

### Setup the Organizations' environments

Open two windows in the ./shipIT directory, one for each organization. In your 'shipIT' window run the following commands, to show the shell environment variables needed to act as that organization.

```bash
# From the root of the project
$ cd ./shipIT/organization/shipIT

$ ./shipIT.sh
```

You can either copy and paste them directly into the terminal, or invoke directly in your own command shell. For example if you are using bash or zsh on Linux you can use this command.

```bash
$ source <(./shipIT.sh)
```

Similarly in your 'agency' window run the following command

```bash
$ cd ./shipIT/organization/agency

$ ./agency.sh
```

### Deploy the smart contract to the channel

Running in shipIT console:

```bash
# shipIT

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name transactioncontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name transactioncontract -v 0 --sequence 1
```

Running in agency console:

```bash

# agency

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name transactioncontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name transactioncontract -v 0 --sequence 1

```

Once both organizations have installed, and approved the chaincode, it can be committed.

```bash
# running in the shipIT console

peer lifecycle chaincode commit -o localhost:7050 \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --ordererTLSHostnameOverride orderer.example.com \
                                --channelID mychannel --name transactioncontract -v 0 \
                                --sequence 1 \
                                --tls --cafile $ORDERER_CA --waitForEvent

```

## Client Applications

Install the dependencies in each application directory

```bash

# Note all paths here are from the root of the project
# Agency application
$ cd ./shipIT/organization/agency/application

$ npm install

# Agency contract
$ cd ./shipIT/organization/agency/contract

$ npm install

# shipIT application
$ cd ./shipIT/organization/shipIT/application 

$ npm install

# shipIT contract
$ cd ./shipIT/organization/shipIT/contract

$ npm install

```

The docker containers don't contain the node or Java runtimes; so it is best to exit the docker containers - but keep the windows open and run the applications locally.

### Issue the transaction

This is running as _shipIT_ These commands are to be run in the `shipIT/organization/shipIT/application` directory 

_Add the Identity to be used_

``` bash 
$ node addToWallet.js

```

_Issue the Transaction_

```bash
$ node issue.js

```

### Complete the Transaction

This is running as _agency_;

You can now run the applications to complete the transaction. Change to the `shipIT/organization/agency/application` directory

_Add the Identity to be used_

```bash 
$ node addToWallet.js

```

_Complete the transaction_

```
$ node complete.js

```

## Clean up

When you are finished using the Fabric test network and the smart contract and applications, you can use the following command to clean up the network:

```bash
$ ./network-clean.sh

```