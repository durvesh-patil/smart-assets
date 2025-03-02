import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Request, { RequestType, RequestStatus } from '@/app/models/Request';

interface QueryParams {
  employee?: string;
  status?: RequestStatus;
  request_type?: RequestType;
}

// GET /api/requests
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status') as RequestStatus | null;
    const type = searchParams.get('type') as RequestType | null;

    // Build query based on parameters
    const query: QueryParams = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    if (type) query.request_type = type;

    const requests = await Request.find(query)
      .populate('employee', 'employeeNo fullName')
      .populate('transfer_to', 'employeeNo fullName')
      .populate('approved_by', 'employeeNo fullName')
      .populate('asset_template', 'name')
      .sort({ created_at: -1 });
    
    return NextResponse.json({
      success: true,
      requests
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// POST /api/requests
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Create new request
    const request = await Request.create(body);
    
    // Populate references for response
    const populatedRequest = await request
      .populate('employee', 'employeeNo fullName')
      .populate('transfer_to', 'employeeNo fullName')
      .populate('asset_template', 'name')
      .execPopulate();

    return NextResponse.json({
      success: true,
      request: populatedRequest
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 