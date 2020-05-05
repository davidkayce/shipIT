import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Transaction } from './transaction.model';

@Controller('transaction')
export class TransactionController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Transaction)
    txn: Transaction, 
    owner: string
  ) {
    await txn.save();
  }

  @Invokable()
  public async getProvisionalBill(txnID: string) {
    await txn.save();
  }
}