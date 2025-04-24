"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  fetchInitialMessages,
  sendMessage,
  subscribeToMessages,
} from "@/lib/chat";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { Timestamp } from "firebase/firestore";

interface DisplayMessage extends Omit<ChatMessage, "createdAt"> {
  from: "me" | "other";
  name?: string;
  createdAt: Timestamp;
}

export default function FakeChat() {
  const cols = Array.from({ length: 26 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { getUserName } = useUsers();

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<DisplayMessage[]>([]);
  const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!user) return;
  
    fetchInitialMessages().then(({ messages }) => {
      const formatted: DisplayMessage[] = messages.reverse().map((msg) => {
        const isMine = msg.uid === user.uid;
        return {
          id: msg.id,
          uid: msg.uid,
          text: msg.text,
          createdAt: msg.createdAt,
          from: isMine ? "me" : "other", // <-- string literal로 인식되게
          name: isMine ? undefined : getUserName(msg.uid),
        };
      });
      setChats(formatted);
      scrollToBottom();
    });
  
    const unsub = subscribeToMessages((msg) => {
      if (!user || msg.uid === user.uid) return;
      const newMsg: DisplayMessage = {
        id: msg.id,
        uid: msg.uid,
        text: msg.text,
        createdAt: msg.createdAt,
        from: "other", // <-- string literal로 명시
        name: getUserName(msg.uid),
      };
      setChats((prev) => [...prev, newMsg]);
    });
  
    return () => unsub();
  }, [user, getUserName]);
  

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    setChats((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        uid: user.uid,
        text: message,
        createdAt: Timestamp.now(),
        from: "me",
      },
    ]);
    await sendMessage(user.uid, message);
    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col h-[600px] border-t border-gray-300">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {chats.map((chat, rowIdx) => (
          <div key={chat.id} className="flex border-b border-gray-200">
            <div className="w-[48px] shrink-0 sticky left-0 z-10 text-xs text-center border-r border-gray-300 bg-gray-100 py-1">
              {50 + rowIdx + 1}
            </div>

            {cols.map((_, colIdx) => {
              if (chat.from === "me") {
                if (colIdx === 2)
                  return (
                    <div
                      key={colIdx}
                      className="w-[500px] min-h-[24px] border-r border-gray-200 px-2 py-1 text-[13px] text-blue-800 break-words whitespace-pre-wrap flex items-center justify-end"
                    >
                      {chat.text}
                    </div>
                  );
                if (colIdx >= 3 && colIdx <= 6) return null;
              }

              if (chat.from === "other") {
                if (colIdx === 1) {
                  return (
                    <div
                      key={colIdx}
                      className="w-[100px] min-h-[24px] border-r border-gray-200 px-2 py-1 text-[13px] text-neutral-500 font-medium flex items-center"
                    >
                      {chat.name}
                    </div>
                  );
                }
                if (colIdx === 2) {
                  return (
                    <div
                      key={colIdx}
                      className="w-[400px] min-h-[24px] border-r border-gray-200 px-2 py-1 text-[13px] text-gray-800 break-words whitespace-pre-wrap flex items-center"
                    >
                      {chat.text}
                    </div>
                  );
                }
                if (colIdx >= 3 && colIdx <= 5) return null;
              }

              return (
                <div key={`${colIdx}-${rowIdx}`} className="w-[100px] min-h-[24px] border-r border-gray-200" />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex border-t border-gray-300 bg-gray-50">
        <div className="w-[48px] h-[48px] shrink-0 sticky left-0 z-10 border-r border-gray-300 bg-gray-100" />
        {cols.map((_, colIdx) => {
          if (colIdx === 1)
            return (
              <div key={colIdx} className="w-[500px] h-[48px] border-r border-gray-200">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  className="w-full h-full px-2 text-[13px] outline-none resize-none bg-white"
                  onKeyDown={(e) => {
                    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
            );
          if (colIdx >= 2 && colIdx <= 5) return null;

          if (colIdx === 6)
            return (
              <div key={colIdx} className="w-[100px] h-[48px] border-r border-gray-200">
                <button
                  onClick={handleSend}
                  className="w-full h-full text-sm text-black hover:bg-gray-200 transition"
                >
                  전송
                </button>
              </div>
            );

          return <div key={colIdx} className="w-[100px] h-[48px] border-r border-gray-200" />;
        })}
      </div>
    </div>
  );
}