"use client";

import {
  IconButton,
  Tooltip
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import ExposureNeg1Icon from "@mui/icons-material/ExposureOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignCenterIcon from "@mui/icons-material/VerticalAlignCenter";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import WrapTextIcon from "@mui/icons-material/WrapText";
import TextRotationNoneIcon from "@mui/icons-material/TextRotationNone";
import FunctionsIcon from "@mui/icons-material/Functions";

export default function SheetToolBar() {
  return (
    <div className="flex items-center gap-2 bg-gray-100 px-2 pb-2 overflow-x-auto text-gray-700 text-[20px]">
      <div className="flex w-full bg-[#f0f4f9] px-4 py-1 gap-2 rounded-full">
        <Tooltip title="확대/축소">
          <IconButton size="small"><ZoomInIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="실행 취소">
          <IconButton size="small"><UndoIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="다시 실행">
          <IconButton size="small"><RedoIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="서식 복사">
          <IconButton size="small"><FormatPaintIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <div className="w-px h-5 bg-gray-300 mx-1.5 self-center" />

        <Tooltip title="통화 서식">
          <IconButton size="small"><AttachMoneyIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="백분율">
          <IconButton size="small"><PercentIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="소수점 줄이기">
          <IconButton size="small"><ExposureNeg1Icon fontSize="inherit" /></IconButton>
        </Tooltip>

        <div className="w-px h-5 bg-gray-300 mx-1.5 self-center" />

        <Tooltip title="굵게">
          <IconButton size="small"><FormatBoldIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="기울임꼴">
          <IconButton size="small"><FormatItalicIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="취소선">
          <IconButton size="small"><StrikethroughSIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="텍스트 색상">
          <IconButton size="small"><FormatColorTextIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="채우기 색상">
          <IconButton size="small"><FormatColorFillIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <div className="w-px h-5 bg-gray-300 mx-1.5 self-center" />

        <Tooltip title="테두리">
          <IconButton size="small"><BorderAllIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="셀 병합">
          <IconButton size="small"><MergeTypeIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <Tooltip title="왼쪽 정렬">
          <IconButton size="small"><FormatAlignLeftIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="가운데 정렬">
          <IconButton size="small"><FormatAlignCenterIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="오른쪽 정렬">
          <IconButton size="small"><FormatAlignRightIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <Tooltip title="위 정렬">
          <IconButton size="small"><VerticalAlignTopIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="세로 가운데 정렬">
          <IconButton size="small"><VerticalAlignCenterIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="아래 정렬">
          <IconButton size="small"><VerticalAlignBottomIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <Tooltip title="텍스트 줄바꿈">
          <IconButton size="small"><WrapTextIcon fontSize="inherit" /></IconButton>
        </Tooltip>
        <Tooltip title="세로 텍스트">
          <IconButton size="small"><TextRotationNoneIcon fontSize="inherit" /></IconButton>
        </Tooltip>

        <Tooltip title="함수 삽입">
          <IconButton size="small"><FunctionsIcon fontSize="inherit" /></IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
