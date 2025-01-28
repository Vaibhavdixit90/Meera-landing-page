"use client";
import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { ConfettiButton } from "./ui/confetti";
import { InView } from "./in-view";

const DemoStoreCard = (props: {}) => {
  const [popupData, setPopupData] = useState<{
    title: string;
    badge?: string;
    Icon?: React.ElementType;
  } | null>(null);

  const handleOpenPopup = (
    title: string,
    badge?: string,
    Icon?: React.ElementType
  ) => {
    setPopupData({ title, badge, Icon });
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  const ShopifySVG = () => (
    <svg
      viewBox="0 0 448 512"
      fill="currentColor"
      height="3em"
      width="3em"
      {...props}
    >
      <path d="M388.32 104.1a4.66 4.66 0 00-4.4-4c-2 0-37.23-.8-37.23-.8s-21.61-20.82-29.62-28.83V503.2L442.76 472s-54.04-365.5-54.44-367.9zm-99.67-33.63a116.67 116.67 0 00-7.21-17.61C271 32.85 255.42 22 237 22a15 15 0 00-4 .4c-.4-.8-1.2-1.2-1.6-2-8-8.77-18.4-12.77-30.82-12.4-24 .8-48 18-67.25 48.83-13.61 21.62-24 48.84-26.82 70.06-27.62 8.4-46.83 14.41-47.23 14.81-14 4.4-14.41 4.8-16 18-1.2 10-38 291.82-38 291.82L307.86 504V65.67a41.66 41.66 0 00-4.4.4s-5.6 1.6-14.81 4.4zm-55.24 17.22c-16 4.8-33.63 10.4-50.84 15.61 4.8-18.82 14.41-37.63 25.62-50 4.4-4.4 10.41-9.61 17.21-12.81 6.81 14.37 8.41 33.99 8.01 47.2zm-32.83-63.25A27.49 27.49 0 01215 28c-6.4 3.2-12.81 8.41-18.81 14.41-15.21 16.42-26.82 42-31.62 66.45-14.42 4.41-28.83 8.81-42 12.81 8.76-38.39 41.18-96.43 78.01-97.23zm-46.43 220.17c1.6 25.61 69.25 31.22 73.25 91.66 2.8 47.64-25.22 80.06-65.65 82.47-48.83 3.2-75.65-25.62-75.65-25.62l10.4-44s26.82 20.42 48.44 18.82c14-.8 19.22-12.41 18.81-20.42-2-33.62-57.24-31.62-60.84-86.86-3.2-46.44 27.22-93.27 94.47-97.68 26-1.6 39.23 4.81 39.23 4.81l-15.21 57.6s-17.21-8-37.63-6.4c-29.62 2.01-30.02 20.81-29.62 25.62zm95.27-161.73c0-12-1.6-29.22-7.21-43.63 18.42 3.6 27.22 24 31.23 36.43q-10.81 3-24.02 7.2z" />
    </svg>
  );
  const WooCommerceSVG = () => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="3em"
      width="3em"
      {...props}
    >
      <path d="M2.227 4.857A2.228 2.228 0 000 7.094v7.457a2.236 2.236 0 002.237 2.237h9.253l4.229 2.355-.962-2.355h7.006c1.236 0 2.237-1 2.237-2.237V7.094c0-1.236-1-2.237-2.237-2.237zm8.08 1.311a.862.862 0 01.535.2.769.769 0 01.304.56.851.851 0 01-.098.47c-.382.707-.696 1.894-.951 3.542-.246 1.6-.334 2.846-.275 3.739.02.245-.02.46-.118.647a.632.632 0 01-.52.353c-.255.02-.52-.098-.775-.362-.913-.933-1.639-2.326-2.169-4.18a184.085 184.085 0 00-1.413 2.825c-.578 1.11-1.069 1.678-1.481 1.708-.265.02-.49-.206-.687-.677-.5-1.286-1.04-3.768-1.619-7.448-.03-.255.02-.48.157-.657.137-.186.344-.284.618-.304.5-.04.785.196.854.706.304 2.051.638 3.788.991 5.21l2.149-4.09c.196-.373.441-.57.736-.589.431-.03.696.245.804.824.246 1.305.56 2.414.932 3.356.255-2.492.687-4.288 1.295-5.397.148-.274.363-.412.648-.431a.866.866 0 01.084-.004zm3.734 1.063c.167 0 .343.02.53.06a2.28 2.28 0 011.57 1.137c.314.53.47 1.168.47 1.933a5.25 5.25 0 01-.765 2.777c-.588.981-1.354 1.472-2.305 1.472a2.59 2.59 0 01-.53-.059c-.697-.147-1.217-.52-1.57-1.138-.314-.54-.471-1.187-.471-1.943 0-1.01.255-1.933.765-2.767.599-.981 1.364-1.472 2.306-1.472zm6.152 0c.167 0 .343.02.53.06.696.146 1.216.52 1.57 1.137.314.53.47 1.168.47 1.933a5.25 5.25 0 01-.765 2.777c-.588.981-1.354 1.472-2.305 1.472a2.59 2.59 0 01-.53-.059c-.697-.147-1.217-.52-1.57-1.138-.314-.54-.471-1.187-.471-1.943 0-1.01.255-1.933.765-2.767.599-.981 1.364-1.472 2.306-1.472zm-6.107 1.645c-.307-.002-.606.201-.889.622a3.173 3.173 0 00-.52 1.168 3.34 3.34 0 00-.069.716c0 .284.06.589.177.893.147.382.343.589.579.638.245.049.51-.06.795-.315.363-.323.608-.804.745-1.452.05-.225.069-.47.069-.726a2.49 2.49 0 00-.176-.893c-.148-.382-.344-.588-.58-.637a.714.714 0 00-.131-.014zm6.152 0c-.307-.002-.606.201-.889.622a3.173 3.173 0 00-.52 1.168c-.049.225-.069.47-.069.716 0 .284.06.589.177.893.147.382.344.589.579.638.245.049.51-.06.795-.315.363-.323.608-.804.745-1.452.04-.225.07-.47.07-.726a2.49 2.49 0 00-.177-.893c-.148-.382-.344-.588-.58-.637a.714.714 0 00-.131-.014z" />
    </svg>
  );

  const BigCommerceSVG = () => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="3em"
      width="3em"
      {...props}
    >
      <path d="M12.645 13.663h3.027c.861 0 1.406-.474 1.406-1.235 0-.717-.545-1.234-1.406-1.234h-3.027c-.1 0-.187.086-.187.172v2.125c.015.1.086.172.187.172zm0 4.896h3.128c.961 0 1.535-.488 1.535-1.35 0-.746-.545-1.35-1.535-1.35h-3.128c-.1 0-.187.087-.187.173v2.34c.015.115.086.187.187.187zM23.72.053l-8.953 8.93h1.464c2.281 0 3.63 1.435 3.63 3 0 1.235-.832 2.14-1.722 2.541-.143.058-.143.259.014.316 1.033.402 1.765 1.48 1.765 2.742 0 1.78-1.19 3.202-3.5 3.202h-6.342c-.1 0-.187-.086-.187-.172V13.85L.062 23.64c-.13.13-.043.359.143.359h23.631a.16.16 0 00.158-.158V.182c.043-.158-.158-.244-.273-.13z" />
    </svg>
  );

  // const WixSvg = () => (
  //   <svg
  //     viewBox="0 0 24 24"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M13.444 8.256c-.4.212-.544.562-.544 1.53 0 0 .202-.194.499-.303a2.01 2.01 0 00.512-.275c.338-.247.385-.562.385-1.096 0 0-.553-.016-.852.144zm-2.349.229c-.32.286-.418.739-.418.739l-1.078 4.141L8.71 9.97c-.087-.355-.246-.808-.495-1.107-.31-.378-.944-.401-1.015-.401-.068 0-.709.023-1.026.407-.246.303-.406.751-.493 1.108l-.889 3.395-1.066-4.147s-.092-.459-.418-.739c-.529-.465-1.314-.367-1.314-.367l2.048 7.764s.677.052 1.015-.126c.441-.224.659-.401.929-1.463.241-.94.912-3.704.974-3.905.029-.098.07-.332.241-.332.179 0 .214.229.241.332.064.195.729 2.965.976 3.905.268 1.055.481 1.227.929 1.463.338.178 1.015.126 1.015.126l2.048-7.759c-.002 0-.789-.099-1.315.361zm3.201.9s-.129.195-.42.367c-.188.104-.367.178-.562.271-.323.154-.414.332-.414.595v5.266s.522.063.854-.104c.436-.222.533-.435.541-1.404V9.385zm5.112 2.632l2.599-3.875s-1.096-.189-1.641.309c-.35.315-.738.885-.738.885l-.952 1.386c-.053.069-.104.15-.2.15-.099 0-.161-.075-.202-.15l-.962-1.382s-.385-.568-.74-.884c-.54-.499-1.641-.31-1.641-.31l2.603 3.865-2.603 3.858s1.146.149 1.688-.35c.35-.315.688-.837.688-.837l.95-1.383c.053-.068.104-.147.2-.147.1 0 .161.075.202.147l.952 1.383s.355.51.7.837c.538.499 1.667.35 1.667.35l-2.57-3.852z" />
  //   </svg>
  // );

  // const WebFlowSvg = () => (
  //   <svg
  //     viewBox="0 0 24 24"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M17.802 8.56s-1.946 6.103-2.105 6.607a4778.8 4778.8 0 00-1.484-11.473c-3.316 0-5.089 2.36-6.026 4.851l-2.565 6.637c-.015-.476-.36-6.565-.36-6.565-.204-3.052-3-4.91-5.262-4.91l2.739 16.6c3.474-.015 5.347-2.361 6.328-4.852 0 0 2.09-5.398 2.176-5.643.015.23 1.5 10.494 1.5 10.494 3.488 0 5.362-2.202 6.37-4.606L24 3.708c-3.445 0-5.261 2.346-6.198 4.851z" />
  //   </svg>
  // );

  // const HubSpotSvg = () => (
  //   <svg
  //     viewBox="0 0 24 24"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446 6.22 6.22 0 001.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" />
  //   </svg>
  // );

  // const OpenCartSvg = () => (
  //   <svg
  //     viewBox="0 0 640 512"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M423.3 440.7c0 25.3-20.3 45.6-45.6 45.6s-45.8-20.3-45.8-45.6 20.6-45.8 45.8-45.8c25.4 0 45.6 20.5 45.6 45.8zm-253.9-45.8c-25.3 0-45.6 20.6-45.6 45.8s20.3 45.6 45.6 45.6 45.8-20.3 45.8-45.6-20.5-45.8-45.8-45.8zm291.7-270C158.9 124.9 81.9 112.1 0 25.7c34.4 51.7 53.3 148.9 373.1 144.2 333.3-5 130 86.1 70.8 188.9 186.7-166.7 319.4-233.9 17.2-233.9z" />
  //   </svg>
  // );

  // const AdobeSvg = () => (
  //   <svg
  //     viewBox="0 0 24 24"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624z" />
  //   </svg>
  // );

  // const SquareSpaceSvg = () => (
  //   <svg
  //     viewBox="0 0 512 512"
  //     fill="currentColor"
  //     height="3em"
  //     width="3em"
  //     {...props}
  //   >
  //     <path d="M186.12 343.34c-9.65 9.65-9.65 25.29 0 34.94 9.65 9.65 25.29 9.65 34.94 0L378.24 221.1c19.29-19.29 50.57-19.29 69.86 0s19.29 50.57 0 69.86L293.95 445.1c19.27 19.29 50.53 19.31 69.82.04l.04-.04 119.25-119.24c38.59-38.59 38.59-101.14 0-139.72-38.59-38.59-101.15-38.59-139.72 0l-157.22 157.2zm244.53-104.8c-9.65-9.65-25.29-9.65-34.93 0l-157.2 157.18c-19.27 19.29-50.53 19.31-69.82.05l-.05-.05c-9.64-9.64-25.27-9.65-34.92-.01l-.01.01c-9.65 9.64-9.66 25.28-.02 34.93l.02.02c38.58 38.57 101.14 38.57 139.72 0l157.2-157.2c9.65-9.65 9.65-25.29.01-34.93zm-261.99 87.33l157.18-157.18c9.64-9.65 9.64-25.29 0-34.94-9.64-9.64-25.27-9.64-34.91 0L133.72 290.93c-19.28 19.29-50.56 19.3-69.85.01l-.01-.01c-19.29-19.28-19.31-50.54-.03-69.84l.03-.03L218.03 66.89c-19.28-19.29-50.55-19.3-69.85-.02l-.02.02L28.93 186.14c-38.58 38.59-38.58 101.14 0 139.72 38.6 38.59 101.13 38.59 139.73.01zm-87.33-52.4c9.64 9.64 25.27 9.64 34.91 0l157.21-157.19c19.28-19.29 50.55-19.3 69.84-.02l.02.02c9.65 9.65 25.29 9.65 34.93 0 9.65-9.65 9.65-25.29 0-34.93-38.59-38.59-101.13-38.59-139.72 0L81.33 238.54c-9.65 9.64-9.65 25.28-.01 34.93h.01z" />
  //   </svg>
  // );

  const CustomSvg = () => (
    <svg
      viewBox="0 0 448 512"
      fill="currentColor"
      height="3em"
      width="3em"
      {...props}
    >
      <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0s224 35.8 224 80zm-54.8 134.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432v-85.9z" />
    </svg>
  );

  return (
    <>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)", // Adjust blur amount as needed
          },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        viewOptions={{ margin: "0px 0px -350px 0px" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h1 className=" w-full md:max-w-[80%] text-center md:text-left text-3xl font-semibold leading-snug tracking-tight text-black dark:text-neutral-300 sm:text-4xl md:text-5xl lg:text-[4rem] lg:leading-[5rem]">
            Intelligence isn&#39;t something you can measure, it&#39;s an
            experience.
          </h1>
          <p className="py-7 text-center md:text-left  text-xl text-black dark:text-neutral-300">
            Click on your store and Get started
          </p>

          <div className="grid cursor-pointer grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <TiltCard
              Icon={WooCommerceSVG}
              title="WooCommerce"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={ShopifySVG}
              title="Shopify"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={BigCommerceSVG}
              title="BigCommerce"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            {/* <TiltCard
              Icon={WixSvg}
              title="Wix eCommerce"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            /> */}
            {/* <TiltCard
              Icon={AdobeSvg}
              title="Adobe Commerce"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={WebFlowSvg}
              title="Webflow"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={HubSpotSvg}
              title="HubSpot"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={OpenCartSvg}
              title="OpenCart"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
            <TiltCard
              Icon={SquareSpaceSvg}
              title="Squarespace"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            /> */}
            <TiltCard
              Icon={CustomSvg}
              title="Custom CMS"
              badge="On the Way"
              onOpenPopup={handleOpenPopup}
            />
          </div>
        </div>
      </InView>

      {popupData && <Popup data={popupData} onClose={handleClosePopup} />}
    </>
  );
};

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

