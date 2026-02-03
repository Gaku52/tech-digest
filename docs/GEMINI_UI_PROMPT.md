# Tech Digest UI改善プロンプト - Gemini用

このプロンプトをGemini 2.0に投稿してください。

---

# 🎨 Tech Digest UI改善依頼

あなたは**世界最高峰のUI/UXデザイナー**です。以下のNext.js + Tailwindで作られた技術情報サイト「Tech Digest」のUIを、**最先端のモダンデザイン**に改善してください。

---

## 📋 現在のコード

### 1. src/app/page.tsx

```typescript
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getLatestArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });
  return articles;
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  const priorityColors = {
    critical: 'bg-red-500/20 text-red-300 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    low: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  };

  const categoryColors = {
    AI: 'bg-purple-500/20 text-purple-300',
    Frontend: 'bg-cyan-500/20 text-cyan-300',
    Backend: 'bg-green-500/20 text-green-300',
    DevOps: 'bg-yellow-500/20 text-yellow-300',
    Tools: 'bg-pink-500/20 text-pink-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Tech Digest
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                SuperGrokが分析する最新技術トレンド
              </p>
            </div>
            <a
              href="https://github.com/Gaku52/tech-digest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            最新の技術トレンド
          </h2>
          <p className="text-gray-400">
            SuperGrokが毎日分析する、Xから抽出された最新のエンジニアリングトピック
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              まだ記事がありません
            </p>
            <p className="text-gray-500 text-sm">
              <code className="bg-slate-800 px-2 py-1 rounded">
                npm run genprompt
              </code>{' '}
              でプロンプトを生成してSuperGrokに投稿してください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group"
              >
                <article className="h-full bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-slate-800/80 hover:border-white/20 transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        categoryColors[article.category as keyof typeof categoryColors] ||
                        categoryColors.Tools
                      }`}
                    >
                      {article.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        priorityColors[article.priority as keyof typeof priorityColors] ||
                        priorityColors.low
                      }`}
                    >
                      {article.priority}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                    <time>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </time>
                    {article.engagement && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {article.engagement.toLocaleString()}
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>
            Powered by{' '}
            <a
              href="https://x.com/i/grok"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SuperGrok
            </a>{' '}
            &{' '}
            <a
              href="https://claude.ai"
              className="text-purple-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude Code
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
```

---

### 2. src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 15, 23, 42;
  --background-end-rgb: 30, 41, 59;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      rgb(var(--background-start-rgb)),
      rgb(var(--background-end-rgb))
    );
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 🎯 改善目標

世界最高峰の技術メディアに匹敵する、**プロフェッショナルで洗練されたUI**を実現してください。

### 参考デザイン

以下のサイトのような**高級感と先進性**を目指してください:

1. **Vercel.com** - クリーンで未来的、グラデーション活用
2. **Linear.app** - シャープでプロフェッショナル、アニメーション豊富
3. **Stripe.com** - 信頼感のあるデザイン、マイクロインタラクション
4. **Arc Browser** - 大胆なカラー、モダンなタイポグラフィ
5. **Notion** - 使いやすさと美しさの両立

---

## ✨ 具体的な改善ポイント

### 1. ヒーローセクション (新規追加)

- **キャッチーなヘッドライン**: "AIが選ぶ、今日の技術トレンド" など
- **サブヘッドライン**: SuperGrokの価値提案を明確に
- **CTAボタン**:
  - "最新記事を読む" (スムーズスクロール)
  - "GitHub Star" (外部リンク)
  - "RSSフィード" (購読)
- **アニメーション**:
  - フェードイン
  - グラデーションテキストのアニメーション
  - 浮遊感のある背景要素

### 2. カードデザイン強化

- **ホバー時のエフェクト**:
  - 滑らかなスケールアップ (scale-105)
  - シャドウの拡大
  - ボーダーグローエフェクト
- **グラスモーフィズム**:
  - より透明度の高い背景
  - backdrop-blur の強化
  - 微妙な光沢感
- **カードの階層**:
  - Featured記事を大きく表示
  - 優先度が高い記事を上部に配置

### 3. タイポグラフィ改善

- **フォントファミリー**:
  - 見出し: Inter Bold / Manrope / Poppins
  - 本文: Inter Regular
  - コード: JetBrains Mono
- **サイズ階層**:
  - Hero: text-6xl / text-5xl (モバイル)
  - Section見出し: text-4xl
  - カード見出し: text-2xl
  - 本文: text-base / text-lg
- **行間・文字間**:
  - 見出し: leading-tight, tracking-tight
  - 本文: leading-relaxed

### 4. カラーパレット最適化

