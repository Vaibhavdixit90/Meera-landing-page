import React, { useState } from "react";

// Define props interface for the ChatAccordion component
interface ChatAccordionProps {
  data: {
    data: {
      attributes: {
        User_Name: string;
        Phone: string;
        Url: string;
        Store_front: string;
        website_name: string;
        Email: string;
      };
    };
  };
}

const ChatAccordion: React.FC<ChatAccordionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const items = [
    { label: "Name:", value: data?.data?.attributes?.User_Name },
    { label: "Phone Number:", value: data?.data?.attributes?.Phone },
    { label: "Url of Store:", value: data?.data?.attributes?.Url },
    { label: "Store Front:", value: data?.data?.attributes?.Store_front },
    { label: "Website Name:", value: data?.data?.attributes?.website_name },
    { label: "Email:", value: data?.data?.attributes?.Email },
  ];

  return (
    <div className="mt-3">
      <div
        className="my-1 flex cursor-pointer items-center justify-between"
        onClick={toggleDetails}
      >
        <div className="flex items-center">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="1.5em"
            width="1.5em"
            className="mr-2 text-gray-400"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M14 7a1 1 0 00-1 1v8a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1h-4zm3 2h-2v6h2V9z"
              clipRule="evenodd"
            />
            <path
              fill="currentColor"
              d="M6 7a1 1 0 000 2h4a1 1 0 100-2H6zM6 11a1 1 0 100 2h4a1 1 0 100-2H6zM5 16a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z"
            />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M4 3a3 3 0 00-3 3v12a3 3 0 003 3h16a3 3 0 003-3V6a3 3 0 00-3-3H4zm16 2H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          <span className="font-medium text-black">Your Details</span>
        </div>

        <span className="text-black">
          {isOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="1.5em"
              width="1.5em"
            >
              <path d="M6.293 13.293l1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 466 1000"
              fill="currentColor"
              height="1.5em"
              width="1.5em"
            >
              <path d="M405 380c14.667-17.333 30.667-17.333 48 0 17.333 14.667 17.333 30.667 0 48L257 620c-14.667 14.667-30.667 14.667-48 0L13 428c-17.333-17.333-17.333-33.333 0-48 16-16 32.667-16 50 0l170 156 172-156" />
            </svg>
          )}
        </span>
      </div>

      {isOpen && (
        <div className="py-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between p-1">
              <span className="font-medium text-black">{item.label}</span>
              <span className="text-[14px] font-medium text-black">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatAccordion;
