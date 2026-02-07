import type { Metadata } from 'next';
import { Noto_Sans_JP, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// 日本語記事に最適化されたフォント
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

// コード用のモノスペースフォント
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tech-digest.ogadix.com'),
  title: 'Tech Digest - 最新技術トレンドを厳選配信',
  description: 'SuperGrokが分析した最新のAI・エンジニアリングトレンドを、分かりやすく配信する技術情報メディア',
  keywords: ['Tech', 'AI', 'Engineering', 'Trends', 'SuperGrok', 'GPT', 'Claude', 'Next.js'],
  openGraph: {
    title: 'Tech Digest - 最新技術トレンドを厳選配信',
    description: 'SuperGrokが分析した最新のAI・エンジニアリングトレンドを、分かりやすく配信する技術情報メディア',
    url: 'https://tech-digest.ogadix.com',
    siteName: 'Tech Digest',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Tech Digest - AI技術トレンドメディア',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Digest - 最新技術トレンドを厳選配信',
    description: 'SuperGrokが分析した最新のAI・エンジニアリングトレンドを、分かりやすく配信する技術情報メディア',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
