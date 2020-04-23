import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core';

// tslint:disable-next-line:class-name
export interface x509Identities {
  status: boolean;
  fingerprint: string;
}

export const x509Identities = yup.object<x509Identities>().shape({
  status: yup.boolean().required(),
  fingerprint: yup.string().required()
});

export class User extends ConvectorModel<Participant> {

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public email: string;

  @ReadOnly()
  @Validate(yup.string())
  public phone: string;


  @ReadOnly()
  @Validate(yup.string())
  public address: string;

  // Provide unique identities for users 
  @Validate(yup.array(x509Identities))
  public identities: x509Identities[];

  activeIdentity() {
    return this.identities.find(identity => identity.status === true);
  }
}
