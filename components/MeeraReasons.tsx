"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReasonDrawer from "./ReasonDrawer";
import { InView } from "./in-view";
import Image from "next/image";

// Update the Feature interface to include details
interface Feature {
  title: string;
  drawer_description: string;
  details: {
    forStoreOwner: string;
    forCustomer: string;
    savingsImpact: string;
  };
  imageUrl: string;
}

export default function MeeraReasons() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [stepsData, setStepsData] = useState<Feature[]>([]);
  const [sectionTitle, setSectionTitle] = useState<string>(""); // Add state for Section_Title

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/meera-reason?populate[0]=Section_Data&populate[1]=Section_Data.Section_Image",
        );
        const data = await response.json();

        setSectionTitle(data.data.attributes.Section_Title);

        // Map the response to your Feature structure
        const features = data.data.attributes.Section_Data.map((item: any) => ({
          title: item.Tittle,
          drawer_description: item.Drawer_Description,
          details: {
            forStoreOwner: item.For_Store_Owner,
            forCustomer: item.For_Customer,
            savingsImpact: item.Savings_Impact,
          },
          imageUrl: `https://cms.flowautomate.io${item.Section_Image.data.attributes.url}`,
        }));

        setStepsData(features);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setDrawerOpen(true);
  };

  return (
    <>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)",
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
            {/* Dynamically render the Section_Title */}
            <h2 className="max-w-[80%] text-left text-3xl font-semibold leading-snug tracking-tight text-black dark:text-neutral-300 md:text-6xl lg:text-[4rem] lg:leading-[5rem]">
              {sectionTitle || "Reasons for choosing Meera"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {stepsData.map((feature, index) => (
              <div
                key={index}
                className="group relative cursor-pointer overflow-hidden rounded-xl"
                onClick={() => handleCardClick(feature)}
              >
                <Image
                  className="h-full w-full object-cover"
                  src={feature.imageUrl}
                  alt={feature.title}
                  layout="responsive"
                  width={500}
                  height={300}
                  loading="lazy"
                  quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent transition-all duration-200 group-hover:backdrop-blur-[2px]"></div>
                <div className="absolute right-4 top-4 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="17" y1="7" x2="7" y2="17"></line>
                    <polyline points="8 7 17 7 17 16"></polyline>
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="translate-y-1/2 transform transition-all duration-300 group-hover:translate-y-0">
                    <p className="text-lg font-bold leading-tight text-white">
                      <Link href="#" title="">
                        {feature.title}
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                      </Link>
                    </p>
                    <p
                      className="mt-2 text-sm font-normal leading-6 text-white"
                      dangerouslySetInnerHTML={{
                        __html: feature.drawer_description,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InView>
      <ReasonDrawer
        title={selectedFeature ? selectedFeature.title : ""}
        drawer_description={
          selectedFeature ? selectedFeature.drawer_description : ""
        }
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        features={stepsData}
      />
    </>
  );
}
