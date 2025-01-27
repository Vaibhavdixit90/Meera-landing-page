"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// Define the types for the props
interface PlaceholdersAndVanishTextareaProps {
  value: string; // Expecting a string
  setValue: (value: string) => void; // Function to set the value
  placeholders: string[]; // Array of string placeholders
  onSubmit?: (value: string) => void; // Optional submit handler
}

export function PlaceholdersAndVanishTextarea({
  value,
  setValue,
  placeholders,
  onSubmit,
}: PlaceholdersAndVanishTextareaProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 7000);
  };

  const startTypewriter = () => {
    clearInterval(typewriterIntervalRef.current!); // Use non-null assertion
    setCharIndex(0);
    typewriterIntervalRef.current = setInterval(() => {
      setCharIndex((prev) => {
        if (prev < placeholders[currentPlaceholder]?.length) {
          return prev + 1;
        } else {
          clearInterval(typewriterIntervalRef.current!);
          return prev;
        }
      });
    }, 30);
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startTypewriter();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(typewriterIntervalRef.current!);
    };
  }, [placeholders, currentPlaceholder]);

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      clearInterval(typewriterIntervalRef.current!);
    } else if (document.visibilityState === "visible") {
      startAnimation();
      startTypewriter();
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const newDataRef = useRef<any[]>([]); // Adjust this type as necessary
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!textareaRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(textareaRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  const animate = (start: number) => {
    const animateFrame = (pos = start) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  const resetRows = () => {
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
    }
  };

  const vanishAndSubmit = () => {
    setAnimating(true);
    draw();

    const currentValue = textareaRef.current?.value || "";
    if (currentValue) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0,
      );
      animate(maxX);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
    onSubmit && onSubmit(value);
    resetRows();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !animating) {
      // Call the handleSubmit function directly to handle form submission
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // Cast to match the expected type
    }
  };
  return (
    <div className="flex w-full items-center justify-center p-0 sm:relative md:p-3">
      <div className="relative flex w-full items-center pt-3">
        <form
          className={cn("relative flex w-full")}
          style={{
            background: "#f5f5f7",
            borderRadius: "15px",
            border: "2px solid #c8c8ca",
          }}
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <textarea
              onChange={(e) => {
                if (!animating) {
                  setValue(e.target.value);
                }
              }}
              ref={textareaRef}
              value={value}
              onKeyDown={handleKeyDown}
              rows={1}
              onFocus={(e) => {
                setIsFocused(true);
                e.target.rows = 4;
              }}
              onBlur={(e) => {
                setIsFocused(false);
                if (!value) e.target.rows = 1;
              }}
              className={cn(
                "relative z-10 ml-4 mt-2 h-full w-full rounded-lg border-none bg-transparent py-0 pl-4 pr-20 text-black focus:outline-none focus:ring-0 dark:text-black",
                "overflow-y-auto",
                "max-h-40",
                "transition-all duration-500 ease-in-out",
                "resize-none",
                animating && "text-transparent dark:text-transparent",
              )}
              style={{
                height: isFocused ? "136px" : "30px",
                outline: "none",
              }}
            />
          </div>
          <div className="flex w-12 items-end justify-center">
            <button
              disabled={!value}
              type="submit"
              className="z-10 mb-[6px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gray-900 text-gray-100 disabled:cursor-not-allowed dark:text-white"
            >
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Placeholder display */}
        {!isFocused && (
          <div className="absolute left-8 top-0 mt-9 flex -translate-y-1/2 transform md:left-12">
            <AnimatePresence mode="wait">
              {!value && (
                <motion.span
                  className="max-w-[600px] text-sm text-gray-500 md:text-base" // Adjusted text size for mobile
                  key={currentPlaceholder}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 1 }}
                >
                  {placeholders[currentPlaceholder]?.slice(0, charIndex)}{" "}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
