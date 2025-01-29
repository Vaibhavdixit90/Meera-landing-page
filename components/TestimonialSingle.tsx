import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface ImageData {
  attributes: {
    url: string;
    alternativeText?: string;
  };
}

interface TestimonialData {
  Section_Image: {
    data: ImageData;
  };
  Company_Logo: {
    data: ImageData;
  };
  Review: string;
  Name: string;
}

const Testimonial: React.FC = () => {
  const [testimonialData, setTestimonialData] =
    useState<TestimonialData | null>(null);

  useEffect(() => {
    const fetchTestimonialData = async () => {
      try {
        const response = await axios.get(
          "https://cms.flowautomate.io/api/meera-landing-page?populate=Sections_5.Section_Image"
        );
        setTestimonialData(response.data.data.attributes.Sections_5);
      } catch (error) {
        console.error("Error fetching testimonial data:", error);
      }
    };
    fetchTestimonialData();
  }, []);

  if (!testimonialData) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid grid-cols-1 items-center gap-y-8 sm:gap-y-10 md:grid-cols-2 md:gap-x-12">
        <div>
          <Image
            className="h-auto w-full rounded-2xl object-cover"
            src={`https://cms.flowautomate.io${testimonialData.Section_Image.data.attributes.url}`}
            alt={
              testimonialData.Section_Image.data.attributes.alternativeText ||
              "Testimonial Image"
            }
            width={500}
            height={300}
            loading="lazy"
            quality={100}
          />
        </div>

        <div className="md:px-6 xl:pr-16">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black dark:bg-white sm:h-16 sm:w-16">
            <svg
              className="h-5 w-5 text-white dark:text-black sm:h-6 sm:w-6"
              viewBox="0 0 43 35"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M42.28 34.3H26.04C24.4533 29.1667 23.66 23.8467 23.66 18.34C23.66 12.74 25.1067 8.30666 28 5.03999C30.9867 1.68 35.3733 0 41.16 0V7.84C36.4933 7.84 34.16 10.6867 34.16 16.38V19.04H42.28V34.3ZM18.62 34.3H2.38C0.793333 29.1667 0 23.8467 0 18.34C0 12.74 1.44667 8.30666 4.34 5.03999C7.32667 1.68 11.7133 0 17.5 0V7.84C12.8333 7.84 10.5 10.6867 10.5 16.38V19.04H18.62V34.3Z" />
            </svg>
          </div>

          <blockquote className="mt-4 sm:mt-6 md:mt-10">
            <p className="text-lg font-normal leading-snug sm:text-xl md:text-2xl xl:text-3xl">
              {testimonialData.Review}
            </p>
          </blockquote>

          <div className="mt-4 flex items-center gap-2 sm:mt-5 sm:gap-3 md:mt-6">
            <p className="text-sm font-semibold sm:text-base md:text-lg">
              {testimonialData.Name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
