"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";
import { GridPatternContainer } from "./GridPatternContainer";

// Define the props type
interface SimpleCTAWithImagesProps {
  heading: string;
  buttonText: string;
  buttonHref: string;
  icon?: React.ReactNode; // Accepts any valid JSX element
}

export const SimpleCTAWithImages: React.FC<SimpleCTAWithImagesProps> = ({
  heading,
  buttonText,
  buttonHref,
  icon,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="relative z-10  my-12 flex  flex-col items-center justify-between rounded-[20px] border-2 border-gray-400 px-4 py-10 dark:border-white md:flex-row md:px-8">
        <GridPatternContainer className="opacity-50" />
        <div className="flex flex-col">
          <motion.h2 className="z-40 mx-auto max-w-4xl text-center text-xl font-bold text-black dark:text-white md:mx-0 md:text-left md:text-3xl">
            {heading}
          </motion.h2>
        </div>
        <Button
          as={Link}
          href={buttonHref}
          variant="primary"
          className="mt-4  items-center px-14 py-3 text-center dark:bg-white dark:text-black md:mt-0 md:flex"
        >
          {icon && <span className="mr-2">{icon}</span>}{" "}
          {/* Render the SVG icon */}
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
