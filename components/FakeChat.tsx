"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage, fetchInitialMessages, fetchMoreMessages, sendMessage, subscribeToMessages, } from "@/lib/chat";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useNewMessage } from "@/contexts/NewMessageContext";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const { setHasNewMessage } = useNewMessage();

  useEffect(() => {
    if (!user) return;
  
    fetchInitialMessages().then(({ messages, lastVisible }) => {
      const formatted: DisplayMessage[] = messages.reverse().map((msg) => {
        const isMine = msg.uid === user.uid;
        return {
          id: msg.id,
          uid: msg.uid,
          text: msg.text,
          createdAt: msg.createdAt,
          from: isMine ? "me" : "other",
          name: isMine ? undefined : getUserName(msg.uid),
        };
      });
      setChats(formatted);
      setLastVisible(lastVisible);
      scrollToBottom();
    });
  
    const unsub = subscribeToMessages((msg) => {
      if (!user || msg.uid === user.uid) return;
    
      const updatedMsg: DisplayMessage = {
        id: msg.id,
        uid: msg.uid,
        text: msg.text,
        createdAt: msg.createdAt,
        from: "other",
        name: getUserName(msg.uid),
      };
    
      const isAtBottom =
        scrollRef.current &&
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop <=
          scrollRef.current.clientHeight + 10;
    
      setChats((prev) => {
        const exists = prev.some((c) => c.id === msg.id);
        if (exists) {
          return prev.map((c) => (c.id === msg.id ? updatedMsg : c));
        } else {
          return [...prev, updatedMsg];
        }
      });
    
      // ✅ 이건 별도로 처리해야 함
      if (isAtBottom) {
        scrollToBottom();
        setHasNewMessage(false);
      } else {
        setHasNewMessage(true);
      }
    });    
  
    return () => unsub();
  }, [user, getUserName, setHasNewMessage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      if (isAtBottom) {
        setHasNewMessage(false);
      }
    };
  
    const target = scrollRef.current;
    if (target) target.addEventListener("scroll", handleScroll);
    return () => {
      if (target) target.removeEventListener("scroll", handleScroll);
    };
  }, [setHasNewMessage]);  

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

  const handleLoadMore = async () => {
    if (!lastVisible) return;
  
    const { messages, lastVisible: newLast } = await fetchMoreMessages(lastVisible);
    const formatted: DisplayMessage[] = messages.reverse().map((msg) => ({
      id: msg.id,
      uid: msg.uid,
      text: msg.text,
      createdAt: msg.createdAt,
      from: msg.uid === user?.uid ? "me" : "other",
      name: msg.uid === user?.uid ? undefined : getUserName(msg.uid),
    }));
  
    setChats((prev) => [...formatted, ...prev]); // 앞에 붙이기
    setLastVisible(newLast);
  };
  

  return (
    <div className="flex flex-col h-[600px] border-t border-gray-300">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {lastVisible && (
          <div className="sticky top-0 left-12 w-40 z-20 py-1 text-center">
            <button
              onClick={handleLoadMore}
              className="text-sm text-gray-600 hover:underline"
            >
              Load Before
            </button>
          </div>
        )}

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
                      className="w-[500px] min-h-[24px] border-r border-gray-200 px-2 py-1 text-[13px] text-blue-900 break-words whitespace-pre-wrap flex items-center justify-end"
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
                    if (e.key === "Enter" && !e.shiftKey) {
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