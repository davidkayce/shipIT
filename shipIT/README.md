# Commercial Paper Tutorial

This folder contains the code for an introductory tutorial to Smart Contract development. It is based around the scenario of Commercial Paper.
The full tutorial, including full scenario details and line by line code walk-through is in the [Hyperledger Fabric Commercial Paper Tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/tutorial/commercial_paper.html).

## Scenario

In this tutorial two organizations, shipIT and agency, trade commercial paper with each other using 'shipitnet', a Hyperledger Fabric blockchain network.

Once you’ve set up a basic network, you’ll act as Isabella, an employee of shipIT, who will issue a commercial paper on its behalf. You’ll then switch hats to take the role of Balaji, an employee of agency, who will buy this commercial paper, hold it for a period of time, and then redeem it with shipIT for a small profit.

![](https://hyperledger-fabric.readthedocs.io/en/latest/_images/commercial_paper.diagram.1.png)

## Quick Start

You are strongly advised to read the full tutorial to get information about the code and the scenario. Below are the quick start instructions for running the tutorial, but without extensive details of what is happening.

This `README.md` file is in the `shipIT` directory, the source code for client applications and the contracts is in the `organization` directory.

### Steps

1. Start the Hyperledger Fabric infrastructure

The 'network' will be used - this has two organizations 'org1' and 'org2' agency will be org1, and shipIT will be org2.

2. Install and Instantiate the Contracts

3. Run client applications in the roles of shipIT and agency to trade the commercial paper

   - Issue the Paper as shipIT (org2)
   - Buy the paper as agency (org1)
   - Redeem the paper as agency (org1)

## Setup

You will need a machine with the following

- Docker and docker-compose installed
- Node.js v12 if you want to run JavaScript client applications
- Java v8 if you want to run Java client applications
- Maven to build the Java applications

You will need to install the peer cli binaries and this fabric-samples repository available. For more information
[Install the Samples, Binaries and Docker Images](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) in the Hyperledger Fabric documentation.

It is advised to have 3 console windows open; one to monitor the infrastructure and one each for shipIT and agency. Once you've cloned the fabric-samples - change to the shipIT directory in each window.

```
cd fabric-samples/shipIT
```

## Running the Infrastructure

In one console window, run the `./network-starter.sh` script; this will start the basic infrastructure.

You can re-use this console window if you wish, but it is recommended to run a docker container monitoring script. This will let you view what Fabric is doing and help diagnose any failures.

```bash
./organization/shipIT/configuration/cli/monitordocker.sh net_test
```

### Setup the Organizations' environments

The contract code is available as either JavaScript, Java or Go. You can use either one, and the choice of contract language does not affect the choice of client language. With the v2.0 Fabric chaincode lifecycle, this requires operations for both shipIT and agency admin. Open two windows in the fabric-samples/commercial paper directory, one for each organization.

In your 'shipIT' window run the following commands, to show the shell environment variables needed to act as that organization.

```
cd fabric-samples/shipIT/organization/shipIT
./shipIT.sh
```

You can either copy and paste them directly into the terminal, or invoke directly in your own command shell. For example if you are using bash or zsh on Linux you can use this command.

```
source <(./shipIT.sh)
```

Similarly in your 'agency' window run the following command

```
cd fabric-samples/shipIT/organization/agency
./agency.sh
```

### Deploy the smart contract to the channel

You need to perform similar operations for both organizations. For different contract languages the steps are very similar. The steps for JavaScript are shown first, with the details of different languages afterwards.

**For a JavaScript Contract**

Running in shipIT:

```
# shipIT

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name papercontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1
```

Running in agency

```

# agency

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name papercontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1

```

Once both organizations have installed, and approved the chaincode, it can be committed.

```
# shipIT

peer lifecycle chaincode commit -o localhost:7050 \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --ordererTLSHostnameOverride orderer.example.com \
                                --channelID mychannel --name papercontract -v 0 \
                                --sequence 1 \
                                --tls --cafile $ORDERER_CA --waitForEvent

```

To test try sending some simple transactions.

```

peer chaincode invoke -o localhost:7050  --ordererTLSHostnameOverride orderer.example.com \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --channelID mychannel --name papercontract \
                                -c '{"Args":["org.shipitnet.commercialpaper:instantiate"]}' ${PEER_ADDRESS_ORG1} ${PEER_ADDRESS_ORG2} \
                                --tls --cafile $ORDERER_CA --waitForEvent

peer chaincode query -o localhost:7050  --ordererTLSHostnameOverride orderer.example.com \
                                        --channelID mychannel \
                                        --name papercontract \
                                        -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}' \
                                        --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                        --tls --cafile $ORDERER_CA | jq -C | more
```

**For a Java Contract:**

Before the `peer lifecycle chaincode package` command, you will need to change into each organization's `contract-java` directory and issue

```
./gradlew build
```

Then from the parent directory when you package the contract, use this variation of the command to specify the java specific contract

```
peer lifecycle chaincode package cp.tar.gz --lang java --path ./contract-java --label cp_0
```

After this point the steps are exactly the same as for JavaScript

**For a Go Contract:**

Before the `peer lifecycle chaincode package` command, you will need to change into each organization's `contract-go` directory and issue

```
go mod vendor
```

Then from the parent directory when you package the contract, use this variation of the command to specify the go specific contract

```
peer lifecycle chaincode package cp.tar.gz --lang golang --path ./contract-go --label cp_0
```

After this point the steps are exactly the same as for JavaScript

## Client Applications

Note for Java applications you will need to compile the Java Code using maven. Use this command in each application-java directory

```
mvn clean package
```

Note for JavaScript applications you will need to install the dependencies first. Use this command in each application directory

```
npm install
```

> Note that there is NO dependency between the language of any one client application and any contract. Mix and match as you wish!

The docker containers don't contain the node or Java runtimes; so it is best to exit the docker containers - but keep the windows open and run the applications locally.

### Issue the paper

This is running as _shipIT_ These commands are to be run in the
`shipIT/organization/shipIT/application` directory or the `shipIT/organization/shipIT/application-java`

_Add the Identity to be used_

```
node addToWallet.js
# or
java -cp target/shipIT-0.0.1-SNAPSHOT.jar org.shipIT.AddToWallet
```

_Issue the Commercial Paper_

```
node issue.js
# or
java -cp target/shipIT-0.0.1-SNAPSHOT.jar org.shipIT.Issue
```

### Buy and Redeem the paper

This is running as _agency_;

You can now run the applications to buy and redeem the paper. Change to either the
`shipIT/organization/agency/application` directory or `shipIT/organization/agency/application-java`

_Add the Identity to be used_

```
node addToWallet.js
# or
java -cp target/shipIT-0.0.1-SNAPSHOT.jar org.agency.AddToWallet
```

_Buy the paper_

```
node buy.js
# or
java -cp target/shipIT-0.0.1-SNAPSHOT.jar org.agency.Buy
```

_Redeem_

```
node redeem.js
# or
java -cp target/shipIT-0.0.1-SNAPSHOT.jar org.agency.Redeem
```

## Clean up

When you are finished using the Fabric test network and the commercial paper smart contract and applications, you can use the following command to clean up the network:

```
./network-clean.sh
```