'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

// 型定義 (Prismaのスキーマに合わせて調整)
type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  priority: string;
  tags: string[];
  publishedAt: Date;
  engagement: number | null;
};

const categoryStyles = {
  AI: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  Frontend: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  Backend: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  DevOps: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  Tools: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  Default: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
};

export default function ArticleCard({ article, index }: { article: Article; index: number }) {
  const isCritical = article.priority === 'critical';
  const categoryStyle = categoryStyles[article.category as keyof typeof categoryStyles] || categoryStyles.Default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/articles/${article.slug}`} className="group block h-full">
        <article
          className={clsx(
            "relative h-full p-6 rounded-2xl border transition-all duration-300 overflow-hidden",
            "bg-slate-900/40 backdrop-blur-md border-white/5",
            "hover:border-white/10 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-blue-900/20",
            "group-hover:-translate-y-1"
          )}
        >
          {/* Critical時のグローエフェクト */}
          {isCritical && (
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-pulse-slow" />
          )}

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className={clsx("px-3 py-1 rounded-full text-xs font-medium border", categoryStyle)}>
              {article.category}
            </span>

            {isCritical && (
              <span className="flex items-center gap-1 text-red-400 text-xs font-medium px-2 py-1 rounded bg-red-950/30 border border-red-500/20">
                <AlertCircle className="w-3 h-3" />
                <span>Critical</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>

          <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {article.excerpt || "No description available."}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-slate-500 px-2 py-1 rounded bg-slate-950 border border-white/5">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </span>
              {article.engagement && (
                <span className="flex items-center gap-1.5 text-blue-400/80">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {article.engagement.toLocaleString()}
                </span>
              )}
            </div>

            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
