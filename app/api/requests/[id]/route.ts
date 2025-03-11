import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Request, { RequestStatus, RequestType } from '@/app/models/Request';
import Asset from '@/app/models/Asset';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/requests/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const request = await Request.findById(id)
      .populate('employee', 'employeeNo fullName')
      .populate('transfer_to', 'employeeNo fullName')
      .populate('approved_by', 'employeeNo fullName')
      .populate('asset_template', 'name');
    
    if (!request) {
      return NextResponse.json({
        success: false,
        message: 'Request not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      request
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// PUT /api/requests/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    const updateData = await req.json();
    
    // Get the current request to check its type
    const currentRequest = await Request.findById(id);
    if (!currentRequest) {
      return NextResponse.json({
        success: false,
        message: 'Request not found'
      }, { status: 404 });
    }

    // If status is being updated to APPROVED
    if (updateData.status === RequestStatus.APPROVED) {
      updateData.approved_at = new Date();

      // Update asset assignment based on request type
      if (currentRequest.asset_id) {
        switch (currentRequest.request_type) {
          case RequestType.TRANSFER:
            // For transfer requests, assign the asset to the employee
            await Asset.findByIdAndUpdate(currentRequest.asset_id, {
              assigned_to: currentRequest.employee
            });
            break;
          case RequestType.RETURN:
            // For return requests, remove the assignment
            await Asset.findByIdAndUpdate(currentRequest.asset_id, {
              assigned_to: null
            });
            break;
          case RequestType.REPLACEMENT:
            // For replacement requests, assign the new asset to the employee
            await Asset.findByIdAndUpdate(currentRequest.asset_id, {
              assigned_to: currentRequest.employee
            });
            break;
        }
      }
    }
    
    // If status is being updated to COMPLETED, set completed_at
    if (updateData.status === RequestStatus.COMPLETED && !updateData.completed_at) {
      updateData.completed_at = new Date();
    }
    
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employee', 'employeeNo fullName')
     .populate('transfer_to', 'employeeNo fullName')
     .populate('approved_by', 'employeeNo fullName')
     .populate({
       path: 'asset_id',
       populate: {
         path: 'template_id',
         select: 'name fields'
       }
     });
    
    return NextResponse.json({
      success: true,
      request: updatedRequest
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// DELETE /api/requests/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const deletedRequest = await Request.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return NextResponse.json({
        success: false,
        message: 'Request not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 