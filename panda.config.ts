import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],

  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: "'Pretendard', sans-serif" },
          title: { value: "'Cafe24PROUP', 'Paperlogy', 'Pretendard', sans-serif" },
          mono: { value: "'JetBrains Mono', 'Fira Code', monospace" },
        },
        colors: {
          primary: {
            DEFAULT: { value: '#706EEA' },
            light: { value: '#9B99F0' },
            dark: { value: '#4B49C8' },
            muted: { value: '#706EEA33' },
          },
          bg: {
            base: { value: '#0D0D1A' },
            surface: { value: '#13132B' },
            elevated: { value: '#1C1C3A' },
            overlay: { value: '#252550' },
          },
          text: {
            primary: { value: '#F0F0FF' },
            secondary: { value: '#A0A0CC' },
            muted: { value: '#606080' },
            inverse: { value: '#0D0D1A' },
          },
          border: {
            DEFAULT: { value: '#2A2A5A' },
            subtle: { value: '#1E1E40' },
            strong: { value: '#4040AA' },
          },
          hp: {
            player: { value: '#4ADE80' },
            playerDark: { value: '#16A34A' },
            enemy: { value: '#F87171' },
            enemyDark: { value: '#DC2626' },
            heal: { value: '#34D399' },
          },
          question: {
            quick: { value: '#60A5FA' },
            quickBg: { value: '#1E3A5F' },
            copy: { value: '#A78BFA' },
            copyBg: { value: '#2D1B5E' },
            algorithm: { value: '#FBBF24' },
            algorithmBg: { value: '#3D2D00' },
          },
          verdict: {
            correct: { value: '#4ADE80' },
            wrong: { value: '#F87171' },
            timeout: { value: '#FB923C' },
          },
          damage: {
            player: { value: '#F87171' },
            enemy: { value: '#FBBF24' },
            heal: { value: '#4ADE80' },
          },
        },
        radii: {
          sm: { value: '6px' },
          md: { value: '12px' },
          lg: { value: '16px' },
          xl: { value: '24px' },
          full: { value: '9999px' },
        },
        spacing: {
          1: { value: '4px' },
          2: { value: '8px' },
          3: { value: '12px' },
          4: { value: '16px' },
          5: { value: '20px' },
          6: { value: '24px' },
          8: { value: '32px' },
          10: { value: '40px' },
          12: { value: '48px' },
          16: { value: '64px' },
        },
        fontSizes: {
          xs: { value: '11px' },
          sm: { value: '13px' },
          md: { value: '15px' },
          lg: { value: '18px' },
          xl: { value: '22px' },
          '2xl': { value: '28px' },
          '3xl': { value: '36px' },
          '4xl': { value: '48px' },
        },
        fontWeights: {
          regular: { value: '400' },
          medium: { value: '500' },
          bold: { value: '700' },
          black: { value: '900' },
        },
        lineHeights: {
          tight: { value: '1.2' },
          normal: { value: '1.5' },
          loose: { value: '1.8' },
        },
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-40px)' },
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '20%': { opacity: '1', transform: 'scale(1)' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        hpDecrease: {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(var(--hp-ratio))' },
        },
      },
    },
  },

  globalCss: {
    'html, body': {
      backgroundColor: 'bg.base',
      color: 'text.primary',
      fontFamily: 'body',
      margin: '0',
      padding: '0',
    },
    '*': {
      boxSizing: 'border-box',
    },
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-track': {
      background: 'bg.surface',
    },
    '::-webkit-scrollbar-thumb': {
      background: 'border.strong',
      borderRadius: 'full',
    },
  },

  outdir: 'styled-system',
})
