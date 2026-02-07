import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // 科学的に目に優しい配色
        background: "#0a0e1a", // 純黒ではなく、わずかに青みがかったダークブルーグレー
        surface: "#131825",    // カード背景 - コントラストを適度に
        surfaceLight: "#1a2030", // 明るいサーフェス
        primary: {
          DEFAULT: "#5b8def", // より明るく、視認性の高いブルー
          foreground: "#ffffff",
        },
        accent: {
          purple: "#9d7bea",
          cyan: "#22d3ee",
          emerald: "#34d399",
        },
        text: {
          primary: "#f1f5f9",    // メイン本文 - WCAG AAA対応
          secondary: "#cbd5e1",  // サブテキスト
          tertiary: "#94a3b8",   // メタ情報
        }
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient": "gradient 8s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundSize: {
        "gradient": "200% 200%",
      },
    },
  },
  plugins: [],
};
export default config;
