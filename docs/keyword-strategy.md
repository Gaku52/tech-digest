# キーワード戦略: Tech Digest

**作成日**: 2025-12-23
**バージョン**: 1.0
**ステータス**: Draft

---

## 1. 概要

本ドキュメントは、Tech DigestがX（旧Twitter）から最新のITトレンドを効率的に収集するための包括的なキーワード戦略を定義します。

### 1.1 目的

- 高品質な技術情報を効率的に収集
- ノイズ（無関係な投稿）を最小化
- 最新トレンドを見逃さない包括的なカバレッジ
- X APIのレート制限内での最適な運用

### 1.2 基本方針

1. **カテゴリ別キーワード設定**: 技術領域ごとに最適化されたキーワード群
2. **階層的キーワード構造**: コアキーワード → サブキーワード → 関連キーワード
3. **動的キーワード更新**: トレンドの変化に応じた定期的な見直し
4. **エンゲージメント重視**: 単なる言及数ではなく、質の高い議論を優先

---

## 2. カテゴリ別キーワード定義

### 2.1 AI & Machine Learning

#### コアキーワード（必須）
```
AI, Artificial Intelligence, Machine Learning, ML, Deep Learning,
Neural Network, LLM, Large Language Model
```

#### サブキーワード（主要技術・ツール）
```
GPT, Claude, Gemini, ChatGPT, OpenAI, Anthropic, Google AI,
Mistral, Llama, Stable Diffusion, Midjourney, DALL-E,
Transformer, RAG, Fine-tuning, Prompt Engineering,
LangChain, LlamaIndex, Vector Database, Embedding,
TensorFlow, PyTorch, JAX, Hugging Face
```

#### 関連キーワード（トレンド・ニュース）
```
AI研究, AI倫理, AI規制, AGI, Multimodal AI,
AI Agent, Function Calling, Tool Use,
Zero-shot, Few-shot, Chain-of-Thought, CoT
```

#### 除外キーワード（ノイズ除去）
```
-仮想通貨, -占い, -スピリチュアル, -宗教
```

---

### 2.2 Frontend

#### コアキーワード
```
Frontend, Front-end, フロントエンド, JavaScript, TypeScript,
Web Development, UI/UX
```

#### サブキーワード（フレームワーク・ライブラリ）
```
React, Next.js, Vue, Nuxt, Angular, Svelte, SvelteKit,
Solid.js, Qwik, Astro, Remix,
Tailwind CSS, styled-components, CSS Modules, Sass,
Vite, Webpack, esbuild, Turbopack,
React Server Components, RSC, Server Actions,
Shadcn/ui, Radix UI, Chakra UI, Material-UI, MUI
```

#### 関連キーワード（技術・手法）
```
SSR, SSG, CSR, ISR, Hydration, Islands Architecture,
Web Components, Progressive Web Apps, PWA,
State Management, Redux, Zustand, Jotai, Recoil,
React Query, TanStack Query, SWR,
Accessibility, a11y, Web Performance, Core Web Vitals,
SEO, Lighthouse, WebAssembly, WASM
```

---

### 2.3 Backend

#### コアキーワード
```
Backend, Back-end, バックエンド, API, REST, GraphQL,
Server, Node.js, Deno, Bun
```

#### サブキーワード（言語・フレームワーク）
```
Express, Fastify, NestJS, Hono, Elysia,
Python, Django, FastAPI, Flask,
Go, Golang, Gin, Echo, Fiber,
Rust, Actix, Axum, Rocket,
Java, Spring Boot, Kotlin, Ktor,
Ruby, Rails, Sinatra,
PHP, Laravel, Symfony
```

#### 関連キーワード（技術・アーキテクチャ）
```
Microservices, Serverless, FaaS, BaaS,
gRPC, tRPC, WebSocket, Socket.IO,
Message Queue, RabbitMQ, Kafka, Redis, Bull,
ORM, Prisma, TypeORM, Drizzle, Kysely,
Database, PostgreSQL, MySQL, MongoDB, Redis,
Supabase, Firebase, PlanetScale, Neon,
Authentication, Auth, JWT, OAuth, Passport,
Rate Limiting, Caching, CDN
```

---

### 2.4 DevOps & Infrastructure

#### コアキーワード
```
DevOps, Infrastructure, Cloud, Deployment, CI/CD,
Docker, Kubernetes, k8s
```

