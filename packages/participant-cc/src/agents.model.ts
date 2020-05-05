import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Agent extends ConvectorModel<Agent> {
  public static async getFromFingerprint(fingerprint: string) {
    const agents = await Agent.query(Agent, {
      selector: {
        type: new Agent().type,
        identity: fingerprint
      }
    }) as Agent[];

    if (!agents.length) throw new Error(`No agent was found with fingerprint: ${fingerprint}`);
    return agents[0];
  }

  @ReadOnly()
  @Required()
  public readonly type = 'com.clearit.agent';

  @ReadOnly()
  @Required()
  @Validate(yup.mixed().oneOf(['Agent', 'Bank', 'Customs']))
  public agentType: string;

  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public id: string;

  @Required()
  @Validate(yup.boolean())
  public isEnabled: boolean;

  @Validate(yup.string())
  public bankId: string;

  @Validate(yup.string())
  public crffnNumber: string;

  @Validate(yup.string())
  public customsOfficeCode: string;

  @Validate(yup.string())
  public customsOfficeName: string;

  @Required()
  @Validate(yup.string())
  public identity: string;
}