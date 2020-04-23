import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { ChaincodeTx } from '@worldsibu/convector-core-chaincode';

import { Customs } from './customs.model';

@Controller('customs')
export class CustomsController extends ConvectorController<ChaincodeTx> {
}
