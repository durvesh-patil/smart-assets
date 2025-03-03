import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Asset from '@/app/models/Asset';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/assets/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const asset = await Asset.findById(id)
      .populate('template_id')
      .populate('assigned_to')
      .populate('created_by');
    
    if (!asset) {
      return NextResponse.json({
        success: false,
        message: 'Asset not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      asset
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// PUT /api/assets/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    const updateData = await req.json();
    
    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAsset) {
      return NextResponse.json({
        success: false,
        message: 'Asset not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      asset: updatedAsset
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// DELETE /api/assets/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const deletedAsset = await Asset.findByIdAndDelete(id);
    
    if (!deletedAsset) {
      return NextResponse.json({
        success: false,
        message: 'Asset not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 