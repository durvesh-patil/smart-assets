import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    expires: 0 // This will automatically delete documents when they expire
  }
});

export default mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema); 