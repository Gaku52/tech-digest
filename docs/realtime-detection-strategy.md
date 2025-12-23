# リアルタイムトレンド検出戦略: Tech Digest

**作成日**: 2025-12-23
**バージョン**: 1.0
**ステータス**: Draft

---

## 1. 概要

本ドキュメントは、Tech Digestのリアルタイムトレンド検出機能の設計を定義します。**10分以内の新興トレンドを検出し、即座に通知**する強力なシステムを実現します。

### 1.1 目標

- **超高速検出**: トレンド発生から10分以内に検出
- **高精度アラート**: 誤検知率5%以下
- **リアルタイム配信**: ユーザーへ1秒以内に通知
- **スケーラビリティ**: 同時1000ユーザーまで対応

### 1.2 競合優位性

| 機能 | Tech Digest | 他サービス |
|-----|------------|----------|
| 検出速度 | 10分以内 | 数時間〜1日 |
| 通知方法 | プッシュ/WebSocket | メール/RSS |
| カスタマイズ | 完全カスタム | 限定的 |
| 技術特化 | ✅ | ❌ |

---

## 2. リアルタイム検出アーキテクチャ

### 2.1 システム全体像

```
┌─────────────────────────────────────────────────────┐
│                  X (Twitter) API                     │
│                  Streaming Endpoint                  │
└────────────────────┬────────────────────────────────┘
                     │ リアルタイムデータ
                     ▼
┌─────────────────────────────────────────────────────┐
│            Data Collection Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Stream      │  │   Polling    │  │  Webhook │  │
│  │  Collector   │  │   Collector  │  │  Handler │  │
│  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │
└─────────┼──────────────────┼────────────────┼───────┘
          │                  │                │
          └──────────────────┴────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│          Real-time Processing Engine                 │
│  ┌─────────────────────────────────────────────┐    │
│  │  1. Data Normalization                      │    │
│  │  2. Keyword Matching                        │    │
│  │  3. Trend Detection (Sliding Window)        │    │
│  │  4. Score Calculation                       │    │
│  └─────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│   Redis Cache    │   │  PostgreSQL DB   │
│  (Hot Trends)    │   │  (Persistent)    │
└────────┬─────────┘   └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│            Notification Dispatcher                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │WebSocket │  │  Push    │  │ Webhook  │          │
│  │  Server  │  │Notification│  │          │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
└───────┼─────────────┼─────────────┼────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────┐
│                    End Users                         │
│  📱 Mobile App  💻 Web App  🤖 Slack/Discord        │
└─────────────────────────────────────────────────────┘
```

### 2.2 データ収集戦略

#### 戦略A: X API Filtered Stream（推奨）

```typescript
// X API v2 Filtered Stream
const streamRules = [
  {
    value: '(Claude OR GPT-4 OR Gemini) -is:retweet lang:en',
    tag: 'ai-releases'
  },
  {
    value: '(Next.js OR React OR Vue) (release OR update) -is:retweet',
    tag: 'frontend-updates'
  }
];

// リアルタイムストリーム接続
const stream = await twitterClient.v2.searchStream({
  'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
  'user.fields': ['verified', 'public_metrics'],
  expansions: ['author_id']
});

stream.on('data', async (tweet) => {
  await processRealtimeTweet(tweet);
});
```

**メリット:**
- ✅ レイテンシ: 1秒以内
- ✅ リアルタイム性: 最高
- ✅ コスト効率: 高（1接続で大量取得）

**デメリット:**
- ❌ X API Pro以上が必要（$5,000/月〜）

---

#### 戦略B: Polling + Incremental Search（MVP推奨）

```typescript
// 5分ごとのポーリング
const POLLING_INTERVAL = 5 * 60 * 1000; // 5分

async function pollRecentTweets() {
  const lastPollTime = await getLastPollTime();
  const startTime = new Date(lastPollTime);

  const tweets = await twitterClient.v2.search({
    query: buildSearchQuery(),
    start_time: startTime.toISOString(),
    max_results: 100,
    'tweet.fields': ['created_at', 'public_metrics']
  });

  await processBatchTweets(tweets);
  await updateLastPollTime(new Date());
}

setInterval(pollRecentTweets, POLLING_INTERVAL);
```

**メリット:**
- ✅ コスト: 低（Essential: $100/月）
- ✅ 実装: シンプル

