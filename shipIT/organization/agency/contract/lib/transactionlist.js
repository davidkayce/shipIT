'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../../shared/ledger-api/statelist.js');
const Transaction = require('./transaction.js');

class TransactionList extends StateList {

  constructor(ctx) {
    super(ctx, 'org.shipitnet.transactionlist');
    this.use(Transaction);
  }

  async addTransaction(transaction) {
    return this.addState(transaction);
  }

  async getTransaction(transactionKey) {
    return this.getState(transactionKey);
  }

  async updateTransaction(transaction) {
    return this.updateState(transaction);
  }
}


module.exports = TransactionList;