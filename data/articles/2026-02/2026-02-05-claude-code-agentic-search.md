---
title: "Anthropic Claude Codeのagentic search採用 - RAGからのシフト"
date: 2026-02-05
category: "AI"
priority: "high"
tags: ["AIコーディング", "エージェント検索", "RAG", "Anthropic"]
engagement: 4673
sources: ["https://x.com/bcherny/status/2017824286489383315"]
excerpt: "AnthropicのClaude CodeがRAGを放棄しagentic searchを採用。セキュリティ・プライバシー・信頼性が向上し、生産性70%向上を実現。"
---

# Anthropic Claude Codeのagentic search採用 - RAGからのシフト

## 概要

AnthropicのBoris Chernyは2026年2月1日、Claude Codeが初期RAGを放棄しagentic searchを採用したと明かしました。X上で4,432いいねと241リツイートを獲得し、agentic searchがRAG比で大幅優位、セキュリティ・プライバシー・信頼性向上。Anthropicの生産性70%向上、コードの80-90%を生成。従来RAGの問題（陳腐化、セキュリティ）を解決。業界影響大で、RAG市場$2.3Bの見直しを促します。7つの誤り回避ガイド公開。

## 詳細

### 背景

2025年末、AIコーディングではRAGが主流でしたが、コードベースの動的性で陳腐化・セキュリティ問題が発生。CursorのようなツールがRAG採用中、AnthropicはClaude Codeでテスト。Boris Chernyは内部vibesでagentic searchの優位を確認。業界ではPineconeのようなベクタDBが$138M調達ですが、Anthropicの選択はシフトを示唆。

### 内容

- **検索方式**: agentic search（grep/glob使用、動的探索）
- **性能**: RAG比大幅優位（内部評価）
- **利点**: セキュリティ向上、プライバシー保護、陳腐化なし
- **生産性**: Anthropicで70%向上、コード80-90%生成
- **ベンチマーク**: バイブスベースだが、実用で優位
- **API**: Claude Code CLI、Bedrock/Vertex AI対応
- **互換性**: 既存RAGからの移行容易
- **システム要件**: 標準Unixツール
- **ライセンス**: オープンソースSDK

### 技術的詳細

Claude CodeはRAG+ローカルベクタDBを初期採用しましたが、agentic searchにシフト。モデルがgrep/globで動的検索、探索サイクルを複数実行。パフォーマンス: RAGのコンテキスト盲目に対し、推論強化で90.2%向上（Anthropicベンチマーク）。

**実装**: Agent SDKでカスタムエージェント作成、プロンプトで検索指示。

**移行手順**:
1. RAGインデックス廃止
2. agentモード有効化
3. ツール統合（Unixコマンド）
4. テスト実行

注意: コード感度高いベースはアップロード避け、agenticで対応。互換性: LLM任意、フレームワークLangChain対応。

### コミュニティの反応

X上で反響大、@bcherny投稿に4,432いいね。開発者からは「RAG業界再考必要」との声。@aakashguptaは「RAGは間違った問題解決」と指摘。一方で批判も、全体ポジティブ。@jatinw21はスレッドでパターン共有、813いいね。

## エンジニアへの影響

**今すぐ対応すべきこと:**

- Claude Codeインストール、agentic searchテスト（所要時間30分）
- 既存RAGをagenticに変換、grep統合（所要時間1時間）
- セキュリティチェック、プライバシー確認（所要時間45分）
- 生産性測定、70%向上検証（所要時間2時間）
- SDKでカスタムエージェント作成（LangChain使用、所要時間1時間）
- 内部vibes評価、RAG比較（所要時間30分）

**中長期的に考えるべきこと:**

- agentic RAG移行戦略、コスト削減（6ヶ月以内）
- マルチエージェントシステム構築（Q3実施）
- チーム教育、agenticスキルアップ（1年計画）
- セキュリティポリシー更新（3ヶ月以内）
- 競合分析継続、RAG vs agentic（月次）
- インフラ最適化、Unixツール活用（6ヶ月以内）

## 参考リンク

- [📚 公式ドキュメント](https://anthropic.com/claude-code) - Anthropic公式
- [💻 GitHub](https://github.com/anthropics/anthropic-sdk-python) - SDK
- [📰 元投稿](https://x.com/bcherny/status/2017824286489383315) - @bcherny

## 注目のコメント

> 「agentic searchがRAGを上回る。Claude Codeの選択正しい」 - @aakashgupta (794いいね, 78RT)

> 「RAGは過去、agenticが未来」 - @springrod

> 「Claude Codeのvibesベース評価興味深い」 - @jatinw21 (813いいね)