**デメリット:**
- ❌ レイテンシ: 5-10分
- ❌ API制限への配慮が必要

---

### 2.3 ハイブリッド戦略（最適解）

```typescript
const detectionStrategy = {
  // 高優先度キーワード: Streaming
  highPriority: {
    method: 'stream',
    keywords: ['Claude', 'GPT-4', 'Next.js 15'],
    latency: '1秒'
  },

  // 中優先度キーワード: 高頻度Polling
  mediumPriority: {
    method: 'polling',
    interval: '5分',
    keywords: ['React', 'TypeScript', 'Docker'],
    latency: '5分'
  },

  // 低優先度キーワード: 低頻度Polling
  lowPriority: {
    method: 'polling',
    interval: '30分',
    keywords: ['legacy tech', 'deprecated'],
    latency: '30分'
  }
};
```

---

## 3. 早期トレンド検出アルゴリズム

### 3.1 スライディングウィンドウ方式

```typescript
interface TimeWindow {
  windowSize: number;     // ウィンドウサイズ（分）
  slideInterval: number;  // スライド間隔（秒）
}

const windows = {
  ultraFast: { windowSize: 10, slideInterval: 30 },  // 10分窓、30秒スライド
  fast: { windowSize: 30, slideInterval: 60 },       // 30分窓、1分スライド
  normal: { windowSize: 60, slideInterval: 300 }     // 1時間窓、5分スライド
};
```

### 3.2 急上昇検出アルゴリズム

```typescript
interface TrendDetectionConfig {
  minPostCount: number;        // 最小投稿数
  growthThreshold: number;     // 成長率閾値（%）
  accelerationFactor: number;  // 加速度係数
  qualityScore: number;        // 品質スコア閾値
}

// 超高速検出設定（10分窓）
const ultraFastDetection: TrendDetectionConfig = {
  minPostCount: 5,             // 10分で5投稿以上
  growthThreshold: 200,        // 200%成長（3倍）
  accelerationFactor: 2.0,     // 加速度2倍
  qualityScore: 50             // 最低品質スコア
};

async function detectEmergingTrend(
  keyword: string,
  window: TimeWindow
): Promise<TrendAlert | null> {

  // 現在の窓と前の窓のデータを取得
  const currentWindow = await getPostsInWindow(keyword, window);
  const previousWindow = await getPostsInPreviousWindow(keyword, window);

  // 投稿数の変化を計算
  const currentCount = currentWindow.length;
  const previousCount = previousWindow.length;

  // 成長率計算
  const growthRate = previousCount === 0
    ? Infinity
    : ((currentCount - previousCount) / previousCount) * 100;

  // 加速度計算（成長率の変化率）
  const acceleration = calculateAcceleration(keyword, window);

  // エンゲージメントスコア計算
  const avgEngagement = calculateAverageEngagement(currentWindow);

  // トレンド判定
  if (
    currentCount >= ultraFastDetection.minPostCount &&
    growthRate >= ultraFastDetection.growthThreshold &&
    acceleration >= ultraFastDetection.accelerationFactor &&
    avgEngagement >= ultraFastDetection.qualityScore
  ) {
    return {
      keyword,
      type: 'emerging',
      confidence: calculateConfidence(growthRate, acceleration, avgEngagement),
      posts: currentWindow,
      detectedAt: new Date(),
      metrics: {
        postCount: currentCount,
        growthRate,
        acceleration,
        avgEngagement
      }
    };
  }

  return null;
}
```

### 3.3 信頼度スコアリング

```typescript
function calculateConfidence(
  growthRate: number,
  acceleration: number,
  engagement: number
): number {
  const weights = {
    growth: 0.4,      // 成長率の重み
    accel: 0.3,       // 加速度の重み
    engage: 0.3       // エンゲージメントの重み
  };

  // 正規化（0-1の範囲に）
  const normalizedGrowth = Math.min(growthRate / 500, 1);
  const normalizedAccel = Math.min(acceleration / 5, 1);
  const normalizedEngage = Math.min(engagement / 200, 1);

  const confidence =
    normalizedGrowth * weights.growth +
    normalizedAccel * weights.accel +
    normalizedEngage * weights.engage;

  return Math.round(confidence * 100); // 0-100のスコア
}
```

---

