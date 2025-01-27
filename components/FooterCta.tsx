"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import Link from "next/link";
import { LinkPreview } from "./ui/link-preview";
import { RainbowButton } from "./ui/rainbow-button";

// Define the type based on the API structure
interface SectionVideoAttributes {
  url: string;
}

interface SectionVideoData {
  data: {
    attributes: SectionVideoAttributes;
  };
}

interface SectionData {
  Section_Title: string;
  Section_Description: string;
  Section_Video: SectionVideoData;
}

export function FooterCta() {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const baseUrl = "https://cms.flowautomate.io";

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/homepage?populate=Sections_10.Section_Video`,
        );
        const data = await response.json();
        setSectionData(data?.data?.attributes?.Sections_10);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!sectionData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative mx-auto mb-28 grid max-w-7xl grid-cols-1 gap-10 overflow-hidden px-4 md:gap-20 md:px-8 md:pt-20 lg:grid-cols-2">
      {/* Video section comes first on mobile */}
      <div className="lg:order-2">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.05)_inset] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0px_0px_5px_1px_rgba(255,255,255,0.05)_inset]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="rounded-2xl"
            width={1000}
            height={1000}
          >
            <source
              src={`${baseUrl}${sectionData.Section_Video.data.attributes.url}`}
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      {/* Text content section */}
      <div className="flex flex-col items-start justify-start lg:order-1 lg:items-center lg:justify-center">
        <h1 className="max-w-5xl text-left text-3xl font-bold tracking-tight md:text-5xl md:leading-tight">
          {sectionData.Section_Title}
        </h1>
        <p className="relative z-10 mt-2 max-w-3xl text-left text-neutral-600 dark:text-neutral-400 md:mt-6 md:text-xl">
          {sectionData.Section_Description}
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-start md:flex-col lg:flex-row">
          <div className="relative z-10 my-4 flex flex-col items-start justify-start gap-4 sm:flex-row sm:items-center md:items-start">
            <Button
              as={Link}
              href="/contact"
              variant="primary"
              className="group flex items-center space-x-2 px-10 py-3 dark:bg-[#1c1c1c] dark:text-gray-200 md:px-12"
            >
              Get In Touch
            </Button>
            <LinkPreview>
              <RainbowButton
                href="/explore-meera"
                className="px-6 py-3 md:px-10"
              >
                Discuss With Meera
              </RainbowButton>
            </LinkPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
