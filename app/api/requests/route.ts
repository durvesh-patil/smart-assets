import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Request, { RequestType, RequestStatus } from "@/app/models/Request";

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
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status") as RequestStatus | null;
    const type = searchParams.get("type") as RequestType | null;

    // Build query based on parameters
    const query: QueryParams = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    if (type) query.request_type = type;

    const requests = await Request.find(query)
      .populate({
        path: "employee",
        model: "User",
        select: "email name role"
      })
      .populate({
        path: "transfer_to",
        model: "User",
        select: "email name role"
      })
      .populate({
        path: "approved_by",
        model: "User",
        select: "email name role"
      })
      .populate({
        path: "asset_id",
        model: "Asset",
        select: "name template_id data",
        populate: {
          path: "template_id",
          model: "AssetTemplate",
          select: "name fields"
        }
      })
      .sort({ created_at: -1 });
    // Transform the response to match the expected format
    const transformedRequests = requests.map((request) => {
      const obj = request.toObject();
      return {
        ...obj,
        asset: {
          ...obj.asset_id,
          template_id: obj.asset_id?.template_id || obj.asset_template
        },
        asset_id: obj.asset_id?._id // Keep only the ID reference
      };
    });

    return NextResponse.json(
      {
        success: true,
        requests: transformedRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/requests
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Create new request with required fields
    const request = await Request.create({
      request_type: body.request_type,
      status: RequestStatus.PENDING,
      employee: body.employee,
      asset_id: body.asset_id,
      asset_template: body.asset_template,
      reason: body.reason,
      notes: body.notes,
      transfer_to: body.transfer_to,
      replacement_reason: body.replacement_reason,
    });

    // Populate references for response
    const populatedRequest = await Request.findById(request._id)
      .populate({
        path: "employee",
        model: "User",
        select: "email name role"
      })
      .populate({
        path: "transfer_to",
        model: "User",
        select: "email name role"
      })
      .populate({
        path: "asset_id",
        model: "Asset",
        select: "name template_id data",
        populate: {
          path: "template_id",
          model: "AssetTemplate",
          select: "name fields"
        }
      });

    if (!populatedRequest) {
      throw new Error("Failed to create request");
    }

    // Transform the response to match the expected format
    const transformedRequest = {
      ...populatedRequest.toObject(),
      asset: {
        ...populatedRequest.asset_id,
        template_id: populatedRequest.asset_id?.template_id || populatedRequest.asset_template
      },
      asset_id: populatedRequest.asset_id?._id // Keep only the ID reference
    };

    return NextResponse.json(
      {
        success: true,
        request: transformedRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
