import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Bill } from '../models';

@Controller('bill')
export class BillController extends ConvectorController<ChaincodeTx> {
  @Invokable() // You need this decorator to signify functions that can be queried on the blockchain
  public async create() {
    await bill.save();
  }
}