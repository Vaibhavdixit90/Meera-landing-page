"use client";
import React, { useEffect, useState } from "react";
import { Logo } from "./logo";

const DemoStoreLeadForm = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState("");
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
  const [leadId, setLeadId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  useEffect(() => {
    const fetchSectionTitle = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/demo-store",
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

          // Check for pending redirect URL
          const pendingRedirectUrl = localStorage.getItem("pendingRedirectUrl");
          if (pendingRedirectUrl) {
            const redirectUrl = `${pendingRedirectUrl}?leadId=${id}&token=${newToken}`;
            localStorage.removeItem("pendingRedirectUrl");

            // Open the URL in a new tab
            window.open(redirectUrl, "_blank");

            // Redirect current tab to the home page after a short delay
            setTimeout(() => {
              window.location.href = "/";
            }, 500); // Adjust delay if needed
          }
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLeadId = localStorage.getItem("id");
      const storedToken = localStorage.getItem("token");
      setLeadId(storedLeadId);
      setToken(storedToken);

      if (storedLeadId && storedToken) {
        setSuccess(true);
      }
    }
  }, []);

  useEffect(() => {
    if (success) {
    }
  }, [success]);

  return (
    <section>
      <Logo />
      <hr className="mb-2 mt-7 border-gray-300" />
      {/* form */}
      <h1 className="my-3 text-left text-sm font-bold uppercase xl:mb-5 xl:text-xl">
        your Bussinees Details
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 2xl:mt-2">
        {/* Name and Phone Fields */}
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="mb-1 block text-left text-sm font-normal"
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
          <div className="mt-1 flex-1 lg:mt-0">
            <label
              htmlFor="phone"
              className="mb-1 block text-left text-sm font-normal"
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
        <div className="mt-1 flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label
              htmlFor="storeUrl"
              className="mb-1 block text-left text-sm font-normal"
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
          <div className="flex-1">
            <label
              htmlFor="storefront"
              className="mb-1 block text-left text-sm font-normal"
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
            className="mb-1 block text-left text-sm font-normal"
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
            className="mb-1 block text-left text-sm font-normal"
          >
            Describe what you sell and who is your target audience?
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
            className="mb-1 block text-left text-sm font-normal"
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
            isSubmitButtonDisabled() ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          Submit
        </button>
      </form>
    </section>
  );
};
export default DemoStoreLeadForm;
