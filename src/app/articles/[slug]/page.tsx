import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import ArticleContent from '@/components/ArticleContent';

interface PageProps {
  params: {
    slug: string;
  };
}

// 静的パスを生成
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Tech Digest`,
    description: article.excerpt || article.title,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await Promise.resolve(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <span className="text-lg">←</span>
            <span className="text-xl font-bold text-white tracking-tight">
              Tech Digest
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Article Header */}
        <article className="bg-surface/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium">
                {article.category}
              </span>
              <PriorityBadge priority={article.priority} />
              <time className="text-text-tertiary text-sm font-medium">
                {new Date(article.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {article.engagement && (
                <span className="text-text-tertiary text-sm flex items-center gap-1.5 font-medium">
                  <span className="text-base">💬</span>
                  {article.engagement.toLocaleString()}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="article-title text-text-primary mb-8">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-[18px] text-text-secondary mb-10 leading-relaxed border-l-4 border-primary pl-6 py-2">
                {article.excerpt}
              </p>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-surfaceLight/80 text-text-tertiary border border-white/5 rounded-lg text-sm font-medium hover:bg-surfaceLight hover:text-text-secondary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/10 mb-12"></div>

            {/* Article Content */}
            <div className="article-content">
              <ArticleContent content={article.content} />
            </div>

            {/* Sources */}
            {article.sources && article.sources.length > 0 && (
              <div className="mt-16 p-6 bg-surfaceLight/60 border border-white/10 rounded-xl">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span>🔗</span>
                  <span>参考リンク</span>
                </h3>
                <ul className="space-y-3">
                  {article.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-2.5 text-[15px] transition-colors group"
                      >
                        <span className="text-lg group-hover:translate-x-0.5 transition-transform">→</span>
                        <span className="break-all underline decoration-primary/30 hover:decoration-primary/60">{source}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 text-primary border border-primary/30 rounded-xl hover:bg-primary/20 hover:border-primary/50 transition-all font-medium"
          >
            <span>←</span>
            <span>ホームに戻る</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    critical: { emoji: '🔴', label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    high: { emoji: '🟠', label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    medium: { emoji: '🟡', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    low: { emoji: '🟢', label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  }[priority] || { emoji: '⚪', label: priority, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };

  return (
    <span className={`px-3 py-1.5 ${config.color} border rounded-lg text-sm font-medium`}>
      {config.emoji} {config.label}
    </span>
  );
}

