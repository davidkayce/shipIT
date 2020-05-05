import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class User extends ConvectorModel<User> {
  public static async getFromFingerprint(fingerprint: string) {
    const users = await User.query(User, {
      selector: {
        type: new User().type,
        identity: fingerprint
      }
    }) as User[];

    if (!users.length) throw new Error(`No user was found with fingerprint: ${fingerprint}`);
    return users[0];
  }

  @ReadOnly()
  @Required()
  public readonly type = 'com.clearit.user';

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

  @Required()
  @Validate(yup.string())
  public identity: string;
}