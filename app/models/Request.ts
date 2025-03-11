import mongoose, { Schema, Document } from 'mongoose';
import { IEmployee } from './Employee';
import { IAssetTemplate } from './AssetTemplate';

export enum RequestType {
  REPLACEMENT = 'replacement',
  TRANSFER = 'transfer',
  RETURN = 'return'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IRequest extends Document {
  request_type: RequestType;
  status: RequestStatus;
  employee: mongoose.Types.ObjectId | IEmployee;
  asset_id: string;
  asset_template: mongoose.Types.ObjectId | IAssetTemplate;
  reason: string;
  notes?: string;
  // For transfer requests
  transfer_to?: mongoose.Types.ObjectId | IEmployee;
  // For replacement requests
  replacement_reason?: string;
  // Common fields
  approved_by?: mongoose.Types.ObjectId | IEmployee;
  approved_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const RequestSchema: Schema = new Schema({
  request_type: { 
    type: String,
    enum: Object.values(RequestType),
    required: true 
  },
  status: { 
    type: String,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING,
    required: true 
  },
  employee: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  asset_id: { 
    type: String,
    required: true 
  },
  asset_template: {
    type: Schema.Types.ObjectId,
    ref: 'AssetTemplate',
  },
  reason: { 
    type: String,
    required: true 
  },
  notes: { 
    type: String,
    required: false 
  },
  // For transfer requests
  transfer_to: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  // For replacement requests
  replacement_reason: { 
    type: String,
    required: false 
  },
  // Common fields
  approved_by: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  approved_at: { 
    type: Date,
    required: false 
  },
  completed_at: { 
    type: Date,
    required: false 
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Add index for common queries
RequestSchema.index({ employee: 1, status: 1 });
RequestSchema.index({ asset_id: 1 });
RequestSchema.index({ status: 1, created_at: -1 });

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema); 