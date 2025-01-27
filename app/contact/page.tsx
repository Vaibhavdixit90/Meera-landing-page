import Contact from "@/components/Contact";
import React from "react";

// Define the type for the fetched metadata structure
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

async function fetchContactMetadata() {
  const res = await fetch(
    "https://cms.flowautomate.io/api/contact-us?populate=Seo.metaImage,Seo.metaSocial.image",
    { cache: "no-store" },
  );
  const data = await res.json();

  const seoData = data?.data?.attributes?.Seo;
  const metaImage = seoData?.metaImage?.data?.attributes?.url || "";
  const metaImageAlt =
    seoData?.metaImage?.data?.attributes?.alternativeText ||
    "FlowAutomate Contact Us";

  // Extracting metadata for Facebook and Twitter
  const metaSocialFacebook = seoData?.metaSocial?.find(
    (item: SocialMediaMeta) => item.socialNetwork === "Facebook",
  );
  const metaSocialTwitter = seoData?.metaSocial?.find(
    (item: SocialMediaMeta) => item.socialNetwork === "Twitter",
  );

  const canonicalURL = seoData?.canonicalURL || "";

  return {
    title: seoData?.metaTitle || "",
    description: seoData?.metaDescription || "",
    openGraph: {
      title: metaSocialFacebook?.title || seoData?.metaTitle || "",
      description:
        metaSocialFacebook?.description || seoData?.metaDescription || "",
      url: `https://flowautomate.io${canonicalURL}`,
      images: [
        {
          url: `https://cms.flowautomate.io${metaImage}`,
          alt: metaImageAlt,
        },
        {
          url: `https://cms.flowautomate.io${metaSocialFacebook?.image?.data?.attributes?.url || metaImage}`,
          alt:
            metaSocialFacebook?.image?.data?.attributes?.alternativeText ||
            metaImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaSocialTwitter?.title || seoData?.metaTitle || "",
      description:
        metaSocialTwitter?.description || seoData?.metaDescription || "",
      images: [
        {
          url: `https://cms.flowautomate.io${metaSocialTwitter?.image?.data?.attributes?.url || metaImage}`,
          alt:
            metaSocialTwitter?.image?.data?.attributes?.alternativeText ||
            metaImageAlt,
        },
      ],
    },
    canonical: canonicalURL,
  };
}

// Export the metadata asynchronously
export const metadata = await fetchContactMetadata();

const page = () => {
  return <Contact />;
};

export default page;
