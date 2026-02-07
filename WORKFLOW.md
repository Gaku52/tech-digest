# Tech Digest 運用フロー

> 週2回（火曜・金曜）、5-10分で最新技術トレンドを配信する運用手順

## 📋 定期更新の作業フロー（火曜・金曜）

### ステップ1: プロンプト生成（1分）

```bash
# プロンプトを生成してクリップボードにコピー
npm run genprompt
```

**出力例:**
```
✅ クリップボードにコピーしました

💡 次のステップ:
1. 上記のプロンプトをコピーして Grok (X Premium+) に投稿
2. Grok からの応答を保存
3. data/articles/YYYY-MM-DD-slug.md として保存
```

### ステップ2: SuperGrokへ投稿（2分）

1. X（旧Twitter）を開く
2. **Grok**（X Premium+）を開く
3. 生成されたプロンプトを貼り付けて送信
4. **Grokの返答全体をコピー**

### ステップ3: 記事を作成（2分）

Grokからの返答を以下の形式で保存：

**ファイル名:** `data/articles/YYYY-MM-DD-記事タイトル.md`

**ファイル内容:**
```markdown
---
title: "記事タイトル"
date: 2025-02-04
category: "AI"
priority: high
tags: [GPT-5, Claude, AI]
featured: true
---

# 記事タイトル

Grokからの返答をここに貼り付け...

## セクション1

内容...

## セクション2

内容...
```

**重要なポイント:**
- ファイル名は `YYYY-MM-DD-slug.md` 形式
- front matter（`---`で囲まれた部分）を必ず含める
- `date` は本日の日付
- `category` は `AI`, `Frontend`, `Backend`, `DevOps`, `Tools` のいずれか
- `priority` は `critical`, `high`, `medium`, `low` のいずれか
- `featured: true` をつけるとトップに表示される

### ステップ4: Gitにコミット＆プッシュ（2分）

```bash
# 新しい記事を追加
git add data/articles/

# コミット
git commit -m "add: 本日のトレンド記事を追加"

# プッシュ（自動デプロイが開始される）
git push origin main
```

**🎉 完了！**

Vercelが自動的にデプロイを開始し、2-3分後に https://tech-digest.ogadix.com に記事が公開されます。

---

## 🔧 オプション: スクリプトを使った処理

### 記事の自動処理（実験的）

```bash
# SuperGrokの返答をファイルから処理
npm run process-response -- --file ./grok-response.md

# または標準入力から
cat grok-response.md | npm run process-response
```

---

## 📁 ファイル構造

```
data/
├── articles/              # 公開記事（Gitで管理）
│   ├── 2025-02-04-welcome.md
│   ├── 2025-02-05-ai-trends.md
│   └── 2025-02-06-nextjs-updates.md
└── supergrok-trends/      # SuperGrokプロンプト＆テンプレート
    ├── template.md
    └── article-generation-template.md
```

---

## ✅ チェックリスト

### 記事公開前

- [ ] front matterが正しく記述されている
- [ ] 日付が今日の日付になっている
- [ ] カテゴリ・優先度が設定されている
- [ ] 内容に誤字脱字がないか確認

### デプロイ後

- [ ] https://tech-digest.ogadix.com にアクセスして確認
- [ ] 記事が正しく表示されているか
- [ ] GitHub Actionsが成功しているか確認

---

## 🚨 トラブルシューティング

### ビルドエラーが出た場合

```bash
# ローカルでビルドを確認
npm run build

# エラーがあれば修正して再プッシュ
```

### 記事が表示されない場合

1. ファイル名が `.md` で終わっているか確認
2. front matterが `---` で正しく囲まれているか確認
3. `data/articles/` ディレクトリに配置されているか確認

---

## 📊 100記事到達後の移行

100記事に達したら、Supabase（データベース）への移行を検討：

1. 既存の記事をDBにインポート
2. コードを切り替え（`src/lib/articles.ts` → `src/lib/prisma.ts`）
3. より高度な検索・フィルタリング機能を追加

---

## 💡 Tips

### 効率化のコツ

1. **テンプレートを活用**: 記事の骨組みをコピペ用に保存
2. **バッチ処理**: 週末にまとめて複数記事を作成
3. **GitHub Actions**: CIが自動で品質チェック

### カテゴリの使い分け

- **AI**: GPT, Claude, LLM関連
- **Frontend**: React, Vue, Next.js等
- **Backend**: Node.js, Python, API設計等
- **DevOps**: CI/CD, Docker, Kubernetes等
- **Tools**: VS Code, ツール紹介等

---

これで週2回（火曜・金曜）、5-10分の作業で tech-digest.ogadix.com を更新できます！
