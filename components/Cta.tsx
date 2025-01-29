import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import axios from "axios";
import { LinkPreview } from "./ui/link-preview";
import { RainbowButton } from "./ui/rainbow-button";

interface CtaData {
  Section_Title: string;
  Section_Description: string;
}

const Cta = () => {
  const [ctaData, setCtaData] = useState<CtaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCtaData = async () => {
      try {
        const response = await axios.get(
          "https://cms.flowautomate.io/api/meera-landing-page?populate=*"
        );
        setCtaData(response.data.data.attributes.Meera_Cta as CtaData);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching CTA data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCtaData();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-0 py-5 xl:py-10">
      <div className="rounded-[20px] bg-gray-100 py-10 dark:bg-[#1d1d1d]">
        <div className="text-center">
          <h2 className="px-4 text-2xl font-bold text-black dark:text-white md:px-8 md:text-4xl">
            {ctaData?.Section_Title}
          </h2>
          <p className="mt-5 px-4 text-base leading-6 text-black dark:text-white md:px-8">
            {ctaData?.Section_Description}
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
