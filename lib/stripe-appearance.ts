import type { Appearance } from "@stripe/stripe-js";

// Hex equivalents of the oklch palette in app/globals.css. CSS variables can't
// cross the Elements iframe boundary, so the values are baked in here — keep
// them in sync with :root if the palette changes.
export const donationAppearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#c35422", // --accent
    colorBackground: "#ffffff", // white inputs sit crisply inside the sage SecureBand
    colorText: "#100f0d", // --foreground
    colorTextSecondary: "#565552", // --muted-foreground
    colorDanger: "#af3c3a", // --destructive
    fontFamily:
      "'Nunito Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
    borderRadius: "10px", // --radius 0.625rem
  },
  rules: {
    ".Input": {
      borderColor: "#d8d3cc", // --input
    },
  },
};
