import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/articles';

export const runtime = 'edge';
export const alt = 'Tech Digest Article';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: {
    slug: string;
  };
}

export default async function Image({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    return new ImageResponse(
      <div style={{ fontSize: 40, color: 'white', background: '#0a0e1a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Article Not Found
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0e1a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a2030 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a2030 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: 60,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            📰
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            Tech Digest
          </div>
        </div>

        {/* Category & Priority */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              backgroundColor: 'rgba(91, 141, 239, 0.2)',
              border: '2px solid rgba(91, 141, 239, 0.3)',
              borderRadius: 8,
              color: '#5b8def',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {article.category}
          </div>
          <div
            style={{
              padding: '8px 20px',
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              border: '2px solid rgba(255, 165, 0, 0.3)',
              borderRadius: 8,
              color: '#ffa500',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {article.priority}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: 30,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.title}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div
            style={{
              fontSize: 24,
              color: '#cbd5e1',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: 40,
            }}
          >
            {article.excerpt}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            {article.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  borderRadius: 6,
                  color: '#94a3b8',
                  fontSize: 16,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#64748b',
            }}
          >
            {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
