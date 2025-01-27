"use client";

import { useState } from "react";
import { SearchPlacholders } from "./ui/searchPlacholders";

interface SearchProps {
  onSubmit: (inputValue: string) => void;
  placeholder: string;
}

export function Search({ onSubmit, placeholder }: SearchProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <SearchPlacholders
      onChange={handleChange}
      onSubmit={handleSubmit}
      placeholder={placeholder}  // Pass placeholder here
    />
  );
}
