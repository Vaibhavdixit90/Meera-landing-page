"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SparklesText from "./magicui/sparkles-text";
import HeroVideoDialog from "./magicui/HeroVideoDialog";

type AccordionItemProps = {
  children: React.ReactNode;
  className?: string;
} & Accordion.AccordionItemProps;

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={cn(
        "mt-px overflow-hidden focus-within:relative focus-within:z-10",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={cn(
          "group flex h-[45px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none outline-none",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </Accordion.Trigger>
    </Accordion.Header>
  )
);
AccordionTrigger.displayName = "AccordionTrigger";

type AccordionContentProps = {
  children: React.ReactNode;
  className?: string;
} & Accordion.AccordionContentProps;

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={cn(
        "data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down overflow-hidden text-[15px] font-medium",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-2">{children}</div>
    </Accordion.Content>
  )
);
AccordionContent.displayName = "AccordionContent";

type Point = {
  id: number;
  title: string;
  content: string;
  fromTimestamp: number;
  toTimestamp: number;
};

type FeatureProps = {
  ltr?: boolean;
  linePosition?: "left" | "right";
};

const Feature = ({ ltr = false, linePosition = "left" }: FeatureProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardData, setCardData] = useState<Point[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFeatureInView, setIsFeatureInView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate[Feature][populate][Main_Video]=*&populate[Feature][populate][Points]=*"
        );
        const data = await response.json();
        const fetchedData = data?.data?.attributes?.Feature;

        if (fetchedData) {
          setVideoUrl(fetchedData.Video_Link);
          setVideoPreviewUrl(fetchedData.Video_Preview_Link);
          setSectionTitle(fetchedData.Section_Title);

          const points: Point[] = fetchedData.Points.map((point: any) => ({
            id: point.id,
            title: point.Title,
            content: point.Description,
            fromTimestamp: parseFloat(point.FromTimestamp),
            toTimestamp: parseFloat(point.ToTimestamp),
          }));
          setCardData(points);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateIndex = () => {
      if (videoRef.current && cardData.length > 0) {
        const currentTime = videoRef.current.currentTime;
        const index = cardData.findIndex(
          (point) =>
            currentTime >= point.fromTimestamp &&
            currentTime < point.toTimestamp
        );
        if (index !== -1 && index !== currentIndex) {
          setCurrentIndex(index);
        }
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", updateIndex);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", updateIndex);
      }
    };
  }, [cardData, currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFeatureInView(entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1279px)").matches;
    if (isFeatureInView && cardRefs.current[currentIndex] && isMobile) {
      cardRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex, isFeatureInView]);

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = cardData[index].fromTimestamp;
    }

    if (cardRefs.current[index] && isFeatureInView) {
      cardRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 py-10 xl:px-8 xl:pb-14 xl:pt-32"
      ref={sectionRef}
    >
      <div className="pb-10 xl:pb-28">
        <h1 className="text-3xl text-center font-bold sm:text-6xl md:text-7xl xl:px-0 2xl:text-8xl mb-5 ">
          Experince
        </h1>
        <SparklesText
          text="The Magic of Meera"
          className="px-4 text-center text-3xl font-normal tracking-tight text-black dark:text-neutral-300 sm:text-6xl md:text-7xl xl:px-0 2xl:text-8xl"
        />
      </div>

      <div className="grid h-full grid-cols-6">
        <div
          className={`col-span-2 hidden xl:flex ${ltr ? "xl:order-2 xl:justify-end" : "justify-start"}`}
        >
          <Accordion.Root
            type="single"
            defaultValue={`item-${currentIndex}`}
            value={`item-${currentIndex}`}
            onValueChange={(value) =>
              setCurrentIndex(Number(value.split("-")[1]))
            }
          >
            {cardData.map((item, index) => (
              <AccordionItem
                key={item.id}
                className="relative mb-5 last:mb-0"
                value={`item-${index}`}
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={`absolute bottom-0 top-0 h-full w-0.5 overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30 ${linePosition === "right" ? "left-auto right-0" : "left-0 right-auto"}`}
                >
                  <div
                    className={`absolute left-0 top-0 w-full ${currentIndex === index ? "h-full" : "h-0"} linear origin-top bg-neutral-500 transition-all dark:bg-white`}
                    style={{
                      transitionDuration:
                        currentIndex === index
                          ? `${(cardData[index].toTimestamp - cardData[index].fromTimestamp) * 1000}ms`
                          : "0s",
                    }}
                  ></div>
                </div>
                <AccordionTrigger className="text-xl font-bold">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion.Root>
        </div>

        <div
          className={`col-span-6 h-auto w-auto xl:col-span-4 ${ltr && "xl:order-1"}`}
        >
          <HeroVideoDialog
            animationStyle="from-center"
            ref={videoRef}
            videoSrc={videoUrl}
            videoPreviewSrc={videoPreviewUrl}
            thumbnailAlt="Hero Video"
          />
          <p className="mt-4 text-center text-base font-bold xl:ml-3 xl:text-left">
            Watch this Video
          </p>
        </div>

        <div className="hide-scrollbar col-span-6 mt-4 flex cursor-pointer space-x-4 overflow-x-auto scroll-smooth pb-4 xl:hidden">
          {cardData.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="relative w-60 flex-shrink-0 snap-start p-4"
              onClick={() => handleCardClick(index)}
            >
              <div
                className={`absolute left-0 top-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/50 dark:bg-neutral-300/30`}
              >
                <div
                  className={`absolute left-0 top-0 h-full ${currentIndex === index ? "w-full" : "w-0"} linear origin-left bg-neutral-500 transition-all dark:bg-white`}
                  style={{
                    transitionDuration:
                      currentIndex === index
                        ? `${(cardData[index].toTimestamp - cardData[index].fromTimestamp) * 1000}ms`
                        : "0s",
                  }}
                ></div>
              </div>
              <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
              <p className="text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export function MeeraFeature() {
  return <Feature linePosition="left" />;
}
