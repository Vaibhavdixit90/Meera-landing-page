import React, { useState, useEffect } from "react";
import { marked } from "marked";
import "../app/globals.css";
import { PlaceholdersAndVanishTextarea } from "./ChatInput";
import MeeraChatCta from "./MeeraChatCta";

interface Message {
  text: string;
  from: "user" | "assistant";
}

interface Conversation {
  id: string;
  message: string;
  from: "user" | "assistant";
}

interface MeeraChatProps {
  conversations?: Conversation[];
  chats: number;
  fetchConversations: () => Promise<void>;
  scrollref: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const MeeraChat: React.FC<MeeraChatProps> = ({
  conversations = [],
  chats,
  fetchConversations,
  scrollref,
}) => {
  const [chatLeft, setChatLeft] = useState(10);
  const [message, setMessage] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [conversationFailed, setConversationFailed] = useState<any>(null);

  const placeholders = [
    "Can you help me to increase my sale?",
    "How you can interact with my customer?",
    "What kind of insites you can give me?",
  ];

  const handleInputSubmit = async (userMessage: string) => {
    if (!userMessage.trim()) {
      setErrorMessage("You need to enter a question");
      return;
    }
    setErrorMessage("");
    setConversationFailed(null);

    if (chatLeft > 0) {
      if (!hasStartedChat) setHasStartedChat(true);

      setIsTyping(true);

      const leadId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      try {
        const postResponse = await fetch("/api/websiteChat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId: leadId,
            userQuery: userMessage,
          }),
        });

        if (postResponse.ok) {
          const postData = await postResponse.json();
          if (postData.success) {
            await fetchConversations();
          } else {
            setConversationFailed(postData.message);
            console.error("Failed to send message:", postData);
          }
        } else {
          console.error("POST response not OK:", await postResponse.text());
        }
      } catch (error) {
        console.error("Error handling message:", error);
      } finally {
        setIsTyping(false);
      }
    }

    if (chatLeft === 1) {
      setMessage("You have no chats left.");
    }
  };

  useEffect(() => {
    const lastMessageId = conversations[conversations.length - 1]?.id;

    if (lastMessageId && scrollref.current[lastMessageId]) {
      scrollref.current[lastMessageId].scrollIntoView({ behavior: "smooth" });
    }

    if (isTyping) {
      const thinkingMessageId = "thinking-message";
      if (scrollref.current[thinkingMessageId]) {
        scrollref.current[thinkingMessageId].scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [conversations, isTyping, scrollref]);

  return (
    <div className="relative mx-auto flex h-full w-full flex-col items-center lg:w-[70%] 2xl:w-[80%]">
      <div className="absolute right-8 top-3 text-sm font-bold text-black lg:top-5">
        {chats > 0 ? (
          `Remaining Questions: ${chats}`
        ) : (
          <span className="text-red-500">{conversationFailed}</span>
        )}
      </div>
      {conversations.length === 0 ? (
        <h3 className="mb-4 mt-10 text-xl font-semibold text-white">
          Loading...
        </h3>
      ) : (
        <div className="markdown hide-scrollbar mt-10 flex w-full flex-1 flex-col overflow-auto p-2">
          {conversations.map((msg) => (
            <div
              key={msg.id}
              ref={(el) => {
                if (el) scrollref.current[msg.id] = el;
              }}
              className={`w-full rounded-lg text-white md:p-2 ${
                msg.from === "user"
                  ? "user my-4 flex items-start"
                  : "flex items-start"
              }`}
            >
              {msg.from === "user" ? (
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  height="1.5em"
                  width="1.5em"
                  className="m-2 mt-3 text-black md:mr-7"
                >
                  <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
                </svg>
              ) : (
                <img
                  src="https://cms.flowAutomate.io/uploads/Flow_Automate_Favicon_faf4b373f6.png"
                  alt="Assistant"
                  className="m-2 h-8 w-8 rounded-full md:mr-7"
                />
              )}
              <div
                className={`flex-1 ${msg.from === "user" ? "rounded-md bg-gray-100 pl-5" : ""}`}
                dangerouslySetInnerHTML={{ __html: marked(msg.message) }}
              />
            </div>
          ))}
          {isTyping && (
            <div
              id="thinking-message"
              className="ml-20 flex w-auto max-w-[70%] rounded-lg bg-gray-100 p-2 font-medium text-black"
            >
              <span>Let me think...</span>
            </div>
          )}
          {chats === 0 && <MeeraChatCta />}
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
      )}

      <div className="w-[95%] py-3 md:sticky md:bottom-0 md:w-full md:pt-0">
        <PlaceholdersAndVanishTextarea
          value={inputValue}
          setValue={setInputValue}
          placeholders={placeholders}
          onSubmit={handleInputSubmit}
        />
      </div>
    </div>
  );
};

export default MeeraChat;
