import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDiaryStore } from '../diary-store';

// テスト用のセットアップ
beforeEach(() => {
  // LocalStorageのモックをクリア
  localStorage.clear();

  // Zustandストアをリセット - 型エラーを避けるためキャスト
  const initialState = useDiaryStore.getState();
  const resetState = { ...initialState, entries: {} };
  useDiaryStore.setState(resetState);

  // タイマーをリセット
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('DiaryStore', () => {
  describe('addEntry', () => {
    it('新しいエントリーを正しく追加する', () => {
      const { addEntry, getEntryByDate } = useDiaryStore.getState();

      // 日記を追加
      addEntry('テスト日記', 7);

      // 今日の日付
      const today = dayjs().format('YYYY-MM-DD');

      // エントリーが追加されたことを確認
      expect(getEntryByDate(today)).toBeDefined();
      expect(getEntryByDate(today)?.content).toBe('テスト日記');
      expect(getEntryByDate(today)?.moodScore).toBe(7);
    });

    it('特定の日付にエントリーを追加する', () => {
      const { addEntry, getEntryByDate } = useDiaryStore.getState();

      const testDate = '2025-01-01';

      // 特定の日付の日記を追加
      addEntry('特定日の日記', 8, testDate);

      // エントリーが追加されたことを確認
      expect(getEntryByDate(testDate)).toBeDefined();
      expect(getEntryByDate(testDate)?.content).toBe('特定日の日記');
      expect(getEntryByDate(testDate)?.moodScore).toBe(8);
    });
  });

  describe('updateEntry', () => {
    it('既存のエントリーを正しく更新する', () => {
      const { addEntry, updateEntry, getEntryByDate } = useDiaryStore.getState();

      const testDate = '2025-01-01';

      // まず日記を追加
      addEntry('更新前', 5, testDate);
      const originalEntry = getEntryByDate(testDate);

      // 少し待ってから更新（timestampの差を作るため）
      vi.advanceTimersByTime(1000);

      // 日記を更新
      updateEntry(testDate, '更新後', 8);

      // エントリーが更新されたことを確認
      expect(getEntryByDate(testDate)?.content).toBe('更新後');
      expect(getEntryByDate(testDate)?.moodScore).toBe(8);
      expect(getEntryByDate(testDate)?.createdAt).toBe(originalEntry?.createdAt); // 作成日は変わらない
      expect(getEntryByDate(testDate)?.updatedAt).not.toBe(originalEntry?.updatedAt); // 更新日は変わる
    });

    it('存在しないエントリーの更新は無視される', () => {
      const { updateEntry, getEntryByDate } = useDiaryStore.getState();

      const nonExistentDate = '2099-12-31';

      // 存在しない日付の日記を更新
      updateEntry(nonExistentDate, '無視される更新', 9);

      // エントリーが追加されていないことを確認
      expect(getEntryByDate(nonExistentDate)).toBeUndefined();
    });
  });

  describe('getEntryByDate', () => {
    it('指定した日付のエントリーを取得する', () => {
      const { addEntry, getEntryByDate } = useDiaryStore.getState();

      const testDate = '2025-02-15';

      // 日記を追加
      addEntry('取得テスト', 6, testDate);

      // エントリーを取得
      const entry = getEntryByDate(testDate);

      // 取得したエントリーが正しいことを確認
      expect(entry).toBeDefined();
      expect(entry?.content).toBe('取得テスト');
      expect(entry?.moodScore).toBe(6);
    });

    it('存在しない日付の場合はundefinedを返す', () => {
      const { getEntryByDate } = useDiaryStore.getState();

      const nonExistentDate = '2099-12-31';

      // 存在しない日付のエントリーを取得
      const entry = getEntryByDate(nonExistentDate);

      // undefinedが返されることを確認
      expect(entry).toBeUndefined();
    });
  });

  describe('getEntriesByMonth', () => {
    it('指定した月のエントリーを取得する', () => {
      const { addEntry, getEntriesByMonth } = useDiaryStore.getState();

      // 2025年3月のエントリーを追加
      addEntry('3月1日', 5, '2025-03-01');
      addEntry('3月15日', 7, '2025-03-15');
      addEntry('3月31日', 9, '2025-03-31');

      // 別の月のエントリーも追加
      addEntry('4月1日', 6, '2025-04-01');

      // 2025年3月のエントリーを取得
      const marchEntries = getEntriesByMonth(2025, 2);

      // 3月のエントリーが3つあることを確認
      expect(marchEntries).toHaveLength(3);

      // 日付でソートされていることを確認
      expect(marchEntries[0].date).toBe('2025-03-01');
      expect(marchEntries[1].date).toBe('2025-03-15');
      expect(marchEntries[2].date).toBe('2025-03-31');
    });

    it('エントリーがない月の場合は空配列を返す', () => {
      const { getEntriesByMonth } = useDiaryStore.getState();

      // 2025年5月のエントリーを取得
      const mayEntries = getEntriesByMonth(2025, 4); // 0-indexedなので4が5月

      // 空配列が返されることを確認
      expect(mayEntries).toHaveLength(0);
    });
  });

  describe('getStreak', () => {
    it('連続記録がない場合は0を返す', () => {
      const { getStreak } = useDiaryStore.getState();

      // 連続記録を計算
      const streak = getStreak();

      // 記録がないので0が返されることを確認
      expect(streak).toBe(0);
    });

    it('今日のエントリーがある場合のストリークを計算する', () => {
      const { addEntry, getStreak } = useDiaryStore.getState();

      const today = dayjs().format('YYYY-MM-DD');
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const twoDaysAgo = dayjs().subtract(2, 'day').format('YYYY-MM-DD');

      // 3日間連続で記録
      addEntry('今日', 7, today);
      addEntry('昨日', 6, yesterday);
      addEntry('一昨日', 5, twoDaysAgo);

      // 連続記録を計算
      const streak = getStreak();

      // 3日間の連続記録が返されることを確認
      expect(streak).toBe(3);
    });

    it('昨日までのエントリーがある場合のストリークを計算する', () => {
      const { addEntry, getStreak } = useDiaryStore.getState();

      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const twoDaysAgo = dayjs().subtract(2, 'day').format('YYYY-MM-DD');

      // 2日間連続で記録（今日はなし）
      addEntry('昨日', 6, yesterday);
      addEntry('一昨日', 5, twoDaysAgo);

      // 連続記録を計算
      const streak = getStreak();

      // 2日間の連続記録が返されることを確認
      expect(streak).toBe(2);
    });

    it('連続していない記録の場合は途切れたところまでのストリークを返す', () => {
      const { addEntry, getStreak } = useDiaryStore.getState();

      const today = dayjs().format('YYYY-MM-DD');
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      // 一昨日の記録がない
      const threeDaysAgo = dayjs().subtract(3, 'day').format('YYYY-MM-DD');

      // 連続していない記録
      addEntry('今日', 7, today);
      addEntry('昨日', 6, yesterday);
      addEntry('3日前', 4, threeDaysAgo);

      // 連続記録を計算
      const streak = getStreak();

      // 今日と昨日の2日間の連続記録が返されることを確認
      expect(streak).toBe(2);
    });
  });
});
