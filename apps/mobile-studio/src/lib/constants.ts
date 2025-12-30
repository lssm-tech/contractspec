/**
 * Programmatic design tokens for navigation and theming
 *
 * Next.js compatibility: Pure objects exported for universal use. Mirrors
 * Tailwind CSS tokens and documented in docs/tech/hcircle/global-css.md.
 */
export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(214 32% 91%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 72% 50%)', // destructive
    primary: 'hsl(216 83% 34%)', // brand primary
    text: 'hsl(222 47% 11%)', // foreground
  },
  dark: {
    background: 'hsl(222 47% 7%)', // background
    border: 'hsl(222 25% 18%)', // border
    card: 'hsl(222 47% 9%)', // card
    notification: 'hsl(0 72% 56%)', // destructive (dark)
    primary: 'hsl(216 83% 34%)', // brand primary
    text: 'hsl(0 0% 100%)', // foreground
  },
};
