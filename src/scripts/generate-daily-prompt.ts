#!/usr/bin/env node

/**
 * Daily Grok Prompt Generator
 *
 * Usage:
 *   npm run generate-prompt
 *   npm run generate-prompt -- --date 2025-01-20
 *   npm run generate-prompt -- --output ./output.md
 */

import * as fs from 'fs';
import * as path from 'path';

interface GeneratorOptions {
  date?: string;
  output?: string;
  copy?: boolean;
}

/**
 * 日付をフォーマット
 */
function formatDate(date: Date): { display: string; utc: string } {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return {
    display: `${year}-${month}-${day}`,
    utc: `${year}-${month}-${day}`,
  };
}

/**
 * テンプレートから日付プレースホルダーを置換
 */
function generatePrompt(template: string, date: Date): string {
  const { display, utc } = formatDate(date);

  return template
    .replace(/\{\{DATE\}\}/g, display)
    .replace(/\{\{DATE_UTC\}\}/g, utc);
}

/**
 * プロンプトを生成してファイルに保存
 */
function savePrompt(prompt: string, outputPath: string): void {
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, prompt, 'utf-8');
  console.log(`✅ プロンプトを保存しました: ${outputPath}`);
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const options: GeneratorOptions = {};

  // 引数をパース
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      options.date = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--copy') {
      options.copy = true;
    }
  }

  // 日付を決定
  const targetDate = options.date ? new Date(options.date) : new Date();

  // テンプレートを読み込み
  const templatePath = path.join(process.cwd(), 'data/supergrok-trends/template.md');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ テンプレートファイルが見つかりません:', templatePath);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // プロンプトを生成
  const prompt = generatePrompt(template, targetDate);

  // 出力
  const { display } = formatDate(targetDate);
  const defaultOutputPath = path.join(
    process.cwd(),
    'data/supergrok-trends',
    `${display}-prompt.md`
  );
  const outputPath = options.output || defaultOutputPath;

  // ファイルに保存
  savePrompt(prompt, outputPath);

  // コンソールに出力
  console.log('\n' + '='.repeat(80));
  console.log('📋 生成されたプロンプト:');
  console.log('='.repeat(80) + '\n');
  console.log(prompt);
  console.log('\n' + '='.repeat(80));

  // クリップボードにコピー（オプション）
  if (options.copy) {
    try {
      // pbcopy (macOS) または clip (Windows) を使用
      const clipCmd = process.platform === 'darwin' ? 'pbcopy' : 'clip';
      const { execSync } = require('child_process');
      execSync(clipCmd, { input: prompt });
      console.log('✅ クリップボードにコピーしました');
    } catch (error) {
      console.log('⚠️  クリップボードへのコピーに失敗しました');
    }
  }

  console.log('\n💡 次のステップ:');
  console.log('1. 上記のプロンプトをコピーして Grok (X Premium+) に投稿');
  console.log('2. Grok からの応答を保存');
  console.log(`3. data/supergrok-trends/${display}.md として保存\n`);
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
