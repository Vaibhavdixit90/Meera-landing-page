import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import DemoStoreLeadForm from "./DemoStoreLeadForm";
import { InView } from "./in-view";

interface CardData {
  id: number;
  Badge: string;
  Card_Text: string;
  Redirection_url: string;
  Hover_Heading: string;
  Hover_Para: string;
  Card_Image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

interface SectionData {
  Section_Title: string;
  Tag_Line: string;
  Card_Data: CardData[];
}

const FeaturedCategories = (props: {}) => {
  const [sectionData, setSectionData] = useState<SectionData | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const baseUrl = "https://cms.flowautomate.io";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/homepage?populate[Sections_6][populate][Card_Data][populate]=Card_Image`,
        );
        const json = await response.json();
        setSectionData(json.data.attributes.Sections_6);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false); // Close popup if clicked outside
      }
    };

    // Add event listener for clicks outside the popup
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up listener
    };
  }, [isPopupOpen]);

  const handleRedirect = async (url: string) => {
    // The below lines are commented as they are unused:
    // const updatedId = localStorage.getItem("id");
    // const updatedToken = localStorage.getItem("token");
  
    // if (updatedId && updatedToken) {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:4000/api/leadDetails/${updatedId}`,
    //     );
  
    //     if (response.data.success) {
    //       const apiToken = response.data.data.token;
    //       const apiId = response.data.data.id.toString();
  
    //       if (apiToken !== updatedToken || apiId !== updatedId) {
    //         localStorage.setItem("id", apiId);
    //         localStorage.setItem("token", apiToken);
    //       }
    //       return `${url}?leadId=${apiId}&token=${apiToken}`;
    //     }
    //   } catch (error) {
    //     console.error("Error validating ID and Token:", error);
    //   }
    // }
  
    // Directly redirect to the provided URL
    return url;
  };

  if (!sectionData) return <div>Loading...</div>;

  return (
    <>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)", // Adjust blur amount as needed
          },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -350px 0px" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="pb-20">
            <h1 className="max-w-[80%] text-left text-3xl font-semibold leading-snug tracking-tight text-black dark:text-neutral-300 sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
              {sectionData.Section_Title}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-2 sm:gap-6">
            {sectionData.Card_Data.map((card) => (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="absolute right-2 top-2 z-10 rounded-full bg-white px-3 py-2 text-sm font-bold text-black">
                  {card.Badge}
                </div>

                <div className="absolute inset-0">
                  {imageLoading[card.id] ? (
                    <div className="h-[475px] w-full animate-pulse rounded-[30px] bg-gray-200 dark:bg-gray-700" />
                  ) : (
                    <Image
                      className="h-full w-full object-cover"
                      src={baseUrl + card.Card_Image.data.attributes.url}
                      alt={card.Card_Text}
                      width={700}
                      height={475}
                      loading="lazy"
                      quality={100}
                      onLoad={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }))
                      }
                      onError={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [card.id]: false,
                        }))
                      }
                    />
                  )}
                </div>

                <div className="relative flex aspect-[4/3] items-end">
                  <div className="flex w-full justify-center p-6">
                    <span className="inline-flex items-center justify-center rounded bg-white px-3 py-1.5 text-xl font-bold text-gray-900 md:text-2xl">
                      {card.Card_Text}
                    </span>
                  </div>
                </div>

                <Link
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    const redirectUrl = await handleRedirect(card.Redirection_url);
                    if (redirectUrl) {
                      window.location.href = redirectUrl;
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  <div className="flex flex-col items-center">
                    <span className="mt-8 text-lg font-bold text-white">
                      {card.Hover_Heading}
                    </span>
                    <span className="mt-1.5 p-5 text-sm font-medium text-gray-200">
                      <span
                        dangerouslySetInnerHTML={{ __html: card.Hover_Para }}
                      />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-bold">{sectionData.Tag_Line}</p>
          </div>
        </div>
      </InView>
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50 px-4 md:px-8">
          <div
            ref={popupRef}
            className="w-[700px] max-w-full rounded-lg bg-white p-10 shadow-2xl dark:bg-[#141414]"
          >
            <DemoStoreLeadForm />
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCategories;
