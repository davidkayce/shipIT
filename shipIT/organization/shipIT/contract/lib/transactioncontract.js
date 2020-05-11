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
  createContext = () =>  new TransactionContext();

  /**
   * Instantiate to perform any setup of the ledger that might be required.
   * @param {Context} ctx the transaction context
   */
  async instantiate(ctx) {
    // No implementation required with this example
    // It could be where data migration is performed, if necessary
    console.log('Instantiate the contract');
  }

  /**
   * Issue transaction
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer commercial paper issuer
   * @param {Integer} paperNumber paper number for this issuer
   * @param {String} issueDateTime paper issue date
   * @param {String} maturityDateTime paper maturity date
   * @param {Integer} faceValue face value of paper
  */
  async issue(ctx, issuer, paperNumber, issueDateTime, maturityDateTime, faceValue) {
    let trxn = Transaction.createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue);
    trxn.setIssued();
    trxn.setOwner(issuer);
    await ctx.transactionList.addTransaction(trxn);
    // Return a serialized transaction to caller of smart contract
    return trxn;
  }

  /**
   * Buy commercial paper
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer commercial paper issuer
   * @param {Integer} paperNumber paper number for this issuer
   * @param {String} currentOwner current owner of paper
   * @param {String} newOwner new owner of paper
   * @param {Integer} price price paid for this paper
   * @param {String} purchaseDateTime time paper was purchased (i.e. traded)
  */
  async transfer(ctx, issuer, paperNumber, currentOwner, newOwner, price, purchaseDateTime) {

    // Retrieve the current paper using key fields provided
    let paperKey = Transaction.makeKey([issuer, paperNumber]);
    let paper = await ctx.paperList.getPaper(paperKey);

    // Validate current owner
    if (paper.getOwner() !== currentOwner) {
      throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
    }

    // First buy moves state from ISSUED to TRADING
    if (paper.isIssued()) {
      paper.setTrading();
    }

    // Check paper is not already REDEEMED
    if (paper.isTrading()) {
      paper.setOwner(newOwner);
    } else {
      throw new Error('Paper ' + issuer + paperNumber + ' is not trading. Current state = ' + paper.getCurrentState());
    }

    // Update the paper
    await ctx.paperList.updatePaper(paper);
    return paper;
  }

  /**
   * Redeem commercial paper
   *
   * @param {Context} ctx the transaction context
   * @param {String} issuer commercial paper issuer
   * @param {Integer} paperNumber paper number for this issuer
   * @param {String} redeemingOwner redeeming owner of paper
   * @param {String} redeemDateTime time paper was redeemed
  */
  async clearBank(ctx, issuer, paperNumber, redeemingOwner, redeemDateTime) {

    let paperKey = Transaction.makeKey([issuer, paperNumber]);

    let paper = await ctx.paperList.getPaper(paperKey);

    // Check paper is not REDEEMED
    if (paper.isRedeemed()) {
      throw new Error('Paper ' + issuer + paperNumber + ' already redeemed');
    }

    // Verify that the redeemer owns the commercial paper before redeeming it
    if (paper.getOwner() === redeemingOwner) {
      paper.setOwner(paper.getIssuer());
      paper.setRedeemed();
    } else {
      throw new Error('Redeeming owner does not own paper' + issuer + paperNumber);
    }

    await ctx.paperList.updatePaper(paper);
    return paper;
  }

}

module.exports = TransactionContract;
