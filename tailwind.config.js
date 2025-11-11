const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    'apps/*/src/**/*.{ts,tsx}',
    'apps/*/app/**/*.{ts,tsx}',
    'apps/*/components/**/*.{ts,tsx}',
    'packages/modules/*/src/**/*.{ts,tsx}',
    'packages/libs/*/ui/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  plugins: [require('tailwindcss-animate')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        //begin custom

        brand: {
          50: 'rgb(245, 243, 255)',
          100: 'rgb(237, 233, 254)',
          200: 'rgb(221, 214, 254)',
          300: 'rgb(196, 181, 253)',
          400: 'rgb(167, 139, 250)',
          500: 'rgb(139, 92, 246)',
          600: 'rgb(124, 58, 237)',
          700: 'rgb(109, 40, 217)',
          800: 'rgb(91, 33, 182)',
          900: 'rgb(76, 29, 149)',
        },
        neutral: {
          0: 'rgb(255, 255, 255)',
          50: 'rgb(250, 250, 250)',
          100: 'rgb(245, 245, 245)',
          200: 'rgb(229, 229, 229)',
          300: 'rgb(212, 212, 212)',
          400: 'rgb(163, 163, 163)',
          500: 'rgb(115, 115, 115)',
          600: 'rgb(82, 82, 82)',
          700: 'rgb(64, 64, 64)',
          800: 'rgb(38, 38, 38)',
          900: 'rgb(23, 23, 23)',
          950: 'rgb(10, 10, 10)',
        },
        error: {
          50: 'rgb(254, 242, 242)',
          100: 'rgb(254, 226, 226)',
          200: 'rgb(254, 202, 202)',
          300: 'rgb(252, 165, 165)',
          400: 'rgb(248, 113, 113)',
          500: 'rgb(239, 68, 68)',
          600: 'rgb(220, 38, 38)',
          700: 'rgb(185, 28, 28)',
          800: 'rgb(153, 27, 27)',
          900: 'rgb(127, 29, 29)',
        },
        warning: {
          50: 'rgb(255, 251, 235)',
          100: 'rgb(254, 243, 199)',
          200: 'rgb(253, 230, 138)',
          300: 'rgb(252, 211, 77)',
          400: 'rgb(251, 191, 36)',
          500: 'rgb(245, 158, 11)',
          600: 'rgb(217, 119, 6)',
          700: 'rgb(180, 83, 9)',
          800: 'rgb(146, 64, 14)',
          900: 'rgb(120, 53, 15)',
        },
        success: {
          50: 'rgb(240, 253, 244)',
          100: 'rgb(220, 252, 231)',
          200: 'rgb(187, 247, 208)',
          300: 'rgb(134, 239, 172)',
          400: 'rgb(74, 222, 128)',
          500: 'rgb(34, 197, 94)',
          600: 'rgb(22, 163, 74)',
          700: 'rgb(21, 128, 61)',
          800: 'rgb(22, 101, 52)',
          900: 'rgb(20, 83, 45)',
        },
        'brand-primary': 'rgb(124, 58, 237)',
        'default-font': 'rgb(23, 23, 23)',
        'subtext-color': 'rgb(115, 115, 115)',
        'neutral-border': 'rgb(229, 229, 229)',
        white: 'rgb(255, 255, 255)',
        // end custom
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      // begin
      fontSize: {
        caption: [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '400',
            letterSpacing: '0em',
          },
        ],
        'caption-bold': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '500',
            letterSpacing: '0em',
          },
        ],
        body: [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '400',
            letterSpacing: '0em',
          },
        ],
        'body-bold': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '500',
            letterSpacing: '0em',
          },
        ],
        'heading-3': [
          '16px',
          {
            lineHeight: '20px',
            fontWeight: '500',
            letterSpacing: '0em',
          },
        ],
        'heading-2': [
          '20px',
          {
            lineHeight: '24px',
            fontWeight: '500',
            letterSpacing: '0em',
          },
        ],
        'heading-1': [
          '30px',
          {
            lineHeight: '36px',
            fontWeight: '500',
            letterSpacing: '0em',
          },
        ],
        'monospace-body': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '400',
            letterSpacing: '0em',
          },
        ],
      },
      fontFamily: {
        caption: 'Inter',
        'caption-bold': 'Inter',
        body: 'Inter',
        'body-bold': 'Inter',
        'heading-3': 'Inter',
        'heading-2': 'Inter',
        'heading-1': 'Inter',
        'monospace-body': 'monospace',
      },
      boxShadow: {
        sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        default: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        md: '0px 4px 16px -2px rgba(0, 0, 0, 0.08), 0px 2px 4px -1px rgba(0, 0, 0, 0.08)',
        lg: '0px 12px 32px -4px rgba(0, 0, 0, 0.08), 0px 4px 8px -2px rgba(0, 0, 0, 0.08)',
        overlay:
          '0px 12px 32px -4px rgba(0, 0, 0, 0.08), 0px 4px 8px -2px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        DEFAULT: '8px',
        lg: '12px',
        full: '9999px',
      },
      container: {
        padding: {
          DEFAULT: '16px',
          sm: 'calc((100vw + 16px - 640px) / 2)',
          md: 'calc((100vw + 16px - 768px) / 2)',
          lg: 'calc((100vw + 16px - 1024px) / 2)',
          xl: 'calc((100vw + 16px - 1280px) / 2)',
          '2xl': 'calc((100vw + 16px - 1536px) / 2)',
        },
      },
      spacing: {
        112: '28rem',
        144: '36rem',
        192: '48rem',
        256: '64rem',
        320: '80rem',
      },
      screens: {
        mobile: {
          max: '767px',
        },
      },
    },
  },
};