- **プライマリグラデーション**:
  - より鮮やかな青〜紫 (#3b82f6 → #8b5cf6)
  - アクセントに緑やシアンを追加
- **カテゴリカラー**:
  - AI: 紫〜ピンクのグラデーション
  - Frontend: シアン〜青
  - Backend: 緑〜エメラルド
  - DevOps: オレンジ〜黄色
  - Tools: ピンク〜赤
- **背景**:
  - より深いダークカラー (#0f172a → #020617)
  - 微妙なグリッドパターンやノイズテクスチャ

### 5. アニメーション追加

以下のアニメーションを実装してください:

- **ページロード時**:
  - ヒーローセクション: フェードイン + 上からスライド
  - カード: 順次フェードイン (staggered animation)
- **スクロール時**:
  - パララックス効果 (背景とコンテンツの速度差)
  - スクロールトリガーでのフェードイン
- **ホバー時**:
  - カードの浮き上がり (transform + shadow)
  - ボタンのリップル効果
  - タグのカラーシフト
- **マイクロインタラクション**:
  - いいね数のカウントアップアニメーション
  - 優先度バッジのパルス (criticalの場合)

### 6. レスポンシブデザイン

- **モバイル (< 768px)**:
  - 1カラムレイアウト
  - ヒーローのフォントサイズ調整
  - ナビゲーションをハンバーガーメニューに
- **タブレット (768px - 1024px)**:
  - 2カラムレイアウト
  - カードサイズの最適化
- **デスクトップ (> 1024px)**:
  - 3カラムレイアウト
  - サイドバー追加 (カテゴリフィルター、人気記事)

### 7. 新規コンポーネント

以下のコンポーネントを追加してください:

1. **HeroSection.tsx**:
   - ヘッドライン
   - CTAボタン
   - 背景アニメーション

2. **ArticleCard.tsx**:
   - カード本体
   - ホバーエフェクト
   - 優先度・カテゴリバッジ

3. **FilterBar.tsx** (オプション):
   - カテゴリフィルター
   - 優先度フィルター
   - 検索バー

4. **NewsletterSignup.tsx** (オプション):
   - メール登録フォーム
   - RSSフィードリンク

---

## 🛠️ 技術制約

- **Next.js 15 App Router**: Server Componentsを維持
- **Tailwind CSS**: 可能な限りTailwindのみで実装 (追加ライブラリは最小限)
- **アニメーション**: Tailwindの `transition-*` + CSS `@keyframes`
  - または `framer-motion` の使用も許可 (明示的に提案してください)
- **アクセシビリティ**: ARIA属性、キーボードナビゲーション対応
- **SEO**: メタデータ、セマンティックHTML維持
- **パフォーマンス**: 画像最適化、lazy loading

---

## 📦 出力形式

以下のファイルを改善版として提供してください:

### 必須ファイル

1. **src/app/page.tsx** - 完全改善版
   - ヒーローセクション追加
   - カードレイアウト改善
   - アニメーション実装

2. **src/app/globals.css** - 追加スタイル
   - カスタムアニメーション定義
   - グローバルスタイル
   - ユーティリティクラス

3. **src/components/HeroSection.tsx** - 新規作成
   - ヒーローセクションコンポーネント

### オプションファイル

4. **src/components/ArticleCard.tsx** - カード抽出版
5. **src/components/FilterBar.tsx** - フィルター機能
6. **tailwind.config.ts** - カスタムカラー・アニメーション定義

---

## 📝 追加要件

- **各ファイルに変更点の説明コメントを含める**
- **Tailwindのクラス名を活用し、カスタムCSSは最小限に**
- **ダークモード専用デザイン** (ライトモードは不要)
- **コードはコピペですぐ動く状態で提供**

---

## 💡 インスピレーション

以下の要素を取り入れてください:

- **Vercel風**: グラデーションテキスト、グローエフェクト
- **Linear風**: シャープなライン、高コントラスト
- **Stripe風**: 信頼感のあるレイアウト、明確なCTA
- **Notion風**: クリーンで読みやすいタイポグラフィ
- **Arc風**: 大胆なカラー、独創的なデザイン

---

## 🎨 デザインのゴール

1. **第一印象**: "これはプロが作ったサイトだ" と思わせる
2. **ユーザビリティ**: 記事が見つけやすく、読みやすい
3. **パフォーマンス**: アニメーションは滑らか、遅延なし
4. **ブランディング**: "Tech Digest" の独自性を確立

---

## 📊 成功指標

以下を満たすデザインを目指してください:

- **視覚的インパクト**: 10/10
- **使いやすさ**: 9/10
- **モダンさ**: 10/10
- **プロフェッショナル感**: 10/10
- **独自性**: 8/10

---

よろしくお願いします! 🚀
