"use client";
import React, { useEffect, useState } from "react";
import TextReveal from "@/components/magicui/text-reveal";

export function TextRevealDemo() {
  const [text, setText] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate=Sections_1",
        );
        const data = await response.json();

        // Ensure data structure exists
        const sectionText = data?.data?.attributes?.Sections_1?.Text;
        if (sectionText) {
          setText(sectionText);
        } else {
          console.warn("Text not found in the response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <TextReveal text={text} />;
}
