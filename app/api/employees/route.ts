import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Employee from '@/app/models/Employee';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

// GET /api/employees
export async function GET() {
  try {
    await dbConnect();
    
    const employees = await Employee.find();
    
    return NextResponse.json({
      success: true,
      employees
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// POST /api/employees
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const employeeData = await req.json();
    
    // Create the employee
    const newEmployee = await Employee.create(employeeData);

    // Create a user account with the employee's email
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    await User.create({
      email: employeeData.emailId,
      password_hash: hashedPassword,
      role: 'user'
    });
    
    return NextResponse.json({
      success: true,
      employee: newEmployee
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 