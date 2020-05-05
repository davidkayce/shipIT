import * as yup from "yup";
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate,
} from "@worldsibu/convector-core-model";

export class Transaction extends ConvectorModel<Transaction> {
  @ReadOnly()
  @Required()
  public readonly type = "com.clearit.transaction";

  invoiceNo;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public bolReference: string;

  @ReadOnly()
  @Required()
  @Validate(yup.mixed().oneOf(["Import", "Export"]))
  public trxnType: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public formMNumber: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public vesselNumber: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public containerNumber: string;

  @Required()
  @Validate(yup.integer())
  public numberOfContainers: number;

  @ReadOnly()
  @Validate(yup.string())
  public exporterName: string;

  @ReadOnly()
  @Validate(yup.string())
  public exporterAddress: string;

  @Required()
  @Validate(yup.string())
  public goodsDescription: string;

  @Validate(
    yup
      .array()
      .of(
        yup
          .object()
          .shape({
            biller: yup.string().required(),
            amount: yup.integer().required(),
            invoiceNo: yup.string().required(),
          })
      )
  )
  public invoices: any[];

  //Utils
  @Required()
  @Validate(yup.number())
  /** Date in which it was modified. */
  public modified: number;

  @Required()
  @Validate(yup.string())
  /** Last user that modified it. */
  public modifiedBy: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public createdBy: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public handledBy: string;
}
