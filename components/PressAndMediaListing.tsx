"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
import { Button } from "./button";
import { LinkPreview } from "./ui/link-preview";
import Balancer from "react-wrap-balancer";
import { useCalEmbed } from "@/app/hooks/useCalEmbed";
import { CONSTANTS } from "@/constants/links";
import { Search } from "./Search";
import { RainbowButton } from "./ui/rainbow-button";

// Define the PressMedia type based on API response
type PressMedia = {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    Title: string;
    Description: string;
    slug: string;
    Short_Description: string;
    Images: {
      Featured_image: {
        data: {
          attributes: {
            url: string;
            formats: {
              thumbnail: {
                url: string;
              };
              small: {
                url: string;
              };
            };
          };
        };
      };
    };
    Categories: {
      data: {
        attributes: {
          Title: string;
        };
      }[];
    };
  };
};

const BASE_URL = "https://cms.flowautomate.io"; // Define your base URL here

export default function PressAndMediaListing() {
  const [pressMedia, setPressMedia] = useState<PressMedia[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more items
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const router = useRouter();
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

  const fetchPressMedia = async (page: number, searchTerm: string = "") => {
    try {
      // Append the search term to the API URL if it exists
      const searchQuery = searchTerm
        ? `&filters[Title][$contains]=${encodeURIComponent(searchTerm)}`
        : "";

      const response = await fetch(
        `https://cms.flowautomate.io/api/press-and-medias?pagination[page]=${page}&pagination[pageSize]=12&populate=Images.Featured_image,Categories${searchQuery}`,
      );
      const data = await response.json();
      const newPressMedia = data.data;

      setPressMedia(newPressMedia);

      setTotalPages(data.meta.pagination.pageCount);
      setHasMore(page < data.meta.pagination.pageCount);
    } catch (error) {
      console.error("Failed to fetch press and media items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setPressMedia([]); // Reset the list when search term changes
      setCurrentPage(1); // Reset to page 1 on new search
      fetchPressMedia(1, searchTerm);
    }
  }, [searchTerm]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPressMedia(currentPage + 1, searchTerm);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault(); // Prevent default form submission
  //   setCurrentPage(1); // Reset to page 1
  //   fetchPressMedia(1, searchTerm);
  // };

  const handleSearch = (searchTerm: string) => {
    setCurrentPage(1); // Reset to page 1
    fetchPressMedia(1, searchTerm); // Fetch blogs with the search term
  };
  return (
    <div className="relative mx-auto mt-16 max-w-7xl overflow-hidden px-4 py-20 md:mt-28 md:px-8">
      {pressMedia.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl px-8 py-10 md:py-20 lg:px-24">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-3xl font-bold sm:text-4xl xl:text-5xl">
                Coming Soon
              </h2>
            </div>

            <div className="mt-8 flex flex-col items-center gap-7 sm:mt-12 md:flex-row md:justify-center">
              <Button
                as={Link}
                href="/overview"
                variant="primary"
                className="hidden items-center px-14 py-3 text-center dark:bg-white dark:text-black md:flex"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                  className="mr-2"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm144.1 454.9L437.7 677.8a8.02 8.02 0 01-12.7-6.5V353.7a8 8 0 0112.7-6.5L656.1 506a7.9 7.9 0 010 12.9z" />
                </svg>
                15 Minutes Overview
              </Button>

              <LinkPreview>
                <RainbowButton href="/explore-meera" className="px-14 py-3">
                  {" "}
                  Explore Meera{" "}
                </RainbowButton>
              </LinkPreview>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            ref={parentRef}
            className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-4 dark:bg-black md:px-8"
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
            <div className="relative z-20 mx-auto max-w-5xl text-balance text-left text-3xl font-semibold tracking-tight text-black dark:text-neutral-300 md:text-center md:text-7xl">
              <Balancer>
                <motion.h2 className="md:text-7xl 2xl:text-8xl">
                  {"Press & Media".split(" ").map((word, index) => (
                    <motion.span
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      className="inline-block"
                      key={index}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.h2>
              </Balancer>
            </div>
            <motion.div className="mb-14 mt-10">
              <Search
                onSubmit={handleSearch}
                placeholder="Search Press And Media..."
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-between py-20">
            <div className="relative z-20 grid w-full grid-cols-1 gap-10 md:grid-cols-3">
              {pressMedia.map((item) => (
                <PressMediaCard pressMedia={item} key={item.attributes.slug} />
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center">
            {loading && <p className="text-gray-500">Loading more...</p>}
            {!loading && hasMore && (
              <button
                onClick={handleLoadMore}
                className="rounded-[15px] bg-black px-14 py-3 text-white dark:bg-[#1c1c1c] dark:text-gray-200"
                aria-label="Load More"
              >
                Load More
              </button>
            )}
            {!loading &&
              (pressMedia.length === 0 ? (
                <p>No items found</p>
              ) : (
                !hasMore && <p>You reached the end</p>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export const PressMediaCard = ({ pressMedia }: { pressMedia: PressMedia }) => {
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const formattedDate = new Date(
    pressMedia.attributes.createdAt,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Prepend the base URL to the image path
  const imageUrl =
    BASE_URL + pressMedia.attributes.Images.Featured_image.data.attributes.url;

  return (
    <Link
      className="shadow-derek flex w-full flex-col overflow-hidden rounded-[.5rem] border bg-white transition duration-200 hover:scale-[1.02] dark:border-neutral-800 dark:bg-neutral-900"
      href={`/press-and-media/${pressMedia.attributes.slug}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={pressMedia.attributes.Title}
          height={800}
          width={800}
          loading="lazy"
          quality={100}
          className="h-52 w-full object-cover object-top"
        />
      ) : (
        // Skeleton placeholder while image is loading
        <div className="h-52 w-full animate-pulse rounded-[.5rem] bg-gray-200 dark:bg-gray-700" />
      )}
      <div className="flex-1 bg-white p-4 dark:bg-neutral-900 md:p-4">
        <p className="mb-4 text-lg font-bold text-neutral-800 dark:text-neutral-100">
          {pressMedia.attributes.Title}
        </p>
        <p className="mt-2 text-left text-sm text-neutral-600 dark:text-neutral-400">
          {truncate(pressMedia.attributes.Short_Description, 100)}
        </p>
      </div>
      <div className="flex justify-between border-t border-neutral-200 bg-white p-4 text-sm font-bold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <p>{formattedDate}</p>
        <p>{pressMedia.attributes.Categories.data[0]?.attributes.Title}</p>
      </div>
    </Link>
  );
};

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
          beamOptions.className,
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
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
    ></div>
  );
};
