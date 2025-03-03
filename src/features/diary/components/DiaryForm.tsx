import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiaryEntryFormValues, diaryEntrySchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/features/mood/components/MoodSelector";
import { useDiaryStore } from "../stores/diary-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import dayjs from "dayjs";

interface DiaryFormProps {
  defaultValues?: Partial<DiaryEntryFormValues>;
  date?: string; // ISO形式の日付文字列 (YYYY-MM-DD)
  onSuccess?: () => void;
}

/**
 * 日記入力フォームコンポーネント
 */
export const DiaryForm: React.FC<DiaryFormProps> = ({
  defaultValues = { content: "", moodScore: 5 },
  date,
  onSuccess,
}) => {
  const addEntry = useDiaryStore((state) => state.addEntry);
  const updateEntry = useDiaryStore((state) => state.updateEntry);
  const getEntryByDate = useDiaryStore((state) => state.getEntryByDate);

  const today = dayjs().format("YYYY-MM-DD");
  const targetDate = date || today;
  const existingEntry = getEntryByDate(targetDate);
  const isUpdate = !!existingEntry;

  // フォーム初期値の設定
  const formValues = {
    content: existingEntry?.content || defaultValues.content || "",
    moodScore: existingEntry?.moodScore || defaultValues.moodScore || 5,
  };

  const form = useForm<DiaryEntryFormValues>({
    resolver: zodResolver(diaryEntrySchema),
    defaultValues: formValues,
  });

  const onSubmit = (data: DiaryEntryFormValues) => {
    if (isUpdate) {
      updateEntry(targetDate, data.content, data.moodScore);
    } else {
      addEntry(data.content, data.moodScore, targetDate);
    }

    onSuccess?.();
  };

  const content = form.watch("content");
  const contentLength = content?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <textarea
                    {...field}
                    placeholder="今日はどんな一日でしたか？（50文字以内）"
                    className="w-full min-h-[120px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={50}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {contentLength}/50
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moodScore"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MoodSelector
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isUpdate ? "更新する" : "記録する"}
        </Button>
      </form>
    </Form>
  );
};
