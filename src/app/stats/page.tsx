"use client";

import React from "react";
import { StatsDisplay } from "@/features/stats/components/StatsDisplay";

/**
 * 統計ページ
 * 日記の統計情報を表示する
 */
export default function StatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">統計</h1>
      <p className="text-gray-500 mb-6">
        あなたの記録の統計情報です。継続的に記録することで、より詳細な分析が可能になります。
      </p>

      <StatsDisplay />
    </div>
  );
}
