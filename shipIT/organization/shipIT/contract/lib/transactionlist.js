'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../../shared/ledger-api/statelist.js');
const Transaction = require('./transaction.js');

class TransactionList extends StateList {

  constructor(ctx) {
    super(ctx, 'org.shipitnet.transactionlist');
    this.use(Transaction);
  }

  async addTransaction(paper) {
    return this.addState(paper);
  }

  async getTransaction(paperKey) {
    return this.getState(paperKey);
  }

  async updateTransaction(paper) {
    return this.updateState(paper);
  }
}


module.exports = TransactionList;