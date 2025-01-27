import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NEXT_PUBLIC_BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

export async function GET(req: NextRequest, { params }: { params: { leadId: string } }) {
  try {
    const { leadId } = params;

    if (!leadId) {
      return NextResponse.json(
        { error: { message: "Lead ID is required" } },
        { status: 400 }
      );
    }

    console.log("leadId-->", leadId);

    // Make the GET request to the API
    const leadDetailsResponse = await axios.get(
      `https://cms.flowautomate.io/api/leads/${leadId}`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    console.log("🚀 ~ GET ~ leadDetailsResponse:", leadDetailsResponse.data.data);

    const responseObject = {
      id: leadDetailsResponse.data.data.id,
      token: leadDetailsResponse.data.data.attributes.Token
    }
    console.log("responseObject",responseObject);
    
    return NextResponse.json(
      { success: true, data: responseObject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching lead details:", error);

    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}
