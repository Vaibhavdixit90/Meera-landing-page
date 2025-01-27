import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { Element } from "domhandler";
import jwt from "jsonwebtoken";
import Joi from "joi";

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

// Define Joi schema for validation
const schema = Joi.object({
  url: Joi.string().required().messages({
    "string.uri": "Invalid URL format",
    "any.required": "URL is required",
  }),
  name: Joi.string().min(2).required().messages({
    "string.min": "Name should be at least 2 characters long",
    "any.required": "Name is required",
  }),
  brief: Joi.string().min(5).required().messages({
    "string.min": "Brief should be at least 5 characters long",
    "any.required": "Brief is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  storefront: Joi.string().required().messages({
    "any.required": "Storefront is required",
  }),
  website_name: Joi.string().required().messages({
    "any.required": "website_name is required",
  }),
  otp: Joi.string().required().messages({
    "any.required": "otp is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
      "any.required": "Phone number is required",
    }),
});

interface LeadData {
  Store_front: string;
  Url: string;
  User_Name: string;
  Brief_Overview: string;
  Email: string;
  Phone: number;
  website_name: string;
}

const stripAndCleanContent = (
  element: Element,
  $: ReturnType<typeof cheerio.load>,
) => {
  const removeEmptyElementsAndClasses = (el: Element) => {
    $(el)
      .find("*")
      .each((i: number, elem: Element) => {
        const textContent = $(elem).text().trim();
        const hasChildren = $(elem).children().length > 0;
        const classAttribute = $(elem).attr("class")?.trim();

        // Remove elements with no text content and no children
        if (!textContent && !hasChildren) {
          $(elem).remove();
        }

        // Remove elements that have class attributes but no meaningful content
        if (!textContent && !hasChildren && classAttribute) {
          $(elem).remove();
        }

        // Remove elements that only have classes like icons, empty divs, or placeholders
        if (!textContent && classAttribute) {
          $(elem).remove();
        }
      });
  };

  // Recursively remove empty elements and elements with only classes
  let previousHtml = "";
  let currentHtml = $.html(element);

  // Clean the HTML until no more changes occur
  while (previousHtml !== currentHtml) {
    previousHtml = currentHtml;
    removeEmptyElementsAndClasses(element);
    currentHtml = $.html(element);
  }

  // Remove <a> and <img> tags
  $(element).find("a").remove();
  $(element).find("img").remove();

  // Return cleaned HTML, trimmed of excessive whitespace
  return $.html(element).replace(/\s+/g, " ").trim();
};

