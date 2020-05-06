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

  @Required()
  @Validate(yup.boolean())
  public isEnabled: boolean;

  @Validate(yup.string())
  public name: string;

  @Validate(yup.string())
  public company: string;

  @Validate(yup.string())
  public crffnNumber: string;

  @Validate(yup.string())
  public registrationNumber: string;


  @Required()
  @Validate(yup.string().oneOf(['percent', 'flat']))
  public surchargeType: string;

  @Required()
  @Validate(yup.string().oneOf(['percent', 'flat']))
  public surchargeAmount: string;

  @Required()
  @Validate(yup.string().oneOf(['percent', 'flat']))
  public surchargePercent: string;

  @Required()
  @Validate(yup.string())
  public identity: string;
}