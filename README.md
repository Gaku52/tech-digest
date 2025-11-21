# Tech Digest

> 技術トレンドを最速でキャッチアップするWebアプリケーション

## 概要

Tech Digestは、X（旧Twitter）から最新のITトレンドを自動収集し、AI要約によって技術者が効率的にキャッチアップできるWebアプリケーションです。

### 主な機能

- **リアルタイムITトレンド表示**: Xから収集した技術トレンドをカテゴリ別に表示
- **AI自動要約**: 複数のポストをAIが要約し、重要なポイントを抽出
- **トレンドフィルタリング**: 興味のある技術カテゴリでカスタマイズ可能
- **お気に入り保存**: 気になるトピックをブックマークして後で確認
- **デイリーダイジェスト**: 毎日のトレンドをまとめて朝の5分でキャッチアップ

## 技術スタック

### フロントエンド
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

### バックエンド
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL
- Redis (キャッシング)

### AI/外部API
- OpenAI API / Anthropic Claude API
- X API v2

### インフラ
- Vercel (ホスティング)
- Supabase / Neon (データベース)
- Upstash (Redis)

## プロジェクト構成

```
tech-digest/
├── docs/                   # ドキュメント
│   ├── requirements.md     # 要件定義書
│   └── functional-spec.md  # 機能仕様書
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # Reactコンポーネント
│   ├── lib/              # ユーティリティ関数
│   └── types/            # TypeScript型定義
├── prisma/               # Prismaスキーマ
└── public/               # 静的ファイル
```

## セットアップ

### 必要な環境

- Node.js 18+
- npm / yarn / pnpm
- PostgreSQL
- Redis

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/tech-digest.git
cd tech-digest

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して必要なAPI キーを設定

# データベースをセットアップ
npx prisma migrate dev

# 開発サーバーを起動
npm run dev
```

### 環境変数

```env
# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# APIs
X_API_KEY="..."
X_API_SECRET="..."
OPENAI_API_KEY="..."
# または
ANTHROPIC_API_KEY="..."

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番環境で実行
npm start

# テスト
npm test

# Linting
npm run lint

# 型チェック
npm run type-check
```

## ドキュメント

詳細な仕様は以下のドキュメントを参照してください：

- [要件定義書](./docs/requirements.md)
- [機能仕様書](./docs/functional-spec.md)

## ロードマップ

### v1.0 (MVP)
- [x] プロジェクト設計
- [ ] X API統合
- [ ] AI要約機能
- [ ] 基本的なダッシュボード
- [ ] デプロイ

### v1.1
- [ ] ユーザー認証
- [ ] パーソナライゼーション
- [ ] 通知機能

### v2.0
- [ ] GitHub Trending統合
- [ ] Hacker News統合
- [ ] 週次/月次レポート
- [ ] Slack/Discord Bot連携

## ライセンス

MIT

## コントリビューション

コントリビューションを歓迎します！Issue や Pull Request をお気軽にお送りください。

## 作成者

Tech Digest Team

---

Generated with Claude Code
