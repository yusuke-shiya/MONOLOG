import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoodSelector } from '../mood-selector';
import { getMoodLabel } from '../../utils/mood-utils';

// スライダーのテストのためのヘルパー関数
const selectSliderValue = async (slider: HTMLElement, value: number) => {
  // スライダーの値を設定
  fireEvent.change(slider, { target: { value } });
};

describe('MoodSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('デフォルト値を正しく表示する', () => {
    render(<MoodSelector defaultValue={5} />);

    // デフォルト値のラベルが表示されていることを確認
    expect(screen.getByText(`5: ${getMoodLabel(5)}`)).toBeInTheDocument();
  });

  it('カスタム値を正しく表示する', () => {
    render(<MoodSelector defaultValue={8} />);

    // カスタム値のラベルが表示されていることを確認
    expect(screen.getByText(`8: ${getMoodLabel(8)}`)).toBeInTheDocument();
  });

  it('値変更時にスコアとラベルが更新される', async () => {
    render(<MoodSelector defaultValue={5} />);

    // スライダー要素を取得
    const slider = screen.getByRole('slider');

    // スライダーを8に変更
    await selectSliderValue(slider, 8);

    // 新しい値のラベルが表示されていることを確認
    expect(screen.getByText(`8: ${getMoodLabel(8)}`)).toBeInTheDocument();
  });

  it('値変更時にコールバックを正しく呼び出す', async () => {
    // モックコールバック関数
    const onChangeMock = vi.fn();

    render(<MoodSelector defaultValue={5} onChange={onChangeMock} />);

    // スライダー要素を取得
    const slider = screen.getByRole('slider');

    // スライダーを9に変更
    await selectSliderValue(slider, 9);

    // コールバックが9の値で呼ばれることを確認
    expect(onChangeMock).toHaveBeenCalledWith(9);
  });

  it('スコアに対応した色スタイルが適用される', async () => {
    render(<MoodSelector defaultValue={5} />);

    // スライダー要素を取得
    const slider = screen.getByRole('slider');

    // 最初のスコア表示要素を取得
    const initialScoreDisplay = screen.getByText(`5: ${getMoodLabel(5)}`);

    // 特定のクラスを持っていることを確認
    expect(initialScoreDisplay).toHaveClass('bg-lime-500');

    // スライダーを3に変更
    await selectSliderValue(slider, 3);

    // 更新されたスコア表示要素を取得
    const updatedScoreDisplay = screen.getByText(`3: ${getMoodLabel(3)}`);

    // 新しい色クラスが適用されていることを確認
    expect(updatedScoreDisplay).toHaveClass('bg-orange-500');
  });

  it('カラーバーが10段階すべて表示されている', () => {
    render(<MoodSelector defaultValue={5} />);

    // カラーバーの要素が10個あることを確認
    const colorBarElements = screen.getAllByTestId('color-bar-segment');
    expect(colorBarElements).toHaveLength(10);
  });
});
