import { RainbowButton } from "@/components/ui/rainbow-button";

// Define the expected structure of the pricing data
interface PricingData {
  Section_Title: string;
  Section_Description: string;
  Button_href: string;
  Steps: {
    id: number;
    Tittle: string;
    Points: {
      id: number;
      Tittle: string;
      Point: string;
    }[];
    Price: string;
  }[];
}

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

async function fetchPricingMetadata() {
  const res = await fetch(
    "https://cms.flowautomate.io/api/pricing?populate=SEO.metaImage,SEO.metaSocial.image",
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
export const metadata = await fetchPricingMetadata();

async function getPricingData() {
  const res = await fetch(
    "https://cms.flowautomate.io/api/pricing?populate[Steps][populate]=Points",
    { cache: "no-store" },
  );
  const data = await res.json();
  return data.data.attributes;
}

export default async function Pricing() {
  // Fetch data server-side
  const pricingData: PricingData = await getPricingData();

  return (
    <div className="mx-auto mt-16 max-w-7xl px-4 py-20 md:mt-28 md:px-8">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {pricingData.Section_Title}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-12 md:mt-12 md:grid-cols-2 md:gap-8">
        {pricingData.Steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex min-h-[400px] flex-col rounded-lg border border-gray-300 p-10"
          >
            <span
              className="absolute left-1.5 top-1 -ml-px hidden h-full w-px bg-gray-700 lg:left-24 lg:top-14 lg:block lg:h-px lg:w-[50%]"
              aria-hidden="true"
            ></span>

            <div className="font-bold">Step {index + 1}</div>
            <div className="mt-4 flex-grow">
              <h3 className="text-2xl font-semibold">{step.Tittle}</h3>
              <ul className="mt-10 space-y-2">
                {step.Points.map((point) => (
                  <li key={point.id}>
                    <span className="text-green-500">✔</span>{" "}
                    <strong>{point.Tittle}:</strong> {point.Point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <h1 className="text-2xl font-bold">{step.Price}</h1>
            </div>
          </div>
        ))}
      </div>

      <div className="my-12 w-full items-center md:max-w-[80%]">
        <p className="text-left">{pricingData.Section_Description}</p>
      </div>

      <RainbowButton href={pricingData.Button_href} className="px-24 py-7">
        Get Started - Step 01
      </RainbowButton>
    </div>
  );
}
