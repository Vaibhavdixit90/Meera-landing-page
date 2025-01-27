// "use client";
// import { cn } from "@/lib/utils";
// import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useMotionValueEvent,
// } from "framer-motion";
// import Link from "next/link";
// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "./button";
// import { Logo } from "./logo";
// import { ModeToggle } from "./StatsForChangelog";
// import { useCalEmbed } from "@/app/hooks/useCalEmbed";
// import { CONSTANTS } from "@/constants/links";
// import { LinkPreview } from "./ui/link-preview";

// interface NavbarProps {
//   navItems: {
//     name: string;
//     link: string;
//     submenu?: JSX.Element;
//   }[];
//   visible: boolean;
// }

// export const Navbar = () => {
//   const navItems = [
//     { name: " Insights and Blogs ", link: "/blogs" },
//     { name: "Pricing", link: "/pricing" },
//   ];

//   const navItemsmobile = [
//     { name: " Insights and Blogs ", link: "/blogs" },
//     { name: "Pricing", link: "/pricing" },
//     { name: "Careers", link: "/careers" },
//     { name: "Contact", link: "/contact" },
//     { name: "FAQs", link: "/faqs" },
//   ];

//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollY } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   });
//   const [visible, setVisible] = useState<boolean>(false);

//   useMotionValueEvent(scrollY, "change", (latest) => {
//     if (latest > 100) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   });

//   return (
//     <motion.div
//       ref={ref}
//       className="fixed inset-x-0 top-[0px] z-50 flex w-full items-center justify-center md:top-2"
//     >
//       <DesktopNav visible={visible} navItems={navItems} />
//       <MobileNav visible={visible} navItems={navItemsmobile} />
//     </motion.div>
//   );
// };

// const DesktopNav = ({ navItems, visible }: NavbarProps) => {
//   const [hovered, setHovered] = useState<number | null>(null);
//   const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
//     null,
//   );

//   const calOptions = useCalEmbed({
//     namespace: CONSTANTS.CALCOM_NAMESPACE,
//     styles: {
//       branding: {
//         brandColor: CONSTANTS.CALCOM_BRAND_COLOR,
//       },
//     },
//     hideEventTypeDetails: CONSTANTS.CALCOM_HIDE_EVENT_TYPE_DETAILS,
//     layout: CONSTANTS.CALCOM_LAYOUT,
//   });

//   // Scroll detection logic
//   useEffect(() => {
//     let lastScrollY = window.scrollY;

//     const updateScrollDirection = () => {
//       const scrollY = window.scrollY;
//       const direction = scrollY > lastScrollY ? "down" : "up";
//       if (
//         direction !== scrollDirection &&
//         Math.abs(scrollY - lastScrollY) > 10
//       ) {
//         setScrollDirection(direction);
//       }
//       lastScrollY = scrollY;
//     };

//     window.addEventListener("scroll", updateScrollDirection);
//     return () => {
//       window.removeEventListener("scroll", updateScrollDirection);
//     };
//   }, [scrollDirection]);

//   // Framer Motion variants for staggered and smooth transition
//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         staggerChildren: 0.1,
//         duration: 0.5,
//         ease: "easeInOut",
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut",
//       },
//     },
//   };

