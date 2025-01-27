import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./button";

// Define the type for the footer data
interface SocialLink {
  id: string;
  Icon: string;
  Redirection_url: string;
  Name: string;
  Active: boolean;
}

interface LogoData {
  data: {
    attributes: {
      url: string;
      alternativeText: string | null; // To hold alt text
    };
  };
}

interface FooterData {
  CopyrightText: string;
  Footer_Tagline: string;
  Social: SocialLink[];
  Light_Logo: LogoData;
  Dark_Logo: LogoData;
}

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const baseUrl = "https://cms.flowautomate.io"; // Define the base URL

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/footer?populate=*",
        );
        const data = await response.json();
        setFooterData(data?.data?.attributes);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    }

    fetchFooterData();
  }, []);

  // Extract logos and alt texts from footer data if available
  const siteLogoDark = footerData?.Dark_Logo?.data?.attributes?.url
    ? `${baseUrl}${footerData.Dark_Logo.data.attributes.url}`
    : null;
  const siteLogoLight = footerData?.Light_Logo?.data?.attributes?.url
    ? `${baseUrl}${footerData.Light_Logo.data.attributes.url}`
    : null;

  const altTextDark =
    footerData?.Dark_Logo?.data?.attributes?.alternativeText || "Dark Logo"; // Default alt text
  const altTextLight =
    footerData?.Light_Logo?.data?.attributes?.alternativeText || "Light Logo"; // Default alt text

  return (
    <>
      <section className="mx-auto mt-0 max-w-7xl px-4 py-10 md:mt-28 md:px-8">
        <hr className="mb-10 mt-16 border-gray-200" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-sm">
            {footerData
              ? footerData.CopyrightText
              : "© Copyright 2024, All Rights Reserved by FlowAutomate LLP"}
          </p>
          <ul className="mt-5 flex items-center space-x-3 sm:mt-0 md:order-3">
            {footerData?.Social?.filter((social) => social.Active).map(
              (social) => (
                <li key={social.id}>
                  <Link
                    href={social.Redirection_url}
                    title={social.Name}
                    target="_blank"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-transparent transition-all duration-200"
                  >
                    <span
                      className="h-4 w-4"
                      dangerouslySetInnerHTML={{ __html: social.Icon }}
                    />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
