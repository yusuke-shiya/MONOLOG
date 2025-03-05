import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { getMoodColor, getMoodLabel, getMoodStyleClass } from "../utils/mood-utils";

interface MoodSelectorProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
}

/**
 * 気分スコア選択コンポーネント
 * 1-10の範囲でスコアを選択し、視覚的にフィードバックを提供する
 */
export const MoodSelector: React.FC<MoodSelectorProps> = ({
  defaultValue = 5,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleValueChange = (newValue: number[]) => {
    const score = newValue[0];
    setValue(score);
    onChange?.(score);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">今日の気分スコア</span>
        <div className={`px-3 py-1 rounded-full text-sm ${getMoodStyleClass(value)}`}>
          {value}: {getMoodLabel(value)}
        </div>
      </div>

      <Slider
        defaultValue={[defaultValue]}
        min={1}
        max={10}
        step={1}
        onValueChange={handleValueChange}
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>1: 最悪</span>
        <span>5: 普通</span>
        <span>10: 最高</span>
      </div>

      <div className="flex h-2 w-full mt-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <div
            key={score}
            className="flex-1 h-full"
            style={{ backgroundColor: getMoodColor(score) }}
            data-testid="color-bar-segment"
          />
        ))}
      </div>
    </div>
  );
};
