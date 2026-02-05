# 📋 Tech Digest - SuperGrok 4段階プロンプト

## 概要

このディレクトリには、Tech Digestの記事を生成するための4段階プロンプトが格納されています。

従来の1回プロンプト方式では情報密度が薄く、記事品質が2.5-3/10でした。
**4段階プロンプト方式**では、SuperGrokに段階的に情報を深掘りさせることで、**8.5-9.0/10**の記事品質を実現します。

## ワークフロー全体図

```
【Stage 1】トレンド抽出
  ↓ 15本のトレンドを優先度別に抽出
  ↓ 出力: stage1-trends.json

【Stage 2】技術的詳細（15回実行）
  ↓ 各トレンドの技術的詳細を深掘り
  ↓ 出力: stage2-technical/trend-XXX.json (×15)

【Stage 3】コミュニティの反応（15回実行）
  ↓ 各トレンドに対するXのコミュニティ反応を収集
  ↓ 出力: stage3-community/trend-XXX.json (×15)

【Stage 4】エンジニアへの影響（15回実行）
  ↓ 各トレンドの実務への影響を分析
  ↓ 出力: stage4-impact/trend-XXX.json (×15)

【Claude Code】統合・記事生成
  ↓ 4段階の情報を統合して記事化
  ↓ 出力: data/articles/YYYY-MM/YYYY-MM-DD-*.md (×15)
```

## ファイル構成

```
data/supergrok-trends/
├── prompts/
│   ├── README.md                                    (このファイル)
│   ├── stage1-trend-extraction-prompt.md            (第1段階: トレンド抽出)
│   ├── stage2-technical-details-prompt.md           (第2段階: 技術的詳細)
│   ├── stage3-community-reactions-prompt.md         (第3段階: コミュニティ反応)
│   └── stage4-engineer-impact-prompt.md             (第4段階: エンジニア影響)
│
└── YYYY-MM-DD/                                      (日付別データ)
    ├── stage1-trends.json                           (Stage 1の出力)
    ├── stage2-technical/
    │   ├── trend-001.json
    │   ├── trend-002.json
    │   └── ... (×15)
    ├── stage3-community/
    │   ├── trend-001.json
    │   ├── trend-002.json
    │   └── ... (×15)
    └── stage4-impact/
        ├── trend-001.json
        ├── trend-002.json
        └── ... (×15)
```

## 毎日の実行手順

### 1. Stage 1: トレンド抽出（1回実行）

**プロンプトファイル**: `stage1-trend-extraction-prompt.md`

**実行方法**:
1. SuperGrok（X Premium+）を開く
2. `stage1-trend-extraction-prompt.md` の内容をコピー
3. 日付を当日に変更（例: 2026-02-05）
4. SuperGrokに投げる

**出力**:
```
data/supergrok-trends/2026-02-05/stage1-trends.json
```

**所要時間**: 約5-10分

---

### 2. Stage 2: 技術的詳細（15回実行）

**プロンプトファイル**: `stage2-technical-details-prompt.md`

**実行方法**:
1. Stage 1の`stage1-trends.json`を開く
2. 各トレンド（trend-001 ~ trend-015）について:
   - `stage2-technical-details-prompt.md`をコピー
   - `{Stage 1のトレンド1件分のJSONを貼り付け}`の部分に該当トレンドのJSONを貼り付け
   - SuperGrokに投げる
   - 出力を`stage2-technical/trend-XXX.json`として保存

**出力**:
```
data/supergrok-trends/2026-02-05/stage2-technical/
├── trend-001.json
├── trend-002.json
└── ... (×15)
```

**所要時間**: 約30-45分（1トレンドあたり2-3分 × 15）

**効率化のヒント**:
- Critical/High記事（計6本）を優先的に詳しく
- Medium/Lowは簡潔に（各1-2分程度）

---

### 3. Stage 3: コミュニティの反応（15回実行）

**プロンプトファイル**: `stage3-community-reactions-prompt.md`

**実行方法**:
1. Stage 1の`stage1-trends.json`を開く
2. 各トレンド（trend-001 ~ trend-015）について:
   - `stage3-community-reactions-prompt.md`をコピー
   - `{Stage 1のトレンド1件分のJSONを貼り付け}`の部分に該当トレンドのJSONを貼り付け
   - SuperGrokに投げる
   - 出力を`stage3-community/trend-XXX.json`として保存

**出力**:
```
data/supergrok-trends/2026-02-05/stage3-community/
├── trend-001.json
├── trend-002.json
└── ... (×15)
```

**所要時間**: 約30-45分（1トレンドあたり2-3分 × 15）

---

### 4. Stage 4: エンジニアへの影響（15回実行）

**プロンプトファイル**: `stage4-engineer-impact-prompt.md`

