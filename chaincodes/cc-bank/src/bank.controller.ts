import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { ChaincodeTx } from '@worldsibu/convector-core-chaincode';

import { Bank } from './bank.model';

@Controller('bank')
export class BankController extends ConvectorController<ChaincodeTx> {

}
