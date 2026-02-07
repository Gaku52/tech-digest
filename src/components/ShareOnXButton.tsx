'use client';

interface ShareOnXButtonProps {
  title: string;
  slug: string;
  tags: string[];
}

export default function ShareOnXButton({ title, slug, tags }: ShareOnXButtonProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tech-digest.vercel.app';
  const articleUrl = `${baseUrl}/articles/${slug}`;

  // ツイート本文を作成
  const hashtags = tags.slice(0, 3).join(','); // 最初の3つのタグをハッシュタグに
  const text = `${title}\n\n#TechDigest #テックニュース`;

  // X投稿URLを生成
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}&hashtags=${encodeURIComponent(hashtags)}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <span>Xでシェア</span>
    </a>
  );
}
