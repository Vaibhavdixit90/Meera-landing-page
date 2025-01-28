import Image from "next/image";

const features = [
  {
    title: "AI answer generator",
    description:
      "Get custom AI research, recommendations, data analysis and research assistance from AI Assistant. It can answer questions and generate insights by compiling information from millions of credible sources.",
    image:
      "https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg",
  },
  {
    title: "Document AI",
    description:
      "Let AI Assistant help you to summarize and draft documents, compare agreements, create presentations, analyze your PDFs, Word docs, and datasets.",
    image:
      "https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg",
  },
  {
    title: "Internet Access",
    description:
      "Real-time data access provides you with global insights powered by billions of online resources with up-to-date information.",
    image:
      "https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg",
  },
  {
    title: "Web & Mobile Platforms",
    description:
      "Interact with AI assistant anywhere, anywhere - our website and iOS/Android apps make personalized AI accessible 24/7.",
    image:
      "https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg",
  },
  {
    title: "Private & Secure",
    description:
      "Your encrypted messages keeping data fully secure. The AI learns only from what you want to share, with no compromises on privacy.",
    image:
      "https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg",
  },
];

export default function BentoGrid() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col py-10 px-4">
      <h1 className=" w-full md:max-w-[80%] text-center md:text-left text-3xl font-semibold leading-snug tracking-tight sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem] ">
        The cutting-edge AI, Proprietary tech, Redefining the future
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`relative mb-6 ${index === 0 ? "h-[200px] md:h-[300px]" : "h-[200px] md:h-[300px]"}`}
            >
              <Image
                src={feature.image || ""}
                alt={feature.title}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-semibold text-black text-xl mb-4">
                {feature.title}
              </h3>
              <p className="text-sm text-black leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
