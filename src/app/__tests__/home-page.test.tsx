import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HomePage from '../page';


beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();

  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
});

describe('HomePage', () => {
  it('ページが正しくレンダリングされる', () => {
    render(<HomePage />);

    // タイトルが表示されていることを確認
    expect(screen.getByText('今日の一言')).toBeInTheDocument();

    // DiaryEntryViewが表示されていることを確認
    expect(screen.getByText('今日の記録がまだありません')).toBeInTheDocument();

    // 送信ボタンが表示されていることを確認
    expect(screen.getByRole('button', { name: '記録する' })).toBeInTheDocument();
  });

  it('記録ボタンをクリックすると、DiaryFormが表示される', async () => {
    render(<HomePage />);

    // 記録ボタンをクリック
    const recordButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(recordButton);

    // DiaryFormが表示されることを確認
    expect(screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）')).toBeInTheDocument();

    // 気分スコアセレクタが表示されることを確認
    expect(screen.getByRole('slider')).toBeInTheDocument();

    // 送信ボタンが表示されることを確認
    expect(screen.getByRole('button', { name: '記録する' })).toBeInTheDocument();
  });

  it('DiaryFormで記録すると、DiaryEntryViewが表示される', async () => {
    render(<HomePage />);

    // 記録ボタンをクリック
    const recordButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(recordButton);

    // テキストエリアに日記を入力
    const textArea = screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）');
    await userEvent.type(textArea, 'テスト日記');

    // 気分スコアの初期値が5に設定されていることを確認
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue(5);
    // 気分スコアを変更
    await userEvent.click(slider);
    await userEvent.keyboard('{arrowright}');
    await userEvent.keyboard('{arrowright}');
    await userEvent.keyboard('{arrowright}');
    expect(slider).toHaveValue(8);

    // 送信ボタンをクリック
    const submitButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(submitButton);

    // DiaryEntryViewが表示されることを確認
    expect(screen.getByText(dayjs().format('YYYY年MM月DD日'))).toBeInTheDocument();
    expect(screen.getByText('テスト日記')).toBeInTheDocument();
    expect(screen.getByText('8: とても良い')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '編集する' })).toBeInTheDocument();
  });

  it('編集ボタンをクリックすると、DiaryFormが表示される', async () => {
    render(<HomePage />);

    // 記録ボタンをクリック
    const recordButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(recordButton);

    // テキストエリアに日記を入力
    const textArea = screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）');
    await userEvent.type(textArea, 'テスト日記');

    // 気分スコアの初期値が5に設定されていることを確認
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue(5);
    // 気分スコアを変更
    await userEvent.click(slider);
    await userEvent.keyboard('{arrowright}');
    await userEvent.keyboard('{arrowright}');
    await userEvent.keyboard('{arrowright}');
    expect(slider).toHaveValue(8);

    // 送信ボタンをクリック
    const submitButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(submitButton);

    // DiaryEntryViewが表示されることを確認
    const editButton = screen.getByRole('button', { name: '編集する' });
    await userEvent.click(editButton);

    // DiaryFormが表示されることを確認
    expect(screen.getByText('テスト日記')).toBeInTheDocument();

    // 気分スコアが8に設定されていることを確認
    expect(slider).toHaveValue(8);

    // 送信ボタンが表示されることを確認
    expect(screen.getByRole('button', { name: '更新する' })).toBeInTheDocument();

    // テキストエリアに日記を入力
    const editTextArea = screen.getByText('テスト日記');
    await userEvent.type(editTextArea, '_編集済み');

    // 気分スコアを変更
    const editSlider = screen.getByRole('slider');
    await userEvent.click(editSlider);
    await userEvent.keyboard('{arrowleft}');
    await userEvent.keyboard('{arrowleft}');
    await userEvent.keyboard('{arrowleft}');
    await userEvent.keyboard('{arrowleft}');
    expect(editSlider).toHaveValue(4);

    // 送信ボタンをクリック
    await userEvent.click(submitButton);

    // DiaryEntryViewが表示されることを確認
    expect(screen.getByText('テスト日記_編集済み')).toBeInTheDocument();
    expect(screen.getByText('4: 少し悪い')).toBeInTheDocument();
  });
});
