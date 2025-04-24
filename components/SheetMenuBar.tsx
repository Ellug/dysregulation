"use client";

import { useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star"
import AddToDrive from "@mui/icons-material/AddToDrive";
import CloudDoneOutlined from "@mui/icons-material/CloudDoneOutlined";
import History from "@mui/icons-material/History";
import Comment from "@mui/icons-material/CommentOutlined";
import Videocam from "@mui/icons-material/VideocamOutlined";
import Public from "@mui/icons-material/Public";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useNewMessage } from "@/contexts/NewMessageContext";

export default function SheetMenuBar({ saveSheet, exportSheet }: { saveSheet: () => void; exportSheet: () => void }) {
  const menus = ["파일", "수정", "보기", "삽입", "서식", "데이터", "도구", "확장 프로그램", "도움말"];
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("무제 시트");
  const { user } = useAuth();
  const { hasNewMessage } = useNewMessage();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-3 h-[64px] text-sm text-neutral-800 bg-gray-100 select-none">
      {/* 좌측: 시트 아이콘 + 제목 + 메뉴 */}
      <div className="flex items-start gap-2 mt-1">
        <img src="/google-sheets.png" alt="Sheet Icon" className="w-10 h-10 mt-[2px]" />

        <div className="flex flex-col justify-start">
          <div className="flex gap-5 items-center">
            {editing ? (
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditing(false)}
                className="bg-transparent border-none text-[18px] font-semibold outline-none px-1 mb-0 text-left"
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-[18px] font-semibold hover:underline px-1 mb-0 text-left cursor-text"
              >
                {title}
              </button>
            )}

            {/* 즐겨찾기/드라이브/클라우드 */}
            <div className="flex gap-3 text-lg text-gray-600">
              {hasNewMessage ? (
                <StarIcon fontSize="inherit" className="text-yellow-500" />
              ) : (
                <StarOutlineIcon fontSize="inherit" />
              )}
              <AddToDrive fontSize="inherit" />
              <CloudDoneOutlined fontSize="inherit" />
            </div>
          </div>

          <div className="flex gap-1 mt-1">
            {menus.map((menu) => (
              <button
                key={menu}
                className="text-[14px] text-neutral-800 hover:bg-gray-200 px-1.5 py-0.5 rounded-sm"
                onClick={() => {
                  if (menu === "파일") {
                    saveSheet();
                  }
                }}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 우측: 기능 아이콘 + 공유 버튼 + 프로필 */}
      <div className="flex items-center gap-8">
        {/* 기능 아이콘 */}
        <div className="flex gap-8 text-[26px] text-gray-800">
          <History fontSize="inherit" />
          <Comment fontSize="inherit" />
          <Videocam fontSize="inherit" />
        </div>

        {/* 공유 버튼 */}
        <button className="flex items-center gap-1 bg-blue-300 hover:bg-blue-200 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full"
          onClick={exportSheet}>
          <Public fontSize="small" className="text-gray-700" />
          공유
        </button>

        {/* 프로필 영역 */}
        <div
          onClick={() => router.push("/mypage")}
          className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold cursor-pointer overflow-hidden"
        >
          {user?.picture && user.picture.trim() !== "" ? (
            <img src={user.picture} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            "H"
          )}
        </div>

      </div>
    </div>
  );
}
