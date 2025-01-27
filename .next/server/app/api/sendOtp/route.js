"use strict";(()=>{var e={};e.id=761,e.ids=[761],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},85209:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>x,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>f,serverHooks:()=>g,staticGenerationAsyncStorage:()=>h});var o={};a.r(o),a.d(o,{POST:()=>c});var i=a(49303),s=a(88716),r=a(60670),n=a(87070),p=a(29712);let l=()=>Math.floor(1e3+9e3*Math.random()).toString(),d="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",u="0e641b7faad4611cef662526bd805434bef849f0d50a0248f1fb6c55ef756e374332ec1b5739293dd4413afa2d2569d96c1a723bfc1555b080253de663f4a242125e2b558ff264205a28ede838cc6f09bc9a35e266cbb924fa0f35c4791971c39b52933645bef31a20ddf3170156778d7059d79a7241515302669fe80b0af37c";if(!d||!u)throw Error("NEXT_PUBLIC_BREVO_API_KEY or NEXT_PUBLIC_BEARER_TOKEN is not defined. Please set them in your environment variables.");async function c(e){try{let{email:t}=await e.json();if(!t)return n.NextResponse.json({success:!1,message:"email cannot be null"},{status:400});let a=l(),o=await p.Z.get(`https://cms.FlowAutomate.io/api/otp-verifications?filters[email_id][$eq]=${t}`,{headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}});if(o.data?.data?.length>0){let e=o.data.data[0].id;await p.Z.put(`https://cms.FlowAutomate.io/api/otp-verifications/${e}`,{data:{OTP:a}},{headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}})}else await p.Z.post("https://cms.FlowAutomate.io/api/otp-verifications",{data:{email_id:t,OTP:a}},{headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}});let i=await p.Z.post("https://api.brevo.com/v3/smtp/email",{sender:{name:"FlowAutomate",email:"operations@FlowAutomate.com"},to:[{email:t,name:"User"}],subject:"Your OTP Code",htmlContent:`
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
              ${a}
            </p>
          </div>
        </div>

    
      </main>

      

  </body>
</html>


`},{headers:{accept:"application/json","api-key":d,"Content-Type":"application/json"}});return console.log("\uD83D\uDE80 ~ POST ~ emailResponse:",i.data),n.NextResponse.json({success:!0,message:"OTP sent via email successfully"},{status:200})}catch(e){return console.error("Error processing request while sending the OTP",e),n.NextResponse.json({success:!1,message:"Error processing the request in send OTP",error:e},{status:500})}}let f=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/sendOtp/route",pathname:"/api/sendOtp",filename:"route",bundlePath:"app/api/sendOtp/route"},resolvedPagePath:"/Users/vaibhavdixit/Documents/meera-landing/app/api/sendOtp/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:h,serverHooks:g}=f,x="/api/sendOtp/route";function b(){return(0,r.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:h})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),o=t.X(0,[948,435],()=>a(85209));module.exports=o})();