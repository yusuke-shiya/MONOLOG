/**
 * 気分スコアに対応する色を取得する
 * 1(低) → 赤色系
 * 10(高) → 青色系
 * 中間値はグラデーション
 */
export const getMoodColor = (score: number): string => {
  // 無効な値の場合はグレーを返す
  if (score < 1 || score > 10 || !Number.isInteger(score)) {
    return "#6b7280"; // gray-500
  }

  // スコアに応じた色のマッピング
  const colorMap: { [key: number]: string } = {
    1: "#e53e3e", // 赤 - 最も低いスコア
    2: "#dd6b20", // オレンジ赤
    3: "#d69e2e", // オレンジ
    4: "#bbb52c", // 黄色寄りのオレンジ
    5: "#90be6d", // ライトグリーン
    6: "#68d391", // グリーン
    7: "#4fd1c5", // ティール
    8: "#38b2ac", // ライトブルー 
    9: "#3182ce", // ブルー
    10: "#0063a5", // 濃いブルー - 最も高いスコア
  };

  return colorMap[score];
};

/**
 * 気分スコアに対応するラベルを取得する
 */
export const getMoodLabel = (score: number): string => {
  // 無効な値の場合
  if (score < 1 || score > 10 || !Number.isInteger(score)) {
    return "不明";
  }

  // スコアに応じたラベルのマッピング
  const labelMap: { [key: number]: string } = {
    1: "最悪",
    2: "とても悪い",
    3: "悪い",
    4: "少し悪い",
    5: "普通",
    6: "少し良い",
    7: "良い",
    8: "とても良い",
    9: "素晴らしい",
    10: "最高",
  };

  return labelMap[score];
};

/**
 * 気分スコアに対応するスタイルクラスを取得する
 */
export const getMoodStyleClass = (score: number): string => {
  if (score < 1 || score > 10 || !Number.isInteger(score)) {
    return "bg-gray-200 text-gray-700";
  }

  const bgClassMap: { [key: number]: string } = {
    1: "bg-red-500 text-white",
    2: "bg-orange-600 text-white",
    3: "bg-orange-500 text-white",
    4: "bg-yellow-500 text-white",
    5: "bg-lime-500 text-white",
    6: "bg-green-400 text-white",
    7: "bg-teal-400 text-white",
    8: "bg-teal-500 text-white",
    9: "bg-blue-500 text-white",
    10: "bg-blue-700 text-white",
  };

  return bgClassMap[score];
};
