/**
 * Zustandストアをテストするためのユーティリティ関数群
 */
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { create } from 'zustand';

/**
 * テスト用にZustandストアを作成するシンプルな関数
 * テスト中のストアの状態を簡単に変更できるようにする
 * 
 * @param initialState 初期状態のオブジェクト
 * @returns テスト用のストアインスタンスとヘルパー関数
 */
export function createTestStore<T extends object>(initialState: Partial<T>) {
  // createStoreは通常のZustandのcreate関数を使用
  const useStore = create<T>(() => ({
    ...initialState as T,
  }));

  // テスト用のヘルパー関数
  const reset = () => {
    act(() => {
      useStore.setState(initialState as T, true);
    });
  };

  // ストアの状態を変更するヘルパー関数
  const setState = (newState: Partial<T>) => {
    act(() => {
      useStore.setState(newState);
    });
  };

  return {
    useStore,
    reset,
    setState,
    getState: useStore.getState,
  };
}

/**
 * モックZustandストアの作成関数
 * ZustandストアをVitestでモックする際に使用
 * 
 * @param initialState 初期状態オブジェクト
 * @returns モック化されたストアオブジェクト
 */
export function mockZustandStore<T extends object>(initialState: Partial<T>) {
  const store = {
    getState: vi.fn(() => initialState),
    setState: vi.fn((newState: Partial<T>) => {
      Object.assign(initialState, newState);
    }),
    subscribe: vi.fn(),
    destroy: vi.fn(),
  };

  return store;
}