export async function POST(req: Request) {
  try {
    // Parse the request body to get the email and OTP
    const body = await req.json();

    // Validate the request body
    const { error, value } = schema.validate(body);

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 },
      );
    }

    const { url, name, brief, email, storefront, phone, otp, website_name } =
      value;
    // Step 1: Fetch stored OTP from FlowAutomate API
    const otpVerificationResponse = await axios.get(
      `https://cms.FlowAutomate.io/api/otp-verifications?filters[email_id][$eq]=${email}`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`, // Bearer token for FlowAutomate API
          "Content-Type": "application/json",
        },
      },
    );
    console.log("otp sent success");

    const storedOtpRecord = otpVerificationResponse.data?.data?.[0];
    const storedOtp = storedOtpRecord?.attributes?.OTP;
    const recordId = storedOtpRecord?.id; // Get the record ID for deletion later

    // If OTP doesn't exist
    if (!storedOtp) {
      return NextResponse.json(
        { success: false, message: "OTP not found for this email" },
        { status: 404 },
      );
    }

    // Step 2: Verify OTP
    if (storedOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 },
      );
    }

    // Step 3: OTP is valid, delete the record from FlowAutomate
    await axios.delete(
      `https://cms.FlowAutomate.io/api/otp-verifications/${recordId}`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("otp deleted from verification api");

    //Step 4: check if lead email already exists or not
    const emailCheckResponse = await axios.get(
      `https://cms.FlowAutomate.io/api/leads?filters[Email][$eq]=${email}`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(
      "🚀 ~ POST ~ emailCheckResponse:",
      emailCheckResponse.data?.data,
    );

    // If email already exists in leads API, return token and lead details
    if (emailCheckResponse.data?.data?.length > 0) {
      console.log("lead already exists");

      const leadId = emailCheckResponse.data?.data[0].id;
      console.log("🚀 ~ POST ~ leadId:", leadId);
      const leadData = emailCheckResponse.data?.data[0];
      console.log("🚀 ~ POST ~ leadData:", leadData);

      const jwtToken = jwt.sign(
        {
          leadId: leadId, // Assuming leadResponse has the lead's ID
          email: email,
        },
        NEXT_PUBLIC_JWT_SECRET, // Use secret to sign the token
        { expiresIn: "24h" }, // Token expiration time
      );

      //add token against the lead 
      const updatedTokenDetails = await axios.put(
        `https://cms.FlowAutomate.io/api/leads/${leadId}`,
        {
          // This is the data payload (body of the PUT request)
          data: {
            Token: jwtToken
          }, 
        },
        {
          headers: {
            Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
          },
        },
      );

      console.log("🚀 ~ POST ~ updatedTokenDetails:", updatedTokenDetails.data);

      return NextResponse.json(
        {
          success: true,
          message: "OTP verified and deleted successfully",
          data: leadData,
          token: jwtToken,
        },
        { status: 200 },
      );
    }

    const staticPromptData = await axios.get(
      `https://cms.FlowAutomate.io/api/prompts/1`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`, // Bearer token for FlowAutomate API
          "Content-Type": "application/json",
        },
      },
    );

    const staticPromptData1 =
      staticPromptData.data.data.attributes.System_before;
    console.log("🚀 ~ POST ~ staticPromptData1:", staticPromptData1);
    const staticPromptData2 =
      staticPromptData.data.data.attributes.System_after;
    console.log("🚀 ~ POST ~ staticPromptData2:", staticPromptData2);

    const secondPromptData = `\n User name: ${name} \n Storefront: ${storefront} \n Email: ${email} \n Website name: ${website_name} \n Store description: ${brief} \n \n`;

    //Step 6 : store lead deatils
    const leadData: LeadData = {
      Store_front: storefront,
      Url: url,
      User_Name: name,
      Brief_Overview: brief,
      Email: email,
      Phone: phone,
      website_name: website_name,
    };

    const leadResponse = await postLeadData(leadData);
    const leadId = leadResponse.data.id;
    console.log("🚀 ~ POST ~ leadId:", leadId);

    //store system context data as a first conversation
    const addFirstConversation = await axios.put(
      `https://cms.FlowAutomate.io/api/leads/${leadId}`,
      {
        data: {
          conversation: [
            {
              from: "system",
              message: `${staticPromptData1} ${secondPromptData} ${staticPromptData2}`,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );
    console.log("🚀 ~ POST ~ addFirstConversation:", addFirstConversation.data);

    //hit llm
    // Make the API call to Fireworks AI - 1
    const llmBody = {
      model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
      max_tokens: 16384,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `${staticPromptData1} ${secondPromptData} ${staticPromptData2}`,
        },
      ],
    };

    const assistantResponse = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      llmBody,
      {
        headers: {
          Authorization: "Bearer fw_3ZnUMW4w6qathxBZ2kjQeqvV",
          "Content-Type": "application/json",
        },
      },
    );

    const leadConversationResponse = await axios.get(
      `https://cms.FlowAutomate.io/api/leads/${leadId}?populate=conversation`,
      {
        // This is the config object where headers should be
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );

    const conversation =
      leadConversationResponse.data.data.attributes.conversation;
    let allConversation = [...conversation];
    const formattedAssistantResponse =
      assistantResponse.data.choices[0].message.content;

    const newConversation = [
      {
        from: "assistant",
        message: formattedAssistantResponse,
      },
    ];

    allConversation = [...allConversation, ...newConversation];

    const addSecondConversation = await axios.put(
      `https://cms.FlowAutomate.io/api/leads/${leadId}`,
      {
        // This is the data payload (body of the PUT request)
        data: {
          conversation: allConversation,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );
    console.log(
      "🚀 ~ POST ~ addSecondConversation:",
      addSecondConversation.data,
    );

    const jwtToken = jwt.sign(
      {
        leadId: leadId, // Assuming leadResponse has the lead's ID
        email: email,
      },
      NEXT_PUBLIC_JWT_SECRET, // Use secret to sign the token
      { expiresIn: "24h" }, // Token expiration time
    );

    //add token against the lead 
    const updatedTokenDetails = await axios.put(
      `https://cms.FlowAutomate.io/api/leads/${leadId}`,
      {
        // This is the data payload (body of the PUT request)
        data: {
          Token: jwtToken
        }, 
      },
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );

    console.log("🚀 ~ POST ~ updatedTokenDetails:", updatedTokenDetails.data);

    // Return success if OTP matches and record is deleted
    return NextResponse.json(
      {
        success: true,
        message: "OTP verified and deleted successfully",
        data: leadResponse.data,
        token: jwtToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying or deleting OTP:", error);
    return NextResponse.json(
      { success: false, message: "Error processing the request", error: error },
      { status: 500 },
    );
  }
}

const postLeadData = async (data: LeadData) => {
  try {
    const response = await axios.post(
      "https://cms.FlowAutomate.io/api/leads",
      {
        data: {
          // This is the data payload (the body of the POST request)
          Store_front: data.Store_front,
          Url: data.Url,
          User_Name: data.User_Name,
          Brief_Overview: data.Brief_Overview,
          Email: data.Email,
          Phone: data.Phone,
          website_name: data.website_name,
        },
      },
      {
        // This is the config object where headers should be
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      },
    );

    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting lead data:", error);
    return error;
  }
};
