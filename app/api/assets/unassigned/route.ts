import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/app/models/Asset";

// GET /api/assets/unassigned
export async function GET() {
  try {
    await dbConnect();

    const assets = await Asset.find({ assigned_to: null })
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
    console.error("Error fetching unassigned assets:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
} 