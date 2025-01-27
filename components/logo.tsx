"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface LogoProps {
  UseLightOnly?: boolean; // Optional prop to use only the dark logo
}

export const Logo = ({ UseLightOnly = false }: LogoProps) => {
  const [lightLogoUrl, setLightLogoUrl] = useState<string | null>(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status

  const baseUrl = "https://cms.flowautomate.io"; // Base URL for your API

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/site-setting?populate=*`);
        const data = await response.json();

        const lightLogo =
          data.data.attributes.Site_logo_light.data.attributes.url;
        const darkLogo =
          data.data.attributes.Site_logo_dark.data.attributes.url;

        setLightLogoUrl(`${baseUrl}${lightLogo}`);
        setDarkLogoUrl(`${baseUrl}${darkLogo}`);
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLoading(false); // Set loading to false once logos are fetched
      }
    };

    fetchLogos();
  }, []);

  return (
    <div className="flex items-center">
      <Link href="/">
        {loading ? (
          // Skeleton placeholder
          <div className="h-12 w-48 animate-pulse rounded-[15px] bg-gray-200 dark:bg-gray-700" />
        ) : (
          <>
            {UseLightOnly ? (
              // Render only dark logo if UseLightOnly is true
              <Image
                src={lightLogoUrl || ""}
                alt="Site Logo Light"
                className="h-auto w-48"
                width={192}
                height={48}
                loading="lazy"
                quality={100}
              />
            ) : (
              <>
                <Image
                  src={darkLogoUrl || ""}
                  alt="Site Logo Dark"
                  className="hidden h-auto w-48 dark:block"
                  width={192}
                  height={48}
                  loading="lazy"
                  quality={100}
                />
                <Image
                  src={lightLogoUrl || ""}
                  alt="Site Logo Light"
                  className="block h-auto w-48 dark:hidden"
                  width={192}
                  height={48}
                  loading="lazy"
                  quality={100}
                />
              </>
            )}
          </>
        )}
      </Link>
    </div>
  );
};
