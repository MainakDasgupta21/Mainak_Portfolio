/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--ui-border))",
        canvas: "hsl(var(--ui-canvas))",
        surface: "hsl(var(--ui-surface))",
        "surface-soft": "hsl(var(--ui-surface-soft))",
        "text-main": "hsl(var(--ui-text))",
        "text-muted": "hsl(var(--ui-text-muted))",
        brand: {
          DEFAULT: "hsl(var(--ui-brand))",
          foreground: "hsl(var(--ui-brand-foreground))",
          soft: "hsl(var(--ui-brand-soft))",
        },
        danger: {
          DEFAULT: "hsl(var(--ui-danger))",
          foreground: "hsl(var(--ui-danger-foreground))",
          soft: "hsl(var(--ui-danger-soft))",
        },
      },
      boxShadow: {
        panel: "0 10px 30px -14px hsl(250 30% 14% / 0.22)",
        focus: "0 0 0 3px hsl(var(--ui-focus) / 0.35)",
      },
      borderRadius: {
        xl: "0.85rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
}