//   return (
//     <motion.div
//       onMouseLeave={() => setHovered(null)}
//       animate={{
//         backdropFilter: visible ? "blur(10px)" : "none",
//         boxShadow: visible
//           ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
//           : "none",
//         y: visible ? 1 : 0,
//         width: "100%",
//         minWidth: "800px",
//       }}
//       transition={{
//         type: "spring",
//         stiffness: 200,
//         damping: 50,
//       }}
//       className={cn(
//         "relative z-[60] hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-[10px] bg-transparent px-4 py-2 dark:bg-transparent lg:flex",
//         visible && "bg-white/90 dark:bg-neutral-950/90",
//       )}
//     >
//       <Logo />
//       <motion.div
//         className={cn(
//           "hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
//           scrollDirection === "down" ? "opacity-0" : "opacity-100",
//         )}
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         {navItems.map((navItem: any, idx: number) => (
//           <motion.div
//             key={`nav-item-${idx}`}
//             onMouseEnter={() => setHovered(idx)}
//             onMouseLeave={() => setHovered(null)}
//             className="relative"
//             variants={itemVariants}
//           >
//             <Link
//               className="group relative flex items-center px-4 py-2 text-neutral-600 dark:text-neutral-300"
//               href={navItem.link}
//             >
//               <span className="relative z-20 font-bold transition duration-200">
//                 {navItem.name}
//               </span>
//               {hovered === idx && (
//                 <span className="absolute left-0 right-0 top-full mt-1 border-b-2 border-yellow-500"></span>
//               )}
//             </Link>

//             {/* Dropdown Menu */}
//             <AnimatePresence>
//               {hovered === idx && navItem?.submenu && <>{navItem?.submenu}</>}
//             </AnimatePresence>
//           </motion.div>
//         ))}
//       </motion.div>
//       <div className="relative flex items-center gap-4">
//         <ModeToggle />
//         <LinkPreview>
//           <Button
//             as={Link}
//             href="/explore-meera"
//             variant="primary"
//             className="hidden bg-black text-white dark:bg-[#1c1c1c] dark:text-gray-200 md:block"
//           >
//             Explore Meera
//           </Button>
//         </LinkPreview>
//         <Button
//           as={Link}
//           href="/contact"
//           variant="primary"
//           className="block md:block"
//         >
//           Get&nbsp;Started
//         </Button>
//       </div>
//     </motion.div>
//   );
// };

// const MobileNav = ({ navItems, visible }: NavbarProps) => {
//   const [open, setOpen] = useState(false);
//   const [expandedItem, setExpandedItem] = useState<number | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const calOptions = useCalEmbed({
//     namespace: "chat-with-manu-demo",
//     styles: {
//       branding: {
//         brandColor: "#000000",
//       },
//     },
//     hideEventTypeDetails: false,
//     layout: "month_view",
//   });

//   const toggleAccordion = (index: number) => {
//     setExpandedItem(expandedItem === index ? null : index);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open]);

//   return (
//     <>
//       <motion.div
//         animate={{
//           backdropFilter: visible ? "blur(10px)" : "none",
//           boxShadow: visible
//             ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
//             : "none",
//           width: visible ? "90%" : "100%",
//           y: visible ? 20 : 0,
//           borderRadius: visible ? "10px" : "0px",
//           paddingRight: visible ? "12px" : "0px",
//           paddingLeft: visible ? "12px" : "0px",
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 200,
//           damping: 50,
//         }}
//         className={cn(
//           "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
//           visible && "bg-white/80 dark:bg-neutral-950/80",
//         )}
//       >
//         <div className="flex w-full flex-row items-center justify-between">
//           <Logo />
//           <div className="flex items-center space-x-6">
//             <ModeToggle />
//             {open ? (
//               <IconX
//                 className="text-black dark:text-white"
//                 onClick={() => setOpen(!open)}
//               />
//             ) : (
//               <IconMenu2
//                 className="text-black dark:text-white"
//                 onClick={() => setOpen(!open)}
//               />
//             )}
//           </div>
//         </div>

//         <AnimatePresence>
//           {open && (
//             <motion.div
//               ref={containerRef} // Reference to the container
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-[10px] bg-white p-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
//             >
//               {navItems.map((navItem, idx) => (
//                 <div key={`link-${idx}`} className="w-full">
//                   {navItem.submenu ? (
//                     <div className="w-full">
//                       <button
//                         className="relative flex w-full items-center justify-between text-neutral-600 dark:text-neutral-300"
//                         onClick={() => toggleAccordion(idx)}
//                       >
//                         <span>{navItem.name}</span>
//                         <motion.div
//                           animate={{ rotate: expandedItem === idx ? 180 : 0 }}
//                         >
//                           <IconChevronDown />
//                         </motion.div>
//                       </button>

//                       <AnimatePresence>
//                         {expandedItem === idx && (
//                           <motion.div
//                             initial={{ height: 0, opacity: 0 }}
//                             animate={{ height: "auto", opacity: 1 }}
//                             exit={{ height: 0, opacity: 0 }}
//                             className="overflow-hidden"
//                           >
//                             {navItem.submenu}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   ) : (
//                     <Link
//                       href={navItem.link}
//                       onClick={() => setOpen(false)}
//                       className="relative block w-full text-xl text-black"
//                     >
//                       {navItem.name}
//                     </Link>
//                   )}
//                 </div>
//               ))}

//               <Button
//                 as={Link}
//                 onClick={() => setOpen(false)}
//                 href="/contact"
//                 variant="primary"
//                 className="block w-full text-base md:hidden"
//               >
//                 Get Started
//               </Button>
//               <Button
//                 as={Link}
//                 href="/explore-meera"
//                 onClick={() => setOpen(false)}
//                 variant="primary"
//                 className="block w-full text-base md:hidden"
//               >
//                 Explore Meera
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </>
//   );
// };
