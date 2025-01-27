"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  className?: string;
};

export const LinkPreview = ({ children, className }: LinkPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={100}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn("text-black dark:text-white", className)}
      >
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="z-50"
        side="top"
        align="center"
        sideOffset={10}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="rounded-xl shadow-xl"
              style={{ x: translateX }}
            >
              <div className="max-w-xs rounded-md bg-[#000000e3] px-4 py-4 shadow-lg dark:bg-[#ffffff] sm:max-w-md md:max-w-lg">
                <h2 className="pb-2 text-sm font-bold text-white dark:text-black md:text-base">
                  See what Meera can do for your store!
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};
