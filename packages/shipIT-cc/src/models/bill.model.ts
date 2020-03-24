import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Bill extends ConvectorModel<Bill> {
  @ReadOnly() 
  @Required()
  public readonly type = 'io.worldsibu.bill';

  @Required()
  @ReadOnly() // Meaning it cannot be changed once it is set
  @Validate(yup.string())
  public id: string;

  @Required() 
  @ReadOnly()
  @Validate(yup.string())
  public owner: string;

  @ReadOnly()
  @Required()
  @Validate(yup.number())
  public created: number;

  @Required()
  @Validate(yup.number())
  public modified: number;
}