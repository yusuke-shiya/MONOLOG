import dayjs from "dayjs";
import "dayjs/locale/ja"; // 日本語ロケール
import utc from "dayjs/plugin/utc"; // UTC時間
import timezone from "dayjs/plugin/timezone"; // タイムゾーン
import weekOfYear from "dayjs/plugin/weekOfYear"; // 年の何週目か
import isoWeek from "dayjs/plugin/isoWeek"; // ISO週番号
import updateLocale from "dayjs/plugin/updateLocale"; // ロケール更新
import weekday from "dayjs/plugin/weekday"; // 週の曜日（0-6）を取得・設定
import advancedFormat from "dayjs/plugin/advancedFormat"; // 追加フォーマット
import relativeTime from "dayjs/plugin/relativeTime"; // 相対時間
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // 日付の比較
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // 日付の比較
import isToday from "dayjs/plugin/isToday"; // 今日かどうか
import isBetween from "dayjs/plugin/isBetween"; // 期間内かどうか
import duration from "dayjs/plugin/duration"; // 期間計算

// プラグイン登録
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(duration);

// 日本語ロケールの設定
dayjs.locale("ja");

// 週の開始日を月曜日に設定
dayjs.updateLocale("ja", {
  weekStart: 1, // 0:日曜日, 1:月曜日
});

export default dayjs;
