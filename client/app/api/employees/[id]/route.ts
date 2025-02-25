import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employee from '@/app/models/Employee';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/employees/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return NextResponse.json({
        success: false,
        message: 'Employee not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      employee
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// PUT /api/employees/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    const updateData = await req.json();
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEmployee) {
      return NextResponse.json({
        success: false,
        message: 'Employee not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      employee: updatedEmployee
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// DELETE /api/employees/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    
    if (!deletedEmployee) {
      return NextResponse.json({
        success: false,
        message: 'Employee not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 