"use client";

import React, { useState } from "react";
import { DiaryCalendar } from "@/features/diary/components/diary-calendar";
import { DiaryForm } from "@/features/diary/components/diary-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dayjs from "dayjs";

/**
 * カレンダーページ
 * 月間カレンダーで日記の一覧を表示し、日付をクリックして新規作成もできる
 */
export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 日付が選択された時のハンドラー
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  // 日記フォーム保存成功時のハンドラー
  const handleFormSuccess = () => {
    setDialogOpen(false);
  };

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format("YYYY年MM月DD日")
    : "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">カレンダー</h1>
      <p className="text-gray-500 mb-4">
        日記を記録した日付には色がついています。日付をクリックすると詳細を表示したり、新しく記録したりできます。
      </p>

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <DiaryCalendar onSelectDate={handleSelectDate} />
      </div>

      {/* 新規日記作成ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formattedDate}の日記</DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <DiaryForm date={selectedDate} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
