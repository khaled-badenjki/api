import * as mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
})

export interface VerificationCodeDocument extends mongoose.Document {
  phone: string;
  code: string;
  isActivated: boolean;
  createdAt: Date;
  expiresAt: Date;
}

interface VerificationCodeModel extends mongoose.Model<VerificationCodeDocument> {
  add({ phone }: { phone: string }): Promise<VerificationCodeDocument>;
  verify({ phone, code }: { phone: string, code: string }): Promise<VerificationCodeDocument>;
}

class VerificationCodeClass extends mongoose.Model {
  public static async add({ phone }: { phone: string }): Promise<VerificationCodeDocument> {
    const verificationCode = new this({
      phone,
      code: Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 5)
    });
    return await verificationCode.save();
  }

  public static async verify({ phone, code }: { phone: string, code: string }): Promise<VerificationCodeDocument> {
    const verificationCode = await this.findOne({ phone, code, isActivated: false });
    if (!verificationCode) {
      throw new Error("Verification code is not found");
    }
    if (verificationCode.expiresAt < new Date()) {
      throw new Error("Verification code is expired");
    }
    verificationCode.isActivated = true;
    return await verificationCode.save();
  }
}

verificationCodeSchema.loadClass(VerificationCodeClass);

const VerificationCode = mongoose.model<VerificationCodeDocument, VerificationCodeModel>(
  "VerificationCode", verificationCodeSchema
);

export default VerificationCode;