'use client';

import { useState } from 'react';

interface FloatingShareButtonProps {
  title: string;
  slug: string;
  tags: string[];
}

export default function FloatingShareButton({ title, slug, tags }: FloatingShareButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tech-digest.vercel.app';
  const articleUrl = `${baseUrl}/articles/${slug}`;

  const hashtags = tags.slice(0, 3).join(',');
  const text = `${title}\n\n#TechDigest #テックニュース`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}&hashtags=${encodeURIComponent(hashtags)}`;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-[#1DA1F2]/50 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>

        {/* ホバー時にテキスト表示 */}
        <span
          className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          この記事をシェア
        </span>
      </a>

      {/* ツールチップ（非ホバー時） */}
      {!isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Xでシェア
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
}
