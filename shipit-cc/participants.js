import { Contract } from 'fabric-contract-api';

export default class ParticipantContract extends Contract {
  async createTransaction(ctx, transaction, sender) {
    const transactionID = 'uibdviupedv';
    await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(transaction)));
    console.log('Transaction created succesfully and assigned id: ', transactionID);
  }

  async getParticipant(ctx, participantId) {
    let idBytes = await ctx.stub.getState(participantId);
    if (!idBytes || idBytes.toString().length <= 0) throw new Error('Participant with this Id does not exist');
    let participant = JSON.parse(idBytes.toString());
    return JSON.stringify(participant);
  }

  async deleteTransaction(ctx, transactionID) {
    await ctx.stub.deleteState(transactionID);
    console.log(`Transaction with ID: ${transactionID} successfully deleted`);
  }
}