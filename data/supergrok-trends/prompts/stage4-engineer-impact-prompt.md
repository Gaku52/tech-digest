# 🎯 Stage 4: エンジニアへの影響分析プロンプト

## 目的
Stage 1-3で収集した情報を基に、エンジニアが「今すぐ対応すべきこと」「中長期的に考えるべきこと」を具体的に分析する。

## 前提条件
- Stage 1-3のJSONファイルが完成していること
- 技術的詳細、コミュニティの反応を踏まえた実践的分析

## 実行指示

```
あなたは日本語技術コンサルタントです。以下のトレンドについて、エンジニアへの影響を分析してください。

【重要】
- すべての出力は**日本語**で記載してください
- アクション項目、理由、期待される成果はすべて日本語で記載
- 技術用語は適切に日本語化してください
- 固有名詞（製品名、企業名）は原語のまま使用してください

【入力情報】
{Stage 1-3の該当トレンドのJSONを貼り付け}

【分析方針】
1. Stage 2の技術的詳細から「何ができるようになったか」を抽出
2. Stage 3のコミュニティ反応から「実務での懸念・期待」を把握
3. エンジニアの立場で「今すぐやるべきこと」「中長期的に考えるべきこと」を具体化
4. すべての分析結果を日本語で出力

【出力要件】
以下のJSON形式で、エンジニアへの影響を出力してください:

```json
{
  "trendId": "trend-001",
  "immediateActions": [
    {
      "action": "Kimi K2.5のAPIキーを取得し、既存のClaude統合と性能比較",
      "reason": "SWE-bench 76.8%はClaude 4.5 Opusを上回り、コスト削減の可能性",
      "estimatedTime": "2-3時間（APIキー取得30分、統合実装1時間、比較テスト1-1.5時間）",
      "difficulty": "easy | medium | hard",
      "impact": "high | medium | low",
      "targetAudience": ["バックエンドエンジニア", "DevOpsエンジニア"],
      "prerequisites": [
        "既存のLLM API統合経験",
        "パフォーマンステストの基礎知識"
      ],
      "expectedOutcome": "月間API費用を30-40%削減可能、かつコード品質は同等以上を維持"
    },
    {
      "action": "マルチモーダルデバッグのPoCを実施",
      "reason": "UI/UXバグの視覚的検出により、デザイナーとのコミュニケーションコストを削減",
      "estimatedTime": "4-6時間（環境構築2時間、テストケース作成2-3時間、評価1時間）",
      "difficulty": "medium",
      "impact": "medium",
      "targetAudience": ["フロントエンドエンジニア", "QAエンジニア"],
      "prerequisites": [
        "画像処理APIの基礎知識",
        "UI/UXテストの経験"
      ],
      "expectedOutcome": "視覚的バグ検出率60-70%達成、手動QA工数を20-30%削減"
    }
  ],
  "longTermConsiderations": [
    {
      "consideration": "Agent Swarmを活用した大規模リファクタリング戦略の検討",
      "timeline": "3-6ヶ月",
      "reason": "100並行エージェントによる4.5倍高速化は、レガシーコードの段階的移行に有効",
      "steps": [
        "Phase 1 (1ヶ月): 小規模モジュール（1-2万行）で検証",
        "Phase 2 (2ヶ月): 中規模サービス（5-10万行）に適用",
        "Phase 3 (3ヶ月): 全社的なリファクタリング計画策定"
      ],
      "risks": [
        "APIコストが予想を上回る可能性（月間$5,000-$10,000規模）",
        "自動生成コードの品質保証プロセスが未確立",
        "エンタープライズSLAの詳細が不明"
      ],
      "mitigations": [
        "まずは非クリティカルなモジュールで試験運用",
        "人間によるコードレビュー体制の強化",
        "段階的なロールアウトでコスト監視"
      ]
    },
    {
      "consideration": "チーム内のLLM活用スキルの底上げ",
      "timeline": "6-12ヶ月",
      "reason": "マルチモーダルAIの実用化により、エンジニアに求められるスキルセットが変化",
      "steps": [
        "Phase 1: LLM API活用の社内勉強会（月1回、3ヶ月）",
        "Phase 2: プロンプトエンジニアリングのベストプラクティス策定（3ヶ月）",
        "Phase 3: プロダクション環境での運用ガイドライン作成（6ヶ月）"
      ],
      "risks": [
        "学習コストの確保が難しい",
        "チーム間でのスキル格差が拡大"
      ],
      "mitigations": [
        "業務時間の10-15%を学習に充当",
        "成功事例の社内共有会を定期開催"
      ]
    }
  ],
  "impactByRole": [
    {
      "role": "フロントエンドエンジニア",
      "impact": "high",
      "keyChanges": [
        "UI/UXバグの視覚的検出により、デザイナーとの齟齬を早期発見",
        "アクセシビリティチェックの自動化が現実的に",
        "Figma → コード変換の精度向上により、実装時間を30-40%削減"
      ],
      "actionPriority": "immediate"
    },
    {
      "role": "バックエンドエンジニア",
      "impact": "high",
      "keyChanges": [
        "大規模コードベースのリファクタリングが実用レベルに",
        "API設計レビューの自動化",
        "レガシーコードの段階的移行計画を数時間で策定可能"
      ],
      "actionPriority": "immediate"
    },
    {
      "role": "DevOpsエンジニア",
      "impact": "medium",
      "keyChanges": [
        "インフラコードの最適化提案",
        "ログ解析とインシデント対応の効率化",
        "コスト削減のためのLLM API選定が重要タスクに"
      ],
      "actionPriority": "medium-term"
    }
  ],
  "industryTrends": {
    "currentPosition": "Kimi K2.5は現在SOTA、ただしClaude/GPT-4との差は縮小傾向",
    "futureOutlook": "6ヶ月以内にClaude 5やGPT-5が登場する可能性、継続的な評価が必要",
    "recommendedStrategy": "特定ベンダーに依存せず、複数LLMを並行評価できる体制を構築"
  }
}
```

【重要な注意事項】
1. **immediateActions**: 具体的で実行可能なアクション
   - ❌ 悪い例: "新技術をキャッチアップする"
   - ✅ 良い例: "Kimi K2.5のAPIキーを取得し、既存のClaude統合と性能比較（2-3時間）"
   - 必ず所要時間を記載
   - 難易度・影響度を明確化
   - 対象エンジニアを特定

2. **longTermConsiderations**: 段階的な計画
   - タイムライン（3ヶ月、6ヶ月、12ヶ月）を明記
   - Phase分けして、各Phaseの目標を具体化
   - リスクと軽減策を必ず含める

3. **impactByRole**: 職種別の影響分析
   - フロントエンド、バックエンド、DevOps、QA、MLエンジニアなど
   - 各職種で「何が変わるか」を具体的に
   - 行動優先度（immediate, medium-term, long-term）を明記

4. **数値の具体性**: 時間削減率、コスト削減率、精度向上率を必ず記載
   - ❌ 悪い例: "効率化される"
   - ✅ 良い例: "UI/UXテスト工数を20-30%削減"

5. **現実的な評価**: 過度な期待ではなく、コミュニティの懸念も反映
   - Stage 3で収集した「懐疑的な意見」もリスクとして記載

【出力形式】
- JSON形式のみ
- コメント不要
- すべてのフィールドを埋める
```

## 実行方法

Stage 1で抽出した15本のトレンドについて、**1本ずつ**このプロンプトをSuperGrokに投げてください。

Critical/High記事（計6本）は特に詳細に、Medium/Lowは簡潔に。

## 出力ファイル名

`data/supergrok-trends/YYYY-MM-DD/stage4-impact/trend-XXX.json`

例:
- `data/supergrok-trends/2026-02-05/stage4-impact/trend-001.json`
- `data/supergrok-trends/2026-02-05/stage4-impact/trend-002.json`
- ...

## 次のステップ

これらのJSONファイルを、Claude Codeに読み込ませて記事を統合生成します。
