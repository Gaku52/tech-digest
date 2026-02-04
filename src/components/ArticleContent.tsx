'use client';

import { useMemo } from 'react';

interface ArticleSection {
  type: 'heading2' | 'heading3' | 'paragraph' | 'list' | 'code' | 'blockquote';
  content: string;
  items?: string[];
  level?: number;
  section?: string; // 概要、詳細、技術的詳細など
}

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const sections = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <Section key={index} section={section} index={index} />
      ))}
    </div>
  );
}

function Section({ section, index }: { section: ArticleSection; index: number }) {
  const { type, content: text, items, section: sectionName } = section;

  // 概要セクション
  if (sectionName === '概要') {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500 rounded-r-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📋</span>
          <span>概要</span>
        </h2>
        <div className="text-lg leading-relaxed text-slate-300 space-y-4">
          {text.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    );
  }

  // 技術的詳細セクション
  if (sectionName === '技術的詳細') {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⚙️</span>
          <span>技術的詳細</span>
        </h3>
        <div className="prose prose-invert prose-lg max-w-none">
          {renderContent(text)}
        </div>
      </div>
    );
  }

  // コミュニティの反応セクション
  if (sectionName === 'コミュニティの反応') {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>💬</span>
          <span>コミュニティの反応</span>
        </h3>
        <div className="text-slate-300 leading-relaxed space-y-4">
          {text.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    );
  }

  // エンジニアへの影響セクション
  if (sectionName === 'エンジニアへの影響') {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎯</span>
          <span>エンジニアへの影響</span>
        </h2>
        <div className="space-y-6">
          {renderEngineerImpact(text)}
        </div>
      </div>
    );
  }

  // 注目のコメントセクション
  if (sectionName === '注目のコメント') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⭐</span>
          <span>注目のコメント</span>
        </h2>
        <div className="space-y-4">
          {renderComments(text)}
        </div>
      </div>
    );
  }

  // 参考リンクセクション
  if (sectionName === '参考リンク') {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔗</span>
          <span>参考リンク</span>
        </h2>
        <div className="space-y-2">
          {renderLinks(text)}
        </div>
      </div>
    );
  }

  // 詳細セクション
  if (sectionName === '詳細') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📊</span>
          <span>詳細</span>
        </h2>
        <div className="space-y-6">
          {renderDetailSection(text)}
        </div>
      </div>
    );
  }

  // デフォルト - 見出し
  if (type === 'heading2') {
    return <h2 className="text-2xl font-bold text-white mb-4">{text}</h2>;
  }

  if (type === 'heading3') {
    return <h3 className="text-xl font-bold text-white mb-3 mt-6">{text}</h3>;
  }

  // 段落
  if (type === 'paragraph') {
    return <p className="text-slate-300 leading-relaxed mb-4">{text}</p>;
  }

  // リスト
  if (type === 'list' && items) {
    return (
      <ul className="space-y-2 mb-4">
        {items.map((item, i) => (
          <li key={i} className="text-slate-300 flex items-start gap-3">
            <span className="text-blue-400 mt-1">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

// Markdownをパース
function parseMarkdown(markdown: string): ArticleSection[] {
  const lines = markdown.split('\n');
  const sections: ArticleSection[] = [];
  let currentSection: string | null = null;
  let buffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ## 見出し (h2)
    if (line.startsWith('## ')) {
      // バッファをフラッシュ
      if (buffer.length > 0) {
        sections.push({
          type: 'paragraph',
          content: buffer.join('\n'),
          section: currentSection || undefined,
        });
        buffer = [];
      }

      const heading = line.replace(/^## /, '').trim();
      currentSection = heading;
      continue;
    }

    // ### 見出し (h3)
    if (line.startsWith('### ')) {
      // バッファをフラッシュ
      if (buffer.length > 0) {
        sections.push({
          type: 'paragraph',
          content: buffer.join('\n'),
          section: currentSection || undefined,
        });
        buffer = [];
      }

      const heading = line.replace(/^### /, '').trim();
      sections.push({
        type: 'heading3',
        content: heading,
        section: currentSection || undefined,
      });
      continue;
    }

    // テキスト行
    if (line.trim()) {
      buffer.push(line);
    } else if (buffer.length > 0) {
      // 空行で段落終了
      sections.push({
        type: 'paragraph',
        content: buffer.join('\n'),
        section: currentSection || undefined,
      });
      buffer = [];
    }
  }

  // 最後のバッファをフラッシュ
  if (buffer.length > 0) {
    sections.push({
      type: 'paragraph',
      content: buffer.join('\n'),
      section: currentSection || undefined,
    });
  }

  // セクションごとにグループ化
  const grouped: ArticleSection[] = [];
  let currentGroup: { section: string; content: string } | null = null;

  for (const sec of sections) {
    if (sec.type === 'paragraph' && sec.section) {
      if (!currentGroup || currentGroup.section !== sec.section) {
        if (currentGroup) {
          grouped.push({
            type: 'paragraph',
            content: currentGroup.content,
            section: currentGroup.section,
          });
        }
        currentGroup = { section: sec.section, content: sec.content };
      } else {
        currentGroup.content += '\n\n' + sec.content;
      }
    } else if (sec.type === 'heading3') {
      if (currentGroup) {
        grouped.push({
          type: 'paragraph',
          content: currentGroup.content,
          section: currentGroup.section,
        });
        currentGroup = null;
      }
      grouped.push(sec);
    }
  }

  if (currentGroup) {
    grouped.push({
      type: 'paragraph',
      content: currentGroup.content,
      section: currentGroup.section,
    });
  }

  return grouped;
}

// コンテンツをレンダリング
function renderContent(text: string) {
  return text.split('\n\n').map((para, i) => {
    // コードブロック
    if (para.startsWith('```')) {
      const code = para.replace(/```[a-z]*\n?/g, '').trim();
      return (
        <div key={i} className="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4">
          <pre className="text-sm text-green-400 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // リスト
    if (para.startsWith('- ')) {
      const items = para.split('\n').filter(l => l.startsWith('- ')).map(l => l.replace(/^- /, ''));
      return (
        <ul key={i} className="space-y-2 mb-4">
          {items.map((item, j) => (
            <li key={j} className="text-slate-300 flex items-start gap-3">
              <span className="text-blue-400 mt-1">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p key={i} className="mb-4">{para}</p>;
  });
}

// エンジニアへの影響をレンダリング
function renderEngineerImpact(text: string) {
  const sections = text.split(/\*\*(.*?)\*\*/g);
  const parts: React.ReactElement[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (section === '今すぐ対応すべきこと:' || section === '中長期的に考えるべきこと:') {
      const nextSection = sections[i + 1];
      const items = nextSection?.split('\n').filter(l => l.trim().startsWith('- ')).map(l => l.trim().replace(/^- /, '')) || [];

      parts.push(
        <div key={i} className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>{section === '今すぐ対応すべきこと:' ? '⚡' : '🎯'}</span>
            <span>{section}</span>
          </h3>
          <div className="grid gap-3">
            {items.map((item, j) => (
              <div key={j} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-blue-500/50 transition">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span className="text-slate-300">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      i++; // Skip next section
    }
  }

  return parts;
}

// コメントをレンダリング
function renderComments(text: string) {
  const comments = text.split('\n\n').filter(c => c.startsWith('>'));

  return comments.map((comment, i) => {
    const match = comment.match(/> 「(.+?)」 - (@\w+) \((.+?)\)/);
    if (!match) return null;

    const [, quote, author, engagement] = match;

    return (
      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition">
        <blockquote className="text-slate-300 mb-3 italic">
          「{quote}」
        </blockquote>
        <div className="flex items-center justify-between">
          <span className="text-blue-400 font-medium">{author}</span>
          <span className="text-sm text-slate-400">{engagement}</span>
        </div>
      </div>
    );
  }).filter(Boolean);
}

// リンクをレンダリング
function renderLinks(text: string) {
  const links = text.split('\n').filter(l => l.trim().startsWith('- '));

  return links.map((link, i) => {
    const match = link.match(/- \[(.+?)\]\((.+?)\)(.*)/);
    if (!match) return null;

    const [, emoji, url, description] = match;

    return (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 hover:bg-slate-800 transition group"
      >
        <span className="text-2xl">{emoji.split(' ')[0]}</span>
        <div className="flex-1">
          <div className="text-blue-400 group-hover:text-blue-300 font-medium">
            {emoji.replace(/^.+? /, '')}
          </div>
          {description && (
            <div className="text-xs text-slate-500">{description.trim()}</div>
          )}
        </div>
        <span className="text-slate-500 group-hover:text-slate-400">→</span>
      </a>
    );
  }).filter(Boolean);
}

// 詳細セクションをレンダリング
function renderDetailSection(text: string) {
  const subsections = text.split(/### /g).filter(Boolean);

  return subsections.map((subsection, i) => {
    const [title, ...contentLines] = subsection.split('\n');
    const content = contentLines.join('\n').trim();

    // 内容セクション（箇条書き）
    if (title === '内容') {
      const items = content.split('\n').filter(l => l.trim().startsWith('- ')).map(l => l.trim().replace(/^- /, ''));

      return (
        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {items.map((item, j) => (
              <div key={j} className="bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-slate-300 text-sm">
                <span className="text-blue-400 mr-2">▸</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 背景セクション
    return (
      <div key={i} className="mb-6">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-300 leading-relaxed">{content}</p>
      </div>
    );
  });
}
