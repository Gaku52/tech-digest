#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

/**
 * Tech Digest - Article Generator
 *
 * Stage 1-4のJSONファイルを統合して、15本の記事を生成する
 *
 * Usage:
 *   npm run generate-articles 2026-02-05
 */

interface Stage1Trend {
  id: string;
  title: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  excerpt: string;
  engagement: number;
  sources: string[];
  keyPoints: string[];
  technicalKeywords: string[];
}

interface Stage1Output {
  date: string;
  trends: Stage1Trend[];
}

interface Stage2Specification {
  aspect: string;
  detail: string;
}

interface Stage2Benchmark {
  name: string;
  score: string;
  comparison: string;
}

interface Stage2UseCase {
  scenario: string;
  benefit: string;
  example: string;
}

interface Stage2Output {
  trendId: string;
  background: {
    context: string;
    previousState: string;
    motivation: string;
  };
  technicalDetails: {
    architecture: string;
    specifications: Stage2Specification[];
    implementation: {
      technology: string;
      deployment: string;
      limitations: string;
    };
  };
  benchmarks: Stage2Benchmark[];
  useCases: Stage2UseCase[];
  additionalSources: string[];
}

interface Stage3Comment {
  author: string;
  authorProfile: string;
  quote: string;
  originalQuote: string;
  engagement: number;
  url: string;
  category: string;
  insight: string;
}

interface Stage3Discussion {
  theme: string;
  summary: string;
  participantCount: number;
  keyTakeaways: string[];
}

interface Stage3Output {
  trendId: string;
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
    summary: string;
  };
  topComments: Stage3Comment[];
  discussions: Stage3Discussion[];
  competitorComparisons: Array<{
    competitor: string;
    comparisonPoint: string;
    communityView: string;
  }>;
  practicalQuestions: Array<{
    question: string;
    answers: string[];
  }>;
}

interface Stage4ImmediateAction {
  action: string;
  reason: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'high' | 'medium' | 'low';
  targetAudience: string[];
  prerequisites: string[];
  expectedOutcome: string;
}

interface Stage4LongTermConsideration {
  consideration: string;
  timeline: string;
  reason: string;
  steps: string[];
  risks: string[];
  mitigations: string[];
}

interface Stage4Output {
  trendId: string;
  immediateActions: Stage4ImmediateAction[];
  longTermConsiderations: Stage4LongTermConsideration[];
  impactByRole: Array<{
    role: string;
    impact: 'high' | 'medium' | 'low';
    keyChanges: string[];
    actionPriority: 'immediate' | 'medium-term' | 'long-term';
  }>;
  industryTrends: {
    currentPosition: string;
    futureOutlook: string;
    recommendedStrategy: string;
  };
}

/**
 * Stage 1-4のJSONファイルを読み込む
 */
function loadStageData(date: string) {
  const baseDir = path.join(process.cwd(), 'data/supergrok-trends', date);

  // Stage 1
  const stage1Path = path.join(baseDir, 'stage1-trends.json');
  if (!fs.existsSync(stage1Path)) {
    throw new Error(`Stage 1 data not found: ${stage1Path}`);
  }
  const stage1: Stage1Output = JSON.parse(fs.readFileSync(stage1Path, 'utf8'));

  // Stage 2-4
  const stage2Dir = path.join(baseDir, 'stage2-technical');
  const stage3Dir = path.join(baseDir, 'stage3-community');
  const stage4Dir = path.join(baseDir, 'stage4-impact');

  const stage2Data: Record<string, Stage2Output> = {};
  const stage3Data: Record<string, Stage3Output> = {};
  const stage4Data: Record<string, Stage4Output> = {};

  for (const trend of stage1.trends) {
    const stage2Path = path.join(stage2Dir, `${trend.id}.json`);
    const stage3Path = path.join(stage3Dir, `${trend.id}.json`);
    const stage4Path = path.join(stage4Dir, `${trend.id}.json`);

    if (fs.existsSync(stage2Path)) {
      stage2Data[trend.id] = JSON.parse(fs.readFileSync(stage2Path, 'utf8'));
    }
    if (fs.existsSync(stage3Path)) {
      stage3Data[trend.id] = JSON.parse(fs.readFileSync(stage3Path, 'utf8'));
    }
    if (fs.existsSync(stage4Path)) {
      stage4Data[trend.id] = JSON.parse(fs.readFileSync(stage4Path, 'utf8'));
    }
  }

  return { stage1, stage2Data, stage3Data, stage4Data };
}

/**
 * 記事のMarkdownを生成
 */
