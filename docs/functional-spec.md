# 機能仕様書: Tech Digest

**作成日**: 2025-11-21
**バージョン**: 1.0
**ステータス**: Draft

---

## 1. 概要

本文書は「Tech Digest」の機能仕様を詳細に定義するものです。各機能について、ユースケース、画面仕様、データ仕様、API仕様を記載します。

---

## 2. 機能一覧

### 2.1 優先度別機能マップ

| 優先度 | 機能名 | 説明 |
|-------|--------|------|
| High | リアルタイムITトレンド表示 | Xから収集したITトレンドをリアルタイムで表示 |
| High | AI自動要約機能 | 選択したトピックに関する複数のポストをAIが自動要約 |
| High | トレンドフィルタリング | 興味のある技術カテゴリでフィルタリング |
| Medium | お気に入り保存・履歴 | 気になったトピックをブックマーク |
| Low | デイリーダイジェスト | 毎日の技術トレンドをまとめたダイジェストを生成 |

---

## 3. 詳細機能仕様

### 3.1 リアルタイムITトレンド表示

#### 3.1.1 概要
Xから収集したITトレンドをリアルタイムで表示する。技術カテゴリ別（AI、フロントエンド、バックエンド等）に分類し、トレンドの勢いをビジュアル化する。

#### 3.1.2 関係者
- エンジニア
- 技術リーダー

#### 3.1.3 ユースケース

**UC-001: トレンド一覧表示**
```
Actor: エンジニア
前提条件: ユーザーがアプリケーションにアクセス
基本フロー:
1. ユーザーがダッシュボードページにアクセス
2. システムが最新のITトレンドを取得
3. トレンドがカテゴリ別に整理されて表示される
4. 各トレンドにエンゲージメント数（いいね、リポスト等）が表示される
代替フロー:
- データ取得失敗時はキャッシュされたデータを表示
事後条件: ユーザーが最新のトレンド情報を閲覧できる
```

**UC-002: トレンド詳細表示**
```
Actor: エンジニア
前提条件: トレンド一覧が表示されている
基本フロー:
1. ユーザーが特定のトレンドをクリック
2. システムが関連するポストを取得
3. トレンド詳細ページが表示される
4. 関連ポスト、タイムライン、統計情報が表示される
代替フロー: なし
事後条件: ユーザーがトレンドの詳細情報を閲覧できる
```

#### 3.1.4 画面仕様

**画面: ダッシュボード（トレンド一覧）**

```
┌─────────────────────────────────────────────────────┐
│ Tech Digest              🔍[検索]    [フィルター▼]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 📊 本日のトレンド (2025-11-21)                       │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ 🔥 AI & Machine Learning                      │   │
│ │ ┌────────────────────────────────────────┐   │   │
│ │ │ Claude 4.5 Release                      │   │   │
│ │ │ 🔥 1,234 posts │ 📈 +45% │ ⏱️ 2h ago    │   │   │
│ │ │ Anthropic社が新しいClaude 4.5をリリース  │   │   │
│ │ │ [詳細を見る →]                           │   │   │
│ │ └────────────────────────────────────────┘   │   │
│ │ ┌────────────────────────────────────────┐   │   │
│ │ │ Next.js 15 Performance Updates          │   │   │
│ │ │ 🔥 856 posts │ 📈 +32% │ ⏱️ 4h ago      │   │   │
│ │ └────────────────────────────────────────┘   │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ ⚛️ Frontend                                    │   │
│ │ [トレンド項目...]                              │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**UI要素:**
- カテゴリカード（折りたたみ可能）
- トレンド項目（クリック可能カード）
- エンゲージメント指標（投稿数、成長率、経過時間）
- リアルタイム更新インジケーター

#### 3.1.5 データ仕様

**Trendテーブル**
```sql
CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  post_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(10, 2),
  growth_rate DECIMAL(5, 2),
  keywords TEXT[],
  first_seen_at TIMESTAMP NOT NULL,
  last_updated_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Postテーブル**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID REFERENCES trends(id),
  external_id VARCHAR(255) UNIQUE NOT NULL,
  author_username VARCHAR(255),
  content TEXT,
  url TEXT,
  likes_count INTEGER DEFAULT 0,
  retweets_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  posted_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.1.6 API仕様

