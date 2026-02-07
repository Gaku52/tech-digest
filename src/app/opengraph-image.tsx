import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tech Digest - AI技術トレンドメディア';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e1a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a2030 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a2030 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            📰
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          Tech Digest
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#cbd5e1',
            marginBottom: 60,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          Xの技術トレンドをAIが分析・キュレーション
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 16,
          }}
        >
          {['AI', 'Blockchain', 'Engineering', 'Infrastructure'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(91, 141, 239, 0.2)',
                border: '2px solid rgba(91, 141, 239, 0.3)',
                borderRadius: 12,
                color: '#5b8def',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 18,
            color: '#64748b',
          }}
        >
          <span>Powered by</span>
          <span style={{ fontWeight: 700, color: '#5b8def' }}>SuperGrok</span>
          <span>×</span>
          <span style={{ fontWeight: 700, color: '#8b5cf6' }}>Claude Code</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