#### サブキーワード（ツール・プラットフォーム）
```
AWS, Azure, GCP, Google Cloud, Vercel, Netlify, Cloudflare,
GitHub Actions, GitLab CI, CircleCI, Jenkins,
Terraform, Pulumi, CloudFormation, IaC,
Helm, ArgoCD, Flux, GitOps,
Prometheus, Grafana, Datadog, New Relic,
Nginx, Caddy, Traefik, Envoy
```

#### 関連キーワード（技術・手法）
```
Container, Containerization, Orchestration,
Service Mesh, Istio, Linkerd,
Monitoring, Observability, Logging, Tracing,
Security, Vulnerability, Pen Testing,
Performance Optimization, Load Balancing,
Blue-Green Deployment, Canary Release
```

---

### 2.5 Mobile Development

#### コアキーワード
```
Mobile, iOS, Android, React Native, Flutter,
Swift, SwiftUI, Kotlin, Jetpack Compose
```

#### サブキーワード（技術・ツール）
```
Expo, Capacitor, Ionic, NativeScript,
App Store, Google Play, TestFlight,
Push Notification, Firebase Cloud Messaging,
App Performance, Crash Reporting
```

---

### 2.6 Database & Data Engineering

#### コアキーワード
```
Database, SQL, NoSQL, Data Engineering,
Big Data, Data Pipeline
```

#### サブキーワード
```
PostgreSQL, MySQL, SQLite, MariaDB,
MongoDB, DynamoDB, Cassandra, CouchDB,
Redis, Memcached, Elasticsearch, Solr,
ClickHouse, TimescaleDB, InfluxDB,
Snowflake, BigQuery, Redshift, Databricks,
Apache Spark, Airflow, Kafka, Flink,
dbt, Airbyte, Fivetran
```

---

### 2.7 Security & Testing

#### コアキーワード
```
Security, Cybersecurity, Testing, QA,
Unit Test, Integration Test, E2E Test
```

#### サブキーワード
```
Jest, Vitest, Mocha, Chai, Playwright, Cypress,
Selenium, Puppeteer, Testing Library,
Penetration Testing, OWASP, XSS, CSRF, SQL Injection,
Authentication, Authorization, Zero Trust,
Encryption, SSL/TLS, Cryptography
```

---

## 3. X API検索クエリ最適化戦略

### 3.1 検索クエリの基本構造

```typescript
interface SearchQuery {
  keywords: string[];        // メインキーワード
  operators: QueryOperator[]; // 検索演算子
  filters: SearchFilter[];    // フィルター条件
  excludes: string[];         // 除外キーワード
}
```

### 3.2 効果的なクエリパターン

#### パターン1: OR結合による網羅的検索
```
(React OR Next.js OR Vue) AND (tutorial OR guide OR best practice)
```

#### パターン2: 言語指定による精度向上
```
Next.js lang:en -lang:ja
```
※ 日本語圏向けの場合は逆に

#### パターン3: エンゲージメントフィルター
```
React has:links min_faves:10 min_retweets:5
```

#### パターン4: 情報源の信頼性重視
```
(Claude OR GPT-4) from:AnthropicAI OR from:OpenAI
```

#### パターン5: 時間軸での絞り込み
```
TypeScript since:2025-12-20 until:2025-12-23
```

### 3.3 推奨クエリ例

#### AI/MLトレンド収集
```javascript
const aiQuery = {
  query: `(
    Claude OR GPT-4 OR Gemini OR LLM OR "Large Language Model"
  ) AND (
    release OR update OR "new feature" OR announced OR launched
  ) lang:en has:links min_faves:50`,
  maxResults: 100
}
```

#### フロントエンド技術情報
```javascript
const frontendQuery = {
  query: `(
    React OR Next.js OR Vue OR Svelte
  ) AND (
    performance OR optimization OR "best practice" OR tips
  ) -crypto -NFT lang:en min_faves:20`,
  maxResults: 100
}
```

---

## 4. エンゲージメントスコアリング戦略

### 4.1 スコアリング基準

```typescript
interface EngagementScore {
  likesWeight: number;      // いいね数の重み
  retweetsWeight: number;   // リポスト数の重み
  repliesWeight: number;    // 返信数の重み
  authorWeight: number;     // 投稿者の影響力
  recencyWeight: number;    // 新しさ
}

const defaultWeights = {
  likesWeight: 1.0,
  retweetsWeight: 2.0,      // リポストはより重要
  repliesWeight: 1.5,       // 返信は議論の証
  authorWeight: 3.0,        // 信頼できる発信者は高評価
  recencyWeight: 2.0        // 新しい情報を優先
}
```

