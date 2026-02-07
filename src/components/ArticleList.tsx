'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Newspaper } from 'lucide-react';
import type { Article } from '@/lib/articles';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // すべてのユニークなカテゴリーを取得
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(articles.map(a => a.category)));
    return ['All', ...uniqueCategories.sort()];
  }, [articles]);

  // フィルタリングされた記事
  const filteredArticles = useMemo(() => {
    if (activeFilter === 'All') return articles;
    return articles.filter(article => article.category === activeFilter);
  }, [articles, activeFilter]);

  return (
    <>
      <div className="mb-10 border-b border-white/5 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Latest Insights
            </h2>
            <p className="text-gray-400">
              AIが厳選した、今日のエンジニアリングトレンド
            </p>
          </div>
        </div>

        {/* カテゴリーフィルター - 全幅で折り返し可能 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-lg scale-105'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-white/5 hover:scale-102'
              }`}
            >
              {filter}
              {filter !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({articles.filter(a => a.category === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
            <Newspaper className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {activeFilter === 'All' ? 'まだ記事がありません' : `${activeFilter}の記事がありません`}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            {activeFilter === 'All'
              ? 'コマンドを実行して、SuperGrokに最新トレンドを分析させましょう。'
              : '他のカテゴリーをお試しください。'
            }
          </p>
          {activeFilter === 'All' && (
            <code className="px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-sm font-mono text-blue-400 shadow-xl">
              npm run genprompt
            </code>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            {filteredArticles.length}件の記事
            {activeFilter !== 'All' && ` (カテゴリー: ${activeFilter})`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
