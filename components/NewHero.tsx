import React from "react";
import HeroVideoDialog from "./magicui/HeroVideoDialog";
import SparklesText from "./magicui/sparkles-text";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import { LinkPreview } from "./ui/link-preview";
import { RainbowButton } from "./ui/rainbow-button";
import { HeroVideoDialogDemo } from "./HeroVideoDialog";

const NewHero = () => {
  const calOptions = useCalEmbed({
    namespace: CONSTANTS.CALCOM_NAMESPACE,
    styles: {
      branding: {
        brandColor: CONSTANTS.CALCOM_BRAND_COLOR,
      },
    },
    hideEventTypeDetails: CONSTANTS.CALCOM_HIDE_EVENT_TYPE_DETAILS,
    layout: CONSTANTS.CALCOM_LAYOUT,
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-20">
      <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-normal tracking-widest uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
              {" "}
              Your startup needs a kick{" "}
            </span>
          </p>
          <h1 className="mt-8 text-4xl text-black font-normal sm:text-5xl lg:text-6xl xl:text-7xl">
            Connect & grow with your targeted customers
          </h1>

          <div className="flex flex-col items-center justify-center px-8 mt-12 space-y-5 sm:space-y-0 sm:px-0 sm:space-x-5 sm:flex-row">
            <div className="relative inline-flex items-center justify-center w-full sm:w-auto group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
              <a
                href="#"
                title=""
                className="relative inline-flex items-center justify-center w-full px-8 py-3 text-base font-normal text-black bg-white border border-transparent rounded-full sm:w-auto"
                role="button"
              >
                {" "}
                Start 14 Days Free Trial{" "}
              </a>
            </div>

            <a
              href="#"
              title=""
              className="inline-flex items-center justify-center w-full px-8 py-3 text-base font-normal text-white transition-all duration-200 bg-black border border-gray-600 rounded-full sm:w-auto hover:border-white"
              role="button"
            >
              {" "}
              Talk to Sales{" "}
            </a>
          </div>
        </div>

        <div className="relative mt-12 -mb-4 sm:-mb-10 lg:-mb-12 sm:mt-16 lg:mt-24">
          {/* <div className="absolute top-0 transform -translate-x-1/2 left-1/2">
                    <svg className="blur-3xl filter"  viewBox="0 0 645 413" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M181.316 218.778C86.2529 123.715 -63.7045 134.94 31.3589 39.8762C126.422 -55.1873 528.427 41.1918 623.49 136.255C718.554 231.319 470.678 289.068 375.614 384.131C280.551 479.195 276.38 313.842 181.316 218.778Z" fill="url(#d)" />
                        <defs>
                            <linearGradient id="d" x1="665.741" y1="178.506" x2="296.286" y2="474.62" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" style="stop-color: var(--color-cyan-500)" />
                                <stop offset="100%" style="stop-color: var(--color-purple-500)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div> */}

          {/* <div className="absolute inset-0">
            <img
              className="object-cover w-full h-full opacity-50"
              src="https://landingfoliocom.imgix.net/store/collection/dusk/images/noise.png"
              alt=""
            />
          </div>

          <img
            className="relative w-full max-w-5xl mx-auto"
            src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/4/dashboard-mockup.png"
            alt=""
          /> */}
          <HeroVideoDialogDemo />
        </div>
      </div>
    </section>
  );
};

export default NewHero;