### 4.2 スコア計算式

```typescript
function calculateEngagementScore(post: Post): number {
  const baseScore =
    post.likes * weights.likesWeight +
    post.retweets * weights.retweetsWeight +
    post.replies * weights.repliesWeight;

  const authorBonus = isVerifiedTechAccount(post.author)
    ? baseScore * weights.authorWeight
    : 0;

  const recencyBonus = calculateRecencyBonus(post.createdAt);

  return baseScore + authorBonus + recencyBonus;
}
```

### 4.3 信頼できるアカウントリスト（例）

```typescript
const verifiedTechAccounts = [
  // 公式アカウント
  '@vercel', '@nextjs', '@reactjs', '@vuejs',
  '@AnthropicAI', '@OpenAI', '@GoogleAI',

  // 著名エンジニア
  '@dan_abramov', '@sebmarkbage', '@tjholowaychuk',
  '@devongovett', '@addyosmani', '@kentcdodds',

  // 技術メディア
  '@TheNewStack', '@changelog', '@devto',
  '@FreeCodeCamp', '@smashingmag', '@CSS',

  // 日本語圏（必要に応じて）
  '@mizchi', '@t_wada', '@kazu_pon'
];
```

---

## 5. トレンド判定アルゴリズム

### 5.1 トレンド検出条件

```typescript
interface TrendCriteria {
  minPostCount: number;      // 最小投稿数
  minGrowthRate: number;     // 最小成長率（%）
  timeWindow: number;        // 時間窓（時間）
  minEngagement: number;     // 最小エンゲージメント
}

const trendThresholds = {
  emerging: {      // 新興トレンド
    minPostCount: 10,
    minGrowthRate: 100,  // 2倍
    timeWindow: 6,       // 6時間
    minEngagement: 500
  },
  hot: {          // ホットトレンド
    minPostCount: 50,
    minGrowthRate: 50,
    timeWindow: 24,
    minEngagement: 2000
  },
  sustained: {    // 持続トレンド
    minPostCount: 100,
    minGrowthRate: 20,
    timeWindow: 72,      // 3日
    minEngagement: 5000
  }
}
```

### 5.2 トレンドグルーピング戦略

類似トピックを統合してノイズを削減：

```typescript
interface TrendGroup {
  primaryKeyword: string;
  relatedKeywords: string[];
  posts: Post[];
  score: number;
}

// 例: Next.js 15関連を統合
const nextjs15Group = {
  primaryKeyword: 'Next.js 15',
  relatedKeywords: [
    'Next.js 15 Release',
    'Next.js 15 Performance',
    'Next.js 15 Turbopack',
    'Next 15'
  ],
  // ...
}
```

---

## 6. ノイズ除去戦略

### 6.1 除外すべきコンテンツ

```typescript
const noisePatterns = {
  // スパム・宣伝
  spam: [
    /🎁.*無料/,
    /DM.*稼げる/,
    /.*副業.*即金/,
    /.*仮想通貨.*億/
  ],

  // 無関係なトピック
  irrelevant: [
    /占い/, /恋愛/, /ダイエット/,
    /ギャンブル/, /パチンコ/
  ],

  // 低品質コンテンツ
  lowQuality: [
    /^.{1,10}$/,  // 極端に短い投稿
    /絵文字のみ/
  ]
};
```

### 6.2 品質フィルター

```typescript
function isHighQualityPost(post: Post): boolean {
  // 技術的なコンテンツの判定
  const hasTechKeywords = containsTechKeywords(post.text);
  const hasLinks = post.urls && post.urls.length > 0;
  const hasCode = /```|`[^`]+`/.test(post.text);

  // 最小品質基準
  const meetsMinimum =
    post.text.length >= 50 &&
    (post.likes + post.retweets) >= 5;

  return hasTechKeywords && meetsMinimum && (hasLinks || hasCode);
}
```

---

## 7. キーワードメンテナンス方針

### 7.1 定期レビュー

| 頻度 | 対象 | 実施内容 |
|-----|------|---------|
| 週次 | 新興キーワード | トレンドから新しいキーワードを発掘 |
| 月次 | 全キーワード | 有効性の評価と優先度見直し |
| 四半期 | カテゴリ構造 | カテゴリの追加・統合・削除 |

