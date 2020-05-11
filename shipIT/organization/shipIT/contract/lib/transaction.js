'use strict';
const State = require('../../../shared/ledger-api/state.js');

// Enumerate state values
const trxnState = {
  ISSUED: 1,
  BANK_CLEARED: 2,
  CUSTOMS_CLEARED: 3,
  PAID: 4,
  COMPLETE: 5
};

// Transaction class extends State class which will be used 
// by application and smart contract to define a paper
class Transaction extends State {
  constructor(obj) {
    super(Transaction.getClass(), [obj.issuer, obj.paperNumber]);
    Object.assign(this, obj);
  }

  // Getters and setters for transaction details
  getIssuer = () => this.issuer;

  setIssuer = newIssuer => this.issuer = newIssuer;

  getOwner = () => this.owner;

  setOwner = newOwner => this.owner = newOwner;

  // Useful methods to encapsulate transaction states
  setIssued = () => this.currentState = trxnState.ISSUED;

  setBankCleared = () => this.currentState = trxnState.BANK_CLEARED;

  setCustomsCleared = () => this.currentState = trxnState.CUSTOMS_CLEARED;

  setPaid = () => this.currentState = trxnState.PAID;

  setCompleted = () => this.currentState = trxnState.COMPLETE;

  // Useful methods to confirm transaction states
  isIssued = () => this.currentState === trxnState.ISSUED;

  isBankCleared = () => this.currentState === trxnState.BANK_CLEARED;
 
  isCustomsCleared = () => this.currentState === trxnState.CUSTOMS_CLEARED;

  isPaid = () => this.currentState === trxnState.PAID;

  isComplete = () => this.currentState === trxnState.COMPLETE;

  static fromBuffer(buffer) {
    return Transaction.deserialize(buffer);
  }

  toBuffer = () => Buffer.from(JSON.stringify(this));

  /**
   * Deserialize a state data to transaction
   * @param {Buffer} data to form back into the object
   */
  static deserialize(data) {
    return State.deserializeClass(data, Transaction);
  }

  // Factory method to create a transacation
  static createInstance(issuer, transactionID, issueAt, , faceValue) {
    return new Transaction({ issuer, paperNumber, issueDateTime, maturityDateTime, faceValue });
  }

  static getClass() {
    return 'org.shipitnet.transaction';
  }
}

module.exports = Transaction;

