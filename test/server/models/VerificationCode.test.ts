import * as mongoose from 'mongoose';
const expect = require('chai').expect;
import VerificationCode from "@models/VerificationCode";

require('dotenv').config()

describe('Verification code model', () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL_TEST);
  })

  it('generate verification code by phone number', async () => {

    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({phone: phoneNumber});

    expect(code).to.exist;
    expect(code.phone).to.be.equal(phoneNumber);
    expect(code.isActivated).to.be.false;
  })

  it('verify verification code', async () => {
    process.env.VERIFICATION_CODE_EXPIRY_SECONDS = '0';

    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({phone: phoneNumber});

    expect(code).to.exist;
    expect(code.isActivated).to.be.false;

    const verifiedCode = await VerificationCode.verify({phone: phoneNumber, code: code.code});
    expect(verifiedCode).to.exist;
    expect(verifiedCode.isActivated).to.be.true;
  })

  afterEach(async () => {
    await mongoose.disconnect();
  });
})
