import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// モックの設定
// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// windowオブジェクトにLocalStorageのモックを設定
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 非推奨だが互換性のために残す
    removeListener: vi.fn(), // 非推奨だが互換性のために残す
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// テスト間でグローバル状態をリセット
afterEach(() => {
  vi.restoreAllMocks();
  localStorageMock.clear();
});
