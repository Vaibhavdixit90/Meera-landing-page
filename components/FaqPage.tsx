"use client";
import React, { useState, useEffect } from "react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<
    { question: string; answer: string }[]
  >([]);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/faq?populate=Section_Data"
        );
        const data = await response.json();

        const title = data.data.attributes.Section_Title;
        const sectionData = data.data.attributes.Section_Data;

        const formattedData = sectionData.map(
          (item: { Question: string; Answer: string }) => ({
            question: item.Question,
            answer: item.Answer,
          })
        );

        setSectionTitle(title);
        setFaqData(formattedData);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  if (loading) {
    return <p>Loading FAQs...</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20  md:px-8">
      <div className="max-w-xl lg:max-w-3xl xl:max-w-none">
        <h2 className="mt-6 text-3xl font-normal sm:mt-8 sm:text-5xl lg:text-6xl xl:text-7xl">
          {sectionTitle}
        </h2>
      </div>

      <div className="mt-16 divide-y divide-gray-500 border-t border-gray-500 lg:mt-24">
        {faqData.map((faq, index) => (
          <div key={index} className="relative overflow-hidden">
            <h3>
              <button
                className="flex w-full items-center justify-between py-6 text-left text-2xl font-normal sm:py-8 sm:text-3xl lg:py-10 lg:text-4xl"
                onClick={() => toggleOpen(index)}
              >
                <span>{faq.question}</span>
                <span className="ml-4">
                  <svg
                    className={`h-6 w-6 transform transition-transform duration-200 ${
                      openIndex === index ? "rotate-90" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
            </h3>

            {openIndex === index && (
              <div className="pb-6 sm:pb-8 lg:pb-10">
                <div className="h-px w-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                <p className="pt-6 text-lg font-normal sm:pt-8 sm:text-xl lg:pt-10 lg:text-2xl">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
