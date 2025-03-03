import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiaryStore } from "@/features/diary/stores/diary-store";
import dayjs from "dayjs";

/**
 * 統計情報表示コンポーネント
 * シンプルな統計情報と連続記録日数を表示
 */
export const StatsDisplay: React.FC = () => {
  const entries = useDiaryStore((state) => state.entries);
  const getStreak = useDiaryStore((state) => state.getStreak);

  const streak = getStreak();
  const entriesArray = Object.values(entries);
  const totalEntries = entriesArray.length;

  // 平均気分スコアの計算
  const averageMood = totalEntries > 0
    ? entriesArray.reduce((acc, entry) => acc + entry.moodScore, 0) / totalEntries
    : 0;

  // 週間と月間のエントリを取得
  const now = dayjs();
  const startOfWeek = now.startOf("week").format("YYYY-MM-DD");
  const startOfMonth = now.startOf("month").format("YYYY-MM-DD");

  const weekEntries = entriesArray.filter(entry => entry.date >= startOfWeek);
  const monthEntries = entriesArray.filter(entry => entry.date >= startOfMonth);

  // 週間と月間の平均気分スコア
  const weeklyAverageMood = weekEntries.length > 0
    ? weekEntries.reduce((acc, entry) => acc + entry.moodScore, 0) / weekEntries.length
    : 0;

  const monthlyAverageMood = monthEntries.length > 0
    ? monthEntries.reduce((acc, entry) => acc + entry.moodScore, 0) / monthEntries.length
    : 0;

  // 週間と月間の記録率
  const daysInWeek = 7;
  const daysInMonth = now.daysInMonth();
  const weeklyRecordRate = weekEntries.length / daysInWeek * 100;
  const monthlyRecordRate = monthEntries.length / daysInMonth * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>記録の継続状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-3xl font-bold">{streak}</div>
              <div className="text-sm text-gray-500">連続記録日数</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-3xl font-bold">{totalEntries}</div>
              <div className="text-sm text-gray-500">総記録数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>平均気分スコア</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold">{weeklyAverageMood.toFixed(1)}</div>
              <div className="text-sm text-gray-500">週間</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold">{monthlyAverageMood.toFixed(1)}</div>
              <div className="text-sm text-gray-500">月間</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold">{averageMood.toFixed(1)}</div>
              <div className="text-sm text-gray-500">全期間</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>記録達成率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold">{weeklyRecordRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">週間 ({weekEntries.length}/{daysInWeek}日)</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold">{monthlyRecordRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">月間 ({monthEntries.length}/{daysInMonth}日)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
