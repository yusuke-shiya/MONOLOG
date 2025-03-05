/**
 * Zustandストアをテストするためのユーティリティ関数群
 */
import { act } from '@testing-library/react';
import { StateCreator, create } from 'zustand';
import { vi } from 'vitest';

/**
 * テスト用にZustandストアを作成するシンプルな関数
 * テスト中のストアの状態を簡単に変更できるようにする
 * 
 * @param initialState 初期状態のオブジェクト
 * @returns テスト用のストアインスタンスとヘルパー関数
 */
export function createTestStore<T extends object>(initialState: Partial<T>) {
  // createStoreは通常のZustandのcreate関数を使用
  const useStore = create<T>((set) => ({
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

/**
 * Zustandモジュールをモック化する
 * vi.mock() 内で使用するためのヘルパー関数
 * 
 * @returns モック化されたZustandの create 関数と実装マップ
 */
export const mockZustand = () => {
  // Zustandストアのインターフェース定義
  interface StoreApi<T> {
    setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
    getState: () => T;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }

  // ストア作成関数の型
  type StoreCreator<T> = (setState: StoreApi<T>['setState'], getState: () => T, api: StoreApi<T>) => T;

  const implementations = new Map<StoreCreator<any>, StoreApi<any> & any>();

  return {
    create: (<T>(createState: StoreCreator<T>) => {
      // 巡回参照に対応するため、先に空のオブジェクトを作成
      const api = {} as StoreApi<T> & T;

      // setState関数
      const setState = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => {
        api.setState(partial, replace);
      };

      // getState関数
      const getState = () => api;

      // ストア作成関数を実行して状態部分を取得
      const state = createState(setState, getState, api);

      // apiオブジェクトに状態とメソッドを追加
      Object.assign(api, state);

      // メソッドをモック化
      api.setState = vi.fn();
      api.getState = vi.fn(() => api);
      api.subscribe = vi.fn(() => () => { });
      api.destroy = vi.fn();

      implementations.set(createState, api);

      return api;
    }) as typeof create,
    implementations,
  };
};
