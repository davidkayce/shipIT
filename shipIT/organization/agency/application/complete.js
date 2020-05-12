'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Transaction = require('../../shipIT/contract/lib/transaction.js');

async function main() {
  const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');
  const gateway = new Gateway();

  try {
    const userName = 'balaji';
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true },
    };

    console.log('Connecting to Fabric gateway.');
    await gateway.connect(connectionProfile, connectionOptions);

    // Access shipitnet network
    console.log('Use network channel: mychannel.');
    const network = await gateway.getNetwork('mychannel');

    console.log('Use org.shipitnet.transaction smart contract.');
    const contract = await network.getContract('transactioncontract', 'org.shipitnet.transaction');

    // complete transaction
    console.log('Completing transaction.');
    const completeResponse = await contract.submitTransaction('complete', 'shipIT', '00001', 'shipIT', 'agency', '4900000', '2020-05-31');

    // process response
    console.log('Process complete transaction response.');
    let trxn = Transaction.fromBuffer(completeResponse);

    console.log(`${trxn.issuer} transaction : ${trxn.id} successfully completed by ${trxn.owner}`);
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
