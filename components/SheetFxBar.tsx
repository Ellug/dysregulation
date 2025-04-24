"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function SheetFxBar() {
  return (
    <div className="flex items-center gap-2 px-4 py-1 border-b border-gray-300 text-sm">
      
      {/* 셀 주소 + 아래 화살표 */}
      <div className="flex items-center justify-between w-24 text-xs px-0 py-[2px]">
        <span>A1</span>
        <ArrowDropDownIcon fontSize="small" className="text-gray-600" />
      </div>

      {/* 구분선 */}
      <div className="w-px h-5 bg-gray-300 mx-1 self-center" />

      {/* fx 아이콘 */}
      <span className="text-gray-400 font-bold">𝑓𝑥</span>

      {/* 함수 입력창 */}
      <input
        type="text"
        placeholder=""
        className="flex-1 rounded border border-transparent focus:border-blue-500 bg-white px-3 py-[5px] text-sm outline-none"
      />
    </div>
  );
}
