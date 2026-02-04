import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  excerpt?: string;
  content: string;
  engagement?: number;
  sources?: string[];
  publishedAt: Date;
  featured?: boolean;
}

const articlesDirectory = path.join(process.cwd(), 'data/articles');

/**
 * 全記事を取得（日付順）
 * 年月フォルダ構造に対応（例: 2026-02/2026-02-05-article.md）
 */
export function getAllArticles(): Article[] {
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const articles: Article[] = [];

  // 年月フォルダを取得（例: 2026-01, 2026-02）
  const yearMonthFolders = fs.readdirSync(articlesDirectory)
    .filter(name => {
      const fullPath = path.join(articlesDirectory, name);
      return fs.statSync(fullPath).isDirectory() && /^\d{4}-\d{2}$/.test(name);
    });

  // 各年月フォルダ内の記事を読み込み
  for (const folder of yearMonthFolders) {
    const folderPath = path.join(articlesDirectory, folder);
    const fileNames = fs.readdirSync(folderPath)
      .filter(fileName => fileName.endsWith('.md'));

    for (const fileName of fileNames) {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(folderPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matterでfront matterをパース
      const { data, content } = matter(fileContents);

      articles.push({
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Tech',
        priority: data.priority || 'medium',
        tags: data.tags || [],
        excerpt: data.excerpt || content.substring(0, 150) + '...',
        content,
        engagement: data.engagement,
        sources: data.sources,
        publishedAt: new Date(data.date || Date.now()),
        featured: data.featured || false,
      } as Article);
    }
  }

  // 日付順にソート
  return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

/**
 * 最新記事を取得
 */
export function getLatestArticles(limit: number = 20): Article[] {
  const articles = getAllArticles();
  return articles.slice(0, limit);
}

/**
 * スラッグから記事を取得
 * 年月フォルダ構造に対応（例: 2026-02/2026-02-05-article.md）
 */
export function getArticleBySlug(slug: string): Article | null {
  // 全記事から検索
  const articles = getAllArticles();
  return articles.find(article => article.slug === slug) || null;
}

/**
 * カテゴリ別に記事を取得
 */
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter(article => article.category === category);
}

/**
 * 注目記事を取得
 */
export function getFeaturedArticles(): Article[] {
  const articles = getAllArticles();
  return articles.filter(article => article.featured);
}
