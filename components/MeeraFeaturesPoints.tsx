"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import FeatureDrawer from "./FeatureDrawer";
import { InView } from "./in-view";

export function MeeraFeaturesPoints() {
  const [selectedFeature, setSelectedFeature] = useState<{
    title: string;
    descriptionDrawer: string;
    imageUrl: string | null;
  } | null>(null);

  const [sectionTitle, setSectionTitle] = useState("");
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      "https://cms.flowautomate.io/api/homepage?populate[Sections_5][populate][0]=Section_Data&populate[Sections_5][populate][1]=Section_Data.Drawer_Image",
    )
      .then((response) => response.json())
      .then((data) => {
        const sectionData = data.data.attributes.Sections_5;
        setSectionTitle(sectionData.Section_Title);
        setFeatures(sectionData.Section_Data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFeatureClick = (
    title: string,
    descriptionDrawer: string,
    imageUrl: string,
  ) => {
    setSelectedFeature({ title, descriptionDrawer, imageUrl });
  };

  const closeDrawer = () => {
    setSelectedFeature(null);
  };

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
              {sectionTitle}
            </h1>
          </div>
          <div className="relative z-10 grid cursor-pointer grid-cols-1 px-4 sm:grid-cols-2 md:grid-cols-3 md:px-0 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Feature
                key={feature.id}
                title={feature.Tittle}
                description={feature.Description}
                descriptionDrawer={feature.Drawer_Description}
                imageUrl={
                  feature.Drawer_Image?.data?.attributes?.url
                    ? `https://cms.flowautomate.io${feature.Drawer_Image.data.attributes.url}`
                    : null
                }
                iconSvg={feature.Icon}
                index={index}
                handleFeatureClick={handleFeatureClick}
              />
            ))}
          </div>
        </div>
      </InView>

      {/* Place FeatureDrawer outside of InView to prevent animation */}
      <FeatureDrawer
        title={selectedFeature?.title || "Default Title"}
        descriptionDrawer={
          selectedFeature?.descriptionDrawer || "Default Description"
        }
        imageUrl={selectedFeature?.imageUrl || null}
        isOpen={!!selectedFeature}
        features={features}
        onClose={closeDrawer}
      />
    </>
  );
}

const Feature = ({
  title,
  description,
  iconSvg,
  index,
  descriptionDrawer,
  imageUrl,
  handleFeatureClick,
}: {
  title: string;
  description: string;
  descriptionDrawer: string;
  imageUrl: string | null;
  iconSvg: string;
  index: number;
  handleFeatureClick: (
    title: string,
    descriptionDrawer: string,
    imageUrl: string,
  ) => void;
}) => {
  return (
    <div
      onClick={() =>
        handleFeatureClick(title, descriptionDrawer, imageUrl || "")
      }
      className={cn(
        "group/feature relative flex flex-col py-5 dark:border-neutral-800 md:py-10 lg:border-r",
        (index % 8 === 0 || index % 8 === 4) &&
          "dark:border-neutral-800 lg:border-l",
        index % 8 < 4 && "dark:border-neutral-800 lg:border-b",
      )}
    >
      {index % 8 < 4 ? (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      ) : (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}

      <div className="relative z-10 mb-4 px-5 text-neutral-600 dark:text-neutral-400 md:px-10">
        {iconSvg && (
          <div
            dangerouslySetInnerHTML={{ __html: iconSvg }}
            className="h-8 w-8"
          />
        )}
      </div>

      <div className="relative z-10 mb-2 pl-5 text-xl font-bold md:px-10 md:text-lg">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-yellow-500 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-yellow-400 dark:group-hover/feature:bg-yellow-500" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs pl-5 text-base text-neutral-600 dark:text-neutral-300 md:px-10">
        {description}
      </p>
    </div>
  );
};
