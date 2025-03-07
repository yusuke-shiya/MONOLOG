/**
 * 日記エントリーのデータモデル
 */
export interface DiaryEntry {
  id: string;             // ユニークID
  date: string;           // ISO形式の日付文字列 (YYYY-MM-DD)
  content: string;        // 50文字以内のテキスト
  moodScore: number;      // 1-10の数値
  createdAt: string;      // ISO形式のタイムスタンプ
  updatedAt: string;      // ISO形式のタイムスタンプ
}

/**
 * 統計データモデル
 */
export interface MoodStats {
  daily: { [date: string]: number };  // 日別の気分スコア
  weekly: { [weekId: string]: number }; // 週別の平均気分スコア
  monthly: { [monthId: string]: number }; // 月別の平均気分スコア 
  streak: number;         // 連続記録日数
}

/**
 * ユーザー設定（Phase 2以降）
 */
export interface UserSettings {
  theme: 'light' | 'dark';
  // 他の設定
}

/**
 * アプリケーション全体の状態
 */
export type AppState = {
  entries: { [date: string]: DiaryEntry };
  stats: MoodStats;
  settings: UserSettings;
}
