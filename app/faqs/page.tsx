import FaqPage from "@/components/FaqPage";
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

async function fetchFaqMetadata() {
  const res = await fetch(
    "https://cms.flowautomate.io/api/faq?populate=SEO.metaImage,SEO.metaSocial.image",
    { cache: "no-store" },
  );
  const data = await res.json();

  const seoData = data.data.attributes.SEO;
  const metaImage = seoData.metaImage.data.attributes.url;
  const metaImageAlt =
    seoData.metaImage.data.attributes.alternativeText || "FlowAutomate FAQ";

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
      url: `https://flowautomate.io${canonicalURL}`,
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

// Export the metadata asynchronously
export const metadata = await fetchFaqMetadata();

const Page = () => {
  return <FaqPage />;
};

export default Page;
