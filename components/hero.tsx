"use client";
import React, { useRef, useEffect, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import { HeroVideoDialogDemo } from "./HeroVideoDialog";
import { LinkPreview } from "./ui/link-preview";
import { RainbowButton } from "./ui/rainbow-button";
import SparklesText from "./magicui/sparkles-text";

export function Hero() {
  const [tittle, setTittle] = useState(" ");
  const [description, setDescription] = useState(" ");
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/homepage?populate[Hero_Section]=*"
        );
        const data = await response.json();

        const tittle = data?.data?.attributes?.Hero_Section?.Tittle;
        const description = data?.data?.attributes?.Hero_Section?.Description;

        if (tittle) {
          setTittle(tittle);
        }
        if (description) {
          setDescription(description);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        ref={parentRef}
        className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-4 pt-10 dark:bg-black md:min-h-screen md:px-8 "
      >
        <div className="hidden sm:block">
          <BackgroundGrids />
          <CollisionMechanism
            beamOptions={{
              initialX: -400,
              translateX: 600,
              duration: 7,
              repeatDelay: 3,
            }}
            containerRef={containerRef}
            parentRef={parentRef}
          />
          <CollisionMechanism
            beamOptions={{
              initialX: -200,
              translateX: 800,
              duration: 4,
              repeatDelay: 3,
            }}
            containerRef={containerRef}
            parentRef={parentRef}
          />
          <CollisionMechanism
            beamOptions={{
              initialX: 200,
              translateX: 1200,
              duration: 5,
              repeatDelay: 3,
            }}
            containerRef={containerRef}
            parentRef={parentRef}
          />
          <CollisionMechanism
            containerRef={containerRef}
            parentRef={parentRef}
            beamOptions={{
              initialX: 400,
              translateX: 1400,
              duration: 6,
              repeatDelay: 3,
            }}
          />
        </div>
        <h1 className="mt-10 rounded-full border border-black px-4 py-1 text-center text-sm dark:border-yellow-200 md:mt-14">
          <img
            src="https://cms.flowautomate.io/uploads/meera_0943e9c2fd.png"
            alt="Celebration Icon"
            className="mr-1 inline-block h-6 w-6 p-1"
          />
          Introducing Meera
        </h1>

        {/* <div className="relative z-20 mx-auto mb-4 mt-4 max-w-5xl text-balance text-center text-3xl font-semibold tracking-tight text-black dark:text-neutral-300 sm:text-4xl md:text-7xl">
          <Balancer>{tittle}</Balancer>
        </div> */}
        {/* <p className="z-20 mx-auto mb-4 max-w-5xl text-center text-xl font-medium text-slate-600 dark:text-gray-200 md:mb-8 md:text-2xl">
          {description}
        </p> */}

        <div className="py-10 xl:pb-20">
          <h1 className="text-3xl text-center font-bold sm:text-6xl md:text-7xl xl:px-0 2xl:text-8xl mb-0 md:mb-5 ">
            Experince
          </h1>
          <SparklesText
            text="The Magic of Meera"
            className="px-4 text-center text-3xl font-normal tracking-tight text-black dark:text-neutral-300 sm:text-6xl md:text-7xl xl:px-0 2xl:text-8xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
          ref={containerRef}
        >
          <HeroVideoDialogDemo />
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.7 }}
          className="hidden w-full flex-col items-center justify-center gap-4 px-8 sm:flex sm:flex-row md:mb-20"
        >
          <Button
            data-cal-namespace={calOptions.namespace}
            data-cal-link={CONSTANTS.CALCOM_LINK}
            data-cal-config={`{"layout":"${calOptions.layout}"}`}
            as="button"
            variant="primary"
            className="hidden items-center px-14 py-3 text-center text-base dark:bg-white dark:text-black md:flex"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              height="1.5em"
              width="1.5em"
              className="mr-3"
            >
              <path d="M14.5 3a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h13zm-13-1A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13z" />
              <path d="M5 8a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 015 8zm0-2.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-1-5a.5.5 0 11-1 0 .5.5 0 011 0zM4 8a.5.5 0 11-1 0 .5.5 0 011 0zm0 2.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
            Book a Consultation
          </Button>
          <div className="hidden md:block">
            <LinkPreview>
              <RainbowButton
                href="/explore-meera"
                className="px-14 py-3 font-bold"
              >
                {" "}
                Interact with Meera{" "}
              </RainbowButton>
            </LinkPreview>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.7 }}
          className="mb-10 mt-8 flex w-full flex-col items-center justify-center gap-4 px-8 md:hidden"
        >
          <Button
            data-cal-namespace={calOptions.namespace}
            data-cal-link={CONSTANTS.CALCOM_LINK}
            data-cal-config={`{"layout":"${calOptions.layout}"}`}
            as="button"
            variant="primary"
            className="px-14 py-3 text-base dark:bg-white dark:text-black"
          >
            Book a Consultation
          </Button>
          <LinkPreview>
            <RainbowButton
              href="/explore-meera"
              className="px-14 py-6 font-bold dark:bg-white dark:text-black"
            >
              Interact with Meera
            </RainbowButton>
          </LinkPreview>
        </motion.div> */}
      </div>
    </>
  );
}

const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform select-none grid-cols-2 gap-10 md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="left-auto right-0" />
      </div>
    </div>
  );
};
export const Badge: React.FC<
  { children: React.ReactNode } & React.ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="group relative mx-auto inline-block w-fit cursor-pointer rounded-full bg-white p-px text-[14px] font-semibold leading-6 text-neutral-700 no-underline shadow-zinc-900 dark:bg-black dark:text-neutral-300 md:shadow-2xl"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative z-10 flex items-center space-x-2 rounded-full bg-white px-4 py-1.5 ring-1 ring-white/10 dark:bg-black">
        <span>{children}</span>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-neutral-400/0 via-neutral-400/90 to-neutral-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
          if (beamRef.current) {
            beamRef.current.style.opacity = "0";
          }
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        // Set beam opacity to 0
        if (beamRef.current) {
          beamRef.current.style.opacity = "1";
        }
      }, 2000);

      // Reset the beam animation after a delay
      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || -45,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "800px",
            translateX: beamOptions.translateX || "700px",
            rotate: beamOptions.rotate || -45,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-96 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x + 20}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-[4px] w-10 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-orange-500 to-yellow-500"
        />
      ))}
    </div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
    ></div>
  );
};
