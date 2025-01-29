"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface FaqItem {
  id: number;
  Question: string;
  Answer: string;
}

export default function FaqPage() {
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [sectionHeading, setSectionHeading] = useState<string>("");

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(
          "https://cms.flowautomate.io/api/meera-landing-page?populate=*"
        );
        const data = response.data.data.attributes.Data;
        setFaqData(data);
        const sectionHeading = response.data.data.attributes.Section_7_Heading;
        setSectionHeading(sectionHeading || "");
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };
    fetchFaqData();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <h2 className="w-full md:max-w-[80%] text-3xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
        {sectionHeading}
      </h2>
      <div className="max-w-7xl mx-auto mt-5 sm:mt-12">
        <div className="flow-root">
          <div className="-my-8 divide-y divide-gray-200">
            {faqData.map((faq) => (
              <div key={faq.id} className="py-8">
                <p className="text-2xl font-bold">{faq.Question}</p>
                <p className="mt-8 text-lg font-normal">{faq.Answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
