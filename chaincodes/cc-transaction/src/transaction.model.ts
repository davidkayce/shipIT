import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate,
} from '@worldsibu/convector-core';

export class Transaction extends ConvectorModel<Transaction> {

  @ReadOnly()
  @Required()
  @Validate(yup.integer())
  public registryNumber: number;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public exporterName: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public exporterAddress: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public consigneeName: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public consigneeAddress: string;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public notifySegmentAddress: string;

  @Required()
  @Validate(yup.string())
  public goodsDescription: string;

  @Required()
  @Validate(yup.integer())
  public numberOfContainers: number;

  @Required()
  @Validate(yup.integer())
  public grossMassManifested: number;

  @Validate(yup.string())
  public bolReference: string;

  @Validate(yup.string())
  public bolTypeSegmentCode: string;

  @Validate(yup.integer())
  public bolNature: number;

  // Customs

  @Validate(yup.string())
  public customsOfficeCode: string;

  @Validate(yup.string())
  public customsOfficeName: string;

  @Validate(yup.integer())
  public lineNumber: number;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfLoadingCode: string;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfLoadingName: string;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfLoadingRegion: string;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfUnloadingCode: string;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfUnloadingName: string;

  @ReadOnly()
  @Validate(yup.string())
  public placeOfUnloadingRegion: string;

  @ReadOnly()
  @Validate(yup.string())
  public packageTypeCode: string;

  @ReadOnly()
  @Validate(yup.string())
  public packageTypeName: string;

  @ReadOnly()
  @Validate(yup.integer())
  public numberOfPackages: number;

  @ReadOnly()
  @Validate(yup.string())
  public referenceKey: string;

  @ReadOnly()
  @Validate(yup.integer())
  public manifestID: number;

  @Validate(yup.integer())
  public manifestStageID: string;
  

  //Utils

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
  /** Unmodifiable date of creation. Default will be the date when created the object. */
  public created: number;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  /** Unmodifiable creator in the network. Default will be the cert requesting the creation in the controller. */
  public createdBy: string;
}
