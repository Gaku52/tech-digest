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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition">
            <span>←</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Tech Digest
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Article Header */}
        <article className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                {article.category}
              </span>
              <PriorityBadge priority={article.priority} />
              <time className="text-slate-400 text-sm">
                {new Date(article.publishedAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {article.engagement && (
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  💬 {article.engagement.toLocaleString()} エンゲージメント
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-slate-300 mb-8 leading-relaxed border-l-4 border-blue-500 pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-700 mb-8"></div>

            {/* Article Content */}
            <ArticleContent content={article.content} />

            {/* Sources */}
            {article.sources && article.sources.length > 0 && (
              <div className="mt-12 p-6 bg-slate-900 border border-slate-700 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">📎 参考リンク</h3>
                <ul className="space-y-2">
                  {article.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-2"
                      >
                        <span>🔗</span>
                        <span className="break-all">{source}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition font-medium"
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
    critical: { emoji: '🔴', label: 'Critical', color: 'bg-red-500/20 text-red-400' },
    high: { emoji: '🟠', label: 'High', color: 'bg-orange-500/20 text-orange-400' },
    medium: { emoji: '🟡', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
    low: { emoji: '🟢', label: 'Low', color: 'bg-green-500/20 text-green-400' },
  }[priority] || { emoji: '⚪', label: priority, color: 'bg-slate-500/20 text-slate-400' };

  return (
    <span className={`px-3 py-1 ${config.color} rounded-full text-sm font-medium`}>
      {config.emoji} {config.label}
    </span>
  );
}

