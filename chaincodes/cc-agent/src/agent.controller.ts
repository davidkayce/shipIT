import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { ChaincodeTx } from '@worldsibu/convector-core-chaincode';

import { Agent } from './agent.model';

@Controller('agent')
export class AgentController extends ConvectorController<ChaincodeTx> {

}
