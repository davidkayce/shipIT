import { resolve } from 'path';
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';
import { TransactionController } from '../../../chaincodes/cc-transaction';
import { AgentController } from '../../../chaincodes/cc-agent';
import { BankController } from '../../../chaincodes/cc-bank';
import { CustomsController } from '../../../chaincodes/cc-customs';
import { UserController, User } from '../../../chaincodes/cc-user';
import { SelfGenContext } from './selfGenContext';
import { ConvectorControllerClient, ClientFactory } from '@worldsibu/convector-core';
import { keyStore, networkProfile, userCert, channel, transactionCC, orgCert, identity } from './env';


async function InitFabricAdapter() {
  await SelfGenContext.getClient();

  const adapter = new FabricControllerAdapter({
    txTimeout: 300000,
    user: userCert,
    // set it later to enable Mutual TLS
    channel: channel,
    chaincode: transactionCC,
    keyStore: resolve(__dirname, keyStore),
    networkProfile: resolve(__dirname, networkProfile),
    userMspPath: keyStore
  });

  await adapter.init();
  return adapter;
}
// Building this adapter allows you to communicate with the test env created by `hurley`.
export async function InitTransactionController(): Promise<ConvectorControllerClient<TransactionController>> {
  return ClientFactory(TransactionController, await InitFabricAdapter());
}
export async function InitBankController(): Promise<ConvectorControllerClient<BankController>> {
  return ClientFactory(BankController, await InitFabricAdapter());
}
export async function InitCustomsController(): Promise<ConvectorControllerClient<CustomsController>> {
  return ClientFactory(CustomsController, await InitFabricAdapter());
}
export async function InitUserController(): Promise<ConvectorControllerClient<UserController>> {
  return ClientFactory(UserController, await InitFabricAdapter());
}
export async function InitAgentController(): Promise<ConvectorControllerClient<AgentController>> {
  return ClientFactory(AgentController, await InitFabricAdapter());
}
export async function InitServerIdentity() {
  const res = await (await InitUserController()).get(identity);
  const serverIdentity = new User(res).toJSON();

  if (!serverIdentity || !serverIdentity.id) {
    console.log('Server identity not found, make sure to enroll it or seed data');
  } else {
    console.log('Server identity found');
  }
}
