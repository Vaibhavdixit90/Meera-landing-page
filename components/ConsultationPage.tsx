import React from "react";

const ConsultationPage = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gray-50 px-8 py-10 md:py-20 lg:px-24">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-pj text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">
              Create any landing page with Rareblocks
            </h2>
          </div>

          <ul className="mt-8 flex flex-col items-center justify-center space-y-5 sm:mt-12 md:flex-row md:space-x-12 md:space-y-0 lg:mt-16">
            <li className="flex items-center text-gray-900">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-pj ml-3 text-lg font-bold">
                {" "}
                150+ UI Blocks{" "}
              </span>
            </li>

            <li className="flex items-center text-gray-900">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-pj ml-3 text-lg font-bold">
                {" "}
                Fully Responsive{" "}
              </span>
            </li>

            <li className="flex items-center text-gray-900">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-pj ml-3 text-lg font-bold">
                {" "}
                Just Copy & Paste{" "}
              </span>
            </li>
          </ul>

          <div className="mt-8 text-center sm:mt-12">
            <div className="group relative inline-flex">
              <div
                className="absolute -inset-px rotate-180 rounded-xl opacity-70 blur-lg filter transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-100 group-hover:duration-200"
                style={{
                  background:
                    "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
                }}
              ></div>

              <a
                href="#"
                title=""
                className="font-pj relative inline-flex items-center justify-center rounded-xl border border-transparent bg-gray-900 px-9 py-3.5 text-base font-bold text-white transition-all duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                role="button"
              >
                Get Rareblocks
              </a>
            </div>

            <p className="font-pj mt-5 text-sm font-normal text-gray-500">
              No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationPage;
