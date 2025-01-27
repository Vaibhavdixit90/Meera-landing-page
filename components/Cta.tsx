import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import axios from "axios";
import DemoStoreLeadForm from "./DemoStoreLeadForm"; // Import the form component

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
          "https://cms.flowautomate.io/api/cta?populate[Details][populate]=Store",
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
    <div className="mx-auto max-w-7xl px-4 md:px-8">
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
        <div className="mt-10 flex-shrink-0 px-4 sm:flex sm:items-center sm:justify-center sm:space-x-5 md:px-8">
          <Button
            data-cal-namespace={calOptions.namespace}
            data-cal-link={CONSTANTS.CALCOM_LINK}
            data-cal-config={`{"layout":"${calOptions.layout}"}`}
            as="button"
            variant="primary"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-400 px-8 py-3 text-base font-bold transition-all duration-200 sm:w-auto"
          >
            {ctaData?.TalkButton || " "}
          </Button>

          <div className="group relative mt-5 inline-flex w-full sm:mt-0 sm:w-auto">
            <div
              className="absolute -inset-px rotate-180 rounded-xl opacity-70 blur-lg filter transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"
              style={{
                background:
                  "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
              }}
            ></div>

            <Link
              href="#"
              title=""
              onClick={(e) => {
                e.preventDefault();
                setIsPopupOpen(true);
              }}
              className="font-pj relative inline-flex w-full items-center justify-center rounded-xl border-2 border-transparent bg-gray-900 px-8 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
              role="button"
            >
              {ctaData?.DemoButton || " "}
            </Link>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50 px-4 md:px-8">
          <div
            ref={popupRef}
            className="w-[700px] max-w-full rounded-lg bg-white p-10 shadow-2xl dark:bg-[#141414]"
          >
            {selectedStore ? (
              <DemoStoreLeadForm />
            ) : (
              <>
                <h3 className="mb-6 text-center text-2xl font-semibold">
                  {ctaData?.Details?.Tittle || "Select Store Type"}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {ctaData?.Details?.Store?.map((store: any) => (
                    <div
                      key={store.id}
                      onClick={() => handleStoreClick(store.Redirection_url)}
                      className="cursor-pointer rounded-lg border-2 border-gray-200 p-6 text-center transition hover:border-black hover:shadow-lg dark:border-gray-600 dark:hover:border-white"
                    >
                      <h4 className="text-xl font-bold">{store.Name}</h4>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {store.Description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cta;
