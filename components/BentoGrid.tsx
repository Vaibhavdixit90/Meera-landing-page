import { useEffect, useState } from "react";
import Image from "next/image";

// Define types for API response
interface Feature {
  id: number;
  Section_Image: string;
  Section_Title: string;
  Section_Description: string;
}

interface APIResponse {
  data: {
    attributes: {
      Section_3_Heading: string;
      Section_3_Data: Feature[];
    };
  };
}

export default function BentoGrid() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [heading, setHeading] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/meera-landing-page?populate=*"
        );
        const data: APIResponse = await response.json();

        // Extract section heading and features data
        setHeading(data.data.attributes.Section_3_Heading || "Our Features");
        setFeatures(data.data.attributes.Section_3_Data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col py-10 px-4">
      <h1 className="w-full md:max-w-[80%] text-center md:text-left text-3xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
        {heading}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`bg-white dark:bg-[#1d1d1d] rounded-3xl p-8 shadow-xl transition-all duration-300 ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div className="relative mb-6 h-[200px] md:h-[300px]">
              <Image
                src={feature.Section_Image || ""}
                alt={feature.Section_Title}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-semibold text-black dark:text-white text-xl mb-4">
                {feature.Section_Title}
              </h3>
              <p className="text-sm text-black dark:text-white leading-relaxed">
                {feature.Section_Description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
