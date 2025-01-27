"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

interface PlaceholdersAndVanishInputDemoProps {
  onSubmit: (inputValue: string) => void; // Update this to accept inputValue
}

export function PlaceholdersAndVanishInputDemo({ onSubmit }: PlaceholdersAndVanishInputDemoProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted value:", inputValue); 
    onSubmit(inputValue); // Pass inputValue to onSubmit
  };

  return (
    <PlaceholdersAndVanishInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
