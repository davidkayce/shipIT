import { Router, Request, Response } from 'express';
import { ModelHelpers } from '../convectorUtils';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    res.send(await ModelHelpers.getAllUsers());
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export const UserCtrl: Router = router;