**実行方法**:
1. Stage 1-3のJSONファイルを開く
2. 各トレンド（trend-001 ~ trend-015）について:
   - `stage4-engineer-impact-prompt.md`をコピー
   - `{Stage 1-3の該当トレンドのJSONを貼り付け}`の部分に、Stage 1-3の該当トレンドのJSONを**すべて**貼り付け
   - SuperGrokに投げる
   - 出力を`stage4-impact/trend-XXX.json`として保存

**出力**:
```
data/supergrok-trends/2026-02-05/stage4-impact/
├── trend-001.json
├── trend-002.json
└── ... (×15)
```

**所要時間**: 約30-45分（1トレンドあたり2-3分 × 15）

---

### 5. Claude Code: 統合・記事生成

**実行方法**:
1. Claude Codeを開く
2. 以下のコマンドを実行:
   ```
   /generate-articles 2026-02-05
   ```
   または
   ```
   data/supergrok-trends/2026-02-05/ のすべてのJSONファイルを読み込んで、
   15本の記事を data/articles/2026-02/ に生成してください。
   ```

**出力**:
```
data/articles/2026-02/
├── 2026-02-05-kimi-k2-5-release.md
├── 2026-02-05-kling-ai-3-0-release.md
└── ... (×15)
```

**所要時間**: 約5-10分

---

## 各ステージの品質基準

### Stage 1: トレンド抽出
- ✅ 15本のトレンド（Critical 3, High 3, Medium 3, Low 6）
- ✅ 各トレンドに`keyPoints`（重要ポイント3個以上）
- ✅ `technicalKeywords`（技術キーワード3個以上）
- ✅ エンゲージメント順にソート

### Stage 2: 技術的詳細
- ✅ `specifications`: 最低3個、できれば5-7個の詳細スペック
- ✅ すべての数値に単位・比較対象を明記
- ✅ `useCases`: 具体的なシナリオ・所要時間・効果を記載

### Stage 3: コミュニティの反応
- ✅ `topComments`: 最低5件、できれば10件
- ✅ `discussions`: 主要な議論テーマ2-4個
- ✅ `practicalQuestions`: 実務的な質問2-3個

### Stage 4: エンジニアへの影響
- ✅ `immediateActions`: 具体的で実行可能なアクション（所要時間明記）
- ✅ `longTermConsiderations`: 段階的な計画（Phase分け、リスク・軽減策）
- ✅ `impactByRole`: 職種別の影響分析

---

## トラブルシューティング

### Q1. SuperGrokが情報を十分に返さない

**原因**: プロンプトの日付が未来になっている

**対策**:
```
検索日: 2026-02-05（未来日の場合は前日まで）
```
を明記し、必要に応じて前日のデータを検索

### Q2. JSON形式が崩れている

**原因**: SuperGrokが余計なコメントを含めている

**対策**:
プロンプトに以下を明記:
```
【出力形式】
- JSON形式のみ
- コメント不要
```

### Q3. 所要時間が長すぎる（2時間以上）

**原因**: すべてのトレンドを同じ深さで処理している

**対策**:
- Critical/High記事（計6本）: 詳細に（1トレンド5-7分）
- Medium記事（3本）: 中程度に（1トレンド3-4分）
- Low記事（6本）: 簡潔に（1トレンド1-2分）

### Q4. 記事品質が8.5/10に到達しない

**原因**: Stage 2-4の情報が薄い

**対策**:
- Stage 2の`specifications`を5個以上に増やす
- Stage 3の`topComments`を10件に増やす
- Stage 4の`immediateActions`に所要時間・難易度を必ず記載

---

## 総所要時間

- **Stage 1**: 5-10分
- **Stage 2**: 30-45分（効率化すれば20-30分）
- **Stage 3**: 30-45分（効率化すれば20-30分）
- **Stage 4**: 30-45分（効率化すれば20-30分）
- **Claude Code統合**: 5-10分

**合計**: 約1.5-2時間（効率化すれば1-1.5時間）

---

## 期待される記事品質

### 従来の1回プロンプト方式
- 情報密度: **2.5-3/10**
- 各セクションの文字数: 50-100文字
- 技術的詳細: ほぼなし
- コミュニティの反応: リンクのみ
- エンジニアへの影響: 抽象的

### 新しい4段階プロンプト方式
- 情報密度: **8.5-9.0/10**
- 各セクションの文字数: 200-500文字
- 技術的詳細: 具体的な数値・スペック5-7個
- コミュニティの反応: 実際のコメント5-10件
- エンジニアへの影響: 具体的なアクション（所要時間明記）

---

## フィードバック

プロンプトの改善提案・質問は、以下に記録してください:
- GitHub Issue
- プロジェクトのドキュメント

---

**作成日**: 2026-02-05
**最終更新**: 2026-02-05
