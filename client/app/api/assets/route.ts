import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/app/models/Asset";

// GET /api/assets
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const template_id = searchParams.get('template_id');

    // Build query
    const query = template_id ? { template_id } : {};

    const assets = await Asset.find(query)
      .populate({
        path: 'template_id',
        select: '_id name fields'
      })
      .populate('assigned_to', 'fullName')
      .populate('created_by', 'name')
      .sort({ created_at: -1 });

    return NextResponse.json(
      {
        success: true,
        assets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/assets
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { created_by, assigned_to, template_id, data } = await req.json();
    console.log(created_by, assigned_to, template_id, data);

    const newAsset = await Asset.create({
      created_by,
      assigned_to,
      template_id,
      data,
    });

    return NextResponse.json(
      {
        success: true,
        asset: newAsset,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