function generateArticleMarkdown(
  trend: Stage1Trend,
  stage2: Stage2Output | undefined,
  stage3: Stage3Output | undefined,
  stage4: Stage4Output | undefined,
  date: string
): string {
  const slug = `${date}-${trend.id}`;

  let markdown = `---
title: "${trend.title}"
date: ${date}
category: "${trend.category}"
priority: "${trend.priority}"
tags: ${JSON.stringify(trend.tags)}
engagement: ${trend.engagement}
sources: ${JSON.stringify(trend.sources)}
excerpt: "${trend.excerpt}"
---

# ${trend.title}

## 概要

${trend.excerpt}

${trend.keyPoints.map(point => `- ${point}`).join('\n')}

`;

  // 詳細セクション
  if (stage2) {
    markdown += `## 詳細

### 背景

${stage2.background.context}

${stage2.background.previousState}

${stage2.background.motivation}

### 内容

${stage2.technicalDetails.specifications.map(spec =>
  `- **${spec.aspect}**: ${spec.detail}`
).join('\n')}

`;

    // 技術的詳細
    markdown += `## 技術的詳細

### アーキテクチャ

${stage2.technicalDetails.architecture}

### 実装

- **使用技術**: ${stage2.technicalDetails.implementation.technology}
- **デプロイ方法**: ${stage2.technicalDetails.implementation.deployment}
- **制約事項**: ${stage2.technicalDetails.implementation.limitations}

`;

    // ベンチマーク
    if (stage2.benchmarks.length > 0) {
      markdown += `### ベンチマーク

${stage2.benchmarks.map(bench =>
  `- **${bench.name}**: ${bench.score} (${bench.comparison})`
).join('\n')}

`;
    }

    // ユースケース
    if (stage2.useCases.length > 0) {
      markdown += `### ユースケース

${stage2.useCases.map(uc =>
  `**${uc.scenario}**

${uc.benefit}

例: ${uc.example}
`
).join('\n')}

`;
    }
  }

  // コミュニティの反応
  if (stage3) {
    markdown += `## コミュニティの反応

${stage3.overallSentiment.summary}

`;

    // 注目のコメント
    if (stage3.topComments.length > 0) {
      markdown += `## 注目のコメント

${stage3.topComments.map(comment =>
  `> 「${comment.quote}」 - ${comment.author} (${comment.engagement.toLocaleString()}エンゲージメント)

${comment.insight}
`
).join('\n')}

`;
    }

    // 議論
    if (stage3.discussions.length > 0) {
      markdown += `### 主要な議論

${stage3.discussions.map(disc =>
  `**${disc.theme}** (参加者: ${disc.participantCount}人)

${disc.summary}

${disc.keyTakeaways.map(tk => `- ${tk}`).join('\n')}
`
).join('\n')}

`;
    }
  }

  // エンジニアへの影響
  if (stage4) {
    markdown += `## エンジニアへの影響

**今すぐ対応すべきこと:**

${stage4.immediateActions.map(action =>
  `- ${action.action} (所要時間: ${action.estimatedTime}, 難易度: ${action.difficulty}, 影響度: ${action.impact})
  - 理由: ${action.reason}
  - 対象: ${action.targetAudience.join(', ')}
  - 期待される成果: ${action.expectedOutcome}`
).join('\n\n')}

**中長期的に考えるべきこと:**

${stage4.longTermConsiderations.map(cons =>
  `- ${cons.consideration} (${cons.timeline})
  - 理由: ${cons.reason}
  - ステップ:
${cons.steps.map(step => `    - ${step}`).join('\n')}
  - リスク:
${cons.risks.map(risk => `    - ${risk}`).join('\n')}
  - 軽減策:
${cons.mitigations.map(mit => `    - ${mit}`).join('\n')}`
).join('\n\n')}

`;

    // 職種別の影響
    if (stage4.impactByRole.length > 0) {
      markdown += `### 職種別の影響

${stage4.impactByRole.map(role =>
  `**${role.role}** (影響度: ${role.impact}, 優先度: ${role.actionPriority})

${role.keyChanges.map(change => `- ${change}`).join('\n')}
`
).join('\n')}

`;
    }
  }

  // 参考リンク
  markdown += `## 参考リンク

${trend.sources.map((source, i) => `- [🔗 ${i === 0 ? '元投稿' : `関連リンク${i}`}](${source})`).join('\n')}
`;

  if (stage2 && stage2.additionalSources.length > 0) {
    markdown += `\n${stage2.additionalSources.map((source, i) => `- [📚 追加資料${i + 1}](${source})`).join('\n')}\n`;
  }

  return markdown;
}

/**
 * メイン処理
 */
async function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: npm run generate-articles YYYY-MM-DD');
    process.exit(1);
  }

  console.log(`📋 Loading data for ${date}...`);
  const { stage1, stage2Data, stage3Data, stage4Data } = loadStageData(date);

  console.log(`✅ Found ${stage1.trends.length} trends`);
  console.log(`   - Stage 2: ${Object.keys(stage2Data).length} files`);
  console.log(`   - Stage 3: ${Object.keys(stage3Data).length} files`);
  console.log(`   - Stage 4: ${Object.keys(stage4Data).length} files`);

  // 出力ディレクトリを作成
  const yearMonth = date.substring(0, 7); // "2026-02"
  const outputDir = path.join(process.cwd(), 'data/articles', yearMonth);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`\n📝 Generating articles...`);

  for (const trend of stage1.trends) {
    const stage2 = stage2Data[trend.id];
    const stage3 = stage3Data[trend.id];
    const stage4 = stage4Data[trend.id];

    const markdown = generateArticleMarkdown(trend, stage2, stage3, stage4, date);
    const filename = `${date}-${trend.id}.md`;
    const outputPath = path.join(outputDir, filename);

    fs.writeFileSync(outputPath, markdown, 'utf8');
    console.log(`   ✓ ${filename} (${trend.priority})`);
  }

  console.log(`\n✅ Generated ${stage1.trends.length} articles in ${outputDir}`);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
