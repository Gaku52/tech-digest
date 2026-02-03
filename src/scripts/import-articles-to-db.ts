#!/usr/bin/env node

/**
 * Import Articles to Database
 *
 * data/articles/ 内のMarkdownファイルをデータベースにインポートします
 *
 * Usage:
 *   npm run import-articles
 *   npm run import-articles -- --dir ./custom-articles
 *   npm run import-articles -- --file ./specific-article.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ArticleData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  priority: string;
  tags: string[];
  engagement?: number;
  sources?: string[];
  publishedAt?: Date;
  featured?: boolean;
  slug: string;
}

interface ImportOptions {
  dir?: string;
  file?: string;
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
      let value = line.substring(colonIndex + 1).trim();

      // クォートを削除
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // 配列形式の値を処理
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key] = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^["']|["']$/g, ''));
      } else if (!isNaN(Number(value))) {
        // 数値に変換
        metadata[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        // 真偽値に変換
        metadata[key] = value === 'true';
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content };
}

/**
 * タイトルからスラッグを生成
 */
function generateSlug(title: string, date: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  return `${date}-${slug}`;
}

/**
 * Markdownから最初の段落を抽出して抜粋を作成
 */
function extractExcerpt(content: string, maxLength = 200): string {
  // 見出しやコードブロックを除去
  const cleaned = content
    .replace(/^#{1,6}\s+.*$/gm, '') // 見出しを削除
    .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
    .replace(/`[^`]+`/g, '') // インラインコードを削除
    .trim();

  // 最初の段落を取得
  const firstParagraph = cleaned.split('\n\n')[0] || cleaned;

  // 指定された長さに切り詰める
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + '...';
}

/**
 * Markdownファイルを読み込んでArticleDataに変換
 */
function parseArticleFile(filepath: string): ArticleData | null {
  try {
    const markdown = fs.readFileSync(filepath, 'utf-8');
    const { metadata, content } = parseFrontMatter(markdown);

    if (!metadata.title || !content.trim()) {
      console.warn(`⚠️  スキップ: ${filepath} (タイトルまたは本文が空)`);
      return null;
    }

    const date = metadata.date || new Date().toISOString().split('T')[0];
    const slug = generateSlug(metadata.title, date);
    const excerpt = metadata.excerpt || extractExcerpt(content);

    return {
      title: metadata.title,
      content: content.trim(),
      excerpt,
      category: metadata.category || 'General',
      priority: metadata.priority || 'medium',
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      engagement: metadata.engagement,
      sources: Array.isArray(metadata.sources) ? metadata.sources : [],
      publishedAt: new Date(date),
      featured: metadata.featured || false,
      slug,
    };
  } catch (error) {
    console.error(`❌ エラー: ${filepath}`, error);
    return null;
  }
}

/**
 * 記事をデータベースに保存
 */
async function saveArticle(articleData: ArticleData): Promise<boolean> {
  try {
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        category: articleData.category,
        priority: articleData.priority,
        tags: articleData.tags,
        engagement: articleData.engagement,
        sources: articleData.sources,
        publishedAt: articleData.publishedAt,
        featured: articleData.featured,
      },
      create: articleData,
    });

    return true;
  } catch (error) {
    console.error(`❌ データベースエラー:`, error);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const options: ImportOptions = {};

  // 引数をパース
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      options.dir = args[i + 1];
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      options.file = args[i + 1];
      i++;
    }
  }

  console.log('📦 記事のインポートを開始します...\n');

  let files: string[] = [];

  if (options.file) {
    // 単一ファイル
    if (!fs.existsSync(options.file)) {
      console.error(`❌ ファイルが見つかりません: ${options.file}`);
      process.exit(1);
    }
    files = [options.file];
  } else {
    // ディレクトリ内のすべてのMarkdownファイル
    const dir = options.dir || path.join(process.cwd(), 'data/articles');

    if (!fs.existsSync(dir)) {
      console.error(`❌ ディレクトリが見つかりません: ${dir}`);
      process.exit(1);
    }

    files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.join(dir, file));
  }

  if (files.length === 0) {
    console.log('⚠️  インポートする記事が見つかりませんでした');
    return;
  }

  console.log(`📄 ${files.length}件のファイルを検出しました\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const filepath of files) {
    const articleData = parseArticleFile(filepath);

    if (!articleData) {
      skipCount++;
      continue;
    }

    console.log(`📝 インポート中: ${articleData.title}`);
    const success = await saveArticle(articleData);

    if (success) {
      console.log(`   ✅ 成功 (slug: ${articleData.slug})`);
      successCount++;
    } else {
      console.log(`   ❌ 失敗`);
      errorCount++;
    }
  }

  // サマリー
  console.log('');
  console.log('='.repeat(80));
  console.log('📊 インポート完了');
  console.log('='.repeat(80));
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`⚠️  スキップ: ${skipCount}件`);
  console.log(`❌ エラー: ${errorCount}件`);
  console.log('');

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('❌ 予期しないエラーが発生しました:', error);
  await prisma.$disconnect();
  process.exit(1);
});
