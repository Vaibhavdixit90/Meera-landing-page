import { NextResponse } from "next/server";
import axios from "axios";

// Function to generate a random OTP (4-digit)
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const NEXT_PUBLIC_BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY;
const NEXT_PUBLIC_BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;

// Ensure the required API keys are available
if (!NEXT_PUBLIC_BREVO_API_KEY || !NEXT_PUBLIC_BEARER_TOKEN) {
  throw new Error(
    "NEXT_PUBLIC_BREVO_API_KEY or NEXT_PUBLIC_BEARER_TOKEN is not defined. Please set them in your environment variables.",
  );
}

export async function POST(req: Request) {
  try {
    // Parse the request body to get the email
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "email cannot be null" },
        { status: 400 },
      );
    }

    // Step 1: Generate the OTP
    const otp = generateOTP();

    // Step 3: Check if the email exists in the otp-verifications API
    const otpCheckResponse = await axios.get(
      `https://cms.FlowAutomate.io/api/otp-verifications?filters[email_id][$eq]=${email}`,
      {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Step 4: If the email already exists in otp-verifications, update the OTP
    if (otpCheckResponse.data?.data?.length > 0) {
      const otpRecordId = otpCheckResponse.data.data[0].id; // Get the OTP record ID
      await axios.put(
        `https://cms.FlowAutomate.io/api/otp-verifications/${otpRecordId}`,
        {
          data: {
            OTP: otp, // Update the OTP
          },
        },
        {
          headers: {
            Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      // If the email does not exist in otp-verifications, create a new OTP record
      await axios.post(
        "https://cms.FlowAutomate.io/api/otp-verifications",
        {
          data: {
            email_id: email,
            OTP: otp,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${NEXT_PUBLIC_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Step 5: Send the OTP via email using Brevo
    const emailResponse = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "FlowAutomate",
          email: "operations@FlowAutomate.com", // Sender email
        },
        to: [
          {
            email: email, // Recipient's email
            name: "User", // Default recipient name
          },
        ],
        subject: "Your OTP Code",
        htmlContent: `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>FlowAutomate email</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
  
  

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
           
             <img
                  alt=""
                  src="https://cms.FlowAutomate.io/uploads/Flow_Automate_Favicon_faf4b373f6.png"
                  height="50px"
                />
                
                
                </br> </br>
           
           
           <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Your OTP
            </h1>
         
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Use the following OTP
              to complete the process. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
              Do not share this code with others.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #000;
              "
            >
              ${otp}
            </p>
          </div>
        </div>

    
      </main>

      

  </body>
</html>


`,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": NEXT_PUBLIC_BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("🚀 ~ POST ~ emailResponse:", emailResponse.data);

    // Return success if both the OTP storage/update and email sending succeed
    return NextResponse.json(
      { success: true, message: "OTP sent via email successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing request while sending the OTP", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing the request in send OTP",
        error: error,
      },
      { status: 500 },
    );
  }
}
