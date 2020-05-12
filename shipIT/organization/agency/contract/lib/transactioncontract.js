'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Transaction = require('./transaction.js');
const TransactionList = require('./transactionlist.js');

// A custom context provides easy access to list of all transactions
class TransactionContext extends Context {
  constructor() {
    super();
    this.transactionList = new TransactionList(this);
  }
}

class TransactionContract extends Contract {
  constructor() {
    // Unique namespace when multiple contracts per chaincode file
    super('org.shipitnet.transaction');
  }

  // Define a custom context for transactions
  createContext = () => new TransactionContext();

  /**
   * Issue transaction
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer transaction issuer
   * @param {String} bolReference bill of laden reference
   * @param {String} trxnType transaction type (either 'import' or 'export')
   * @param {String} formMNumber form M reference number
   */
  async issue(ctx, issuer, bolReference, trxnType, formMNumber, provisionalBill, amountPaid, goodsDescription) {
    let trxn = Transaction.createInstance(issuer, bolReference, trxnType, formMNumber, provisionalBill, amountPaid, goodsDescription);
    trxn.setIssued();
    trxn.setOwner(issuer);
    await ctx.transactionList.addTransaction(trxn);
    // Return a serialized transaction to caller of smart contract
    return trxn;
  }

  /**
   * Transfer transaction
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer transaction issuer
   * @param {String} id transaction id set by the issuer
   * @param {String} currentOwner current owner of transaction
   * @param {String} newOwner new owner of transaction
   */
  async transfer(ctx, issuer, id, currentOwner, newOwner) {
    // Retrieve the currenttrxn using key fields provided
    let trxnKey = Transaction.makeKey([issuer, id]);
    let trxn = await ctx.transactionList.getTransaction(trxnKey);
    if (trxn.getOwner() !== currentOwner) throw new Error('Transaction ' + issuer + id + ' is not owned by ' + currentOwner);

    // Check transaction is not already COMPLETE
    if (trxn.isCompleted()) throw new Error('Transaction ' + issuer + id + ' is already completed and cannot be transferred');
    trxn.setOwner(newOwner);
    await ctx.transactionList.updateTransaction(trxn);
    return trxn;
  }

  /**
   * Complete transaction
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer transaction issuer
   * @param {String} id transaction id set by the issuer
   * @param {Integer} amountPaid amount for transaction
   * @param {String} owner current owner of the transaction
   */
  async completeTransaction(ctx, issuer, id, amountPaid, owner) {
    let trxnKey = Transaction.makeKey([issuer, id]);
    let trxn = await ctx.transactionList.getTransaction(trxnKey);

    // Check if transaction is not COMPLETE
    if (trxn.isCompleted()) throw new Error('Transaction ' + issuer + id + ' is already completed');

    if (trxn.getOwner() === owner) {
      trxn.setOwner(trxn.getIssuer());
      if (amountPaid >= trxn.provisionalBill) trxn.setCompleted();
      trxn.amountPaid = amountPaid;
    } else {
      throw new Error('Only owners of the transaction ' + issuer + id + ' can complete it');
    }

    await ctx.transactionList.updateTransaction(trxn);
    return trxn;
  }
}

module.exports = TransactionContract;
