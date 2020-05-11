import { Contract } from 'fabric-contract-api';

export default class TransactionContract extends Contract {
  async createTransaction(ctx, transaction, sender) {
    const transactionID = 'uibdviupedv';
    await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(transaction)));
    console.log('Transaction created succesfully and assigned id: ', transactionID);
  }

  async queryMarks(ctx, studentId) {

    let marksAsBytes = await ctx.stub.getState(studentId);

    if (!marksAsBytes || marksAsBytes.toString().length <= 0) {

      throw new Error('Student with this Id does not exist: ');

    }

    let marks = JSON.parse(marksAsBytes.toString());
    return JSON.stringify(marks);

  }

  async deleteTransaction(ctx, transactionID) {
    await ctx.stub.deleteState(transactionID);
    console.log(`Transaction with ID: ${transactionID} successfully deleted`);
  }
}