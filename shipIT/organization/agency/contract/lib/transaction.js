'use strict';
const State = require('../../../shared/ledger-api/state.js');

// Enumerate state values
const trxnState = {
  ISSUED: 1,
  COMPLETE: 2,
};

// Transaction class extends State class which will be used
// by application and smart contract to define a transaction
class Transaction extends State {
  constructor(obj) {
    super(Transaction.getClass(), [obj.issuer, obj.id]);
    Object.assign(this, obj);
  }

  // Getters and setters for transaction details
  getIssuer () {
    return this.issuer;
  } 

  setIssuer (newIssuer) {
    return this.issuer = newIssuer;
  }

  getOwner () {
    return this.owner;
  }

  setOwner (newOwner) {
    return this.owner = newOwner;
  }

  // Useful methods to encapsulate transaction states
  setIssued () {
    return this.currentState = trxnState.ISSUED;
  }

  setCompleted () {
    return this.currentState = trxnState.COMPLETE;
  }

  // Useful methods to confirm transaction states
  isIssued () {
    return this.currentState === trxnState.ISSUED;
  }

  isCompleted () {
    return this.currentState === trxnState.COMPLETE;
  } 

  static fromBuffer(buffer) {
    return Transaction.deserialize(buffer);
  }

  toBuffer () {
    return Buffer.from(JSON.stringify(this));
  }

  /**
   * Deserialize a state data to transaction
   * @param {Buffer} data to form back into the object
   */
  static deserialize(data) {
    return State.deserializeClass(data, Transaction);
  }

  // Factory method to create a transacation
  static createInstance(issuer, bolReference, trxnType, formMNumber, provisionalBill, amountPaid, goodsDescription) {
    let issuedAt = Date.now();
    let id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb62';
    return new Transaction({
      id,
      issuer,
      bolReference,
      trxnType,
      formMNumber,
      provisionalBill,
      amountPaid,
      goodsDescription,
      issuedAt,
    });
  }

  static getClass() {
    return 'org.shipitnet.transaction';
  }
}

module.exports = Transaction;
