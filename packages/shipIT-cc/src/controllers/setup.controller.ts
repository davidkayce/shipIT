import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { Bill } from '../models';


@Controller('bill')
export class SetupController extends ConvectorController<ChaincodeTx> {
  
  @Invokable()
  public async initLedger(): Promise<void> {
    let MockData = [
      new Bill({ id: 'id1', owner: 'David', created: 1590979790, modified: 27897597 }),
      new Bill({ id: 'id2', owner: 'Toju', created: 1590979792, modified: 27897597 }),
      new Bill({ id: 'id3', owner: 'Dami', created: 1590979794, modified: 27897597 }),
      new Bill({ id: 'id4', owner: 'Yemisi', created: 1590979795, modified: 27897597 }),
      new Bill({ id: 'id5', owner: 'Aisosa', created: 1590979797, modified: 27897597 }),
      new Bill({ id: 'id6', owner: 'Toyos', created: 1590979800, modified: 27897597 })
    ]
    try {
      await Promise.all(MockData.map((bill: Bill) => bill.save()));
    } catch (error) {
      throw new Error('Cannot set up the ledger, please try again');
    }
  }
}