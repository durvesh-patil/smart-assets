import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user', 'admin']
  }
}, {
  timestamps: true
});

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 