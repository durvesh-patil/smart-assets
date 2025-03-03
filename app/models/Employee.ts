import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeNo: number;
  fullName: string;
  joiningDate: string;
  resignDate: string;
  department: string;
  floor: string;
  emailId: string;
  skypeId: string;
}

const EmployeeSchema: Schema = new Schema({
  employeeNo: { 
    type: Number, 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  joiningDate: { 
    type: String, 
    required: true 
  },
  resignDate: { 
    type: String, 
    default: 'N/A' 
  },
  department: { 
    type: String, 
    required: true 
  },
  floor: { 
    type: String, 
    required: true 
  },
  emailId: { 
    type: String, 
    required: true 
  },
  skypeId: { 
    type: String, 
    default: 'N/A' 
  }
}, {
  timestamps: true
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema); 