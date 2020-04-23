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

export class Participant extends ConvectorModel<Participant> {
  @ReadOnly()
  public readonly type = 'io.worldsibu.examples.participant';

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Validate(yup.string())
  public msp: string;

  @Validate(yup.array(x509Identities))
  public identities: x509Identities[];

  activeIdentity() {
    return this.identities.find(identity => identity.status === true);
  }
}
