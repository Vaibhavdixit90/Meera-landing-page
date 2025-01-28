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
      <h2 className=" w-full md:max-w-[80%] text-3xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]  ">
        Frequently Asked Questions
      </h2>
      <div className="max-w-7xl mx-auto mt-5 sm:mt-12">
        <div className="flow-root">
          <div className="-my-8 divide-y divide-gray-200">
            <div className="py-8">
              <p className="text-2xl font-bold  ">
                01. How this UI Kit is different from others in market?
              </p>
              <p className="mt-8 text-lg font-normal  ">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
                Exercitation veniam consequat sunt nostrud amet.
              </p>
            </div>

            <div className="py-8">
              <p className="text-2xl font-bold  ">
                02. Do I need any experience to work with Rareblocks?
              </p>
              <p className="mt-8 text-lg font-normal  ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Porttitor convallis suspendisse eget risus, praesent nullam amet
                sed. Auctor sed viverra purus ullamcorper. Fermentum ante fames
                velit massa cras id donec metus, aliquam. Nibh odio volutpat in
                etiam.
              </p>
            </div>

            <div className="py-8">
              <p className="text-2xl font-bold  ">
                03. Do you provide any support for this kit?
              </p>
              <p className="mt-8 text-lg font-normal  ">
                Consectetur adipiscing elit. Nisi tincidunt mauris faucibus
                netus. Quis quis et metus, integer adipiscing. Nulla egestas
                elit ultricies nunc enim orci pellentesque. Semper risus vel
                nisl a, tortor egestas vulputate justo, magna. Diam ut eget ut
                pharetra donec in duis pellentesque dignissim.
              </p>
            </div>

            <div className="py-8">
              <p className="text-2xl font-bold  ">
                04. Will I get money back if I am not satisfied?
              </p>
              <p className="mt-8 text-lg font-normal  ">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
                Exercitation veniam consequat sunt nostrud amet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
