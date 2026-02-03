import { PrismaClient } from '@prisma/client';
import HeroSection from '@/components/HeroSection';
import ArticleCard from '@/components/ArticleCard';
import { Newspaper } from 'lucide-react';

const prisma = new PrismaClient();

// データ取得はServer Componentで行う
async function getLatestArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });
  return articles;
}

export default async function HomePage() {
  const articles = await getLatestArticles();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header - スクロールでブラーがかかるスティッキーヘッダー */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Tech Digest
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Trends</a>
            <a href="#" className="hover:text-white transition-colors">Categories</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a
              href="https://github.com/Gaku52/tech-digest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 py-20" id="articles">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 border-b border-white/5 pb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Latest Insights
              </h2>
              <p className="text-gray-400">
                AIが厳選した、今日のエンジニアリングトレンド
              </p>
            </div>

            {/* 簡易フィルター (UIのみ) */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {['All', 'AI', 'Frontend', 'Backend', 'DevOps'].map((filter, i) => (
                <button
                  key={filter}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    i === 0
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white border border-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <Newspaper className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">まだ記事がありません</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                コマンドを実行して、SuperGrokに最新トレンドを分析させましょう。
              </p>
              <code className="px-4 py-3 bg-slate-950 border border-white/10 rounded-lg text-sm font-mono text-blue-400 shadow-xl">
                npm run genprompt
              </code>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Tech Digest</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                X (旧Twitter) の膨大なエンジニアリング議論をAIが分析。
                ノイズを取り除き、本当に価値のある技術トレンドだけをお届けします。
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contributing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Powered By</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://x.com/i/grok" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    SuperGrok
                  </a>
                </li>
                <li>
                  <a href="https://claude.ai" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                    Claude Code
                  </a>
                </li>
                <li>Vercel SDK</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Tech Digest. All rights reserved.</p>
            <p>Designed with AI & Passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
