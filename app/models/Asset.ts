import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IEmployee } from './Employee';
import { IAssetTemplate } from './AssetTemplate';

export interface IAsset extends Document {
  created_by: mongoose.Types.ObjectId | IUser;
  assigned_to: mongoose.Types.ObjectId | IEmployee;
  template_id: mongoose.Types.ObjectId | IAssetTemplate;
  created_at: Date;
  last_updated_at: Date;
  data: Record<string, unknown>;
}

const AssetSchema: Schema = new Schema({
  name:{
    type: String,
  },
  created_by: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  },
  assigned_to: { 
    type: Schema.Types.ObjectId, 
    ref: 'Employee',
    required: false
  },
  template_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'AssetTemplate',
    required: false
  },
  data: { 
    type: Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'last_updated_at'
  }
});

export default mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema); 