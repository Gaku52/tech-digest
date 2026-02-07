import HeroSection from '@/components/HeroSection';
import ArticleList from '@/components/ArticleList';
import { Newspaper } from 'lucide-react';
import { getLatestArticles } from '@/lib/articles';

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
          <ArticleList articles={articles} />
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
