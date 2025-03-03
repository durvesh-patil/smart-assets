import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/app/models/User';

const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY || 'admin-secret-key';

// POST request handler for admin registration
// curl -X POST http://localhost:3000/api/auth/admin/register \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "admin@example.com",
//     "password": "strong-admin-password",
//     "adminKey": "your-very-secure-key-here"
//   }'
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, adminKey } = await req.json();

    // Check if all details are provided
    if (!email || !password || !adminKey) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 403 }
      );
    }

    // Verify admin registration key
    if (adminKey !== ADMIN_REGISTRATION_KEY) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin registration key' },
        { status: 401 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      role: 'admin'
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 