## 4. リアルタイム通知システム

### 4.1 通知配信アーキテクチャ

```typescript
interface NotificationChannel {
  type: 'websocket' | 'push' | 'webhook' | 'email';
  priority: 'immediate' | 'high' | 'normal' | 'low';
  latency: string;
}

const channels: NotificationChannel[] = [
  {
    type: 'websocket',
    priority: 'immediate',
    latency: '< 1秒'
  },
  {
    type: 'push',
    priority: 'high',
    latency: '< 5秒'
  },
  {
    type: 'webhook',
    priority: 'normal',
    latency: '< 10秒'
  },
  {
    type: 'email',
    priority: 'low',
    latency: '< 1分'
  }
];
```

### 4.2 WebSocketリアルタイム配信

```typescript
// WebSocketサーバー（Next.js + Socket.io）
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true
  }
});

// クライアント接続時
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ユーザーのフィルター設定を取得
  socket.on('subscribe', async (filters) => {
    const userFilters = {
      categories: filters.categories || [],
      keywords: filters.keywords || [],
      minConfidence: filters.minConfidence || 70
    };

    // ユーザー固有のルームに追加
    socket.join(`user:${socket.id}`);
    socket.data.filters = userFilters;
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// トレンド検出時に配信
async function broadcastTrendAlert(trend: TrendAlert) {
  // 全接続クライアントをフィルタリング
  const sockets = await io.fetchSockets();

  for (const socket of sockets) {
    const filters = socket.data.filters;

    // ユーザーのフィルター条件に合致するか確認
    if (matchesUserFilters(trend, filters)) {
      socket.emit('trend:alert', {
        id: trend.id,
        keyword: trend.keyword,
        type: trend.type,
        confidence: trend.confidence,
        postCount: trend.metrics.postCount,
        growthRate: trend.metrics.growthRate,
        timestamp: trend.detectedAt,
        previewPosts: trend.posts.slice(0, 3) // 最初の3投稿
      });
    }
  }
}
```

### 4.3 プッシュ通知（Web Push API）

```typescript
// Service Worker登録
async function subscribeToNotifications() {
  const registration = await navigator.serviceWorker.register('/sw.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  });

  // サーバーに購読情報を送信
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
}

// サーバーサイド: プッシュ送信
import webpush from 'web-push';

async function sendPushNotification(
  subscription: PushSubscription,
  trend: TrendAlert
) {
  const payload = JSON.stringify({
    title: `🔥 ${trend.keyword} がトレンド入り`,
    body: `信頼度: ${trend.confidence}% | 投稿数: ${trend.metrics.postCount}`,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      url: `/trends/${trend.id}`,
      trendId: trend.id
    }
  });

  await webpush.sendNotification(subscription, payload);
}
```

### 4.4 Webhook統合

```typescript
// ユーザーのWebhook設定
interface WebhookConfig {
  url: string;
  secret: string;
  filters: {
    categories: string[];
    minConfidence: number;
  };
}

async function sendWebhook(
  config: WebhookConfig,
  trend: TrendAlert
) {
  const payload = {
    event: 'trend.detected',
    timestamp: new Date().toISOString(),
    data: trend
  };

  // HMAC署名生成
  const signature = generateHmacSignature(
    JSON.stringify(payload),
    config.secret
  );

  await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tech-Digest-Signature': signature
    },
    body: JSON.stringify(payload)
  });
}
```

---

## 5. 速度最適化戦略

### 5.1 多段階キャッシング

```typescript
const cacheStrategy = {
  // L1: In-Memory Cache（Node.js）
  L1: {
    type: 'memory',
    ttl: 60,           // 1分
    target: 'hot trends',
    latency: '< 1ms'
  },

  // L2: Redis Cache
  L2: {
    type: 'redis',
    ttl: 300,          // 5分
    target: 'recent trends',
    latency: '< 10ms'
  },

  // L3: Database
  L3: {
    type: 'postgresql',
    ttl: Infinity,
    target: 'historical data',
    latency: '< 100ms'
  }
};

// キャッシュ階層
class CacheManager {
  private memCache = new Map<string, any>();
  private redisClient: Redis;

  async get(key: string): Promise<any> {
    // L1: メモリキャッシュチェック
    if (this.memCache.has(key)) {
      return this.memCache.get(key);
    }

    // L2: Redisチェック
    const redisData = await this.redisClient.get(key);
    if (redisData) {
      this.memCache.set(key, JSON.parse(redisData));
      return JSON.parse(redisData);
    }

    // L3: データベースから取得
    const dbData = await this.fetchFromDatabase(key);
    if (dbData) {
      await this.set(key, dbData);
      return dbData;
    }

    return null;
  }

  async set(key: string, value: any, ttl = 300) {
    // 全階層に保存
    this.memCache.set(key, value);
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
  }
}
```

