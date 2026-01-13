# Tech Digest

> 技術トレンドを最速でキャッチアップする完全無料のWebアプリケーション

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## 概要

Tech Digestは、SuperGrokをメインデータソースとし、複数のソース（Hacker News、Reddit、GitHub）から最新のAI・エンジニアリングトレンドを自動収集・配信するWebアプリケーションです。

**特徴:**
- 🤖 **SuperGrok統合** - AIが分析済みの最新トレンドを活用
- 💰 **超低コスト** - 月額$17のみ（従来の91%削減）
- 📊 **複数ソース統合** - HN/Reddit/GitHub も併用
- ⏰ **毎日更新** - 朝の5-10分作業で最新情報をキャッチアップ
- 🎯 **スマートフィルタリング** - 60+キーワードで重要度スコアリング

### 主な機能

- **SuperGrokトレンド分析**: AIが既に分析・要約済みの最新技術トレンド（最重要）
- **複数ソース統合**: Hacker News、Reddit、GitHub Trendingから自動収集
- **キーワードベースフィルタリング**: GPT-5、Claude、Next.js等の重要キーワードで自動抽出
- **スコアリングシステム**: 優先度に応じた重要度計算
- **柔軟な運用**: 手動統合から段階的に自動化可能な設計

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

### データソース
- **SuperGrok** - AIが分析済みの最新技術トレンド（メインソース・$17/月）
- **Hacker News API** - 技術トレンド（無料）
- **Reddit API** - コミュニティの声（無料）
- **GitHub Trending API** - 人気リポジトリ（無料）

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
├── data/                      # データファイル
│   └── supergrok-trends/      # SuperGrok取得データ
│       ├── YYYY-MM-DD.md      # 日次トレンドデータ
│       └── template.md        # 質問テンプレート
├── docs/                      # ドキュメント
│   ├── requirements.md        # 要件定義書
│   ├── functional-spec.md     # 機能仕様書
│   ├── keyword-strategy.md    # キーワード戦略
│   ├── realtime-detection-strategy.md
│   └── supergrok-integration-strategy.md  # SuperGrok統合戦略
├── prisma/                    # Prismaスキーマ
│   └── schema.prisma
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # Reactコンポーネント
│   ├── lib/
│   │   ├── data-sources/      # データソース統合
│   │   │   ├── supergrok-reader.ts  # SuperGrokデータ読み込み
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

### フェーズ0: SuperGrok統合版 (現在の実装) - $17/月 ← 今ここ
- ✅ SuperGrok統合（メインデータソース）
- ✅ Hacker News API統合
- ✅ Reddit API統合
- ✅ GitHub Trending統合
- ✅ キーワード管理システム
- ✅ 手動統合（1日5-10分作業）

**コスト内訳:**
- X Premium+: $17/月（SuperGrok利用料込み）
- その他のデータソース: 無料
- **合計: $17/月**

**従来プラン（X API利用）との比較:**
- X API Basic: $200/月
- 削減率: **91%**（$183/月の節約）
- 年間削減額: **$2,196**

### フェーズ1: 半自動化版 - $17/月
- ファイル監視による自動取り込み
- 手動作業の軽減
- コストは変わらず

### フェーズ2: AI要約強化版 - $37-67/月
- Ollama (ローカルLLM) または
- Claude/GPT API追加 ($20-50/月)
- より高度な要約生成

## ロードマップ

### v0.5 (SuperGrok統合MVP) ← 今ここ
- [x] プロジェクト設計
- [x] 無料データソース統合 (HN/Reddit/GitHub)
- [x] キーワード管理システム
- [x] SuperGrok統合戦略策定
- [ ] SuperGrokデータ読み込み実装
- [ ] 基本的なダッシュボード
- [ ] 1週間トライアル運用
- [ ] デプロイ

### v1.0 (半自動化版)
- [ ] ファイル監視システム実装
- [ ] 自動データ取り込み
- [ ] データベース統合強化
- [ ] Ollama AI要約
- [ ] 頻度を1日3回に増加

### v1.1 (機能拡張)
- [ ] ユーザー認証
- [ ] パーソナライゼーション
- [ ] 通知機能
- [ ] ブックマーク機能

### v2.0 (完全版)
- [ ] 週次/月次レポート自動生成
- [ ] Slack/Discord Bot連携
- [ ] Claude/GPT API統合
- [ ] トレンド予測機能

## ライセンス

MIT

## コントリビューション

コントリビューションを歓迎します！Issue や Pull Request をお気軽にお送りください。

## 作成者

Tech Digest Team

---

Generated with Claude Code
