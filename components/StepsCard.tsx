import React, { useEffect, useState } from "react";
import Image from "next/image";

interface StepData {
  id: number;
  Section_Image: string;
  Section_Title: string;
  Section_Description: string;
}

const StepsCard: React.FC = () => {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [heading, setHeading] = useState<string>("");

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/meera-landing-page?populate=*"
        );
        const data = await response.json();
        setHeading(data.data.attributes.Section_1_Heading || "");
        setSteps(data.data.attributes.Section_1_Data || []);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    fetchSteps();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col px-4 py-20 md:px-8">
      <h1 className="w-full md:max-w-[80%] text-center md:text-left text-3xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
        {heading}
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full mt-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className="p-8 rounded-2xl shadow-xl flex-1 bg-white dark:bg-[#1d1d1d]"
          >
            <Image
              src={step.Section_Image}
              alt={step.Section_Title}
              width={600}
              height={600}
              className="mx-auto mb-6 rounded-lg"
            />
            <h3 className="text-2xl font-bold mb-4 text-left">
              {step.Section_Title}
            </h3>
            <p className="text-base text-left">{step.Section_Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsCard;
