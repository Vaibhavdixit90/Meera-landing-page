"use client";
import { Hero } from "@/components/hero";
import Testimonial from "@/components/TestimonialSingle";
import { FooterCta } from "@/components/FooterCta";
import { Testimonials } from "@/components/Testimonials";
import { MeeraFeaturesPoints } from "@/components/MeeraFeaturesPoints";
import { InView } from "@/components/in-view";
import { TextRevealDemo } from "@/components/textrevil";
import DemoStoreCard from "@/components/DemoStoreCard";
import { useEffect, useState } from "react";
import { MeeraFeature } from "./MeeraFeature";
import Cta from "./Cta";
import FaqPage from "./FaqPage";

// Define the interface for the CTA data
interface CTAData {
  id: number;
  Tag_Line: string;
  Button_title: string;
  Button_href: string;
  Icon: string;
}

export default function HomePage() {
  const [ctaData, setCtaData] = useState<CTAData | null>(null);
  const [ctaData2, setCtaData2] = useState<CTAData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  SimpleCTAWithImages (first CTA)
        const response3 = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate[CTA_1]=*"
        );
        const data3 = await response3.json();
        setCtaData(data3?.data?.attributes?.CTA_1);

        //  SimpleCTAWithImages (second CTA)
        const response4 = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate[CTA_2]=*"
        );
        const data4 = await response4.json();
        setCtaData2(data4?.data?.attributes?.CTA_2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <Hero />
      <TextRevealDemo />
      <MeeraFeature />
      <Cta />
      <DemoStoreCard />
      <MeeraFeaturesPoints />

      {/* <FeaturedCategories /> */}

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
        <Testimonial />
      </InView>

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
        <Testimonials />
      </InView>

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
        <FaqPage />
      </InView>

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
        <FooterCta />
      </InView>
    </main>
  );
}
