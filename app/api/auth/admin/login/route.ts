import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Check if all details are provided
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 403 }
      );
    }

    // Find user and check if they are an admin
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials or not authorized' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Admin login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
        }
      }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
} 