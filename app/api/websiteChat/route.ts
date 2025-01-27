import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../utils/verifyToken";
import axios from "axios";

const NEXT_PUBLIC_BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;
const NEXT_PUBLIC_JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET ||
  "NEXT_PUBLIC_JWT_SECRET not found in environment variables";

// Make sure NEXT_PUBLIC_JWT_SECRET is properly initialized and not undefined
if (!NEXT_PUBLIC_JWT_SECRET) {
  throw new Error(
    "NEXT_PUBLIC_JWT_SECRET is not defined. Please set it in your environment variables.",
  );
}
// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const tokenVerification = verifyToken(req, NEXT_PUBLIC_JWT_SECRET);
    // Handle cases where the token is invalid or missing
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { success: false, message: tokenVerification.message },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { leadId, userQuery } = body; // Extract leadId from the request body
    console.log("🚀 ~ POST ~ userQuery:", userQuery);
    console.log("🚀 ~ POST ~ leadId:", leadId);

    const leadResponse = await axios.get(
      `https://cms.flowautomate.io/api/leads/${leadId}?populate=conversation`,
      {
        // This is the config object where headers should be
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );
    console.log("🚀 ~ POST ~ leadResponse:", leadResponse.data);
    const summary = leadResponse.data.data.attributes.Summary;
    const conversation = leadResponse.data.data.attributes.conversation;

    const countUserChat = conversation.filter(
      (item: { from: string }) => item.from === "user",
    ).length;

    if (countUserChat === 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Conversation limit reached. Only 10 free conversation are allowed.",
        },
        { status: 200 },
      );
    }

    console.log("in_final_conversation");

    let allConversation = [...conversation];
    const conversationForLlm = await transformArray(allConversation);
    conversationForLlm.push({
      role: "user",
      content: userQuery, // Use the summary retrieved from the external API
    });

    console.log("conversationForLlm:", conversationForLlm);

    //user questions llm
    const llmBody = {
      model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      // model: "accounts/fireworks/models/llama-v3p1-405b-instruct",
      max_tokens: 16384,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0,
      messages: conversationForLlm,
    };

    // Make the API call to Fireworks AI
    const llmResponse = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      llmBody,
      {
        headers: {
          Authorization: "Bearer fw_3ZnUMW4w6qathxBZ2kjQeqvV",
          "Content-Type": "application/json",
        },
      },
    );
    console.log("🚀 ~ POST ~ llmResponse:", llmResponse.data);
    console.log(
      "responseCheck_data",
      llmResponse.data.choices[0].message.content,
    );

    const formattedLlmResponse = llmResponse.data.choices[0].message.content;
    console.log("🚀 ~ POST ~ formattedLlmResponse:", formattedLlmResponse);

    const newConversation = [
      {
        from: "user",
        message: userQuery,
      },
      {
        from: "assistant",
        message: formattedLlmResponse,
      },
    ];

    allConversation = [...allConversation, ...newConversation];
    console.log("🚀 ~ POST ~ allConversation:", allConversation);

    const updateConversation = await axios.put(
      `https://cms.flowautomate.io/api/leads/${leadId}`,
      {
        // This is the data payload (body of the PUT request)
        data: {
          conversation: allConversation,
        },
      },
      {
        // This is the config object containing headers
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );

    console.log("🚀 ~ POST ~ updateConversation:", updateConversation.data);
    return NextResponse.json(
      { success: true, newConversation },
      { status: 200 },
    );
    // }

    // return NextResponse.json({ success: true, data: existingChat }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

interface Message {
  from: string;
  message: string;
  id?: number; // 'id' is optional since we are not including it in the output
}

interface TransformedMessage {
  role: string;
  content: string; // Renamed from 'message' to 'content'
}

async function transformArray(
  inputArray: Message[],
): Promise<TransformedMessage[]> {
  // First map and await all the promises inside the map
  const mappedArray = await Promise.all(
    inputArray.map(async ({ id, from, message, ...rest }) => ({
      role: from, // Replace "from" with "role"
      content: message, // Rename 'message' to 'content'
      ...rest, // Spread the remaining key-value pairs
    })),
  );

  // Then filter out the "system" roles
  // return mappedArray.filter(item => item.role !== 'system');
  return mappedArray;
}

export async function GET(req: NextRequest) {
  try {
    const tokenVerification = verifyToken(req, NEXT_PUBLIC_JWT_SECRET);
    // Handle cases where the token is invalid or missing
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { success: false, message: tokenVerification.message },
        { status: 401 },
      );
    }
    // Extract the leadId from the request's URL
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { success: false, message: "leadId is required" },
        { status: 400 },
      );
    }

    // Make the GET request to the API
    const leadResponse = await axios.get(
      `https://cms.flowautomate.io/api/leads/${leadId}?populate=conversation`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );
    console.log("🚀 ~ GET ~ leadResponse:", leadResponse.data.data);

    const { conversation, ...formattedleadDataWithoutConversation } =
      leadResponse.data.data.attributes;

    const formattedleadData = {
      ...leadResponse.data.data,
      attributes: formattedleadDataWithoutConversation,
    };

    // Extract the conversation from the response
    const allConversation = leadResponse.data.data.attributes.conversation;
    const formattedConversations = await removeSystemMessages(allConversation);

    // Return the conversation in the response
    return NextResponse.json(
      {
        success: true,
        data: formattedleadData,
        conversation: formattedConversations.filteredConversation,
        remainingChats: formattedConversations.remainingChats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching conversation" },
      { status: 500 },
    );
  }
}

interface ConversationItem {
  id: number;
  from: string;
  message: string;
}

async function removeSystemMessages(
  conversation: ConversationItem[],
): Promise<{
  filteredConversation: ConversationItem[];
  userMessageCount: number;
  remainingChats: number;
}> {
  const MAX_USER_CHATS = 10;

  // Use Promise.all to handle async tasks inside the filter
  const filteredConversation = await Promise.all(
    conversation.map(async (item) => {
      if (item.from !== "system") {
        return item; // Include non-system messages
      }
      return null; // Exclude system messages
    }),
  );

  // Filter out the null values which represent the removed "system" messages
  const nonSystemMessages = filteredConversation.filter(
    (item) => item !== null,
  ) as ConversationItem[];

  // Calculate the number of messages where "from" is "user"
  const userMessageCount = nonSystemMessages.filter(
    (item) => item.from === "user",
  ).length;
  // Calculate the remaining number of chats allowed (limit is 10)
  const remainingChats = Math.max(MAX_USER_CHATS - userMessageCount, 0);

  return {
    filteredConversation: nonSystemMessages,
    userMessageCount,
    remainingChats,
  };
}
