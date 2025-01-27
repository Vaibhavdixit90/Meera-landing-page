"use client";
import { IconMenu } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

type TocProps = {
  links: { title: string; href: string }[];
};

export const Toc: React.FC<TocProps> = ({ links }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // Function to scroll to a specific section with offset
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80; // Adjust offset as needed
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="sticky left-0 top-20 hidden max-w-xs flex-col self-start pr-10 md:flex">
        {links.map((link, index) => (
          <button
            className="group/toc-link relative flex w-full justify-start rounded-lg px-2 py-1 text-left text-sm text-neutral-700 dark:text-neutral-200"
            key={link.href}
            onClick={() => scrollToSection(link.href)} // Use scroll function
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === index && (
              <motion.span
                layoutId="toc-indicator"
                className="absolute left-0 top-0 h-full w-1 rounded-br-full rounded-tr-full bg-neutral-200 dark:bg-neutral-700"
              />
            )}
            <span className="inline-block font-bold transition duration-200">
              {link.title}
            </span>
          </button>
        ))}
      </div>
      <div className="sticky right-2 top-20 flex w-full flex-col items-end justify-end self-start md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-900"
        >
          <IconMenu className="h-6 w-6 text-black dark:text-white" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex flex-col items-end rounded-3xl border border-neutral-100 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {links.map((link, index) => (
                <button
                  className="group/toc-link relative flex w-full justify-start rounded-lg px-2 py-1 text-left text-sm text-neutral-700 dark:text-neutral-200"
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === index && (
                    <motion.span
                      layoutId="toc-indicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-br-full rounded-tr-full bg-neutral-200 dark:bg-neutral-700"
                    />
                  )}
                  <span className="inline-block transition duration-200">
                    {link.title}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
