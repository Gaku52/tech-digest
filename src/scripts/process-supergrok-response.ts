#!/usr/bin/env node

/**
 * SuperGrok Response Processor
 *
 * SuperGrokからの応答を受け取り、記事として処理・保存します
 *
 * Usage:
 *   # インタラクティブモード
 *   npm run process-response
 *
 *   # ファイルから読み込み
 *   npm run process-response -- --file ./supergrok-response.md
 *
 *   # 標準入力から読み込み
 *   cat response.md | npm run process-response
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface Article {
  title: string;
  date: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  engagement?: number;
  sources?: string[];
  content: string;
  metadata?: Record<string, any>;
}

interface ProcessorOptions {
  file?: string;
  output?: string;
  interactive?: boolean;
}

/**
 * Markdownのfront matterをパース
 */
function parseFrontMatter(markdown: string): { metadata: Record<string, any>; content: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontMatterRegex);

  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const [, frontMatterStr, content] = match;
  const metadata: Record<string, any> = {};

  frontMatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      // 配列形式の値を処理
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key] = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim());
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content };
}

/**
 * SuperGrokの応答を複数の記事に分割
 */
function splitIntoArticles(markdown: string): Article[] {
  const articles: Article[] = [];

  // まずfront matterで分割された記事を探す
  const articlePattern = /---\s*\ntitle:/g;
  const matches = [...markdown.matchAll(articlePattern)];

  if (matches.length === 0) {
    console.log('⚠️  front matterが見つかりません。全体を1つの記事として処理します。');
    return [
      {
        title: 'Tech Digest Daily Summary',
        date: new Date().toISOString().split('T')[0],
        category: 'General',
        priority: 'high',
        tags: [],
        content: markdown,
      },
    ];
  }

  // 各記事を抽出
  for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index!;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : markdown.length;
    const articleMarkdown = markdown.substring(startIndex, endIndex).trim();

    const { metadata, content } = parseFrontMatter(articleMarkdown);

    articles.push({
      title: metadata.title || 'Untitled',
      date: metadata.date || new Date().toISOString().split('T')[0],
      category: metadata.category || 'General',
      priority: metadata.priority || 'medium',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      engagement: metadata.engagement ? parseInt(metadata.engagement) : undefined,
      sources: metadata.sources,
      content: content.trim(),
      metadata,
    });
  }

  return articles;
}

/**
 * 記事をファイルに保存
 */
function saveArticle(article: Article, outputDir: string): string {
  const date = article.date;
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const filename = `${date}-${slug}.md`;
  const filepath = path.join(outputDir, filename);

  // Front matterを再構築
  const frontMatter = [
    '---',
    `title: "${article.title}"`,
    `date: ${article.date}`,
    `category: ${article.category}`,
    `priority: ${article.priority}`,
    `tags: [${article.tags.join(', ')}]`,
  ];

  if (article.engagement) {
    frontMatter.push(`engagement: ${article.engagement}`);
  }

  if (article.sources && article.sources.length > 0) {
    frontMatter.push(`sources: [${article.sources.join(', ')}]`);
  }

  frontMatter.push('---\n');

  const fullContent = frontMatter.join('\n') + '\n' + article.content;

  fs.writeFileSync(filepath, fullContent, 'utf-8');
  return filepath;
}

/**
 * インタラクティブモードで入力を受け取る
 */
async function readInteractiveInput(): Promise<string> {
  console.log('📝 SuperGrokからの応答を貼り付けてください:');
  console.log('   (入力完了後、新しい行で "EOF" と入力してください)\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const lines: string[] = [];

  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line.trim() === 'EOF') {
        rl.close();
        resolve(lines.join('\n'));
      } else {
        lines.push(line);
      }
    });
  });
}

/**
 * 標準入力から読み込み
 */
async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const options: ProcessorOptions = {};

  // 引数をパース
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      options.file = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--interactive' || args[i] === '-i') {
      options.interactive = true;
    }
  }

  // 入力を読み込み
  let input: string;

  if (options.file) {
    // ファイルから読み込み
    if (!fs.existsSync(options.file)) {
      console.error(`❌ ファイルが見つかりません: ${options.file}`);
      process.exit(1);
    }
    input = fs.readFileSync(options.file, 'utf-8');
    console.log(`✅ ファイルから読み込みました: ${options.file}`);
  } else if (options.interactive || process.stdin.isTTY) {
    // インタラクティブモード
    input = await readInteractiveInput();
  } else {
    // 標準入力から読み込み
    input = await readStdin();
  }

  if (!input.trim()) {
    console.error('❌ 入力が空です');
    process.exit(1);
  }

  // 記事に分割
  console.log('\n📊 SuperGrok応答を処理中...\n');
  const articles = splitIntoArticles(input);
  console.log(`✅ ${articles.length}件の記事を検出しました\n`);

  // 出力ディレクトリ
  const outputDir = options.output || path.join(process.cwd(), 'data/articles');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 記事を保存
  const savedFiles: string[] = [];

  for (const article of articles) {
    const filepath = saveArticle(article, outputDir);
    savedFiles.push(filepath);

    console.log(`✅ 保存: ${path.basename(filepath)}`);
    console.log(`   タイトル: ${article.title}`);
    console.log(`   カテゴリ: ${article.category}`);
    console.log(`   優先度: ${article.priority}`);
    console.log(`   タグ: ${article.tags.join(', ') || 'なし'}`);
    console.log('');
  }

  // サマリー
  console.log('='.repeat(80));
  console.log('📊 処理完了サマリー');
  console.log('='.repeat(80));
  console.log(`総記事数: ${articles.length}`);
  console.log(`保存先: ${outputDir}`);
  console.log('');

  console.log('優先度別内訳:');
  const priorityCounts = articles.reduce(
    (acc, a) => {
      acc[a.priority] = (acc[a.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  Object.entries(priorityCounts).forEach(([priority, count]) => {
    const emoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }[priority] || '⚪';
    console.log(`  ${emoji} ${priority}: ${count}件`);
  });

  console.log('');
  console.log('💡 次のステップ:');
  console.log('1. 記事の内容を確認');
  console.log('2. 必要に応じて編集');
  console.log('3. データベースにインポート (npm run import-articles)');
  console.log('');
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
