# Ship IT 

This project is a POC for a data management system /application for shippers, customs and other third parties secured by the blockchain. This project is built on hyperledger fabric


## Project Setup

First, we need to start the network and create a channel.

In the root directory, you can get the latest hyperledger fabric binaries and configuration which would be stored under the "bin" directory by running:

```
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

```
cd src/shipit-network
./start.sh
```

Wait for a few moments. It will take some time to set up network. If you encounter any permission errors, simply run under root user privileges. Once our network with a single peer is up and running, we are able to install chaincode. For installing and invoking chaincode, we can use CLI container of Peer.

```
## Enter into CLI Container:

cd src/network
./start.sh

## Installing and Instantiating Chaincode:

peer chaincode install -n mycc -v 1.0 -p "/opt/gopath/src/github.com/newcc" -l "node"
peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -l "node" -v 1.0 -c '{"Args":[]}'
```

Adding Marks Of Student
peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"addMarks","Args":["Alice","68","84","89"]}'