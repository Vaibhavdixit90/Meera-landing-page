import React from "react";
import Image from "next/image";

const StepsCard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col px-4 py-20 md:px-8">
      <h1 className=" w-full md:max-w-[80%] text-center md:text-left  text-3xl font-semibold leading-snug tracking-tight text-black dark:text-neutral-300 sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
        Customize your AI's Knowledge
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full mt-10">
        {/* Card 1 */}
        <div className="p-8 rounded-2xl shadow-xl flex-1 bg-white dark:bg-black dark:border-white dark:border-2">
          <Image
            src="https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg"
            alt="AI Training"
            width={600}
            height={600}
            className="mx-auto mb-6 rounded-lg"
          />
          <h3 className="text-2xl font-bold mb-4 text-left">
            Step 1: Train Your Artificial Intelligence
          </h3>
          <p className="text-base  text-left">
            When you find interesting articles, videos, or tweets, share them
            with the AI Assistant. It will read and absorb key insights,
            creating a personalized knowledge base just for you.
          </p>
        </div>
        {/* Card 2 */}
        <div className="p-8 rounded-2xl shadow-xl flex-1 bg-white dark:bg-black dark:border-white dark:border-2">
          <Image
            src="https://cms.flowautomate.io/uploads/Flow_Automate_1_0f32437847.jpeg"
            alt="Personalized Suggestions"
            width={600}
            height={600}
            className="mx-auto mb-6 rounded-lg"
          />
          <h3 className="text-2xl font-bold mb-4 text-left">
            Step 2: Get Personalized Suggestions
          </h3>
          <p className="text-base  text-left">
            Later, ask the AI Assistant for advice on related topics. It will
            provide customized suggestions and actionable insights based on its
            growing knowledge.
          </p>
        </div>
      </div>
      {/* <div className="flex justify-center mt-10">
        <Button
          as={Link}
          href="/contact"
          variant="primary"
          className="group flex items-center space-x-2 px-10 py-3 dark:bg-[#1c1c1c] dark:text-gray-200 md:px-12"
        >
          Get In Touch
        </Button>
      </div> */}
    </div>
  );
};

export default StepsCard;
