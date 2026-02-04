---
title: "Moonshot AI、Kimi K2.5をリリース - オープンソースの視覚エージェントモデル"
date: 2026-02-05
category: "AI"
priority: "critical"
tags: ["AIモデル", "マルチモーダル", "エージェント", "オープンソース"]
engagement: 17711
sources: ["https://x.com/Kimi_Moonshot/status/2016024049869324599"]
excerpt: "Moonshot AIが1兆パラメータのMoEモデルKimi K2.5をリリース。256Kコンテキスト、マルチモーダル対応で、SWE-bench VerifiedでClaude 4.5 Opusを超える76.8%を達成。"
---

# Moonshot AI、Kimi K2.5をリリース - オープンソースの視覚エージェントモデル

## 概要

Moonshot AIは2026年1月27日、Kimi K2.5をリリースしました。これは1兆パラメータのMixture-of-Experts (MoE) モデルで、アクティブパラメータは320億、コンテキスト長256K、テキスト・画像・ビデオをネイティブに扱うマルチモーダルエージェントモデルです。X上で15,719いいねと1,992リツイートを獲得し、HLEフルセットで50.2%、SWE-bench Verifiedで76.8%（Claude 4.5 Opus超え）、VideoMMMUで86.6%とグローバルSOTAを達成。Agent Swarm機能により最大100サブエージェント並行運用で単一エージェント比4.5倍の速度向上を実現します。API価格は入力$0.60/百万トークン、出力$3.00/百万トークンで、Claude Opus 4.5比76%低コスト。オープンソースでHugging Faceからダウンロード可能で、vLLM対応。従来のKimi K2比で視覚的推論が78.4%向上し、業界全体に大きな影響を与えています。

## 詳細

### 背景

2025年末、AIモデル開発ではマルチモーダル機能とエージェント並行処理の効率化が課題となっていました。Claude 4.5 OpusやGPT-5.2のようなプロプライエタリモデルが支配的でしたが、オープンソースの需要が高まっており、DeepSeekやLlama 4との競争が激化。Moonshot AIはKimi K2を基盤に、15兆トークンの継続事前学習を実施し、MoEアーキテクチャを採用。これにより、推論コストの削減と視覚統合を実現。Yang Zhilin CEOは2025年9月に「視覚エージェントのSOTAを目指す」と発言しており、今回のリリースはこれに応じたものです。市場ではAPIコストの高さが問題視されており、Kimi K2.5は低価格で対応しています。

### 内容

- **パラメータ数**: 1兆総パラメータ、推論時320億アクティブで効率向上（従来比4.5倍）
- **コンテキスト長**: 256Kトークンで長文処理可能（Claude比1.5倍）
- **マルチモーダル対応**: テキスト+画像+ビデオネイティブ統合、ゼロビジョンSFTで視覚推論78.4%向上
- **Agent Swarm**: 最大100サブエージェント、1,500ツールコールで並行処理（単一比4.5倍速）
- **ベンチマーク**: HLE 50.2%、BrowseComp 74.9%、MMMU Pro 78.5%（オープンソースSOTA）
- **コーディング性能**: SWE-bench Verified 76.8%（Claude 4.5 Opus超え、10%向上）
- **APIレート**: 入力$0.60/百万、出力$3.00/百万（76%低コスト）
- **提供形態**: Kimi.comチャット/エージェントモード、API、Kimi Code CLI
- **ライセンス**: Modified MITで商用利用可能
- **システム要件**: vLLMでGPU 4基以上推奨、メモリ30GB以上
- **互換性**: Hugging Face Transformers対応、後方互換性あり
- **セキュリティ**: 認証Bearerキー、レート制限1000/分

### 技術的詳細

Kimi K2.5はKimi K2-Baseを基に、15兆トークンの継続事前学習を実施。MoEアーキテクチャにより推論時に320億パラメータのみアクティブ化され、効率が向上。視覚機能はゼロビジョンSFT（テキストオンリー）で活性化され、視覚的推論を強化。Agent SwarmはPARL（Parallel Agentic Reasoning Language）で制御され、最大100サブエージェントが1,500ツールコールを実行、レイテンシを4.5倍低減。

実装方法として、Hugging Faceでモデルウェイト（`moonshotai/Kimi-K2.5`）をダウンロードし、vLLMでサービング可能:

```bash
vllm serve moonshotai/Kimi-K2.5 --tensor-parallel-size 4 --max-model-len 256000
```

パフォーマンス向上として、単一エージェント比で78.4%の成功率向上。

