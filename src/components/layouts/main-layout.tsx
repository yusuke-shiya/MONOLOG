"use client";

import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

/**
 * メインレイアウトコンポーネント
 * 共通のヘッダーとナビゲーションを提供
 */
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">MONOLOG</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* フッター（ナビゲーション） */}
      <footer className="bg-white border-t py-4 sticky bottom-0">
        <div className="container mx-auto px-4">
          <Tabs value={pathname} className="w-full justify-center">
            <TabsList className="w-full justify-between">
              <TabsTrigger
                value="/"
                asChild
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Link href="/">ホーム</Link>
              </TabsTrigger>
              <TabsTrigger
                value="/calendar"
                asChild
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Link href="/calendar">カレンダー</Link>
              </TabsTrigger>
              <TabsTrigger
                value="/stats"
                asChild
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Link href="/stats">統計</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </footer>
    </div>
  );
};
