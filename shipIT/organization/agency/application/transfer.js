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
    const contract = await network.getContract('trxncontract', 'org.shipitnet.transaction');

    // transfer transaction
    console.log('Transfering transaction.');
    const completeResponse = await contract.submitTransaction('transfer', 'shipIT', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'agency', 'shipIT');

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
