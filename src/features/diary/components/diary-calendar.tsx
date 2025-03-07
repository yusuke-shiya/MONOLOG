import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDiaryStore } from "@/features/diary/stores/diary-store";
import { DiaryEntryView } from "@/features/diary/components/diary-entry";
import { getMoodColor } from "@/features/mood/utils/mood-utils";
import dayjs from "dayjs";
import "dayjs/locale/ja";

// 日本語ロケールを設定
dayjs.locale("ja");

/**
 * カスタムカレンダーデイコンポーネント
 */
const CustomDay = ({ day, diaryEntries }: { day: Date; diaryEntries: any }) => {
  const dateStr = dayjs(day).format("YYYY-MM-DD");
  const entry = diaryEntries[dateStr];

  // 選択された日付の背景色を設定
  const style: React.CSSProperties = {};

  if (entry) {
    // 気分スコアがある場合は対応する色を適用
    style.backgroundColor = getMoodColor(entry.moodScore);
    style.color = "white";
  }

  return (
    <div
      className="h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md"
      style={style}
    >
      {day.getDate()}
    </div>
  );
};

interface DiaryCalendarProps {
  onSelectDate?: (date: string) => void;
}

/**
 * 日記カレンダーコンポーネント
 * 各日付に気分スコアの色を表示し、日記がある日付をクリックすると詳細が表示される
 */
export const DiaryCalendar: React.FC<DiaryCalendarProps> = ({ onSelectDate }) => {
  const entries = useDiaryStore((state) => state.entries);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  // 日付選択ハンドラー
  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateStr = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(date);

    // 日記エントリーがある場合は詳細表示
    if (entries[dateStr]) {
      setSelectedEntry(entries[dateStr]);
      setDialogOpen(true);
    } else if (onSelectDate) {
      // 日記がなく、外部ハンドラーがある場合は呼び出す
      onSelectDate(dateStr);
    }
  };

  return (
    <>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        className="rounded-md border"
        components={{
          Day: ({ date, ...props }) => CustomDay({ day: date, diaryEntries: entries }),
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>日記の詳細</DialogTitle>
          </DialogHeader>
          {selectedEntry && <DiaryEntryView entry={selectedEntry} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
