import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiaryEntry } from "@/types/diary";
import dayjs from "dayjs";

/**
 * 日記ストアの状態定義
 */
interface DiaryState {
  entries: { [date: string]: DiaryEntry };
  // アクション
  addEntry: (content: string, moodScore: number, date?: string) => void;
  updateEntry: (date: string, content: string, moodScore: number) => void;
  getEntryByDate: (date: string) => DiaryEntry | undefined;
  getEntriesByMonth: (year: number, month: number) => DiaryEntry[];
  getStreak: () => number;
}

/**
 * 日記エントリーを管理するストア
 */
export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: {},

      // 新規エントリーの追加
      addEntry: (content: string, moodScore: number, date?: string) => {
        const targetDate = date || dayjs().format("YYYY-MM-DD");
        const timestamp = new Date().toISOString();

        const newEntry: DiaryEntry = {
          id: `diary-${targetDate}-${Date.now()}`,
          date: targetDate,
          content,
          moodScore,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          entries: {
            ...state.entries,
            [targetDate]: newEntry,
          },
        }));
      },

      // エントリーの更新
      updateEntry: (date: string, content: string, moodScore: number) => {
        set((state) => {
          const entry = state.entries[date];
          if (!entry) return state;

          const updatedEntry: DiaryEntry = {
            ...entry,
            content,
            moodScore,
            updatedAt: new Date().toISOString(),
          };

          return {
            entries: {
              ...state.entries,
              [date]: updatedEntry,
            },
          };
        });
      },

      // 日付でエントリーを取得
      getEntryByDate: (date: string) => {
        return get().entries[date];
      },

      // 月ごとのエントリーを取得
      getEntriesByMonth: (year: number, month: number) => {
        const entries = get().entries;
        const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;

        return Object.values(entries).filter((entry) =>
          entry.date.startsWith(prefix)
        ).sort((a, b) => a.date.localeCompare(b.date));
      },

      // 連続記録日数を取得
      getStreak: () => {
        const entries = get().entries;
        const sortedDates = Object.keys(entries)
          .sort()
          .reverse();

        if (sortedDates.length === 0) return 0;

        const today = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

        // 今日または昨日のエントリーがなければストリークは0
        if (!entries[today] && !entries[yesterday]) return 0;

        // 最新のエントリーが今日でも昨日でもない場合はストリークは0
        const latestDate = sortedDates[0];
        if (latestDate !== today && latestDate !== yesterday) return 0;

        let streak = 1; // 最新のエントリーでストリークは1から始まる

        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = dayjs(sortedDates[i - 1]);
          const prevDate = dayjs(sortedDates[i]);

          // 日付の差が1日の場合、ストリークを増やす
          if (currentDate.diff(prevDate, "day") === 1) {
            streak++;
          } else {
            break; // 連続していない場合はループを抜ける
          }
        }

        return streak;
      },
    }),
    {
      name: "diary-storage", // LocalStorageのキー
    }
  )
);