**GET /api/trends**
```typescript
// Request
interface GetTrendsRequest {
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'engagement' | 'growth' | 'recent';
}

// Response
interface GetTrendsResponse {
  trends: Array<{
    id: string;
    title: string;
    category: string;
    postCount: number;
    engagementScore: number;
    growthRate: number;
    keywords: string[];
    firstSeenAt: string;
    lastUpdatedAt: string;
  }>;
  total: number;
}
```

**GET /api/trends/:id**
```typescript
// Response
interface GetTrendDetailResponse {
  trend: {
    id: string;
    title: string;
    category: string;
    summary: string;
    postCount: number;
    engagementScore: number;
    growthRate: number;
    keywords: string[];
    relatedPosts: Array<{
      id: string;
      authorUsername: string;
      content: string;
      url: string;
      likesCount: number;
      retweetsCount: number;
      postedAt: string;
    }>;
    timeline: Array<{
      timestamp: string;
      postCount: number;
    }>;
  };
}
```

---

### 3.2 AI自動要約機能

#### 3.2.1 概要
選択したトピックに関する複数のポストをAIが自動的に要約し、重要なポイントを箇条書きで提示。技術的な詳細、議論のポイント、実装例などを抽出する。

#### 3.2.2 関係者
- エンジニア
- CTO

#### 3.2.3 ユースケース

**UC-003: トレンド自動要約**
```
Actor: システム（バッチ処理）
前提条件: 新しいトレンドが検出された
基本フロー:
1. システムがトレンドに関連するポストを収集
2. AIに要約生成リクエストを送信
3. AI が要約テキストを生成
4. 要約をデータベースに保存
5. ユーザーがトレンド詳細ページで要約を閲覧
代替フロー:
- AI API失敗時は再試行（最大3回）
事後条件: トレンドに要約が付与される
```

**UC-004: 手動要約生成**
```
Actor: エンジニア
前提条件: トレンド詳細ページを表示中
基本フロー:
1. ユーザーが「要約を生成」ボタンをクリック
2. システムがAIに要約生成をリクエスト
3. 生成中のローディング表示
4. 要約が表示される
代替フロー: なし
事後条件: 最新の情報で要約が更新される
```

#### 3.2.4 画面仕様

**画面: トレンド詳細（要約表示）**

```
┌─────────────────────────────────────────────────────┐
│ ← 戻る   Claude 4.5 Release                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 📝 AI要約                            [🔄 再生成]      │
│ ┌──────────────────────────────────────────────┐   │
│ │ **主要なポイント:**                           │   │
│ │ • Anthropic社がClaude 4.5をリリース           │   │
│ │ • パフォーマンスが前バージョンより30%向上     │   │
│ │ • コンテキストウィンドウが200Kトークンに     │   │
│ │                                               │   │
│ │ **技術的詳細:**                               │   │
│ │ • 新しいFunction Calling API                  │   │
│ │ • マルチモーダル対応の強化                    │   │
│ │                                               │   │
│ │ **コミュニティの反応:**                       │   │
│ │ • 開発者からのポジティブなフィードバック多数  │   │
│ │ • 実装例がGitHubで多数シェアされている        │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ 📊 統計                                              │
│ [グラフ表示エリア]                                   │
│                                                      │
│ 💬 関連ポスト (25)                                   │
│ [ポスト一覧...]                                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### 3.2.5 データ仕様

**Summaryテーブル**
```sql
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id UUID REFERENCES trends(id) UNIQUE,
  summary_text TEXT NOT NULL,
  key_points TEXT[],
  technical_details TEXT,
  community_reaction TEXT,
  code_snippets JSONB,
  ai_model VARCHAR(50),
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.2.6 API仕様

