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
        panel: "0 1px 2px hsl(220 18% 30% / 0.04)",
        focus: "0 0 0 2px hsl(var(--ui-focus) / 0.2)",
      },
      borderRadius: {
        xl: "0.5rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
}
