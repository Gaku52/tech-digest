# Tech Digest

> 技術トレンドを最速でキャッチアップする完全無料のWebアプリケーション

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## 概要

Tech Digestは、複数のソース（Hacker News、Reddit、GitHub）から最新のAI・エンジニアリングトレンドを自動収集し、毎日まとめて配信するWebアプリケーションです。

**特徴:**
- 💰 **完全無料** - 全て無料APIのみ使用
- 🤖 **AI要約** - Ollama (ローカルLLM) で自動要約
- ⏰ **毎日自動収集** - 朝6時に自動実行
- 🎯 **スマートフィルタリング** - 60+キーワードで重要度スコアリング

### 主な機能

- **複数ソース統合**: Hacker News、Reddit、GitHub Trendingから自動収集
- **キーワードベースフィルタリング**: GPT-5、Claude、Next.js等の重要キーワードで自動抽出
- **スコアリングシステム**: 優先度に応じた重要度計算
- **1日1回自動実行**: 毎朝6時にトレンド収集
- **段階的アップグレード対応**: 将来的にX API追加可能な設計

## 技術スタック

### フロントエンド
- **Next.js 15** - App Router
- **React 19** - Server Components
- **TypeScript 5** - 型安全
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネント

### バックエンド
- **Next.js API Routes** - サーバーレスAPI
- **Prisma ORM** - タイプセーフなDB操作
- **PostgreSQL** - メインデータベース
- **Supabase** - データベースホスティング (Proプラン推奨)

### データソース (全て無料)
- **Hacker News API** - 技術トレンド
- **Reddit API** - コミュニティの声
- **GitHub Trending API** - 人気リポジトリ
- *(将来) X API v2* - リアルタイム情報

### AI/要約
- **Ollama** - ローカルLLM (無料)
- *(将来) Claude/GPT API* - 高度な要約

### インフラ
- **Vercel** - ホスティング & デプロイ
- **Supabase** - PostgreSQLホスティング
- **Vercel Cron Jobs** - スケジューラー (無料枠)

## プロジェクト構成

```
tech-digest/
├── config/
│   └── keywords.json          # キーワード管理 (60+キーワード)
├── docs/                      # ドキュメント
│   ├── requirements.md        # 要件定義書
│   ├── functional-spec.md     # 機能仕様書
│   ├── keyword-strategy.md    # キーワード戦略
│   └── realtime-detection-strategy.md
├── prisma/                    # Prismaスキーマ
│   └── schema.prisma
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # Reactコンポーネント
│   ├── lib/
│   │   ├── data-sources/      # データソース統合
│   │   │   ├── hacker-news.ts
│   │   │   ├── reddit.ts
│   │   │   └── github.ts
│   │   ├── scheduler/         # スケジューラー
│   │   │   └── daily-fetch.ts
│   │   └── keyword-manager.ts # キーワード管理
│   └── types/                 # TypeScript型定義
└── public/                    # 静的ファイル
```

## セットアップ

### 必要な環境

- **Node.js 18+**
- **npm / yarn / pnpm**
- **Supabase アカウント** (無料プランでOK、Proプラン推奨)

### クイックスタート

```bash
# 1. リポジトリをクローン
git clone https://github.com/Gaku52/tech-digest.git
cd tech-digest

# 2. 依存関係をインストール
npm install

# 3. Supabaseプロジェクトを作成
# https://supabase.com でプロジェクト作成

# 4. 環境変数を設定
cp .env.example .env.local
# .env.local を編集 (下記参照)

# 5. データベースをセットアップ
npx prisma db push

# 6. データ取得のテスト
npx ts-node src/test-fetch.ts

# 7. 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.local` を作成して以下を設定:

```env
# Supabase Database (必須)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 将来的に追加予定
# X_API_KEY="..."
# ANTHROPIC_API_KEY="..."
```

**Supabase接続文字列の取得方法:**
1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Project Settings → Database → Connection String
3. `postgres://...` の文字列をコピー

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

## Vercelへのデプロイ

### 1. Vercelプロジェクト作成

```bash
# Vercel CLIをインストール (初回のみ)
npm i -g vercel

# デプロイ
vercel
```

または [Vercel Dashboard](https://vercel.com/new) から:
1. GitHubリポジトリをインポート
2. 環境変数を設定 (下記参照)
3. Deploy

### 2. 環境変数設定

Vercel Dashboard > Settings > Environment Variables で以下を設定:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### 3. Cron Jobs設定

`vercel.json` で毎朝6時に自動実行する設定済み:
- `/api/cron/daily-fetch` - 毎日6:00に実行

## ドキュメント

詳細な仕様は以下のドキュメントを参照してください：

- [要件定義書](./docs/requirements.md)
- [機能仕様書](./docs/functional-spec.md)
- [キーワード戦略](./docs/keyword-strategy.md)
- [リアルタイム検知戦略](./docs/realtime-detection-strategy.md)

## コスト戦略

### フェーズ0: 完全無料版 (現在の実装) - $0/月
- ✅ Hacker News API統合
- ✅ Reddit API統合
- ✅ GitHub Trending統合
- ✅ キーワード管理システム
- ✅ 1日1回自動収集 (毎朝6時)
- 予定: Ollama (ローカルLLM) による無料AI要約

**データソース:**
- Hacker News: 無料・無制限
- Reddit: 無料 (読み取り専用)
- GitHub: 無料 (60req/時)

### フェーズ1: X統合版 - $200/月
- X API Basic tier追加
- 1日3回または30分ごと取得
- 一次情報の追加

### フェーズ2: プロ版 - $220/月
- 10分ごと更新
- Claude/GPT要約追加

## ロードマップ

### v0.5 (完全無料MVP) ← 今ここ
- [x] プロジェクト設計
- [x] 無料データソース統合 (HN/Reddit/GitHub)
- [x] キーワード管理システム
- [x] 1日1回スケジューラー
- [ ] Ollama AI要約
- [ ] 基本的なダッシュボード
- [ ] デプロイ

### v1.0 (X統合版)
- [ ] X API Basic統合 ($200/月)
- [ ] 頻度を1日3回に増加
- [ ] AI要約強化

### v1.1
- [ ] ユーザー認証
- [ ] パーソナライゼーション
- [ ] 通知機能

### v2.0
- [ ] リアルタイム更新 (10分〜30分ごと)
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