**POST /api/summaries**
```typescript
// Request
interface GenerateSummaryRequest {
  trendId: string;
  forceRegenerate?: boolean;
}

// Response
interface GenerateSummaryResponse {
  summary: {
    id: string;
    trendId: string;
    summaryText: string;
    keyPoints: string[];
    technicalDetails: string;
    communityReaction: string;
    codeSnippets: Array<{
      language: string;
      code: string;
    }>;
    generatedAt: string;
  };
}
```

**GET /api/summaries/:trendId**
```typescript
// Response - same as GenerateSummaryResponse
```

---

### 3.3 トレンドフィルタリング

#### 3.3.1 概要
興味のある技術カテゴリ、言語、フレームワークでフィルタリング。カスタムキーワード設定で自分専用のトレンドビューを作成できる。

#### 3.3.2 関係者
- エンジニア

#### 3.3.3 ユースケース

**UC-005: カテゴリフィルター適用**
```
Actor: エンジニア
前提条件: ダッシュボードが表示されている
基本フロー:
1. ユーザーがフィルターボタンをクリック
2. フィルターパネルが開く
3. カテゴリ、言語、フレームワークを選択
4. 「適用」ボタンをクリック
5. フィルター条件に合致するトレンドのみが表示される
代替フロー: なし
事後条件: ユーザーの興味に合ったトレンドが表示される
```

**UC-006: カスタムキーワード設定**
```
Actor: エンジニア
前提条件: フィルターパネルが開いている
基本フロー:
1. ユーザーが「カスタムキーワード」タブを選択
2. キーワードを入力（カンマ区切り）
3. 「保存」ボタンをクリック
4. 設定が保存される
5. 次回アクセス時にも適用される
代替フロー: なし
事後条件: カスタムフィルターが保存される
```

#### 3.3.4 画面仕様

**コンポーネント: フィルターパネル**

```
┌─────────────────────────────┐
│ フィルター            [×]    │
├─────────────────────────────┤
│                              │
│ 📂 カテゴリ                  │
│ ☑ AI & ML                   │
│ ☑ Frontend                  │
│ ☐ Backend                   │
│ ☐ DevOps                    │
│ ☐ Mobile                    │
│                              │
│ 💻 言語                      │
│ ☑ TypeScript                │
│ ☑ Python                    │
│ ☐ Rust                      │
│ ☐ Go                        │
│                              │
│ 🔧 フレームワーク            │
│ ☑ React                     │
│ ☐ Next.js                   │
│ ☐ Vue                       │
│                              │
│ 🔖 カスタムキーワード        │
│ [Claude, GPT, Gemini____]   │
│                              │
│ [クリア]        [適用]       │
│                              │
└─────────────────────────────┘
```

#### 3.3.5 データ仕様

**UserFilterテーブル**
```sql
CREATE TABLE user_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- 将来的なユーザー管理用
  session_id VARCHAR(255), -- セッションベースのフィルター保存
  categories TEXT[],
  languages TEXT[],
  frameworks TEXT[],
  custom_keywords TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3.3.6 API仕様

**GET /api/filters/options**
```typescript
// Response
interface GetFilterOptionsResponse {
  categories: string[];
  languages: string[];
  frameworks: string[];
}
```

**POST /api/filters**
```typescript
// Request
interface SaveFilterRequest {
  categories: string[];
  languages: string[];
  frameworks: string[];
  customKeywords: string[];
}

