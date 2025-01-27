import { FC, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Image from "next/image";

interface FeatureDrawerProps {
  title: string;
  descriptionDrawer: string;
  isOpen: boolean;
  onClose: () => void;
  features: Array<{
    title: string;
    description: string;
  }>;
  imageUrl: string | null;
}

const FeatureDrawer: FC<FeatureDrawerProps> = ({
  title,
  descriptionDrawer,
  isOpen,
  onClose,
  features,
  imageUrl,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track image loading

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false when image is loaded
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction={isMobile ? "bottom" : "right"}
      style={{
        width: isMobile ? "100%" : "30rem",
        height: isMobile ? "70%" : "100%",
      }}
    >
      <div className="relative flex h-full flex-col bg-white shadow-lg dark:bg-neutral-800">
        <div className="flex-grow overflow-y-auto">
          {imageUrl && isLoading && (
            <div className="h-60 w-full animate-pulse rounded-[30px] bg-gray-200" />
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="feature"
              className={`h-60 w-full rounded-[30px] object-cover p-6 transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
              width={700}
              height={475}
              loading="lazy"
              quality={100}
              onLoadingComplete={handleImageLoad} // Callback when image is loaded
            />
          )}

          {/* Title and Description */}
          <h3 className="my-5 px-6 text-xl font-bold text-black dark:text-white">
            {title}
          </h3>
          <p
            className="mt-2 px-6 text-lg text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: descriptionDrawer }}
          />
        </div>

        {/* Close Drawer Button */}
        <div
          className="flex w-full cursor-pointer items-center justify-end bg-gray-200 p-4 dark:bg-gray-800"
          onClick={onClose}
        >
          <span className="text-black dark:text-white">Close</span>
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1.5em"
            width="1.5em"
            className="ml-3 text-black dark:text-white"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
          </svg>
        </div>
      </div>
    </Drawer>
  );
};

export default FeatureDrawer;
