import { Request, Response } from "express";
import { controller, post } from "./decorators";
import { TransactionControllerBackEnd } from '../convector';

@controller("/transaction")
export class Transaction {

  @post("/login")
  private login = (req: Request, res: Response): void => {
    res.send("Hey there, welcome to login page");
  }
}