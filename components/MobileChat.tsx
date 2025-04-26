"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage, fetchInitialMessages, fetchMoreMessages, sendMessage, subscribeToMessages } from "@/lib/chat";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersContext";
import { useNewMessage } from "@/contexts/NewMessageContext";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

import SendIcon from "@mui/icons-material/Send"; 

interface DisplayMessage extends Omit<ChatMessage, "createdAt"> {
  from: "me" | "other";
  name?: string;
  photoURL?: string;
  createdAt: Timestamp;
}

export default function MobileChat() {
  const { user } = useAuth();
  const { getUserName, getUserPicture } = useUsers();
  const { setHasNewMessage } = useNewMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<DisplayMessage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastVisible, setLastVisible] = useState<any | null>(null);

  // service worker 등록
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker 등록 성공:", registration.scope);
          })
          .catch((err) => {
            console.error("Service Worker 등록 실패:", err);
          });
      });
    }
  }, []);

  // 새로고침 방지
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
  
    let startY = 0;
  
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
  
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
  
      if (el.scrollTop === 0 && deltaY > 0) {
        // 최상단에서 손가락을 아래로 당기는 경우만 막는다
        e.preventDefault();
      }
      // 그 외에는 스크롤 허용
    };
  
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
  
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);  

  useEffect(() => {
    if (!user) return;

    fetchInitialMessages().then(({ messages, lastVisible }) => {
      const formatted: DisplayMessage[] = messages.reverse().map((msg) => {
        const isMine = msg.uid === user.uid;
        return {
          ...msg,
          from: isMine ? "me" : "other",
          name: isMine ? undefined : getUserName(msg.uid),
          photoURL: isMine ? user.picture : getUserPicture?.(msg.uid),
        };
      });
      setChats(formatted);
      setLastVisible(lastVisible);
      scrollToBottom();
    });

    const unsub = subscribeToMessages((msg) => {
      if (!user || msg.uid === user.uid) return;

      const newMsg: DisplayMessage = {
        ...msg,
        from: "other",
        name: getUserName(msg.uid),
        photoURL: getUserPicture?.(msg.uid),
      };

      const isAtBottom = scrollRef.current &&
        scrollRef.current.scrollHeight - scrollRef.current.scrollTop <= scrollRef.current.clientHeight + 10;

      setChats((prev) => {
        const exists = prev.some((c) => c.id === msg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });

      if (isAtBottom) {
        scrollToBottom();
        setHasNewMessage(false);
      } else {
        setHasNewMessage(true);
      }
    });

    return () => unsub();
  }, [user, getUserName, getUserPicture, setHasNewMessage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 10) {
        setHasNewMessage(false);
      }
    };
    const el = scrollRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [setHasNewMessage]);

  const handleSend = async () => {
    if (!message.trim() || !user) return;
    const newMessage: DisplayMessage = {
      id: crypto.randomUUID(),
      uid: user.uid,
      text: message,
      createdAt: Timestamp.now(),
      from: "me",
      photoURL: user.picture,
    };
    setChats((prev) => [...prev, newMessage]);
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
      ...msg,
      from: msg.uid === user?.uid ? "me" : "other",
      name: msg.uid === user?.uid ? undefined : getUserName(msg.uid),
      photoURL: msg.uid === user?.uid ? user?.picture : getUserPicture?.(msg.uid),
    }));
  
    setChats((prev) => [...formatted, ...prev]);
    setLastVisible(newLast);
  };
  

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* ✅ 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-black shadow-sm border-b">
        <div className="text-sm font-semibold text-gray-100 text-center w-full">
          dysrequlation
        </div>
        {user && (
          <div
            onClick={() => router.push("/mypage")}
            className="absolute right-4 w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
          >
            {user.picture && user.picture.trim() !== "" ? (
              <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
        )}
      </div>

      {/* 메시지 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">

        {lastVisible && (
          <div className="w-full flex justify-center py-2">
            <button
              onClick={handleLoadMore}
              className="px-4 py-1.5 bg-blue-600 text-gray-100 text-sm font-medium rounded-full shadow hover:bg-blue-50 hover:text-blue-700 transition duration-200"
            >
              이전 메시지 더 보기
            </button>
          </div>
        )}

        {chats.map((chat, index) => {
          const prevChat = chats[index - 1];
          const isSameUserAsPrev = prevChat?.uid === chat.uid;
          const isOther = chat.from === "other";

          const currentDate = chat.createdAt.toDate().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        
          const prevDate = prevChat?.createdAt.toDate().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        
          const isNewDate = currentDate !== prevDate;

          const time = chat.createdAt.toDate().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={chat.id} className={`flex flex-col ${isOther ? "items-start" : "items-end"}`}>

              {/* 날짜 구분선 */}
              {isNewDate && (
                <div className="flex items-center gap-3 my-6 w-full">
                  <div className="flex-grow border-t border-dashed border-gray-500"></div>
                  <span className="text-xs text-white whitespace-nowrap">{currentDate}</span>
                  <div className="flex-grow border-t border-dashed border-gray-500"></div>
                </div>
              )}

              {/* 프로필 + 이름은 첫 메시지에만 출력 */}
              {isOther && !isSameUserAsPrev && (
                <div className="flex items-center gap-2">
                  <img
                    src={chat.photoURL || "/default-profile.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-[13px] text-gray-200 font-medium">{chat.name}</div>
                </div>
              )}

              {/* 말풍선 */}
              <div
                className={`
                  max-w-[70%] px-3 py-2 rounded-xl text-sm shadow whitespace-pre-wrap
                  ${isOther ? "bg-gray-200 text-gray-800 rounded-tl-none ml-10" : "bg-yellow-200 text-gray-800 rounded-tr-none"}
                `}
              >
                <div>{chat.text}</div>
                <div className="text-[10px] text-right mt-1 opacity-80">{time}</div>
              </div>
            </div>
          );
        })}

      </div>

      {/* 입력창 */}
      <div className="flex items-center p-3 border-t border-gray-700 bg-black">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 resize-none border border-gray-600 rounded-lg bg-black px-3 py-2 text-sm text-white placeholder-gray-400 outline-none max-h-[100px]"
          rows={1}
        />
        <button
          onTouchStart={(e) => e.preventDefault()}
          onClick={handleSend}
          className="ml-2 px-2 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-sm rounded-lg hover:opacity-90 transition"
        >
          <SendIcon fontSize="small" />
        </button>
      </div>

    </div>
  );
}
