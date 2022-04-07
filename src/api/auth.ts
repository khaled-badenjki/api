import * as express from "express";
import VerificationCode from "../models/VerificationCode";

import sendSms from "../sms";

const router = express.Router();

interface RequestBody {
  phone: string;
}

router.post("/request-verification-code", async (req, res, next) => {
  try {
    const { phone } = req.body as RequestBody;
    const verificationCode = await VerificationCode.add({ phone });
    sendSms(phone, verificationCode.code);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
export default router;