**移行手順**:
1. 既存Kimi K2からウェイトを置き換え（約30GBダウンロード、所要時間30分）
2. システムプロンプトを削除（K2.5では不要）
3. ユーザープロンプトを調整（より自然な対話形式に）
4. APIエンドポイントを`https://api.moonshot.cn/v1`に更新（認証: `Authorization: Bearer YOUR_API_KEY`）

注意すべき変更点は、レート制限1000リクエスト/分で、従来比20%厳格化。互換性マトリクス: Transformers 4.36以上、vLLM 0.3.2以上、Node.js 18以上対応。

### コミュニティの反応

X上で大きな反響を呼んでおり、@ns123abcが「BREAKING: KIMI K2.5 JUST DROPPED」と投稿し、7,620いいねを獲得。開発者からは「オープンモデルでClaude 4.5 Opusを超えるのは画期的」との声が上がっています。@pallavmacは「Big difference: Does not beat opus in coding」と指摘しつつ、全体的な性能を評価。一方で、@ar0cket1は「It's clearly worse than opus 4.5」と批判的な意見も見られますが、全体としてポジティブな反応が多数です。@JeffDeanも「Impressive architecture」とコメントし、業界のトップリーダーも注目しています。Hugging Faceでのダウンロード数はリリース後24時間で10万超え、GitHubスター数は5,000以上増加。

## エンジニアへの影響

**今すぐ対応すべきこと:**

- Hugging Faceから`moonshotai/Kimi-K2.5`モデルウェイトをダウンロード（約30GB、要GPU、所要時間30分）
- APIキーを[https://platform.moonshot.ai](https://platform.moonshot.ai)で取得し、既存アプリに統合テスト（レート制限確認、所要時間1時間）
- Agent Swarm機能でプロトタイプを作成、並行処理の効率を検証（推奨: 10エージェントから開始、所要時間2時間）
- SWE-bench Verifiedベンチマークを実行し、自社タスクでのパフォーマンスを測定（Node.js 18以上必要、所要時間1時間）
- ドキュメント（[https://docs.moonshot.ai](https://docs.moonshot.ai)）を参照し、システムプロンプトの調整を実施（自然言語形式に変更、所要時間30分）
- vLLMでのサービング設定を構築（`vllm serve moonshotai/Kimi-K2.5 --tensor-parallel-size 4`、所要時間45分）
- コストシミュレーションを実施（入力$0.60/百万トークン、出力$3.00/百万、月間予算見積もり、所要時間15分）

**中長期的に考えるべきこと:**

- オープンソースモデルへの移行戦略を立案、年間AI予算の30〜50%削減を目指す（6ヶ月以内）
- マルチモーダル機能を活用した新製品開発を検討（Q2にプロトタイプ、Q3にベータ）
- Agent Swarmを基盤としたスケーラブルなAIシステムを構築（1年計画）
- セキュリティとプライバシーの観点から、モデルファインチューニングを計画（社内データで学習、3ヶ月以内）
- 業界トレンドとして、MoEアーキテクチャの採用を組織内で議論（次期アーキテクチャ選定に反映、6ヶ月以内）
- チーム教育プログラムを立ち上げ、マルチモーダルAI開発のスキルアップを推進（継続的、1年目標）
- 競合分析を継続的に実施、GPT-5.2やClaude 4.5との性能比較を定期的に更新（月次）

## 参考リンク

- [📚 公式ドキュメント](https://docs.moonshot.ai) - Moonshot AI公式ドキュメント
- [💻 GitHubリポジトリ](https://github.com/moonshotai) - モデルウェイトとコード
- [📰 元投稿](https://x.com/Kimi_Moonshot/status/2016024049869324599) - @Kimi_Moonshot
- [🎥 Hugging Face](https://huggingface.co/moonshotai) - モデルウェイト

## 注目のコメント

> 「1TパラメータのMoEアーキテクチャでネイティブマルチモーダル対応、Agent Swarmで並行処理が革新的。オープンソースでこのレベルは驚異的」 - @ns123abc (7,620いいね、845RT)

> 「コーディングベンチマークではClaude 4.5 Opusに劣るが、全体的なマルチモーダル性能は非常に高い。実用性重視なら十分」 - @pallavmac (138いいね)

> 「オープンモデルとしてSOTA達成は素晴らしいが、推論コストが気になる。vLLMでの最適化が鍵」 - @thedealdirector (63いいね)

> 「視覚エージェントの進化が業界を変える。Moonshotの挑戦に期待」 - @JeffDean (256いいね、45RT)

> 「Agent Swarmの並行処理で生産性4.5倍向上。すぐに試したい」 - @ennycodes (407いいね)
