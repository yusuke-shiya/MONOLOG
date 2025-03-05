import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../page';
import { useDiaryStore } from '@/features/diary/stores/diary-store';
import dayjs from 'dayjs';

// Zustandストアのモック
const createMockState = () => {
  const addEntryMock = vi.fn();
  const updateEntryMock = vi.fn();
  const getEntryByDateMock = vi.fn();
  const entriesMock = {};

  return {
    addEntry: addEntryMock,
    updateEntry: updateEntryMock,
    getEntryByDate: getEntryByDateMock,
    entries: entriesMock,
    getStreak: vi.fn(() => 0),
    getEntriesByMonth: vi.fn(() => []),
  };
};

// 初期モック状態
let mockState = createMockState();

// useDiaryStoreのモック
vi.mock('@/features/diary/stores/diary-store', () => ({
  useDiaryStore: vi.fn(() => ({
    ...mockState,
  })),
}));

// テスト前の準備
beforeEach(() => {
  // モックをリセット
  vi.resetAllMocks();
  localStorage.clear();

  // 初期状態を再作成
  mockState = createMockState();

  // モックの更新
  (useDiaryStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
    ...mockState,
  }));
});

describe('HomePage', () => {
  it('ページが正しくレンダリングされる', () => {
    render(<HomePage />);

    // タイトルが表示されていることを確認
    expect(screen.getByText('今日の一言')).toBeInTheDocument();

    // テキストエリアが表示されていることを確認
    expect(screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）')).toBeInTheDocument();

    // 気分スコアセレクタが表示されていることを確認
    expect(screen.getByText('今日の気分スコア')).toBeInTheDocument();

    // 送信ボタンが表示されていることを確認
    expect(screen.getByRole('button', { name: '記録する' })).toBeInTheDocument();
  });

  it('日記を入力して送信すると、addEntryが呼ばれる', async () => {
    render(<HomePage />);

    // テキストエリアに日記を入力
    const textArea = screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）');
    await userEvent.type(textArea, 'テスト日記');

    // 気分スコアを設定
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 8 } });

    // 送信ボタンをクリック
    const submitButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(submitButton);

    // addEntryが正しく呼ばれたことを確認
    expect(mockState.addEntry).toHaveBeenCalledWith('テスト日記', 8);
  });

  it('既存のエントリがある場合、フォームに内容が表示される', async () => {
    // 今日の日付
    const today = dayjs().format('YYYY-MM-DD');

    // モックエントリ
    const mockEntry = {
      content: '既存の日記',
      moodScore: 7,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // モックの状態を設定
    mockState.getEntryByDate.mockReturnValue(mockEntry);
    mockState.entries = { [today]: mockEntry };

    render(<HomePage />);

    // 既存の日記内容が表示されていることを確認
    await waitFor(() => {
      expect(screen.getByText(mockEntry.content)).toBeInTheDocument();
    });

    // 気分スコアが設定されていることを確認
    expect(screen.getByText(`7: とても良い`)).toBeInTheDocument();
  });

  it('既存のエントリを編集して更新すると、updateEntryが呼ばれる', async () => {
    // 今日の日付
    const today = dayjs().format('YYYY-MM-DD');

    // モックエントリ
    const mockEntry = {
      content: '既存の日記',
      moodScore: 7,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // モックの状態を設定
    mockState.getEntryByDate.mockReturnValue(mockEntry);
    mockState.entries = { [today]: mockEntry };

    render(<HomePage />);

    // 編集ボタンをクリック
    const editButton = await screen.findByRole('button', { name: '編集する' });
    await userEvent.click(editButton);

    // テキストエリアに新しい内容を入力
    const textArea = screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）');
    // まず既存のテキストをクリア
    await userEvent.clear(textArea);
    // 新しいテキストを入力
    await userEvent.type(textArea, '更新した日記');

    // 気分スコアを更新
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 9 } });

    // 更新ボタンをクリック
    const updateButton = screen.getByRole('button', { name: '記録する' });
    await userEvent.click(updateButton);

    // updateEntryが正しく呼ばれたことを確認
    expect(mockState.updateEntry).toHaveBeenCalledWith(today, '更新した日記', 9);
  });

  it('文字数制限（50文字）を超えると入力が制限される', async () => {
    render(<HomePage />);

    // テキストエリアに51文字の文字列を入力
    const textArea = screen.getByPlaceholderText('今日はどんな一日でしたか？（50文字以内）');
    const longText = 'あ'.repeat(51);
    await userEvent.type(textArea, longText);

    // 入力値が50文字に制限されていることを確認
    expect(textArea).toHaveValue('あ'.repeat(50));
  });
});
