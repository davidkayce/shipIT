'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Transaction = require('../contract/lib/transaction.js');

async function main() {
  // A wallet stores a collection of identities for use
  const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  try {
    // Specify userName for network access
    // const userName = 'isabella.issuer@shipIT.com';
    const userName = 'isabella';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true },
    };

    // Connect to gateway using application specified parameters
    console.log('Connecting to Fabric gateway.');
    await gateway.connect(connectionProfile, connectionOptions);

    // Access shipitnet network
    console.log('Use network channel: mychannel.');
    const network = await gateway.getNetwork('mychannel');

    // Get addressability to transaction contract
    console.log('Use org.shipitnet.transaction smart contract.');
    const contract = await network.getContract('trxncontract', 'org.shipitnet.transaction');

    // issue transaction
    console.log('Submitting the issue transaction.');
    const issueResponse = await contract.submitTransaction('issue', 'shipIT', 'BOL347HT23454', 'import', 'M-23H342243', 300000, 0, 'POC Import transaction');

    // process response
    console.log('Process issue transaction response.' + issueResponse);
    let trxn = Transaction.fromBuffer(issueResponse);

    console.log(`${trxn.issuer} transaction : ${trxn.id} successfully issued`);
    console.log('Transaction complete.');
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
    // Disconnect from the gateway
    console.log('Disconnecting from Fabric gateway.');
    gateway.disconnect();
  }
}

main()
  .then(() => {
    console.log('Issue program complete.');
  })
  .catch((e) => {
    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
  });
