import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Toc } from "@/components/Toc";
import Link from "next/link";

type Section = {
  id: number;
  Content: string;
  Section_id: string;
};

type TableOfContentItem = {
  Title: string;
  section_id: string;
};

type PressAndMediaAttributes = {
  Title: string;
  createdAt: string;
  slug: string;
  Short_Description: string;
  Press_link?: string;
  Images: {
    Banner_image?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  };
  Press_Media_Sections: Section[];
  Table_of_content: TableOfContentItem[];
};

type PressAndMediaData = {
  id: number;
  attributes: PressAndMediaAttributes;
};

type ApiResponse = {
  data: PressAndMediaData[];
};

const BASE_URL = "https://cms.flowautomate.io";

type PressAndMediaSingleProps = {
  slug: string;
};

const PressAndMediaSingle: React.FC<PressAndMediaSingleProps> = ({ slug }) => {
  const [pressData, setPressData] = useState<PressAndMediaData | null>(null);

  useEffect(() => {
    async function fetchPressData() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/press-and-medias?populate=Images.Banner_image,Categories,Press_Media_Sections,Table_of_content`,
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: ApiResponse = await res.json();
        const pressItem = data.data.find(
          (item) => item.attributes.slug === slug,
        );
        setPressData(pressItem || null);
      } catch (error) {
        console.error("Error fetching press data:", error);
      }
    }
    fetchPressData();
  }, [slug]);

  if (!pressData) {
    return <div>Loading...</div>;
  }

  const pressItem = {
    title: pressData.attributes.Title,
    date: pressData.attributes.createdAt,
    thumbnail:
      BASE_URL +
      (pressData.attributes.Images?.Banner_image?.data?.attributes?.url || ""),
    pressLink: pressData.attributes.Press_link,
    sections: pressData.attributes.Press_Media_Sections || [],
    tableOfContent: pressData.attributes.Table_of_content || [],
  };

  const tocLinks = pressItem.tableOfContent.map((item) => ({
    title: item.Title,
    href: `#${item.section_id}`,
  }));

  return (
    <div className="mx-auto mt-16 flex w-full max-w-7xl flex-col gap-4 px-4 py-20 md:mt-28 md:flex-row md:px-8">
      <Toc links={tocLinks} />

      <div className="flex max-w-7xl flex-1 flex-col">
        <Image
          src={pressItem.thumbnail}
          alt={pressItem.title}
          className="h-60 w-full rounded-3xl object-cover md:h-[30rem]"
          height={720}
          width={1024}
          loading="lazy"
        />
        <h2 className="mb-2 mt-6 text-2xl font-bold tracking-tight text-black dark:text-white">
          {pressItem.title}
        </h2>
        <div className="mt-8">
          {pressItem.sections.map((section) => (
            <div
              key={section.id}
              id={section.Section_id}
              className="blog-section mb-8"
              dangerouslySetInnerHTML={{ __html: section.Content }}
            />
          ))}
        </div>

        {pressItem.pressLink && (
          <div className="mt-6">
            <Link
              href={pressItem.pressLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-black py-2 text-center text-white dark:bg-gray-600 dark:text-gray-200"
            >
              Go to Press
            </Link>
          </div>
        )}

        <div className="mt-10 max-w-2xl">
          <div className="h-px w-full bg-neutral-200 dark:bg-neutral-900" />
          <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="mt-10 flex items-center">
          <div className="mx-2 h-1 w-1 rounded-full bg-black dark:bg-white" />
          <p className="pl-1 text-sm text-neutral-600 dark:text-neutral-400">
            {format(new Date(pressItem.date), "LLLL d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PressAndMediaSingle;
