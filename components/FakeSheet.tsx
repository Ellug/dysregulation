"use client";

import SheetMenuBar from "@/components/SheetMenuBar";
import SheetToolbar from "@/components/SheetToolBar";
import SheetFxBar from "@/components/SheetFxBar";
import { useEffect, useRef, useState } from "react";
import FakeChat from "./FakeChat";

export default function FakeSheet() {
  const [data, setData] = useState<string[][]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cols = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
  const rows = Array.from({ length: 50 }, (_, i) => i + 1); // 1-50

  const saveSheet = (data: string[][], key = "sheetData") => {
    const json = JSON.stringify(data);
    sessionStorage.setItem(key, json);
  }

  useEffect(() => {
    const key = "sheetData";
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setData(parsed);
          return;
        }
      } catch (err) {
        console.error("세션스토리지 파싱 오류:", err);
      }
    }
  
    // 데이터가 없으면 빈 시트 생성
    const emptyData = Array.from({ length: rows.length }, () =>
      Array.from({ length: cols.length }, () => "")
    );
    setData(emptyData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 컨트롤1로 최상단으로 긴급탈출
  useEffect(() => {
    console.log("이펙트 실행됨");
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  return (
    <main className="h-screen w-full bg-white text-[13px] text-neutral-900 hidden md:block">
      <div className="flex flex-col h-full w-full">
        {/* 상단 메뉴, 툴바, 함수 입력창 */}
        <SheetMenuBar saveSheet={() => saveSheet(data)} />
        <SheetToolbar />
        <SheetFxBar />

        {/* 시트 그리드 */}
        <div ref={scrollRef} className="flex-1 overflow-auto border-t border-gray-300">
          <div className="min-w-[2800px]">
            {/* 컬럼 인덱스 */}
            <div className="flex sticky top-0 z-10 border-b border-gray-300">
              <div className="w-[48px] shrink-0 border-r border-gray-300 bg-gray-200" />
              {cols.map((col) => (
                <div
                  key={col}
                  className="w-[100px] h-[24px] px-2 py-1 bg-white text-xs text-center border-r border-gray-300 "
                >
                  {col}
                </div>
              ))}
            </div>

            {/* 데이터 행 */}
            {rows.map((_, rowIdx) => (
              <div key={rowIdx} className="flex border-b border-gray-200">
                <div className="w-[48px] h-[24px] shrink-0 sticky left-0 z-10 text-xs text-center border-r border-gray-300 bg-gray-100">
                  {rowIdx + 1}
                </div>

                {cols.map((_, colIdx) => (
                  <div key={`${rowIdx}-${colIdx}`} className="w-[100px] h-[24px] border-r border-gray-200">
                    <input
                      type="text"
                      value={data[rowIdx]?.[colIdx] ?? ""}
                      onChange={(e) => {
                        const updated = [...data];
                        if (!updated[rowIdx]) updated[rowIdx] = [];
                        updated[rowIdx][colIdx] = e.target.value;
                        setData(updated);
                      }}
                      className="w-full h-full px-2 text-[13px] outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* --- 채팅 UI 구역 --- */}
            <FakeChat />

          </div>
        </div>
      </div>
    </main>
  );
}
