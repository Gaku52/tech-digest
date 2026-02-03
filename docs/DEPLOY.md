# Tech Digest - Vercelデプロイガイド

完全自動デプロイの手順書

---

## 🚀 クイックデプロイ (5分)

### 前提条件

- [x] Supabaseプロジェクトが作成済み
- [x] GitHubリポジトリがある
- [x] Vercelアカウントがある (なければ無料登録)

---

## ステップ1: Supabaseデータベースの準備

### 1.1 Supabaseプロジェクト作成

1. [Supabase Dashboard](https://supabase.com/dashboard) を開く
2. "New Project" をクリック
3. 以下を入力:
   - **Project Name**: tech-digest
   - **Database Password**: 強力なパスワードを生成 (保存しておく!)
   - **Region**: Northeast Asia (Tokyo)

### 1.2 接続文字列を取得

1. Project Settings (⚙️) → Database
2. "Connection String" セクションで "URI" を選択
3. `[YOUR-PASSWORD]` を実際のパスワードに置き換え
4. コピーしておく

**例:**
```
postgresql://postgres:your_password_here@db.abc123xyz.supabase.co:5432/postgres
```

### 1.3 データベーススキーマをデプロイ

ローカルで一度だけ実行:

```bash
cd tech-digest

# .env.local を作成
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"
EOF

# Prismaでスキーマをデプロイ
npx prisma db push

# 成功メッセージを確認
# ✅ Your database is now in sync with your Prisma schema.
```

---

## ステップ2: Vercelにデプロイ

### 方法A: Vercel Dashboard (推奨)

#### 2.1 GitHubリポジトリをプッシュ

```bash
cd tech-digest

# 変更をコミット
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2.2 Vercelでインポート

1. [Vercel Dashboard](https://vercel.com/new) を開く
2. "Import Project" をクリック
3. GitHubを接続して `tech-digest` リポジトリを選択
4. 以下の設定を確認:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: 自動検出
   - **Output Directory**: 自動検出

#### 2.3 環境変数を設定

"Environment Variables" セクションで以下を追加:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://tech-digest.vercel.app` | Production |

**重要:** `DATABASE_URL` はSupabaseからコピーした接続文字列を使用

#### 2.4 デプロイ実行

"Deploy" ボタンをクリック!

---

### 方法B: Vercel CLI (上級者向け)

```bash
# Vercel CLIをインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel

# プロンプトに従って設定:
# - Set up and deploy: Y
# - Which scope: あなたのアカウント
# - Link to existing project: N
# - Project name: tech-digest
# - Directory: ./

# 環境変数を追加
vercel env add DATABASE_URL
# 値を入力: postgresql://postgres:...
# Environment: Production, Preview, Development を選択

vercel env add NEXT_PUBLIC_APP_URL
# 値を入力: https://tech-digest.vercel.app
# Environment: Production

# 本番デプロイ
vercel --prod
```

---

## ステップ3: デプロイ確認

### 3.1 ビルドログを確認

Vercel Dashboard → Deployments → 最新のデプロイ → "Building" タブ

**成功メッセージを確認:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### 3.2 サイトにアクセス

デプロイが完了したら、Vercelが提供するURLにアクセス:

```
https://tech-digest-xxxx.vercel.app
```

**確認項目:**
- [ ] ページが表示される
- [ ] ダークモードのデザインが適用されている
- [ ] "記事がまだありません" というメッセージが表示される (最初は記事がないため)

---

## ステップ4: 最初の記事を追加

### 4.1 ローカルで記事を作成

```bash
# 1. プロンプト生成
npm run genprompt

# 2. SuperGrokに投稿 (X Premium+)
# → 応答をコピー

# 3. 応答を処理
npm run process-response
# → SuperGrokの応答を貼り付けて EOF

# 4. データベースにインポート
npm run import-articles
```

### 4.2 デプロイされたサイトで確認

Vercelは自動的に再デプロイしないため、記事は**すぐに本番サイトに反映されます** (データベースに直接保存されるため)

ブラウザをリロードして記事が表示されることを確認!

---

## ステップ5: カスタムドメインの設定 (オプション)

### 5.1 ドメインを追加

1. Vercel Dashboard → Project → Settings → Domains
2. "Add Domain" をクリック
3. ドメイン名を入力 (例: `techdigest.dev`)
4. DNS設定の指示に従う

### 5.2 環境変数を更新

`NEXT_PUBLIC_APP_URL` を新しいドメインに変更:

```bash
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL
# 新しい値: https://techdigest.dev
```

---

## 🔧 トラブルシューティング

### エラー: "Prisma Client could not locate..."

**原因:** Prisma Clientが生成されていない

**解決策:**
1. `vercel.json` を確認:
   ```json
   {
     "buildCommand": "prisma generate && next build"
   }
   ```
2. 再デプロイ

---

### エラー: "Database connection failed"

**原因:** `DATABASE_URL` が正しくない

**解決策:**
1. Vercel Dashboard → Settings → Environment Variables
2. `DATABASE_URL` の値を確認
3. Supabaseの接続文字列と一致しているか確認
4. パスワードに特殊文字がある場合はURLエンコード

---

### ページは表示されるが記事が表示されない

**原因:** データベースにスキーマがデプロイされていない

**解決策:**
```bash
# ローカルで実行
npx prisma db push
```

または

```bash
# Supabase SQL Editorで直接実行
# prisma/schema.prisma を元にCREATE TABLE文を実行
```

---

### ビルドが遅い

**原因:** Next.jsのビルド最適化

**解決策:**
- 通常2-3分かかります
- 初回デプロイは5分程度かかることもあります
- 待つのが最善策です

---

## 📊 デプロイ後の運用

### 日次更新フロー

**記事は自動的に本番サイトに反映されます:**

```bash
# ローカルで実行 (1日1回、5-10分)
npm run genprompt
# → SuperGrokに投稿
npm run process-response
npm run import-articles
```

データベースに直接保存されるため、再デプロイ不要!

### コードを更新した場合

```bash
git add .
git commit -m "Update: ..."
git push origin main
```

Vercelが自動的に再デプロイします!

---

## 🎉 完了チェックリスト

デプロイが完全に成功したことを確認:

- [ ] Supabaseプロジェクトが作成された
- [ ] データベーススキーマがデプロイされた
- [ ] Vercelプロジェクトが作成された
- [ ] 環境変数が正しく設定された
- [ ] ビルドが成功した
- [ ] サイトにアクセスできる
- [ ] 記事を追加してDBに保存できる
- [ ] 追加した記事が本番サイトに表示される

---

## 🚀 次のステップ

1. **UIを改善** - Geminiでデザインをかっこよく
2. **記事を増やす** - 毎日SuperGrokから記事を追加
3. **SNSでシェア** - X (Twitter) で宣伝
4. **アクセス解析** - Vercel Analyticsを有効化
5. **カスタムドメイン** - 独自ドメインを設定

---

**おめでとうございます! Tech Digestが世界に公開されました 🎉**
