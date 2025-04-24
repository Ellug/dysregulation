"use client";

import SheetMenuBar from "@/components/SheetMenuBar";
import SheetToolbar from "@/components/SheetToolBar";
import SheetFxBar from "@/components/SheetFxBar";
import { useEffect, useRef, useState } from "react";
import FakeChat from "./FakeChat";

export default function FakeSheet() {
  const [data, setData] = useState<string[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array.from({ length: 26 }, () => 100)
  );
  const [resizeGuideX, setResizeGuideX] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cols = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 100 }, (_, i) => i + 1);

  const saveSheet = (data: string[][], key = "sheetData") => {
    const json = JSON.stringify(data);
    sessionStorage.setItem(key, json);
  };

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

    const emptyData = Array.from({ length: rows.length }, () =>
      Array.from({ length: cols.length }, () => "")
    );
    setData(emptyData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startResizing = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colIdx];
    setResizeGuideX(startX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      setResizeGuideX(startX + delta);
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      const delta = upEvent.clientX - startX;
      const newWidth = Math.max(40, startWidth + delta);

      setColumnWidths((prev) =>
        prev.map((w, idx) => (idx === colIdx ? newWidth : w))
      );
      setResizeGuideX(null);

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const exportToCSV = (tableData: string[][]) => {
    const csv = tableData
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = async (file: File): Promise<string[][]> => {
    const text = await file.text();
    return text
      .trim()
      .split("\n")
      .map((row) =>
        row
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"'))
      );
  };

  return (
    <main
      className={`h-screen w-full bg-white text-[13px] text-neutral-900 hidden md:block ${
        isDragging ? "ring-4 ring-blue-300" : ""
      } select-none`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "text/csv") {
          try {
            const parsed = await parseCSV(file);
            setData(parsed);
          } catch (err) {
            alert("CSV 파일을 불러오는 데 실패했습니다.");
            console.error(err);
          }
        } else {
          alert("CSV 파일만 지원됩니다.");
        }
      }}
    >
      <div className="flex flex-col h-full w-full">
        <SheetMenuBar saveSheet={() => saveSheet(data)} exportSheet={() => exportToCSV(data)} />
        <SheetToolbar />
        <SheetFxBar />

        <div ref={scrollRef} className="flex-1 overflow-auto border-t border-gray-300 relative">
          {resizeGuideX !== null && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-gray-300 z-50 pointer-events-none"
              style={{ left: resizeGuideX }}
            />
          )}

          <div style={{ minWidth: columnWidths.reduce((a, b) => a + b, 48) }}>
            <div className="flex sticky top-0 z-10 border-b border-gray-300 bg-white">
              <div className="w-[48px] shrink-0 border-r border-gray-300 bg-gray-200" />
              {cols.map((col, idx) => (
                <div
                  key={col}
                  className="h-[24px] px-2 py-1 text-xs text-center border-r border-gray-300 relative group box-border"
                  style={{ width: columnWidths[idx] }}
                >
                  {col}
                  <div
                    onMouseDown={(e) => startResizing(e, idx)}
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent group-hover:bg-blue-300 user-select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {rows.map((_, rowIdx) => (
              <div key={rowIdx} className="flex border-b border-gray-200">
                <div className="w-[48px] h-[24px] shrink-0 sticky left-0 z-10 text-xs text-center border-r border-gray-300 bg-gray-100 flex items-center justify-center">
                  {rowIdx + 1}
                </div>
                {cols.map((_, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="h-[24px] border-r border-gray-200 box-border"
                    style={{ width: columnWidths[colIdx] }}
                  >
                    <input
                      type="text"
                      value={data[rowIdx]?.[colIdx] ?? ""}
                      onChange={(e) => {
                        const updated = [...data];
                        if (!updated[rowIdx]) updated[rowIdx] = [];
                        updated[rowIdx][colIdx] = e.target.value;
                        setData(updated);
                      }}
                      className="w-full h-full px-2 text-[13px] outline-none focus:ring-1 focus:ring-blue-400 bg-white box-border"
                    />
                  </div>
                ))}
              </div>
            ))}

            <FakeChat />
          </div>
        </div>
      </div>
    </main>
  );
}