interface TiltCardProps {
  Icon: React.ElementType; // Type for the icon component
  title: string; // Type for the title
  badge?: string; // Optional badge prop
  onOpenPopup: (
    title: string,
    badge?: string,
    Icon?: React.ElementType
  ) => void; // Prop to handle popup
}

const TiltCard: React.FC<TiltCardProps> = ({
  Icon,
  title,
  badge,
  onOpenPopup,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize the router

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (badge) {
      onOpenPopup(title, badge, Icon); // Open popup if badge exists
    } else {
      router.push("/explore-meera/"); // Redirect if no badge
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-60 cursor-pointer rounded-xl bg-gray-100 bg-gradient-to-br dark:bg-[#141414]"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg dark:bg-black"
      >
        {badge && (
          <div className="absolute right-2 top-2 z-10 rounded-full bg-yellow-400 px-2 py-1 text-xs font-medium text-black">
            {badge}
          </div>
        )}
        {Icon && (
          <div className="mx-auto">
            <Icon />
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 text-center text-xl font-semibold text-black dark:text-white">
          {title}
        </div>
      </div>
    </motion.div>
  );
};

interface PopupProps {
  data: { title: string; badge?: string | undefined; Icon?: React.ElementType };
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ data, onClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const Icon = data.Icon;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    if (validateEmail(email)) {
      const requestBody = {
        data: {
          Name: data.title, // Use the title from popup data
          Email: email, // Use the entered email
        },
      };

      try {
        const response = await fetch(
          "https://cms.flowautomate.io/api/store-contacts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          // Handle success response
          const result = await response.json();
          setEmail(""); // Clear the input field
          setEmailError(""); // Clear any existing error
          onClose(); // Close the popup
        } else {
          // Handle error response
          console.error("Failed to submit data:", response.status);
          setEmailError("Failed to submit data. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setEmailError("An error occurred. Please try again.");
      }
    } else {
      setEmailError("Please enter a valid email address."); // Set error message only on submission
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative w-[90%] max-w-sm transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 dark:bg-neutral-800">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1.5em"
            width="1.5em"
            className="text-black dark:text-white"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
          </svg>
        </button>
        <div className="mb-4 flex items-center">
          {Icon && (
            <div className="mr-4">
              <Icon />
            </div>
          )}

          <h2 className="dark text-xl font-semibold text-gray-400">
            {data.title}
          </h2>
        </div>
        <p className="mb-4">
          We are working on making it available as soon as possible.
        </p>
        <p className="mb-4">Give us your email if you want to be notified.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(""); // Clear error on input change
          }}
          required
          placeholder="Your email"
          className={`mb-4 w-full rounded border p-2 ${emailError ? "border-red-500" : "border-gray-300"}`}
        />
        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        <div className="relative">
          <ConfettiButton
            onClick={handleSubmit}
            shouldFireConfetti={validateEmail(email)}
            className={`${!validateEmail(email) ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Notify Me
          </ConfettiButton>
        </div>
      </div>
    </div>
  );
};

export default DemoStoreCard;
