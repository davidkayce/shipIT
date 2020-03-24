import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Bill } from '../models';

@Controller('bill')
export class BillController extends ConvectorController<ChaincodeTx> {
  // You need the Invokable decorator to signify functions that can 
  // be queried by a user on the blockchain

  @Invokable()
  public async queryBills(): Promise<Bill[]> {
    return Bill.getAll();
  }

  @Invokable()
  public async queryBill(
    @Param(yup.string()) id: string
  ): Promise<Bill> {
    return Bill.getOne(id)
  }

  @Invokable()
  public async addBill(
    @Param(Bill) bill: Bill
  ): Promise<void> {
    try {
      await bill.save();
    } catch (error) {
      throw new Error('Cannot add this bill, please try again');
    }
  }


  @Invokable()
  public async editBill(
    @Param(yup.string()) id: string,
    @Param(yup.string()) field: string,
    value: any
  ): Promise<void> {
    try {
      const bill = await Bill.getOne(id);
      bill[field] = value;
      return bill.save();
    } catch (error) {
      throw new Error('Cannot edit this bill, please try again');
    }
  }
}