import * as z from "zod";

/**
 * 日記エントリーのバリデーションスキーマ
 */
export const diaryEntrySchema = z.object({
  content: z
    .string()
    .min(1, "内容は必須です。")
    .max(50, "内容は50文字以内で入力してください。"),
  moodScore: z
    .number()
    .int()
    .min(1, "気分スコアは1以上を選択してください。")
    .max(10, "気分スコアは10以下を選択してください。"),
});

export type DiaryEntryFormValues = z.infer<typeof diaryEntrySchema>;
