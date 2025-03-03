import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssetTemplate from '@/app/models/AssetTemplate';

// GET /api/templates
export async function GET() {
  try {
    await dbConnect();
    
    const assetTemplates = await AssetTemplate.find()
      .populate('created_by');
    
    return NextResponse.json({
      success: true,
      assetTemplates
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
}

// POST /api/templates
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const templateData = await req.json();
    
    const newTemplate = await AssetTemplate.create(templateData);
    
    return NextResponse.json({
      success: true,
      assetTemplate: newTemplate
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 });
  }
} 