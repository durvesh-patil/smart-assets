import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssetTemplate from '@/app/models/AssetTemplate';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/templates/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const template = await AssetTemplate.findById(id)
      .populate('created_by');
    
    if (!template) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      assetTemplate: template
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// PUT /api/templates/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    const updateData = await req.json();
    
    const updatedTemplate = await AssetTemplate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTemplate) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      assetTemplate: updatedTemplate
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// DELETE /api/templates/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const deletedTemplate = await AssetTemplate.findByIdAndDelete(id);
    
    if (!deletedTemplate) {
      return NextResponse.json({
        success: false,
        message: 'Template not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 