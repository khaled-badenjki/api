import * as express from "express";
import VerificationCode from "@models/VerificationCode";

import sendSms from "@adapters/sms/console";

const router = express.Router();

interface RequestVerificationCodeRequestBody {
  phone: string;
}

interface VerifyVerificationCodeRequestBody {
  phone: string;
  code: string;
}

router.post("/request-verification-code", async (req, res, next) => {
  try {
    const { phone } = req.body as RequestVerificationCodeRequestBody;
    const verificationCode = await VerificationCode.add({ phone });
    sendSms(phone, verificationCode.code);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post("/verify-verification-code", async (req, res, next) => {
  try {
    const { phone, code } = req.body as VerifyVerificationCodeRequestBody;
    await VerificationCode.verify({ phone, code });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
export default router;