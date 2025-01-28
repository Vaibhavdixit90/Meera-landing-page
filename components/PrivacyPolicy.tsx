"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
interface PrivacyPolicyAttributes {
  Tittle: string;
  Description: string;
}

interface PrivacyPolicyResponse {
  data: {
    id: number;
    attributes: PrivacyPolicyAttributes;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const PrivacyPolicy: React.FC = () => {
  const [policyData, setPolicyData] = useState<PrivacyPolicyAttributes | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); // Attach the button ref
  const dropdownRef = useRef<HTMLDivElement>(null); // Attach the dropdown ref
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/pages?filters[slug][$eq]=privacy-policy",
        );
        const data: PrivacyPolicyResponse = await response.json();
        if (data.data.length > 0) {
          setPolicyData(data.data[0].attributes);
        } else {
          setError("Privacy policy not found");
        }
      } catch (err) {
        setError("Failed to fetch privacy policy");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown state on button click
  };

  const handleClick = (route: string) => {
    router.push(route);
    setShowDropdown(false); // Close dropdown after navigation
  };

  // Close dropdown if clicking outside of the dropdown or button
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node) // Ensure the button is not part of the outside click
      ) {
        setShowDropdown(false); // Close dropdown on outside click
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick); // Cleanup on unmount
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative mx-auto mt-24 max-w-7xl px-4 md:mt-28 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-left text-2xl font-bold md:text-4xl">
          {policyData?.Tittle}
        </h1>
        <button
          ref={buttonRef} // Attach the button ref
          onClick={toggleDropdown} // Toggle the dropdown open/close
          className={`rounded-full p-3 transition ${
            showDropdown ? "bg-black dark:bg-white" : "bg-black dark:bg-white"
          } `}
          aria-label="More Policies"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 text-white dark:text-black md:h-5 md:w-5"
          >
            <path
              fill="currentColor"
              d="M6 1h10v2H6V1zm0 6h10v2H6V7zm0 6h10v2H6v-2zM0 2a2 2 0 113.999-.001A2 2 0 010 2zm0 6a2 2 0 113.999-.001A2 2 0 010 8zm0 6a2 2 0 113.999-.001A2 2 0 010 14z"
            />
          </svg>
        </button>
      </div>
      {showDropdown && (
        <div
          ref={dropdownRef} // Attach the dropdown ref
          className="absolute right-2 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:bg-[#1d1d1d] md:right-2"
        >
          <ul>
            <li>
              <button
                onClick={() => handleClick("/data-protection")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-400"
              >
                Data Protection
              </button>
            </li>
            <li>
              <button
                onClick={() => handleClick("/terms-of-service")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-400"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                onClick={() => handleClick("/cookie-policy")}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-400"
              >
                Cookie Policy
              </button>
            </li>
          </ul>
        </div>
      )}
      <div
        className="mb-8 text-lg leading-relaxed md:text-base"
        dangerouslySetInnerHTML={{ __html: policyData?.Description || "" }}
      />
    </div>
  );
};

export default PrivacyPolicy;
