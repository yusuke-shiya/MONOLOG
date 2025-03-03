import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiaryEntry as DiaryEntryType } from "@/types/diary";
import { getMoodLabel, getMoodStyleClass } from "@/features/mood/utils/mood-utils";
import dayjs from "dayjs";

interface DiaryEntryProps {
  entry: DiaryEntryType;
  onEdit?: () => void;
}

/**
 * 日記エントリー表示コンポーネント
 */
export const DiaryEntryView: React.FC<DiaryEntryProps> = ({ entry, onEdit }) => {
  const formattedDate = dayjs(entry.date).format("YYYY年MM月DD日");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{formattedDate}</CardTitle>
        <div className={`px-3 py-1 rounded-full text-sm ${getMoodStyleClass(entry.moodScore)}`}>
          {entry.moodScore}: {getMoodLabel(entry.moodScore)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{entry.content}</p>
        {onEdit && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onEdit}>
              編集する
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
