import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/app/models/Asset";

// GET /api/assets
export async function GET() {
  try {
    await dbConnect();

    const assets = await Asset.find()
      .populate("template_id")
      .populate("assigned_to")
      .populate("created_by");

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