### 7.2 新規キーワード追加基準

```typescript
interface KeywordEvaluationCriteria {
  mentionCount: number;      // 言及回数
  growthTrend: 'rising' | 'stable' | 'declining';
  relevanceScore: number;    // 技術的関連性
  communityAdoption: number; // コミュニティ採用度
}

// 追加基準
const addKeywordThreshold = {
  mentionCount: 100,         // 週100回以上
  growthTrend: 'rising',
  relevanceScore: 0.7,       // 70%以上の関連性
  communityAdoption: 0.5     // 50%以上
}
```

### 7.3 非推奨キーワードの削除

以下に該当するキーワードは削除候補：
- 3ヶ月間言及がない
- 検索結果の90%以上がノイズ
- 技術的に時代遅れ（例: Flash, IE6）

---

## 8. X API利用制限への対応

### 8.1 レート制限

X API v2 Essential:
- 検索: 450リクエスト/15分
- ツイート取得: 300リクエスト/15分

### 8.2 最適化戦略

```typescript
const apiOptimization = {
  // バッチ処理
  batchInterval: '*/15 * * * *',  // 15分ごと
  requestsPerBatch: 100,

  // キャッシング
  cacheStrategy: {
    trendData: 5 * 60,      // 5分
    postData: 15 * 60,      // 15分
    summaryData: 60 * 60    // 1時間
  },

  // 優先度制御
  priorityQueue: [
    'AI',           // 優先度: 高
    'Frontend',
    'Backend',
    'DevOps',
    'Mobile'        // 優先度: 低
  ]
}
```

---

## 9. 実装時の推奨構成

### 9.1 キーワード設定ファイル構造

```
src/config/
├── keywords/
│   ├── ai-ml.ts           # AI/MLカテゴリ
│   ├── frontend.ts        # フロントエンド
│   ├── backend.ts         # バックエンド
│   ├── devops.ts          # DevOps
│   ├── mobile.ts          # モバイル
│   └── index.ts           # 統合エクスポート
├── queries/
│   ├── search-queries.ts  # 検索クエリテンプレート
│   └── filters.ts         # フィルター設定
└── scoring/
    ├── engagement.ts      # エンゲージメントスコア
    ├── trend-detection.ts # トレンド検出
    └── noise-filter.ts    # ノイズフィルター
```

### 9.2 型定義

```typescript
// keywords/types.ts
export interface KeywordConfig {
  category: string;
  core: string[];
  sub: string[];
  related: string[];
  exclude: string[];
}

export interface SearchQueryTemplate {
  category: string;
  query: string;
  filters: {
    lang?: string;
    minFaves?: number;
    minRetweets?: number;
    hasLinks?: boolean;
  };
}

export interface TrendScore {
  engagementScore: number;
  growthRate: number;
  recencyScore: number;
  qualityScore: number;
  totalScore: number;
}
```

---

## 10. 成功指標（KPI）

### 10.1 収集品質

| 指標 | 目標値 | 測定方法 |
|-----|--------|---------|
| トレンド検出精度 | 85%以上 | 手動レビューとの一致率 |
| ノイズ率 | 15%以下 | 無関係投稿の割合 |
| カバレッジ | 90%以上 | 主要トレンドの捕捉率 |

### 10.2 運用効率

| 指標 | 目標値 | 測定方法 |
|-----|--------|---------|
| API利用率 | 80%以下 | レート制限に対する使用率 |
| レスポンス時間 | 1秒以内 | API応答時間 |
| キャッシュヒット率 | 70%以上 | キャッシュからの取得率 |

---

## 11. 次のステップ

1. **技術検証（POC）**
   - X API接続テスト
   - キーワード検索の有効性検証
   - エンゲージメントスコアのチューニング

2. **キーワード設定実装**
   - `src/config/keywords/` 配下のファイル作成
   - 検索クエリテンプレートの実装
   - スコアリングアルゴリズムの実装

3. **継続的改善**
   - 収集データの分析
   - キーワードの効果測定
   - 定期的な最適化

---

## 12. 承認

| 役割 | 氏名 | 承認日 | 署名 |
|-----|------|-------|------|
| プロダクトオーナー | - | - | - |
| 技術リード | - | - | - |

---

**文書管理**
- 最終更新日: 2025-12-23
- 更新者: Tech Digest Team
- 次回レビュー予定: 実装開始時
