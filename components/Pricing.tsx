"use client";

import { useEffect, useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface PricingData {
  Section_4_Heading: string;
  Section_4_Description: string;
  Button_href: string;
  Steps: {
    id: number;
    Tittle: string;
    Points: {
      id: number;
      Tittle: string;
      Point: string;
    }[];
    Price: string;
  }[];
}

export default function Pricing() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPricingData() {
      try {
        const res = await fetch(
          "https://cms.flowautomate.io/api/meera-landing-page?populate[Steps][populate]=Points",
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setPricingData(data.data.attributes);
      } catch (err) {
        setError("Failed to fetch pricing data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPricingData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-20 px-4 md:px-8">
      <h2 className=" w-full md:max-w-[80%] text-center md:text-left text-3xl font-semibold leading-snug tracking-tight  sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem] ">
        {pricingData?.Section_4_Heading}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-12 md:mt-12 md:grid-cols-2 md:gap-8">
        {pricingData?.Steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex min-h-[400px] flex-col rounded-lg border border-gray-300 p-10"
          >
            <span
              className="absolute left-1.5 top-1 -ml-px hidden h-full w-px bg-gray-700 lg:left-24 lg:top-14 lg:block lg:h-px lg:w-[50%]"
              aria-hidden="true"
            ></span>

            <div className="font-bold">Step {index + 1}</div>
            <div className="mt-4 flex-grow">
              <h3 className="text-2xl font-semibold">{step.Tittle}</h3>
              <ul className="mt-10 space-y-2">
                {step.Points.map((point) => (
                  <li key={point.id}>
                    <span className="text-green-500">✔</span>{" "}
                    <strong>{point.Tittle}:</strong> {point.Point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <h1 className="text-2xl font-bold">{step.Price}</h1>
            </div>
          </div>
        ))}
      </div>

      <div className="my-12 w-full items-center md:max-w-[80%]">
        <p className=" text-center md:text-left">
          {pricingData?.Section_4_Description}
        </p>
      </div>

      <div className="w-full text-center md:text-left">
        <RainbowButton
          href={pricingData?.Button_href || "#"}
          className="px-24 py-7"
        >
          Get Started - Step 01
        </RainbowButton>
      </div>
    </div>
  );
}
