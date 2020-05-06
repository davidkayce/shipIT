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

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public bolReference: string;

  @Required()
  @Validate(yup.number().min(0))
  public provisionalBill: number;

  @Default(0)
  @Validate(yup.string().min(0))
  public amountCharged: number;

  @ReadOnly()
  @Required()
  @Validate(yup.mixed().oneOf(["import", "export"]))
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
  @Validate(yup.number())
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
            amount: yup.number().required(),
            invoiceNo: yup.string().required(),
          })
      )
  )
  public invoices: any[];

  //Utils
  @Required()
  @Validate(yup.number())
  public updated: number;

  @Required()
  @Validate(yup.string())
  public updatedBy: string;

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
