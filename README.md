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

# You can observe the network

$ docker network inspect net_test 

# or better yet to run a docker container monitoring script. 
# This will let you view what Fabric is doing and help diagnose any failures.

$ ./organization/shipIT/configuration/cli/monitordocker.sh net_test
```

### Setup the Organizations' environments

Open two windows in the ./shipIT directory, one for each organization. In your 'shipIT' window run the following commands, to show the shell environment variables needed to act as that organization.

#### 1. ShipIT

```bash
# From the root of the project
$ cd ./shipIT/organization/shipIT

# We want to set the environment variables for this window
$  source shipIT.sh

# First we install the transaction smart contract in shipIT
$ peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

# Then can now install the chaincode on the network
$ peer lifecycle chaincode install cp.tar.gz

# After we install the smart contract, we need to approve the chaincode definition for transactioncontract as shipIT.
# We first need to find the packageID of the installed chaincode through:
$ peer lifecycle chaincode queryinstalled

# We save this id as an environment variable:
export PACKAGE_ID= ## ID##

# The admin can now approve the chaincode definition for shipIT by:
peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name trxncontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA

```

#### 2. Agency

Similarly in your 'agency' window run the following commands

```bash
$ cd ./shipIT/organization/agency

# We want to set the environment variables for the agency window
$ source agency.sh

# Then we want to install the smart contracts and chaincodes for the agency as we did with agency
$ peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0

$ peer lifecycle chaincode install cp.tar.gz

# We save this id again as an environment variable:
export PACKAGE_ID= ## ID##

# The admin can now approve the chaincode definition for agency by:
peer lifecycle chaincode approveformyorg --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name trxncontract -v 0 --package-id $PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA
```

### Deploy the smart contract to the channel

Since we have the minimum number of peers on the network, we can deploy the smart contract from any of the perrs, we would use the shipIT here though:

```bash
# shipIT

$ peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} --channelID mychannel --name trxncontract -v 0 --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent

```

## Client Applications

Install the dependencies in each application directory

```bash

# Note all paths here are from the root of the project
# Agency application
$ cd ./shipIT/organization/agency/application

$ npm install


# shipIT application
$ cd ./shipIT/organization/shipIT/application 

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

_Transfer the Transaction_

```bash
$ node transfer.js

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