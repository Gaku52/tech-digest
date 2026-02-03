'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Github, Rss } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* 背景の光彩エフェクト (Spotlight) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 translate-y-20" />

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Powered Tech Analysis</span>
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-white">Discover the Future of</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-gradient animate-gradient">
            Engineering Trends
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          SuperGrokが数千の技術議論を分析。
          <br className="hidden md:block" />
          今、エンジニアが注目すべきトピックだけを厳選してお届けします。
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* メインCTAボタン: Shimmer Effect */}
          <button
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
            className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-auto"
          >
            <span className="absolute inset-[-1000%] animate-[shimmer_2s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors group-hover:bg-slate-900">
              最新記事を読む
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <div className="flex gap-3 w-full sm:w-auto justify-center">
            <a
              href="https://github.com/Gaku52/tech-digest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white text-sm font-medium flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
