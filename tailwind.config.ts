import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors from index.css
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        'chart-1': 'var(--color-chart-1)',
        'chart-2': 'var(--color-chart-2)',
        'chart-3': 'var(--color-chart-3)',
        'chart-4': 'var(--color-chart-4)',
        'chart-5': 'var(--color-chart-5)',
        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)',
        'sidebar-primary': 'var(--color-sidebar-primary)',
        'sidebar-primary-foreground': 'var(--color-sidebar-primary-foreground)',
        'sidebar-accent': 'var(--color-sidebar-accent)',
        'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',
        'sidebar-border': 'var(--color-sidebar-border)',
        'sidebar-ring': 'var(--color-sidebar-ring)',
        
        // Additional custom colors
        'page-bg-from': '#F8FAFC',
        'page-bg-to': '#EEF2F7',
        'surface': '#FFFFFF',
        'surface-muted': '#FAFAFB',
        'overlay': 'rgba(17, 24, 39, 0.55)',
        'divider': '#EEF2F7',
        'shadow': 'rgba(16, 24, 40, 0.08)',
        
        // Text colors
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'text-inverse': '#FFFFFF',
        'text-link': '#2563EB',
        'text-link-hover': '#1D4ED8',
        
        // Brand colors
        'brand-primary': '#2563EB',
        'brand-primary-hover': '#1D4ED8',
        'brand-primary-active': '#1E40AF',
        'brand-accent': '#6366F1',
        
        // State colors
        'success': '#16A34A',
        'warning': '#D97706',
        'danger': '#DC2626',
        'focus-ring': '#93C5FD',
        'selected-bg': '#E0E7FF',
        'selected-border': '#6366F1',
        'hover-bg': '#F8FAFF',
        
        // Timeline colors
        'timeline-track': '#E5E7EB',
        'timeline-buffered': '#CBD5E1',
        'timeline-played': '#2563EB',
        'timeline-chapter-marker': '#64748B',
        'timeline-scrubber': '#2563EB',
        
        // Chip colors
        'chip-bg': '#F1F5F9',
        'chip-text': '#0F172A',
        'chip-border': '#E2E8F0',
        'chip-selected-bg': '#DBEAFE',
        'chip-selected-text': '#1E3A8A',
        'chip-selected-border': '#93C5FD',
        
        // List colors
        'list-row-bg-active': '#EEF2FF',
        'list-row-border-active': '#6366F1',
        'list-timestamp': '#334155',
        
        // Tooltip colors
        'tooltip-bg': '#111827',
        'tooltip-text': '#FFFFFF',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h2': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'mono': ['12px', { lineHeight: '16px' }],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'xs': '6px',
        'pill': '999px',
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'panel': '0 2px 12px rgba(16, 24, 40, 0.08)',
        'popover': '0 8px 24px rgba(16, 24, 40, 0.12)',
        'focus-ring': '0 0 0 3px rgba(147, 197, 253, 0.9)',
        'scrubber': '0 2px 8px rgba(16, 24, 40, 0.18)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      transitionDuration: {
        'fast': '120ms',
        'base': '180ms',
        'slow': '280ms',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'header': '10',
        'scrubber': '20',
        'popover': '30',
        'tooltip': '40',
        'overlay': '50',
      },
    },
  },
  plugins: [],
}

export default config
