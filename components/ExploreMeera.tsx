"use client";
import React, { useEffect, useRef, useState } from "react";
import MeeraChat from "./MeeraChat";
import { MultiStepLoaderDemo } from "./MultiStepLoaderDemo";
import { Logo } from "./logo";
import ChatAccordion from "./ChatAccordion";
import Link from "next/link";

const ExploreMeera = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState("");
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [formData, setFormData] = useState({
    name: "",
    storeUrl: "",
    description: "",
    websiteName: "",
    storefront: "",
    email: "",
    phone: "",
    otp: "",
  });
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<any>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchSectionTitle = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/explore-meera",
        );
        const data = await response.json();
        const sectionTitle = data?.data?.attributes?.Section_Title;
        if (sectionTitle) {
          setSectionTitle(sectionTitle);
        }
      } catch (error) {
        console.error("Error fetching section title:", error);
      }
    };

    fetchSectionTitle();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;

    const maxLength = 10;
    if (id === "phone") {
      if (
        (/^[\d-]*$/.test(value) || value === "") &&
        value.length <= maxLength
      ) {
        setFormData((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleNextClick = () => {
    setIsFormVisible(true);
  };

  const handleVerifyEmail = async () => {
    if (formData.email) {
      try {
        const response = await fetch(`/api/sendOtp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        });

        if (response.ok) {
          setIsOtpVisible(true);
          setOtpStatusMessage("OTP has been sent to your email.");
        } else {
          setOtpStatusMessage("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setOtpStatusMessage("Error sending OTP. Please check your connection.");
      }
    }
  };

  const isVerifyButtonDisabled = () => {
    return (
      !formData.phone ||
      !formData.name ||
      !formData.storeUrl ||
      !formData.description ||
      !formData.websiteName ||
      !formData.storefront ||
      !formData.email
    );
  };

  const isSubmitButtonDisabled = () => {
    return !formData.otp || isSubmitted;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const submitData = {
      otp: formData.otp,
      url: formData.storeUrl,
      name: formData.name,
      brief: formData.description,
      website_name: formData.websiteName,
      email: formData.email,
      storefront: formData.storefront,
      phone: formData.phone,
    };

    try {
      const response = await fetch(`/api/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success && responseData.data) {
          const { id } = responseData.data;
          const { token: newToken } = responseData;

          localStorage.setItem("token", newToken);
          localStorage.setItem("id", id);

          setSuccess(true);
        }
      } else {
        setOtpStatusMessage("Check the OTP you entered.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitted(false);
    }
  };

  const showdata = async () => {
    try {
      const storedLeadId = localStorage.getItem("id");
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`/api/websiteChat?leadId=${storedLeadId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        if (res.success) {
          setData(res);
        } else {
          console.error("Failed to fetch conversation:", res);
        }
      } else {
        localStorage.clear();
        setSuccess(false);
        console.error("Response not OK:", await response.text());
      }
    } catch (error) {
      localStorage.clear();
      setSuccess(false);
      console.error("Error fetching conversation:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLeadId = localStorage.getItem("id");
      const storedToken = localStorage.getItem("token");
      setLeadId(storedLeadId);
      setToken(storedToken);

      if (storedLeadId && storedToken) {
        setSuccess(true);
        showdata();
      }
    }
  }, []);

  useEffect(() => {
    if (success) {
      showdata();
    }
  }, [success]);

  const handleScroll = (id: string) => {
    messageRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (data?.conversation?.length > 1 && messageRefs.current) {
      handleScroll(data.conversation[data.conversation.length - 2]?.id);
    }
  }, [data]);

  return (
    <div className="flex h-screen w-full flex-col justify-between bg-white lg:flex-row">
      {!isSubmitted ? (
        <>
          <div
            className={`m-4 flex flex-col items-center bg-white sm:w-96 lg:w-[30%] lg:flex-col 2xl:w-[28%] ${
              success ? "hidden lg:block" : ""
            }`}
          >
            {" "}
            {!success ? (
              <>
                {!isFormVisible && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4 lg:hidden">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="flex w-full justify-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800">
                          <svg
                            className="h-5 w-auto text-white"
                            viewBox="0 0 33 23"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M32.0011 4.7203L30.9745 0C23.5828 0.33861 18.459 3.41404 18.459 12.4583V22.8687H31.3725V9.78438H26.4818C26.4819 6.88236 28.3027 5.17551 32.0011 4.7203Z" />
                            <path d="M13.5421 4.7203L12.5155 0C5.12386 0.33861 0 3.41413 0 12.4584V22.8687H12.914V9.78438H8.02029C8.02029 6.88236 9.84111 5.17551 13.5421 4.7203Z" />
                          </svg>
                        </div>
                      </div>

                      {/* Title - Centered */}
                      <h1 className="text-left text-xl font-semibold text-black">
                        {sectionTitle}
                      </h1>
                      <div className="flex w-full justify-start">
                        <button
                          type="button"
                          className="rounded-lg bg-black px-10 py-2 text-white"
                          onClick={handleNextClick}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {(isFormVisible || !isFormVisible) && (
                  <div
                    className={`w-96 flex-1 rounded-2xl bg-white bg-opacity-90 p-4 shadow-lg lg:w-full lg:p-6 ${!isFormVisible ? "hidden lg:block" : "mt-5"}`}
                  >
                    <Logo UseLightOnly={true} />
                    <hr className="mb-2 mt-7 border-gray-300" />
                    {/* form */}
                    <h1 className="my-3 text-left text-sm font-bold uppercase text-black xl:mb-5 xl:text-xl">
                      your Bussinees Details
                    </h1>
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 2xl:mt-2"
                    >
                      {/* Name and Phone Fields */}
                      <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1">
                          <label
                            htmlFor="name"
                            className="mb-1 block text-left text-sm font-normal text-black"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                          />
                        </div>
                        <div className="mt-1 flex-1 md:mt-0">
                          <label
                            htmlFor="phone"
                            className="mb-1 block text-left text-sm font-normal text-black"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            placeholder="123-456-7890"
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                            pattern="[0-9]*"
                            inputMode="numeric"
                          />
                        </div>
                      </div>

                      {/* Store URL and Store Front Fields */}
                      <div className="mt-1 flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1">
                          <label
                            htmlFor="storeUrl"
                            className="mb-1 block text-left text-sm font-normal text-black"
                          >
                            URL of Store
                          </label>
                          <input
                            type="text"
                            id="storeUrl"
                            placeholder="https://yourstore.com"
                            value={formData.storeUrl}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                          />
                        </div>
                        <div className="mt-1 flex-1 md:mt-0">
                          <label
                            htmlFor="storefront"
                            className="mb-1 block text-left text-sm font-normal text-black"
                          >
                            Store Front
                          </label>
                          <select
                            id="storefront"
                            value={formData.storefront}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            <option value="woocommerce">WooCommerce</option>
                            <option value="shopify">Shopify</option>
                          </select>
                        </div>
                      </div>
                      {/* website name  */}
                      <div className="mt-1">
                        <label
                          htmlFor="websiteName"
                          className="mb-1 block text-left text-sm font-normal text-black"
                        >
                          Website Name
                        </label>
                        <input
                          type="text"
                          id="websiteName"
                          placeholder="website Name"
                          value={formData.websiteName}
                          onChange={handleChange}
                          className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                          required
                          disabled={isSubmitted}
                        />
                      </div>

                      {/* Description Field */}
                      <div className="mt-1">
                        <label
                          htmlFor="description"
                          className="mb-1 block text-left text-sm font-normal text-black"
                        >
                          Describe what you sell and who is your target
                          audience?
                        </label>
                        <textarea
                          id="description"
                          placeholder="Brief description..."
                          value={formData.description}
                          onChange={handleChange}
                          className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                          rows={2}
                          required
                          disabled={isSubmitted}
                        />
                      </div>

                      {/* Email Field with OTP */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="email"
                          className="mb-1 block text-left text-sm font-normal text-black"
                        >
                          Email
                        </label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="email"
                            id="email"
                            placeholder="test@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmail}
                            disabled={isVerifyButtonDisabled() || isSubmitted}
                            className={`rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 ${
                              isVerifyButtonDisabled() || isSubmitted
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            Verify
                          </button>
                        </div>
                      </div>

                      {/* OTP Field */}
                      {isOtpVisible && (
                        <div className="mt-1">
                          <input
                            type="text"
                            id="otp"
                            placeholder="OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-900 placeholder-gray-600 transition-all duration-200 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            required
                            disabled={isSubmitted}
                          />
                          {otpStatusMessage && (
                            <p
                              className={`text-sm 2xl:mt-5 ${
                                otpStatusMessage.includes("OTP has been sent")
                                  ? "text-blue-600"
                                  : "text-red-500"
                              }`}
                            >
                              {otpStatusMessage}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitButtonDisabled()}
                        className={`w-full rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-800 ${
                          isSubmitButtonDisabled()
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="hidden w-full flex-1 rounded-2xl bg-white bg-opacity-90 p-6 shadow-lg lg:block">
                <Logo UseLightOnly={true} />
                <hr className="mb-2 mt-5 border-gray-300" />
                <div className="lg:min-w-70 h-[68vh] overflow-y-auto xl:min-w-80 2xl:h-[78vh]">
                  <ChatAccordion data={data} />
                  <hr className="mt-4 border-gray-300" />
                  {/* Asked Questions */}
                  <div className="mb-5 mt-7 flex items-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="1.5em"
                      width="1.5em"
                      className="mr-2 text-gray-400"
                    >
                      <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h4v3a1 1 0 001 1h.5c.25 0 .5-.1.7-.29L13.9 18H20a2 2 0 002-2V4a2 2 0 00-2-2H4m0 2h16v12h-6.92L10 19.08V16H4V4m8.19 1.5c-.89 0-1.6.18-2.14.54-.55.36-.83.96-.78 1.65h1.97c0-.28.1-.49.26-.63.2-.14.42-.21.69-.21.31 0 .58.08.76.26.18.17.27.39.27.69 0 .28-.08.53-.22.74-.17.22-.38.4-.64.54-.52.32-.86.6-1.07.84-.19.24-.29.58-.29 1.08h2c0-.28.05-.5.14-.68.09-.17.26-.32.52-.47.46-.21.84-.49 1.13-.85.29-.37.44-.76.44-1.2 0-.7-.27-1.26-.81-1.68-.54-.41-1.29-.62-2.23-.62M11 12v2h2v-2h-2z" />
                    </svg>
                    <h2 className="font-medium text-black">Asked Questions</h2>
                  </div>
                  <ul>
                    {data?.conversation.map((item: any) => (
                      <li
                        onClick={() => handleScroll(item?.id)}
                        key={item?.id}
                        className={`my-1 flex cursor-pointer items-center justify-between text-black ${
                          item.from === "user"
                            ? "rounded-md bg-gray-100 p-3"
                            : ""
                        }`}
                      >
                        {item.from === "user" && (
                          <p className="text-[14px] font-medium first-letter:uppercase">
                            {item?.message}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 flex items-center justify-center">
                  <Link
                    href="/pricing"
                    className="rounded-2xl bg-black px-9 py-2.5 text-white"
                  >
                    See the Pricing
                  </Link>
                </div>
              </div>
            )}
          </div>
          {!success ? (
            <div className="relative hidden w-[70%] flex-col items-center justify-center lg:flex 2xl:w-[72%]">
              <div className="max-w-[600px] p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800">
                  <svg
                    className="h-5 w-auto text-white"
                    viewBox="0 0 33 23"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M32.0011 4.7203L30.9745 0C23.5828 0.33861 18.459 3.41404 18.459 12.4583V22.8687H31.3725V9.78438H26.4818C26.4819 6.88236 28.3027 5.17551 32.0011 4.7203Z" />
                    <path d="M13.5421 4.7203L12.5155 0C5.12386 0.33861 0 3.41413 0 12.4584V22.8687H12.914V9.78438H8.02029C8.02029 6.88236 9.84111 5.17551 13.5421 4.7203Z" />
                  </svg>
                </div>

                <blockquote className="mt-5">
                  <p className="text-2xl font-medium leading-relaxed text-black md:text-3xl">
                    {sectionTitle}
                  </p>
                </blockquote>

                <div className="mt-8 flex items-center">
                  <img
                    className="h-8 w-auto object-cover"
                    src="https://cms.flowautomate.io/uploads/Light_Logo_Footer_fb8eaca7f5.webp"
                    alt="Meera"
                  />
                </div>
              </div>
            </div>
          ) : (
            <MeeraChat
              conversations={data?.conversation}
              chats={data?.remainingChats}
              fetchConversations={showdata}
              scrollref={messageRefs}
            />
          )}
        </>
      ) : (
        <MultiStepLoaderDemo />
      )}
    </div>
  );
};
export default ExploreMeera;