### 5.2 並列処理とバッチング

```typescript
// 並列キーワード検索
async function processMultipleKeywords(keywords: string[]) {
  const batchSize = 10; // 10並列
  const results = [];

  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);

    // Promise.allで並列実行
    const batchResults = await Promise.all(
      batch.map(keyword => detectEmergingTrend(keyword, windows.ultraFast))
    );

    results.push(...batchResults.filter(r => r !== null));
  }

  return results;
}
```

### 5.3 データベースインデックス最適化

```sql
-- トレンド検出用インデックス
CREATE INDEX idx_posts_keyword_created ON posts(keyword, created_at DESC);
CREATE INDEX idx_posts_created_engagement ON posts(created_at DESC, engagement_score DESC);

-- 部分インデックス（最近24時間のみ）
CREATE INDEX idx_posts_recent ON posts(created_at, keyword)
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 複合インデックス（カバリングインデックス）
CREATE INDEX idx_posts_covering ON posts(keyword, created_at, engagement_score, author_verified)
INCLUDE (content, author_username);
```

---

## 6. アラート条件設定

### 6.1 アラートレベル定義

```typescript
enum AlertLevel {
  CRITICAL = 'critical',  // 即座に通知（WebSocket + Push）
  HIGH = 'high',          // 高優先度通知（Push）
  MEDIUM = 'medium',      // 通常通知（アプリ内）
  LOW = 'low'             // ログのみ
}

interface AlertCriteria {
  level: AlertLevel;
  conditions: {
    minPostCount?: number;
    minGrowthRate?: number;
    minConfidence?: number;
    keywords?: string[];
  };
  channels: NotificationChannel['type'][];
}

const alertRules: AlertCriteria[] = [
  // CRITICAL: 主要技術の新リリース
  {
    level: AlertLevel.CRITICAL,
    conditions: {
      keywords: ['Claude', 'GPT-5', 'Next.js 16'],
      minPostCount: 10,
      minGrowthRate: 300,
      minConfidence: 80
    },
    channels: ['websocket', 'push', 'webhook']
  },

  // HIGH: 急上昇トレンド
  {
    level: AlertLevel.HIGH,
    conditions: {
      minPostCount: 15,
      minGrowthRate: 200,
      minConfidence: 70
    },
    channels: ['websocket', 'push']
  },

  // MEDIUM: 中程度のトレンド
  {
    level: AlertLevel.MEDIUM,
    conditions: {
      minPostCount: 10,
      minGrowthRate: 100,
      minConfidence: 60
    },
    channels: ['websocket']
  }
];
```

### 6.2 ユーザーカスタムアラート

```typescript
// ユーザー設定
interface UserAlertConfig {
  userId: string;
  customKeywords: string[];      // カスタムキーワード
  categories: string[];          // 興味カテゴリ
  minConfidence: number;         // 最小信頼度
  quietHours?: {                 // 通知OFF時間
    start: string;  // "22:00"
    end: string;    // "07:00"
  };
  channels: NotificationChannel['type'][];
}

// カスタムアラート判定
function shouldNotifyUser(
  user: UserAlertConfig,
  trend: TrendAlert
): boolean {
  // 静粛時間チェック
  if (isQuietHours(user.quietHours)) {
    return false;
  }

  // 信頼度チェック
  if (trend.confidence < user.minConfidence) {
    return false;
  }

  // カテゴリマッチング
  const categoryMatch = user.categories.includes(trend.category);

  // カスタムキーワードマッチング
  const keywordMatch = user.customKeywords.some(
    keyword => trend.keyword.toLowerCase().includes(keyword.toLowerCase())
  );

  return categoryMatch || keywordMatch;
}
```

---

## 7. パフォーマンス指標

### 7.1 ターゲットメトリクス

