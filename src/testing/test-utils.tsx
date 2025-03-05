import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// テスト用に使用するProviderなどのラッパーコンポーネント
interface TestProviderProps {
  children: React.ReactNode;
}

/**
 * テスト用のProviderをまとめたラッパーコンポーネント
 * Zustandストア、テーマ、ルーターなどのプロバイダーをラップする
 */
export const TestProvider = ({ children }: TestProviderProps) => {
  return (
    <>
      {/* 必要に応じてプロバイダーを追加 */}
      {children}
    </>
  );
};

/**
 * コンポーネントをテスト用のProviderでラップしてレンダリングする
 * @param ui テスト対象のコンポーネント
 * @param options レンダリングオプション
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>,
    ...options,
  });
};

/**
 * コンポーネントをカスタムコンテキストでレンダリングする汎用関数
 * @param ui テスト対象のコンポーネント
 * @param wrapper カスタムラッパーコンポーネント
 * @param options レンダリングオプション
 */
export const renderWithCustomContext = (
  ui: ReactElement,
  wrapper: React.FC<{ children: React.ReactNode }>,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper,
    ...options,
  });
};

// Testing Libraryからのすべてのエクスポートを再エクスポート
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
export { screen, fireEvent, waitFor, within };
export { renderWithProviders as render };
