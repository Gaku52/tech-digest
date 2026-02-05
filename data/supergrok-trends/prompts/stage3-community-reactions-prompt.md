# 💬 Stage 3: コミュニティの反応プロンプト

## 目的
Stage 1で抽出したトレンドに対するコミュニティ（X上のエンジニア）の反応・議論を収集する。

## 前提条件
- Stage 1の`stage1-trends.json`が完成していること
- 各トレンドの`sources`（元ツイート）を使用

## 実行指示

```
あなたは日本語コミュニティリサーチャーです。以下のトレンドに対するX上のエンジニアの反応を収集してください。

【重要】
- すべての出力は**日本語**で記載してください
- 英語のコメントは日本語に翻訳してください（quoteフィールド）
- 英語原文はoriginalQuoteフィールドに保持してください
- 議論の要約・洞察もすべて日本語で記載
- 固有名詞（製品名、企業名）は原語のまま使用してください

【入力情報】
{Stage 1のトレンド1件分のJSONを貼り付け}

【調査方法】
1. 元ツイート（sources）のリプライを確認
2. 元ツイートの引用リツイートを確認
3. technicalKeywordsで関連する議論を検索
4. エンゲージメントが高いコメント（いいね50+）を優先的に収集
5. すべてのコメント・議論を日本語に翻訳

【出力要件】
以下のJSON形式で、コミュニティの反応を出力してください:

```json
{
  "trendId": "trend-001",
  "overallSentiment": {
    "positive": 75,
    "neutral": 20,
    "negative": 5,
    "summary": "全体的に前向きな反応が多く、特にマルチモーダル対応とAgent Swarm機能に期待の声が集中。一部でAPI料金への懸念も。"
  },
  "topComments": [
    {
      "author": "@username",
      "authorProfile": "AI研究者 | Google Brain出身",
      "quote": "コメントの全文（日本語に翻訳）",
      "originalQuote": "Original comment in English",
      "engagement": 1523,
      "url": "https://x.com/username/status/123456789",
      "category": "technical-insight | use-case | concern | comparison",
      "insight": "このコメントが示唆する重要なポイント（50-100文字）"
    },
    {
      "author": "@another_user",
      "authorProfile": "Senior SWE @ Microsoft",
      "quote": "SWE-bench 76.8%は驚異的。これでコードレビューの自動化が現実的になる。ただし、セキュリティ監査には人間の目がまだ必要だと思う。",
      "originalQuote": "76.8% on SWE-bench is insane. This makes automated code review actually viable. Though I still think security audits need human eyes.",
      "engagement": 892,
      "url": "https://x.com/another_user/status/987654321",
      "category": "use-case",
      "insight": "実務への適用可能性を示唆しつつ、限界も認識している現実的な評価"
    }
  ],
  "discussions": [
    {
      "theme": "マルチモーダル対応の実用性",
      "summary": "UI/UXデバッグでの活用可能性について活発な議論。デザイナーとエンジニアの協業が変わる可能性が指摘されている。",
      "participantCount": 47,
      "keyTakeaways": [
        "Figmaとの統合が実現すれば、デザイン→実装のギャップを大幅削減可能",
        "視覚的バグ検出の精度が鍵、現状では誤検知が課題",
        "アクセシビリティチェックへの応用に期待の声"
      ]
    },
    {
      "theme": "Agent Swarmのパフォーマンス",
      "summary": "100並行エージェントの実運用での挙動について懐疑的な意見も。コスト対効果の検証が必要との声。",
      "participantCount": 32,
      "keyTakeaways": [
        "4.5倍高速化は理想的条件下、実環境では2-3倍程度では？",
        "API制限・コスト増加への懸念",
        "複雑なタスク分解が難しいケースでの有効性に疑問"
      ]
    }
  ],
  "competitorComparisons": [
    {
      "competitor": "Claude 4.5 Opus",
      "comparisonPoint": "SWE-bench Verified",
      "communityView": "Kimi K2.5の76.8%に対し、Claudeの73.1%。差は小さいが、コスト面でKimiが有利との見方が多い。"
    },
    {
      "competitor": "GPT-4 Turbo",
      "comparisonPoint": "マルチモーダル処理",
      "communityView": "GPT-4Vと比較して、動画理解の精度が高いとの評価。VideoMMMU 86.6%は現時点で最高水準。"
    }
  ],
  "practicalQuestions": [
    {
      "question": "既存のClaude統合をKimiに移行する価値はあるか？",
      "answers": [
        "コスト削減が主目的ならYes。性能はほぼ同等",
        "動画処理が必要ならKimi一択",
        "エコシステムの成熟度ではClaudeが上、移行コストを考慮すべき"
      ]
    },
    {
      "question": "プロダクション環境での安定性は？",
      "answers": [
        "まだリリース直後、数週間は様子見が賢明との意見多数",
        "APIレート制限の詳細が不明確",
        "エンタープライズSLAの情報待ち"
      ]
    }
  ]
}
```

【重要な注意事項】
1. **topComments**: 最低5件、できれば10件収集
   - エンゲージメント順に並べる
   - 技術的洞察・実用例・懸念点のバランスを取る
   - 著名なエンジニア・研究者のコメントを優先

2. **discussions**: 主要な議論テーマ2-4個を抽出
   - 単なる賞賛ではなく、**建設的な議論**を選ぶ
   - keyTakeawaysは具体的な行動指針・懸念事項を記載

3. **competitorComparisons**: 主要競合2-3個との比較
   - コミュニティの**実際の声**に基づく比較
   - 単なる数値比較ではなく、実務での選択基準を示す

4. **practicalQuestions**: エンジニアが実際に悩む実務的質問2-3個
   - 「使うべきか？」「いつ移行すべきか？」など
   - 多様な視点の回答を収集

5. **翻訳の正確性**: 英語コメントは正確に翻訳し、originalQuoteも保持

【出力形式】
- JSON形式のみ
- コメント不要
- すべてのフィールドを埋める（該当情報がない場合は空配列 `[]` を使用）
```

## 実行方法

Stage 1で抽出した15本のトレンドについて、**1本ずつ**このプロンプトをSuperGrokに投げてください。

Critical/High記事（計6本）は特に詳細に、Medium/Lowは簡潔に。

## 出力ファイル名

`data/supergrok-trends/YYYY-MM-DD/stage3-community/trend-XXX.json`

例:
- `data/supergrok-trends/2026-02-05/stage3-community/trend-001.json`
- `data/supergrok-trends/2026-02-05/stage3-community/trend-002.json`
- ...

## 次のステージへの引き継ぎ

これらのJSONファイルを使って、Stage 4でエンジニアへの影響を分析します。
