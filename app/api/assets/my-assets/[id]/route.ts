import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/app/models/Asset";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/assets/my-assets/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    // Find assets assigned to the employee
    const assets = await Asset.find({ assigned_to: id })
      .populate({
        path: 'template_id',
        select: '_id name fields'
      })
      .sort({ created_at: -1 });

    return NextResponse.json(
      {
        success: true,
        assets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching employee assets:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Server error'
      },
      { status: 500 }
    );
  }
} 