// Response
interface SaveFilterResponse {
  filterId: string;
  message: string;
}
```

---

### 3.4 お気に入り保存・履歴

#### 3.4.1 概要
気になったトピックをブックマークし、後で見返せる。過去にチェックしたトレンドの履歴を可視化し、自分の学習履歴を追跡できる。

#### 3.4.2 関係者
- エンジニア
- 技術リーダー

#### 3.4.3 ユースケース

**UC-007: トレンドをブックマーク**
```
Actor: エンジニア
前提条件: トレンド詳細ページを表示中
基本フロー:
1. ユーザーが「ブックマーク」アイコンをクリック
2. システムがブックマークを保存
3. アイコンが「保存済み」状態に変化
代替フロー:
- 既にブックマーク済みの場合は削除
事後条件: トレンドがブックマークリストに追加される
```

**UC-008: ブックマーク一覧表示**
```
Actor: エンジニア
前提条件: ユーザーがアプリケーションにアクセス
基本フロー:
1. ユーザーが「ブックマーク」ページにアクセス
2. システムが保存されたブックマークを取得
3. ブックマークが一覧表示される
4. 各ブックマークに保存日時が表示される
代替フロー: なし
事後条件: ユーザーが保存したトレンドを確認できる
```

#### 3.4.4 データ仕様

**Bookmarkテーブル**
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255),
  trend_id UUID REFERENCES trends(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**ViewHistoryテーブル**
```sql
CREATE TABLE view_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255),
  trend_id UUID REFERENCES trends(id),
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3.5 デイリーダイジェスト

#### 3.5.1 概要
毎日の技術トレンドをまとめたダイジェストを生成。朝の5分で今日のトレンドをキャッチアップできる。

#### 3.5.2 関係者
- エンジニア
- CTO

#### 3.5.3 ユースケース

**UC-009: デイリーダイジェスト生成**
```
Actor: システム（バッチ処理）
前提条件: 毎日午前6時
基本フロー:
1. システムが過去24時間のトレンドを集計
2. AIがデイリーサマリーを生成
3. ダイジェストをデータベースに保存
4. ユーザーがアクセス時にダイジェストを表示
代替フロー: なし
事後条件: その日のダイジェストが利用可能になる
```

#### 3.5.4 データ仕様

**DailyDigestテーブル**
```sql
CREATE TABLE daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_date DATE UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  top_trends JSONB,
  categories_breakdown JSONB,
  generated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. システムアーキテクチャ

### 4.1 全体構成図

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Next.js App   │
│  (Frontend +    │
│   API Routes)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ X API  │ │ AI API   │
│        │ │ (OpenAI/ │
│        │ │ Claude)  │
└────────┘ └──────────┘
    │
    ▼
┌─────────────┐
│ PostgreSQL  │
└─────────────┘
    │
    ▼
┌─────────────┐
│    Redis    │
│  (Cache)    │
└─────────────┘
```

### 4.2 データフロー

**トレンド収集フロー:**
1. バッチジョブ（Cron）が定期実行
2. X APIから技術関連ポストを取得
3. キーワードマッチングとスコアリング
4. データベースに保存
5. Redisキャッシュ更新

**要約生成フロー:**
1. トレンド検出
2. 関連ポストを収集
3. AI APIにプロンプト送信
4. 要約テキスト受信
5. データベースに保存

---

## 5. セキュリティ仕様

### 5.1 API認証
- API Keyの環境変数管理
- Rate Limiting（100 req/min per IP）

### 5.2 データ保護
- XSS対策（入力サニタイゼーション）
- CSRF対策（Next.jsビルトイン機能）
- SQL Injection対策（Prisma ORM使用）

---

## 6. パフォーマンス最適化

### 6.1 キャッシング戦略
- トレンドデータ: 5分間キャッシュ
- 要約データ: 1時間キャッシュ
- 静的リソース: CDN配信

### 6.2 データベース最適化
- インデックス作成（category, created_at）
- 古いデータの自動アーカイブ（30日以上）

---

## 7. テスト計画

### 7.1 単体テスト
- API Routes: Jest
- コンポーネント: React Testing Library

### 7.2 統合テスト
- E2Eテスト: Playwright
- API統合テスト: Supertest

### 7.3 パフォーマンステスト
- Lighthouseスコア: 90点以上
- Core Web Vitals: 全項目グリーン

---

## 8. 承認

| 役割 | 氏名 | 承認日 | 署名 |
|-----|------|-------|------|
| プロダクトオーナー | - | - | - |
| 技術リード | - | - | - |
| UI/UX デザイナー | - | - | - |

---

**文書管理**
- 最終更新日: 2025-11-21
- 更新者: Tech Digest Team
- 次回レビュー予定: 開発フェーズ開始時
