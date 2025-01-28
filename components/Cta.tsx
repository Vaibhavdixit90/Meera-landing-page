import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import axios from "axios";
import DemoStoreLeadForm from "./DemoStoreLeadForm"; // Import the form component
import { LinkPreview } from "./ui/link-preview";
import { RainbowButton } from "./ui/rainbow-button";

const Cta = () => {
  const calOptions = useCalEmbed({
    namespace: CONSTANTS.CALCOM_NAMESPACE,
    styles: {
      branding: {
        brandColor: CONSTANTS.CALCOM_BRAND_COLOR,
      },
    },
    hideEventTypeDetails: CONSTANTS.CALCOM_HIDE_EVENT_TYPE_DETAILS,
    layout: CONSTANTS.CALCOM_LAYOUT,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ctaData, setCtaData] = useState<any>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCtaData = async () => {
      try {
        const response = await axios.get(
          "https://cms.flowautomate.io/api/cta?populate[Details][populate]=Store"
        );
        setCtaData(response.data.data.attributes);
      } catch (error) {
        console.error("Error fetching CTA data:", error);
      }
    };
    fetchCtaData();
  }, []);

  // Redirection logic with validation (commented out for direct redirection)
  const handleStoreClick = async (storeUrl: string) => {
    // Save the selected store URL in localStorage
    localStorage.setItem("pendingRedirectUrl", storeUrl);

    // Commented out the ID and token check
    // const updatedId = localStorage.getItem("id");
    // const updatedToken = localStorage.getItem("token");

    // if (updatedId && updatedToken) {
    //   try {
    //     const response = await axios.get(`api/leadDetails/${updatedId}`);

    //     if (response.data.success) {
    //       const apiToken = response.data.data.token;
    //       const apiId = response.data.data.id.toString();

    //       // Update localStorage if token or id differs
    //       if (apiToken !== updatedToken || apiId !== updatedId) {
    //         localStorage.setItem("id", apiId);
    //         localStorage.setItem("token", apiToken);
    //       }

    //       // Redirect user
    //       window.open(
    //         `${storeUrl}?leadId=${apiId}&token=${apiToken}`,
    //         "_blank",
    //       );
    //       return;
    //     }
    //   } catch (error) {
    //     console.error("Error validating ID and Token:", error);
    //   }
    // }

    // Directly redirect to the Redirection URL
    window.open(storeUrl, "_blank");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
        setSelectedStore(null);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-0 py-5 xl:py-10">
      <div className="rounded-[20px] bg-gray-100 py-10 dark:bg-[#1d1d1d]">
        <div className="text-center">
          <h2
            className="px-4 text-2xl font-bold text-black dark:text-white md:px-8 md:text-4xl"
            dangerouslySetInnerHTML={{
              __html: ctaData?.Section_Title || "",
            }}
          />
          <p className="mt-5 px-4 text-base leading-6 text-black dark:text-white md:px-8">
            {ctaData?.Section_Description || ""}
          </p>
        </div>
        <div className="mt-10 flex-shrink-0 px-4 flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0 sm:items-center sm:justify-center sm:space-x-5 md:px-8">
  <Button
    data-cal-namespace={calOptions.namespace}
    data-cal-link={CONSTANTS.CALCOM_LINK}
    data-cal-config={`{"layout":"${calOptions.layout}"}`}
    as="button"
    variant="primary"
    className="flex items-center px-5 md:px-14 py-3 text-center text-base dark:bg-white dark:text-black"
  >
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1.5em"
      width="1.5em"
      className="mr-3"
    >
      <path d="M14.5 3a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h13zm-13-1A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13z" />
      <path d="M5 8a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 015 8zm0-2.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-1-5a.5.5 0 11-1 0 .5.5 0 011 0zM4 8a.5.5 0 11-1 0 .5.5 0 011 0zm0 2.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
    </svg>
    Book a Consultation
  </Button>
  <div>
    <LinkPreview>
      <RainbowButton href="#" className="px-14 py-3 font-bold">
        Get Started - Step 01
      </RainbowButton>
    </LinkPreview>
  </div>
</div>

      </div>
    </div>
  );
};

export default Cta;
