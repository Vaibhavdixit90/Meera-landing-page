"use client";
import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CareerContact = () => {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState({
    Name: "",
    email: "",
    message: "",
    resume: "",
  });

  // State for holding the data fetched from the new API call
  const [careerData, setCareerData] = useState<any>(null);

  // API call to fetch career data
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/career?populate=*",
        );
        const data = await response.json();
        setCareerData(data.data.attributes); // Store the career section data in state
      } catch (error) {
        console.error("Error fetching career data:", error);
      }
    };

    fetchCareerData();
  }, []);

  const handleSubmit = async () => {
    // Reset errors
    setErrors({ Name: "", email: "", message: "", resume: "" });

    // Validate form fields
    let hasError = false;
    if (!Name) {
      setErrors((prev) => ({ ...prev, Name: "Your name is required." }));
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
    if (!resume) {
      setErrors((prev) => ({ ...prev, resume: "Resume is required." }));
      hasError = true;
    }

    if (hasError) {
      return; // Exit if there are validation errors
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        Name: Name,
        Email: email,
        Message: message,
      }),
    );
    if (resume) {
      formData.append("files.Resume", resume);
    }

    try {
      const response = await fetch(
        "https://cms.flowautomate.io/api/applications",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        toast.success("Thank you! We'll get back to you shortly.🚀");
        // Clear the form fields after submission
        setName("");
        setEmail("");
        setMessage("");
        setResume(null);
        if (resumeInputRef.current) {
          resumeInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast.error(
          "There was an error submitting the form. Please try again.",
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("There was an error submitting the form. Please try again.");
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-16">
          <div className="flex flex-col justify-between self-stretch">
            <div className="flex-1">
              <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
                {careerData?.Section_Title ||
                  "Hi there, Drop your details and We will get back to you."}
              </h2>
            </div>

            {/* Office details for large screens */}
            <div className="mt-8 hidden grid-cols-1 gap-8 sm:mt-12 sm:grid md:grid-cols-2 md:mt-auto">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest">
                  OFFICE Hours
                </h3>
                <p className="mt-2 text-sm font-medium sm:text-base">
                  {careerData?.Details?.Days || "Monday-Friday"}
                  <br />
                  {careerData?.Details?.Timing || "10:00 am to 6:00 pm"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest">
                  Our Address
                </h3>
                <p className="mt-2 text-sm font-medium sm:text-base">
                  {careerData?.Details?.Address || ""}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest">
                  Email
                </h3>
                <p className="mt-2 text-sm font-medium sm:text-base">
                  {careerData?.Details?.Email || ""}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-widest">
                  Get In Touch
                </h3>
                <p className="mt-2 text-sm font-medium sm:text-base">
                  {`+91 ${careerData?.Details?.Phone || ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border shadow-xl dark:border-white">
            <div className="p-4 sm:p-6 md:p-10">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium sm:text-base"
                  >
                    Your name
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Enter your full name"
                      className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none sm:text-base"
                      value={Name}
                    />
                    {errors.Name && (
                      <p className="mt-2 text-sm text-red-500">{errors.Name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium sm:text-base"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none sm:text-base"
                      value={email}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium sm:text-base"
                  >
                    Write your message
                  </label>
                  <div className="mt-2">
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      name="message"
                      id="message"
                      placeholder="Write us your question here..."
                      rows={4}
                      className="block w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none sm:text-base"
                      value={message}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="resume"
                    className="text-sm font-medium sm:text-base"
                  >
                    Upload your resume
                  </label>
                  <div className="mt-2">
                    <input
                      ref={resumeInputRef}
                      onChange={handleResumeChange}
                      type="file"
                      name="resume"
                      id="resume"
                      accept=".pdf, .doc, .docx, .xlsx, .pptx"
                      className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none sm:text-base"
                    />
                    {errors.resume && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.resume}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center rounded-xl bg-black px-12 py-3 text-center text-white dark:bg-[#1c1c1c] dark:text-gray-200 sm:px-14"
                  >
                    Send message
                  </button>
                </div>
              </div>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </div>

          {/* Office details for mobile */}
          <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-12 sm:hidden sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest">
                OFFICE Hours
              </h3>
              <p className="mt-2 text-sm font-medium sm:text-base">
                {careerData?.Details?.Days || "Monday-Friday"}
                <br />
                {careerData?.Details?.Timing || "10:00 am to 6:00 pm"}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest">
                Our Address
              </h3>
              <p className="mt-2 text-sm font-medium sm:text-base">
                {careerData?.Details?.Address || ""}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest">
                Email
              </h3>
              <p className="mt-2 text-sm font-medium sm:text-base">
                {careerData?.Details?.Email || ""}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest">
                Get In Touch
              </h3>
              <p className="mt-2 text-sm font-medium sm:text-base">
                {`+91 ${careerData?.Details?.Phone || ""}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerContact;
