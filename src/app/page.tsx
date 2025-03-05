"use client";

import React from "react";
import { DiaryForm } from "@/features/diary/components/diary-form";
import { DiaryEntryView } from "@/features/diary/components/diary-entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiaryStore } from "@/features/diary/stores/diary-store";
import dayjs from "dayjs";
import { MonthCalendar } from "@/features/calendar/components/month-calendar";

export default function Home() {
  return <HomePage />;
}

/**
 * クライアントコンポーネントとして実装
 */
const HomePage = () => {
  const { entries, getEntryByDate, getStreak } = useDiaryStore();

  // 今日の日付と日記エントリーの取得
  const today = dayjs().format("YYYY-MM-DD");
  const todayEntry = getEntryByDate(today);
  const streak = getStreak();

  // 編集モードの状態管理
  const [isEditing, setIsEditing] = React.useState(!todayEntry);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">今日の一言</h2>

        {isEditing ? (
          <DiaryForm onSuccess={handleFormSuccess} />
        ) : todayEntry ? (
          <DiaryEntryView entry={todayEntry} onEdit={handleEditClick} />
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="mb-4 text-gray-500">今日の記録がまだありません</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                記録する
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 連続記録日数 */}
      {streak > 0 && (
        <Card className="bg-primary/10">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{streak}日</div>
              <div className="text-sm text-gray-500">連続記録中！</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 今週の記録カレンダー */}
      <div>
        <h2 className="text-xl font-bold mb-4">今週の記録</h2>
        <MonthCalendar
          onSelectDate={(date) => {
            if (date === today) {
              setIsEditing(true);
            }
          }}
        />
      </div>
    </div>
  );
};

// クライアントコンポーネントとして使用するための設定
export const dynamic = "force-dynamic";
export const runtime = "edge";
