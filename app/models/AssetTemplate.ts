import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAssetTemplate extends Document {
  name: string;
  created_by: mongoose.Types.ObjectId | IUser;
  fields: Record<string, unknown>;
  notes: string;
  created_at: Date;
}

const AssetTemplateSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  created_by: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  },
  fields: { 
    type: Schema.Types.Mixed,
    required: false
  },
  notes: { 
    type: String,
    required: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export default mongoose.models.AssetTemplate || mongoose.model<IAssetTemplate>('AssetTemplate', AssetTemplateSchema); 