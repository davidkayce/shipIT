import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { ShipIT } from './shipIT.model';

@Controller('shipIT')
export class ShipITController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(ShipIT)
    shipIT: ShipIT
  ) {
    await shipIT.save();
  }
}