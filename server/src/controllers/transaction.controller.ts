import * as crypto from 'crypto';
import { Router, Request, Response } from 'express';
import {
  ModelHelpers,
  InitTransactionController,
  userCert,
  identity
} from '../convectorUtils';
import { InitServerIdentity } from '../convectorUtils/convectorControllers';

const router: Router = Router();

// To enroll default server identity
InitServerIdentity();

/** Get all the users */
router.get('/users', async (req: Request, res: Response) => {
  try {
    res.send(await ModelHelpers.getAllUsers());
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).send(err);
  }
});

/** Get all the transactions! */
router.get('/', async (req: Request, res: Response) => {
  try {
    res.send((await ModelHelpers.getAllTransactions()).reverse());
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).send(err);
  }
});

/** Get transaction history! */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let cntrl = await InitTransactionController();
    let result = await cntrl.getHistory(id);
    res.send(result);
  } catch (err) {
    console.log(err);
    if (err.code === 'EDOCMISSING') {
      res.send([]);
    } else {
      console.log(JSON.stringify(err));
      res.status(500).send(err);
    }
  }
});

/** Transfer the holder of the transaction in the value chain. */
router.post('/:id/transfer/', async (req: Request, res: Response) => {
  let { id } = req.params;
  let { to, reportHash, reportUrl, transportId } = req.body;

  try {
    let cntrl = await InitTransactionController();
    await cntrl.transfer(id, to, reportHash, reportUrl, transportId, Date.now());
    // Return the transaction after transfer
    res.send(await ModelHelpers.formatTransaction(await ModelHelpers.Transaction.getOne(id)));

  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).send(err);
  }
});

/** Insert one transaction. */
router.post('/', async (req: Request, res: Response) => {
  let { id, name } = req.body;

  const fId = id || crypto.randomBytes(16).toString('hex');

  try {
    let cntrl = await InitTransactionController();
    await cntrl.create(id, name, identity, Date.now());
    // Return the newly created transaction
    res.send(await ModelHelpers.formatTransaction(await ModelHelpers.Transaction.getOne(fId)));
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).send(err);
  }
});

export const TransactionCtrl: Router = router;
