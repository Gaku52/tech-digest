# Tech Digest 記事生成ワークフロー

完璧な技術記事サイトを運営するための完全ガイド

---

## 🎯 全体フロー

```
Claude Code → SuperGrokプロンプト生成
     ↓
あなた → SuperGrokに投稿
     ↓
SuperGrok → 記事を執筆
     ↓
あなた → Claude Codeに応答を伝達
     ↓
Claude Code → 記事を処理・保存
     ↓
Tech Digest → 記事を公開
     ↓
Gemini → UIをかっこよく改善 (オプション)
```

---

## 📝 日次ワークフロー (5-10分)

### ステップ 1: SuperGrok用プロンプトを生成

**Claude Code (あなたのターミナル) で実行:**

```bash
cd tech-digest
npm run genprompt
```

**これにより:**
- 今日の日付で最適化されたプロンプトが生成されます
- クリップボードに自動コピーされます
- `data/supergrok-trends/YYYY-MM-DD-prompt.md` に保存されます

**出力例:**
```
✅ プロンプトを保存しました: data/supergrok-trends/2026-02-03-prompt.md
📄 テンプレート: article-generation-template.md
✅ クリップボードにコピーしました

📋 生成されたプロンプト:
================================================================================
あなたは世界最高の技術ジャーナリストです...
================================================================================
```

---

### ステップ 2: SuperGrokに投稿

**X (Twitter) で:**

