import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { Controller, ConvectorController, Invokable, Param } from '@worldsibu/convector-core';

import { User, Agency, Agent } from 'participant-cc';
import { Transaction } from './transaction.model';

@Controller('transaction')
export class TransactionController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async createTransaction(
    @Param(Transaction)
    txn: Transaction
  ) {
    const existing = await Transaction.getOne(txn.id);
    if (existing.id) throw new Error(`Batch with id ${txn.id} has been already registered`);
    const creator = await User.getFromFingerprint(this.sender);
    txn.createdBy = creator.id;
    await txn.save();
  }

  @Invokable()
  public async getTransaction(
    @Param(yup.string())
    txnId: string
  ) {
    const txn = await Transaction.getOne(txnId);
    if (!txn.id) throw new Error(`No txn found with id ${txn.id}`);
    return txn.toJSON() as Transaction;
  }

  @Invokable()
  public async getAllTransactions() {
    return (await Transaction.getAll()).map((p) => p.toJSON() as Transaction);
  }

  @Invokable()
  public async transferTransaction(
    @Param(yup.string())
    txnId: string,
    @Param(yup.string())
    to: string,
    @Param(yup.string().oneOf(['agency', 'agent']))
    senderType: string
  ) {
    const trxn = await Transaction.getOne(txnId);
    if (!trxn) throw new Error(`No transaction found with id ${txnId}`);
    let handler;
    if (senderType === 'agency') {
      handler = await Agency.getFromFingerprint(this.sender);
    } else {
      handler = await Agent.getFromFingerprint(this.sender);
    }
    if (trxn.handledBy !== handler.id) throw new Error(`Only the transaction handler can transfer this transaction`);
    trxn.handledBy = to;
    await trxn.save(); 
  }

  @Invokable()
  public async updateTransaction(
    @Param(yup.string())
    txnId: string,
    @Param(yup.string().oneOf(['agency', 'agent']))
    senderType: string,
    @Param(yup.object())
    details: any
  ) {
    const trxn = await Transaction.getOne(txnId);
    if (!trxn) throw new Error(`No transaction found with id ${txnId}`);
    let handler;
    if (senderType === 'agency') {
      handler = await Agency.getFromFingerprint(this.sender);
    } else {
      handler = await Agent.getFromFingerprint(this.sender);
    }
    if (trxn.handledBy !== handler.id) throw new Error(`Only the transaction handler can update this transaction`);
    trxn.modifiedBy = handler.id;
    trxn.modified = Date.now();
    Object.keys(details)
      .map(key => trxn[key] = details[key]);
    
    await trxn.save();
  }
}