| 指標 | 目標値 | 測定方法 |
|-----|--------|---------|
| トレンド検出速度 | 10分以内 | トレンド発生からアラートまでの時間 |
| 通知レイテンシ | 1秒以内 | アラート生成からユーザー受信まで |
| 誤検知率 | 5%以下 | 手動検証との比較 |
| 見逃し率 | 10%以下 | 実際のトレンドとの比較 |
| システム稼働率 | 99.9% | アップタイム監視 |

### 7.2 モニタリング設定

```typescript
// Prometheus メトリクス
import { Counter, Histogram, Gauge } from 'prom-client';

const metrics = {
  // トレンド検出数
  trendsDetected: new Counter({
    name: 'trends_detected_total',
    help: 'Total number of trends detected',
    labelNames: ['category', 'confidence_level']
  }),

  // 検出レイテンシ
  detectionLatency: new Histogram({
    name: 'trend_detection_latency_seconds',
    help: 'Time from trend emergence to detection',
    buckets: [60, 300, 600, 1800] // 1分, 5分, 10分, 30分
  }),

  // 通知レイテンシ
  notificationLatency: new Histogram({
    name: 'notification_latency_seconds',
    help: 'Time from detection to user notification',
    buckets: [0.1, 0.5, 1, 5, 10]
  }),

  // アクティブ接続数
  activeConnections: new Gauge({
    name: 'websocket_active_connections',
    help: 'Number of active WebSocket connections'
  })
};
```

---

## 8. 実装ロードマップ

### Phase 1: MVP（1-2週間）
- ✅ Polling方式での5分間隔トレンド検出
- ✅ WebSocketリアルタイム配信
- ✅ 基本的なアラート条件
- ✅ アプリ内通知

### Phase 2: 高速化（2-3週間）
- ✅ スライディングウィンドウ実装（10分窓）
- ✅ 多段階キャッシング
- ✅ プッシュ通知実装
- ✅ カスタムアラート設定

### Phase 3: 最適化（3-4週間）
- ✅ X API Filtered Stream統合（Pro契約後）
- ✅ 機械学習による精度向上
- ✅ Webhook統合
- ✅ Slack/Discord Bot連携

---

## 9. コスト試算

### 9.1 X API費用

| プラン | 月額 | 機能 | 推奨フェーズ |
|-------|------|------|-------------|
| Essential | $100 | 基本検索、Polling | MVP |
| Elevated | $200 | より高いレート制限 | Phase 2 |
| Pro | $5,000 | Filtered Stream | Phase 3 |

### 9.2 インフラ費用

```typescript
const monthlyCosts = {
  // Vercel
  hosting: {
    plan: 'Pro',
    cost: 20
  },

  // Upstash Redis
  redis: {
    plan: 'Pro',
    cost: 30
  },

  // Supabase/Neon
  database: {
    plan: 'Pro',
    cost: 25
  },

  // プッシュ通知（Firebase/OneSignal）
  push: {
    plan: 'Free',
    cost: 0  // 10K通知/月まで
  },

  total: 75 + 100  // $175/月（Essential）
};
```

---

## 10. セキュリティ考慮事項

### 10.1 レート制限

```typescript
// ユーザーあたりの通知制限
const rateLimits = {
  perMinute: 10,     // 1分あたり10通知まで
  perHour: 100,      // 1時間あたり100通知まで
  perDay: 500        // 1日あたり500通知まで
};

// Redis使用例
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `ratelimit:${userId}:${Date.now() / 60000 | 0}`;
  const count = await redis.incr(key);
  await redis.expire(key, 60);

  return count <= rateLimits.perMinute;
}
```

### 10.2 Webhook署名検証

```typescript
import crypto from 'crypto';

function generateHmacSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateHmacSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 11. 次のステップ

1. **技術検証**
   - [ ] X API接続テスト
   - [ ] WebSocket性能テスト
   - [ ] Redis遅延測定

2. **プロトタイプ開発**
   - [ ] 10分窓トレンド検出実装
   - [ ] WebSocketサーバー構築
   - [ ] 基本的なアラート機能

3. **テストと最適化**
   - [ ] 負荷テスト（1000同時接続）
   - [ ] 検出精度の検証
   - [ ] レイテンシ最適化

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
- 次回レビュー予定: Phase 1完了時