1. [X.com](https://x.com) にログイン (Premium+ 必須)
2. Grok を開く
3. **クリップボードからプロンプトを貼り付けて送信**
4. SuperGrokの応答を待つ (1-2分)

**SuperGrokの応答例:**

```markdown
---
title: "OpenAI、GPT-5を正式リリース - コンテキスト1M対応"
date: 2026-02-03
category: AI
priority: critical
tags: [OpenAI, GPT-5, LLM]
engagement: 45000
sources: [https://x.com/sama/status/...]
---

## 概要

OpenAIが本日、次世代大規模言語モデル「GPT-5」を正式にリリース...

## 詳細

### 背景
...

(以下、記事が続く)
```

---

### ステップ 3: Claude Codeに応答を伝達

**2つの方法があります:**

#### 方法A: インタラクティブモード (推奨)

```bash
npm run process-response
```

SuperGrokからの応答を貼り付けて、新しい行で `EOF` と入力:

```
📝 SuperGrokからの応答を貼り付けてください:
   (入力完了後、新しい行で "EOF" と入力してください)

[ここにSuperGrokの応答を貼り付け]
EOF
```

#### 方法B: ファイル経由

SuperGrokの応答をファイルに保存してから:

```bash
npm run process-response -- --file ./supergrok-response.md
```

---

### ステップ 4: 自動処理を確認

**Claude Codeが自動的に:**

1. SuperGrokの応答を複数の記事に分割
2. 各記事のメタデータを抽出 (タイトル、カテゴリ、優先度、タグなど)
3. `data/articles/` に保存

**出力例:**
```
📊 SuperGrok応答を処理中...

✅ 5件の記事を検出しました

✅ 保存: 2026-02-03-openai-gpt-5-released.md
   タイトル: OpenAI、GPT-5を正式リリース - コンテキスト1M対応
   カテゴリ: AI
   優先度: critical
   タグ: OpenAI, GPT-5, LLM

✅ 保存: 2026-02-03-next-js-16-breaking-changes.md
   タイトル: Next.js 16リリース - App Routerが大幅改善
   カテゴリ: Frontend
   優先度: high
   タグ: Next.js, React, Frontend

...

================================================================================
📊 処理完了サマリー
================================================================================
総記事数: 5
保存先: /Users/gaku/tech-digest/data/articles

優先度別内訳:
  🔴 critical: 2件
  🟠 high: 2件
  🟡 medium: 1件

💡 次のステップ:
1. 記事の内容を確認
2. 必要に応じて編集
3. データベースにインポート (npm run import-articles)
```

---

### ステップ 5: データベースにインポート

```bash
npm run import-articles
```

**Claude Codeが自動的に:**

1. `data/articles/` 内のすべての記事を読み込み
2. Prismaを通じてSupabase (PostgreSQL) に保存
3. 記事のスラッグ、抜粋などを自動生成

**出力例:**
```
📦 記事のインポートを開始します...

📄 5件のファイルを検出しました

📝 インポート中: OpenAI、GPT-5を正式リリース - コンテキスト1M対応
   ✅ 成功 (slug: 2026-02-03-openai-gpt-5-released)

📝 インポート中: Next.js 16リリース - App Routerが大幅改善
   ✅ 成功 (slug: 2026-02-03-next-js-16-breaking-changes)

...

================================================================================
📊 インポート完了
================================================================================
✅ 成功: 5件
⚠️  スキップ: 0件
❌ エラー: 0件
```

---

### ステップ 6: サイトで確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて、記事が表示されていることを確認!

---

## 🎨 Geminiでデザインを改善 (オプション)

UIをさらにかっこよくしたい場合:

### Geminiへのプロンプト例

```
Tech Digestというモダンな技術情報サイトのUIを改善してください。

現在のデザイン:
- ダークモード
- グラデーション背景 (slate-900 → slate-800)
- カード型レイアウト
- Next.js 15 + Tailwind CSS

改善してほしいポイント:
1. ヒーローセクションの追加
2. アニメーション効果
3. レスポンシブデザインの最適化
4. アクセシビリティの向上

参考にしてほしいサイト:
- Vercel.com
- Stripe.com
- Linear.app

ファイル:
- src/app/page.tsx
- src/app/globals.css
```

Geminiが改善案を提案してくれたら、Claude Codeに戻って実装します。

---

## 🚀 本番環境へのデプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIをインストール (初回のみ)
npm i -g vercel

# デプロイ
vercel
```

または [Vercel Dashboard](https://vercel.com/new) から:

1. GitHubリポジトリをインポート
2. 環境変数を設定:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
3. Deploy ボタンをクリック

---

## 📊 日次運用スケジュール

### 推奨スケジュール

**朝 (7:00 - 7:10)**
```bash
npm run genprompt           # プロンプト生成 (30秒)
```
→ SuperGrokに投稿 (1分)
→ 応答をClaude Codeに伝達 (1分)
```bash
npm run process-response    # 記事処理 (30秒)
npm run import-articles     # DB保存 (30秒)
```

**昼 (12:00 - 12:05)** - オプション
- 重大ニュースがあれば追加更新

**夜 (21:00 - 21:05)** - オプション
- 1日の振り返り記事を追加

---

## 🛠️ トラブルシューティング

### 記事が表示されない

```bash
# データベース接続を確認
npx prisma studio

# 記事があるか確認
# Article テーブルを開く

# なければ再インポート
npm run import-articles
```

### プロンプトが生成されない

```bash
# テンプレートファイルがあるか確認
ls data/supergrok-trends/article-generation-template.md

# なければREADMEから再作成
```

### SuperGrokが期待通りの形式で返さない

テンプレートをカスタマイズ:

```bash
vim data/supergrok-trends/article-generation-template.md
```

プロンプトに以下を追加:
```markdown
**重要**: 必ず以下の形式で記事を執筆してください:

---
title: "記事タイトル"
date: 2026-02-03
category: AI
priority: high
tags: [タグ1, タグ2]
---

## 概要
...
```

---

## 📈 成長戦略

### Week 1: 基礎運用
- 毎日1回記事を更新
- ワークフローに慣れる

### Week 2: 頻度を上げる
- 朝・昼・夜の1日3回更新
- カテゴリを充実させる

### Week 3: 品質向上
- 記事の編集を丁寧に
- 画像やコードスニペットを追加

### Week 4: コミュニティ構築
- X (Twitter) で記事をシェア
- 読者からのフィードバックを収集

### Month 2: マネタイズ検討
- スポンサー記事
- プレミアムコンテンツ
- ニュースレター配信

---

## 🎉 まとめ

**あなたがやること (1日5-10分):**
1. `npm run genprompt` でプロンプト生成
2. SuperGrokに投稿して応答を受け取る
3. Claude Codeに伝達
4. `npm run process-response`
5. `npm run import-articles`

**Claude Codeがやること:**
- SuperGrok用の完璧なプロンプト生成
- 応答を記事に自動変換
- データベース保存
- サイトで自動表示

**Geminiがやること (オプション):**
- UIデザインの改善提案
- アニメーション効果の追加
- アクセシビリティ向上

**結果:**
- 毎日更新される最新技術情報サイト
- プロフェッショナルな記事品質
- かっこいいモダンUI
- 月額$17のみの超低コスト運用

---

**さあ、Tech Digestを世界最高の技術情報メディアに育てましょう! 🚀**
