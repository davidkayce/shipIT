import * as crypto from 'crypto';
import { Router, Request, Response } from 'express';
import {
  ModelHelpers, userCert, identity, User
} from '../convectorUtils';
import { InitServerIdentity, InitUserController } from '../convectorUtils/convectorControllers';

const router: Router = Router();

/** Get all the transactions */
router.get('/', async (req: Request, res: Response) => {
  try {
    const resGet = await (await InitUserController()).get(identity);
    const serverIdentity = new User(resGet).toJSON();
    res.send(serverIdentity);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export const ServerCtrl: Router = router;
