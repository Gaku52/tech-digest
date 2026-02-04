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
 */
export function getAllArticles(): Article[] {
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);

  const articles = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // gray-matterでfront matterをパース
      const { data, content } = matter(fileContents);

      return {
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
      } as Article;
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return articles;
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
 */
export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Tech',
    priority: data.priority || 'medium',
    tags: data.tags || [],
    excerpt: data.excerpt,
    content,
    engagement: data.engagement,
    sources: data.sources,
    publishedAt: new Date(data.date || Date.now()),
    featured: data.featured || false,
  } as Article;
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
