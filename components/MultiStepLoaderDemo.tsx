"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
const loadingStates = [
  {
    text: "Fetching data",
  },
  {
    text: "Analyzing data",
  },
  {
    text: "Generating report",
  },
];

export function MultiStepLoaderDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
    </div>
  );
}
