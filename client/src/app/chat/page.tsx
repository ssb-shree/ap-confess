"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { User } from "@/store/user";
import { AxiosResponse } from "axios";
import axiosInstance from "@/servies/axios";

import { useRouter } from "next/navigation";
import { errorToast } from "@/servies/toast";
import toast from "react-hot-toast";

type MessagePayload = {
  username: string;
  message: string;
};

const Chatpage = () => {
  const [socket, setSocket] = useState<Socket>();
  const [userDetails, setUserDetails] = useState<User>();

  const [inputMessage, setInputMessage] = useState<string>("");

  const [messageArray, setMessageArray] = useState<MessagePayload[]>([]);

  const router = useRouter();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageArray]);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res: AxiosResponse = await axiosInstance.get("/user", {
          withCredentials: true,
        });

        if (res.data.user) {
          setUserDetails(res.data.user);
          console;
        }
      } catch (error: any) {
        console.error(error.message || error);
        errorToast("Failed to fetch user details");
        router.push("/auth/login");
      }
    };

    getProfileData();
  }, [router]);

  useEffect(() => {
    const options = {
      "force new connection": true,
      reconnectAttempt: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
    };

    const URL =
      process.env.NEXT_PUBLIC_STATUS === "PROD" ? process.env.NEXT_PUBLIC_BACKENDURL : "http://localhost:8080";

    const newSocket = io(URL, options);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket || !userDetails) return;
    socket.emit("join-chat", { username: userDetails.username });

    socket.on("user-joined", (payload) => {
      console.log(payload.username);
      toast.success(`${payload.username} joined the chat`, {
        position: "top-center",
      });
    });

    socket.on("get-chats", ({ previousMessages }: { previousMessages: MessagePayload[] }) => {
      setMessageArray(previousMessages);
    });

    socket.on("receive-message", (payload: MessagePayload) => {
      console.log(payload);
      setMessageArray((prev) => [...prev, payload]);
    });

    socket.on("error", (payload: { message: string }) => {
      errorToast(`${payload.message}`);
    });

    return () => {
      socket.off("user-joined");
      socket.off("get-chats");
      socket.off("receive-message");
      socket.off("error");
    };
  }, [socket, userDetails]);

  const handleSendMessage = () => {
    if (!socket || !userDetails) {
      errorToast("failed to send message");
      console.log(socket, userDetails);
      return;
    }

    if (inputMessage.length < 2) {
      toast.error("message is too short", { position: "top-center" });
      return;
    }

    const { username } = userDetails;

    socket.emit("send-message", { username, message: inputMessage });

    setInputMessage("");
  };

  if (!socket) {
    return <ChatFallback />;
  }

  return (
    <section className="relative w-screen h-[calc(100vh-4rem)] bg-base-200">
      {/* Chat Body */}
      <div ref={chatContainerRef} className="absolute top-0 left-0 right-0 bottom-16 overflow-y-auto p-4">
        {messageArray &&
          messageArray.map((payload, index) => {
            return <ChatBox key={index} isUser={payload.username === userDetails?.username} payload={payload} />;
          })}
      </div>

      {/* Input Section */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-row gap-x-2 px-5 mb-10 md:mb-5">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={({ key }) => {
            if (key === "Enter") {
              handleSendMessage();
            }
          }}
          type="text"
          placeholder="Type your message..."
          className="input input-bordered flex-1"
        />
        <button onClick={handleSendMessage} type="submit" className="btn btn-primary rounded-lg">
          Send
        </button>
      </div>
    </section>
  );
};

export default Chatpage;

const ChatBox = ({ isUser, payload }: { isUser: boolean; payload: MessagePayload }) => {
  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      {/* Header with username and time */}
      <div className="chat-header flex items-center gap-2">
        <span className="font-semibold">{payload.username}</span>
      </div>

      {/* Message bubble */}
      <div className={`chat-bubble ${isUser ? "chat-bubble-primary" : "bg-base-100"}`}>{payload.message}</div>
    </div>
  );
};

const ChatFallback = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Skeleton Incoming Message */}
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
        </div>
        <div className="chat-header">
          <div className="h-3 w-16 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="chat-bubble bg-base-300 animate-pulse w-32 h-6"></div>
      </div>

      {/* Skeleton Outgoing Message */}
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
        </div>
        <div className="chat-header">
          <div className="h-3 w-10 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="chat-bubble bg-base-300 animate-pulse w-24 h-6"></div>
      </div>

      {/* Skeleton Incoming Message */}
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full bg-base-300 animate-pulse"></div>
        </div>
        <div className="chat-header">
          <div className="h-3 w-20 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="chat-bubble bg-base-300 animate-pulse w-36 h-6"></div>
      </div>
    </div>
  );
};
