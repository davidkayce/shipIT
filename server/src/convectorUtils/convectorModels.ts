import { BaseStorage } from '@worldsibu/convector-core';
import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
import { Transaction as TransactionModel } from '../../../chaincodes/cc-transaction';
import { User as UserModel } from '../../../chaincodes/cc-user';

export { Transaction } from '../../../chaincodes/cc-transaction';
export { User } from '../../../chaincodes/cc-user';
import { channel, transactionCC, couchDBHost, couchDBProtocol, couchDBPort, couchDBView } from './env';

// Route to the CouchDB
BaseStorage.current = new CouchDBStorage({
  host: couchDBHost,
  protocol: couchDBProtocol,
  port: couchDBPort
}, couchDBView);

export namespace ModelHelpers {
  export async function formatTransaction(trxn: TransactionModel): Promise<any> {
    const trxnObj = trxn.toJSON();
    (trxnObj as any).holder = await formatParticipant(await User.getOne(trxnObj.holderId));
    return trxnObj;
  }

  export async function formatParticipant(participant: UserModel): Promise<any> {
    const participantObj = participant.toJSON();
    return participantObj;
  }

  export async function getAllTransactions() {
    const cc = transactionCC;
    const dbName = `${channel}_${cc}`;
    const viewUrl = '_design/drugs/_view/all';

    const queryOptions = { startKey: [''], endKey: [''] };

    try {
      const result = <TransactionModel[]>(await Drug.query(Transaction, dbName, viewUrl, queryOptions));
      return await Promise.all(result.map(ModelHelpers.formatDrug));
    } catch (err) {
      console.log(err);
      if (err.code === 'EDOCMISSING') {
        return [];
      } else {
        throw err;
      }
    }
  }

  export async function getAllUsers() {
    const cc = transactionCC;
    const dbName = `${channel}_${cc}`;
    const viewUrl = '_design/participants/_view/all';

    const queryOptions = { startKey: [''], endKey: [''] };

    try {
      const result = <UserModel[]>(await User.query(User, dbName, viewUrl, queryOptions));
      return await Promise.all(result.map(formatParticipant));
    } catch (err) {
      console.log(err);
      if (err.code === 'EDOCMISSING') {
        return [];
      } else {
        throw err;
      }
    }
  }

  export const Drug = TransactionModel;
  export const User = UserModel;
}
