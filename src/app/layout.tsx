import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tech Digest - 最新技術トレンドを毎日お届け',
  description: 'SuperGrokが分析した最新のAI・エンジニアリングトレンドを、分かりやすく配信する技術情報メディア',
  keywords: ['Tech', 'AI', 'Engineering', 'Trends', 'SuperGrok', 'GPT', 'Claude', 'Next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
