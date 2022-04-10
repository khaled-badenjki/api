import * as mongoose from 'mongoose';
import VerificationCode from "@models/VerificationCode";

require('dotenv').config()

describe('Verification code model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL_TEST);
  })

  test('generate verification code by phone number', async () => {

    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({phone: phoneNumber});

    expect(code).toBeTruthy();
    expect(code.phone).toBe(phoneNumber);
    expect(code.isActivated).toBeFalsy();
  })

  test('verify verification code', async () => {
    const phoneNumber = '+84988888888';
    const code = await VerificationCode.add({phone: phoneNumber});

    expect(code).toBeTruthy();
    expect(code.isActivated).toBeFalsy();

    const verifiedCode = await VerificationCode.verify({phone: phoneNumber, code: code.code});
    expect(verifiedCode).toBeTruthy();
    expect(verifiedCode.isActivated).toBeTruthy();
  })

  afterAll(async () => {
    await mongoose.disconnect();
  });
})
