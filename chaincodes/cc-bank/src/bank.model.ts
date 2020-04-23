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

export class Bank extends ConvectorModel<Bank> {
  
}
