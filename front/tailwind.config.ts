import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'sans-serif',
        ],
      },
      colors: {
        primary: 'rgba(56, 202, 156, 1)',
        secondary: 'rgba(56, 202, 156, 0.2)',
        border: 'rgb(238, 238, 238)',
        ring: 'rgba(56, 202, 156, 1)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        ...Object.fromEntries(
          Array.from({ length: 100 }, (_, i) => [
            i + 1,
            `${(i + 1) * 0.25}rem`,
          ]),
        ),
      },
    },
  },
  plugins: [],
};
export default config;
