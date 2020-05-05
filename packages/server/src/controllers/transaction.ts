import { Request, Response } from 'express';
import { controller, post, get, put } from './decorators';
import { TransactionControllerBackEnd } from '../convector';

@controller('/transaction')
export class Transaction {
  @get('/')
  private getTransactions = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await TransactionControllerBackEnd.getAllTransactions());
    } catch (ex) {
      res.status(500).send(ex);
    }
  };

  @get('/:id')
  private getATransaction = async (req: Request, res: Response) => {
    try {
      let params = req.params;
      res.status(200).send(await TransactionControllerBackEnd.getTransaction(params.id));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };

  @post('/create')
  private createTransaction = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(await TransactionControllerBackEnd.createTransaction(params.txn));
    } catch (ex) {
      res.status(500).send(ex);
    }
  };

  @post('/transfer')
  private transferTransaction = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(
        await TransactionControllerBackEnd
          .transferTransaction(params.txnId, params.receiverId, params.senderType)
      );
    } catch (ex) {
      res.status(500).send(ex);
    }
  };

  @put('/update')
  private updateTransaction = async (req: Request, res: Response) => {
    try {
      let params = req.body;
      res.status(200).send(
        await TransactionControllerBackEnd
          .updateTransaction(params.txnId, params.senderType, params.details)
      );
    } catch (ex) {
      res.status(500).send(ex);
    }
  };
}
