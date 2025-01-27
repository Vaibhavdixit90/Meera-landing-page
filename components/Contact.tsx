"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function Contact() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState({
    sectionTitle: "",
    sectionDescription: "",
    email: "",
    phone: "",
  });

  // Fetch contact us data from API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/contact-us?populate=*",
        );
        const data = await response.json();

        if (data && data.data) {
          setContactInfo({
            sectionTitle: data.data.attributes.Section_Title,
            sectionDescription: data.data.attributes.Section_Description,
            email: data.data.attributes.Data.Email,
            phone: data.data.attributes.Data.Phone,
          });
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Reset errors
    setErrors({ fullName: "", email: "", message: "" });

    // Validate form fields
    let hasError = false;
    if (!fullName) {
      setErrors((prev) => ({ ...prev, fullName: "Full name is required." }));
      hasError = true;
    }
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      hasError = true;
    }
    if (!message) {
      setErrors((prev) => ({ ...prev, message: "Message is required." }));
      hasError = true;
    }

    if (hasError) {
      return; // Exit if there are validation errors
    }

    // Wrap the form data in a `data` object as expected by Strapi
    const formData = {
      data: {
        Full_Name: fullName,
        Email: email,
        Message: message,
      },
    };

    try {
      const response = await fetch("https://cms.flowautomate.io/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        toast.success("Thank you! We'll get back to you shortly.🚀");
        // Clear the form fields after submission
        setFullName("");
        setEmail("");
        setMessage("");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast.error("Please fill all the details.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="mx-auto mt-16 grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2 md:mt-28 md:px-6 md:py-20">
      <div className="relative flex flex-col items-start overflow-hidden">
        <h2 className="mt-9 bg-gradient-to-b from-neutral-800 to-neutral-900 bg-clip-text text-left text-3xl font-bold text-transparent dark:from-neutral-200 dark:to-neutral-300 md:text-5xl">
          {contactInfo.sectionTitle || "Contact us"}
        </h2>
        <p className="mt-8 max-w-lg text-left text-base text-neutral-600 dark:text-neutral-400">
          {contactInfo.sectionDescription ||
            "We are always looking for ways to improve our products and services. Contact us and let us know how we can help you."}
        </p>

        <div className="mt-10 flex items-center gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {contactInfo.email || ""}
          </p>

          <div className="h-1 w-1 rounded-full bg-neutral-500 dark:bg-neutral-400" />

          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {contactInfo.phone ? `+91 ${contactInfo.phone}` : ""}
          </p>
        </div>
        <div className="relative mt-20 hidden w-[600px] -translate-x-10 items-center justify-center [perspective:800px] [transform-style:preserve-3d] lg:flex lg:-translate-x-32">
          {/* Assuming Pin is a valid component */}
          <Pin className="right-1 top-0" />
          <Image
            src="https://assets.aceternity.com/pro/world.svg"
            width={500}
            loading="lazy"
            height={500}
            alt="world map"
            className="[transform:rotateX(45deg)_translateZ(0px)] dark:invert dark:filter"
          />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-b from-gray-100 to-gray-200 p-4 dark:from-neutral-900 dark:to-neutral-950 sm:p-10">
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300"
            htmlFor="name"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-10 w-full rounded-md border border-transparent bg-white pl-4 text-sm text-neutral-700 placeholder-neutral-500 shadow-input outline-none focus:outline-none focus:ring-2 focus:ring-neutral-800 active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="support@yoursaas.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border border-transparent bg-white pl-4 text-sm text-neutral-700 placeholder-neutral-500 shadow-input outline-none focus:outline-none focus:ring-2 focus:ring-neutral-800 active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            required
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border border-transparent bg-white pl-4 pt-4 text-sm text-neutral-700 placeholder-neutral-500 shadow-input outline-none focus:outline-none focus:ring-2 focus:ring-neutral-800 active:outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-500">{errors.message}</p>
          )}
        </div>
        <button
          className="relative z-10 flex items-center justify-center rounded-md border border-transparent bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#FFFFFF20_inset] transition duration-200 hover:bg-neutral-900 md:text-sm"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <ToastContainer
          position="top-right"
          autoClose={6000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          theme="light"
        />
      </div>
    </div>
  );
}

const Pin = ({ className }: { className?: string }) => {
  return (
    <motion.div
      style={{
        transform: "translateZ(1px)",
      }}
      className={cn(
        "pointer-events-none absolute z-[60] flex h-40 w-96 items-center justify-center opacity-100 transition duration-500",
        className,
      )}
    >
      <div className="h-full w-full">
        <div className="absolute inset-x-0 top-0 z-20 mx-auto inline-block w-fit rounded-lg bg-neutral-200 px-2 py-1 text-xs font-normal text-neutral-700 dark:bg-neutral-800 dark:text-white">
          We are here
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500"></span>
        </div>

        <div
          style={{
            perspective: "800px",
            transform: "rotateX(70deg) translateZ(0px)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,

                z: 0,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 4,
              }}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] dark:bg-sky-500/[0.2]"
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-blue-500 blur-[2px]" />
          <motion.div className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-blue-500" />
          <motion.div className="absolute bottom-1/2 right-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-blue-600 blur-[3px]" />
          <motion.div className="absolute bottom-1/2 right-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-blue-300" />
        </>
      </div>
    </motion.div>
  );
};
