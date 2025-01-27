import React from "react";
import HomePage from "@/components/HomePage";
import { Metadata } from "next";

// Define types for the metadata structure
type SocialMediaMeta = {
  socialNetwork: string;
  title: string;
  description: string;
  image: {
    data: {
      attributes: {
        url: string;
        alternativeText: string | null;
      };
    };
  };
};

async function fetchMetadata() {
  const res = await fetch(
    "https://cms.flowautomate.io/api/homepage?populate=Seo.metaImage,Seo.metaSocial.image",
    { cache: "no-store" },
  );
  const data = await res.json();

  const seoData = data.data.attributes.Seo;
  const metaImage = seoData.metaImage.data.attributes.url;
  const metaImageAlt =
    seoData.metaImage.data.attributes.alternativeText || "FlowAutomate Home";

  // Extracting metadata for Facebook and Twitter
  const metaSocialFacebook = seoData.metaSocial.find(
    (item: SocialMediaMeta) => item.socialNetwork === "Facebook",
  );
  const metaSocialTwitter = seoData.metaSocial.find(
    (item: SocialMediaMeta) => item.socialNetwork === "Twitter",
  );

  const canonicalURL = seoData.canonicalURL;

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    openGraph: {
      title: metaSocialFacebook?.title || seoData.metaTitle,
      description: metaSocialFacebook?.description || seoData.metaDescription,
      url: canonicalURL,
      images: [
        {
          url: `https://cms.flowautomate.io${metaImage}`,
          alt: metaImageAlt,
        },
        {
          url: `https://cms.flowautomate.io${metaSocialFacebook?.image.data.attributes.url || metaImage}`,
          alt:
            metaSocialFacebook?.image.data.attributes.alternativeText ||
            metaImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaSocialTwitter?.title || seoData.metaTitle,
      description: metaSocialTwitter?.description || seoData.metaDescription,
      images: [
        {
          url: `https://cms.flowautomate.io${metaSocialTwitter?.image.data.attributes.url || metaImage}`,
          alt:
            metaSocialTwitter?.image.data.attributes.alternativeText ||
            metaImageAlt,
        },
      ],
    },
    canonical: canonicalURL,
  };
}

// Define a metadata type for the page
export const metadata: Metadata = await fetchMetadata();

const Page = () => {
  return (
    <>
      <HomePage />
    </>
  );
};

export default Page;
