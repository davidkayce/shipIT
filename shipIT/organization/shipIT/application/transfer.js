'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Transaction = require('../contract/lib/transaction.js');

async function main() {
  const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');
  const gateway = new Gateway();

  try {
    const userName = 'isabella';

    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));
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

    console.log('Use org.shipitnet.transaction smart contract.');
    const contract = await network.getContract('transactioncontract');

    // transfer transaction
    console.log('Transfering transaction.');
    const completeResponse = await contract.submitTransaction('transfer', 'shipIT', '00001', 'shipIT', 'agency', '4900000', '2020-05-31');

    // process response
    console.log('Process transfer transaction response.');
    let trxn = Transaction.fromBuffer(completeResponse);

    console.log(`${trxn.issuer} transaction : ${trxn.id} successfully transferred to ${trxn.owner}`);
    console.log('Transaction complete.');
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
    console.log('Disconnecting from Fabric gateway.');
    gateway.disconnect();
  }
}

main()
  .then(() => {
    console.log('Complete program complete.');
  })
  .catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
  });


