import { describe, it, expect } from 'vitest';
import { getMoodColor, getMoodLabel, getMoodStyleClass } from '../mood-utils';

describe('mood-utils', () => {
  describe('getMoodColor', () => {
    it('有効なスコアに対して正しい色を返す', () => {
      // 各スコアに対応する色をテスト
      expect(getMoodColor(1)).toBe('#e53e3e');
      expect(getMoodColor(5)).toBe('#90be6d');
      expect(getMoodColor(10)).toBe('#0063a5');
    });

    it('境界値に対して正しい色を返す', () => {
      // 最小値と最大値
      expect(getMoodColor(1)).toBe('#e53e3e');
      expect(getMoodColor(10)).toBe('#0063a5');
    });

    it('無効なスコアに対してグレーを返す', () => {
      // 範囲外の値
      expect(getMoodColor(0)).toBe('#6b7280');
      expect(getMoodColor(11)).toBe('#6b7280');

      // 小数値
      expect(getMoodColor(5.5)).toBe('#6b7280');

      // 負の値
      expect(getMoodColor(-1)).toBe('#6b7280');
    });
  });

  describe('getMoodLabel', () => {
    it('有効なスコアに対して正しいラベルを返す', () => {
      // 各スコアに対応するラベルをテスト
      expect(getMoodLabel(1)).toBe('最悪');
      expect(getMoodLabel(5)).toBe('普通');
      expect(getMoodLabel(10)).toBe('最高');
    });

    it('境界値に対して正しいラベルを返す', () => {
      // 最小値と最大値
      expect(getMoodLabel(1)).toBe('最悪');
      expect(getMoodLabel(10)).toBe('最高');
    });

    it('無効なスコアに対して「不明」を返す', () => {
      // 範囲外の値
      expect(getMoodLabel(0)).toBe('不明');
      expect(getMoodLabel(11)).toBe('不明');

      // 小数値
      expect(getMoodLabel(5.5)).toBe('不明');

      // 負の値
      expect(getMoodLabel(-1)).toBe('不明');
    });
  });

  describe('getMoodStyleClass', () => {
    it('有効なスコアに対して正しいスタイルクラスを返す', () => {
      // 各スコアに対応するスタイルクラスをテスト
      expect(getMoodStyleClass(1)).toBe('bg-red-500 text-white');
      expect(getMoodStyleClass(5)).toBe('bg-lime-500 text-white');
      expect(getMoodStyleClass(10)).toBe('bg-blue-700 text-white');
    });

    it('境界値に対して正しいスタイルクラスを返す', () => {
      // 最小値と最大値
      expect(getMoodStyleClass(1)).toBe('bg-red-500 text-white');
      expect(getMoodStyleClass(10)).toBe('bg-blue-700 text-white');
    });

    it('無効なスコアに対してデフォルトのスタイルクラスを返す', () => {
      // 範囲外の値
      expect(getMoodStyleClass(0)).toBe('bg-gray-200 text-gray-700');
      expect(getMoodStyleClass(11)).toBe('bg-gray-200 text-gray-700');

      // 小数値
      expect(getMoodStyleClass(5.5)).toBe('bg-gray-200 text-gray-700');

      // 負の値
      expect(getMoodStyleClass(-1)).toBe('bg-gray-200 text-gray-700');
    });
  });
});
