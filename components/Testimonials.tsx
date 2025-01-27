"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image"; // Import Next.js Image component

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  Stars: number;
  className?: string;
  [key: string]: any;
}

// Define the type for the fetched testimonials
interface Testimonial {
  Name: string;
  Role: string;
  image: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  Review: string;
  Stars: number;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  Stars,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      "border border-neutral-200 bg-white",
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        {/* Display 5 stars, filled based on `Stars` */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <StarFilledIcon
            key={idx}
            className={`size-4 ${idx < Stars ? "text-yellow-500" : "text-neutral-300"}`} // Color filled stars yellow, others white
          />
        ))}
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      {/* Use Next.js Image component */}
      {img && (
        <Image
          src={img}
          alt={name}
          width={40}
          height={40}
          loading="lazy"
          quality={100}
          className="rounded-full ring-1 ring-border ring-offset-4"
        />
      )}
      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialCardProps[]>([]); // Correct type for state

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await fetch(
        "https://cms.flowautomate.io/api/homepage?populate[Testimonials][populate]=*",
      );
      const data = await response.json();

      // Mapping the fetched data to match TestimonialCardProps
      const mappedTestimonials: TestimonialCardProps[] =
        data.data.attributes.Testimonials.map((item: Testimonial) => ({
          name: item.Name, // Map to name
          role: item.Role, // Map to role
          img: `https://cms.flowautomate.io${item.image.data.attributes.url}`, // Add base URL
          description: <p>{item.Review}</p>, // Wrap review in a paragraph
          Stars: item.Stars, // Map to Stars
        }));

      setTestimonials(mappedTestimonials);
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="mx-auto max-w-7xl py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative max-h-[650px] overflow-hidden">
          <div className="gap-4 md:columns-3 lg:columns-4">
            {Array(Math.ceil(testimonials.length / 3))
              .fill(0)
              .map((_, i) => (
                <Marquee
                  vertical
                  key={i}
                  className={cn({
                    "[--duration:60s]": i === 1,
                    "[--duration:30s]": i === 2,
                    "[--duration:70s]": i === 3,
                  })}
                >
                  {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                    <TestimonialCard {...card} key={idx} />
                  ))}
                </Marquee>
              ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-white from-20% dark:from-black"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-white from-20% dark:from-black"></div>
        </div>
      </div>
    </section>
  );
}
