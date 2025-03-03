"use client";

import React, { useEffect } from "react";

// カスタム設定したdayjsをインポート
import "@/lib/dayjs";

/**
 * アプリケーション全体のプロバイダーコンポーネント
 * グローバルな状態や設定をラップする
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
