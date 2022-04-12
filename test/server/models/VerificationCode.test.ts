import * as mongoose from 'mongoose';
import { expect } from 'chai'
import VerificationCode from "@models/VerificationCode";

require('dotenv-flow').config()

describe('Verification code model', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  })

  it('should allow to generate verification code by phone number', async () => {
    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({ phone: phoneNumber });

    expect(code).to.exist;
    expect(code.phone).to.be.equal(phoneNumber);
    expect(code.isActivated).to.be.false;
  })

  it('should allow to verify verification code', async () => {
    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({ phone: phoneNumber });

    expect(code).to.exist;
    expect(code.isActivated).to.be.false;

    const verifiedCode = await VerificationCode.verify({ phone: phoneNumber, code: code.code });
    expect(verifiedCode).to.exist;
    expect(verifiedCode.isActivated).to.be.true;
  })

  it('should fail to verify verification code if expired', async () => {
    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({ phone: phoneNumber });

    expect(code).to.exist;
    expect(code.isActivated).to.be.false;
    setTimeout(async () => {
      try {
        const verifiedCode = await VerificationCode.verify({ phone: phoneNumber, code: code.code });
        expect(verifiedCode).to.throw(new Error('Verification code is expired'))
        expect.fail();
      } catch (e) {
        expect(e.message).to.be.equal('Verification code is expired');
      }
    }, parseInt(process.env.VERIFICATION_CODE_EXPIRY_SECONDS));
  })

  it('should fail if verification code does not match phone number', async () => {
    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({ phone: phoneNumber });

    expect(code).to.exist;
    expect(code.isActivated).to.be.false;

    try {
      await VerificationCode.verify({ phone: '+84988888889', code: code.code });
      expect.fail();
    } catch (e) {
      expect(e.message).to.be.equal('Verification code is not found');
    }
  })

  after(async () => {
    await mongoose.disconnect();
  });
})
