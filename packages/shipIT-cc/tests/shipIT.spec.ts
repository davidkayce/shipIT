// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { ShipIT, ShipITController } from '../src';

describe('ShipIT', () => {
  let adapter: MockControllerAdapter;
  let shipITCtrl: ConvectorControllerClient<ShipITController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    shipITCtrl = ClientFactory(ShipITController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ShipITController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new ShipIT({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await shipITCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<ShipIT>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});