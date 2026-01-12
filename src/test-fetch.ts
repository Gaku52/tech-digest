#!/usr/bin/env node
/**
 * テスト用スクリプト: データ取得の動作確認
 * 実行方法: npx ts-node src/test-fetch.ts
 */

import { scheduler } from './lib/scheduler/daily-fetch';

async function main() {
  console.log('='.repeat(60));
  console.log('Tech Digest - Test Fetch');
  console.log('='.repeat(60));
  console.log('');

  try {
    const trends = await scheduler.runOnce((results) => {
      console.log('');
      console.log('='.repeat(60));
      console.log('トップ10トレンド:');
      console.log('='.repeat(60));
      console.log('');

      results.slice(0, 10).forEach((trend, index) => {
        console.log(`${index + 1}. [${trend.source}] ${trend.title}`);
        console.log(`   URL: ${trend.url}`);
        console.log(`   スコア: ${trend.keywords_score} | Score: ${trend.score}`);
        console.log('');
      });
    });

    console.log('='.repeat(60));
    console.log(`合計: ${trends.length}件のトレンドを検出`);
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

main();
