export const SITE_NAME = "Centre for Demographic Studies";
export const SITE_NAME_SHORT = "CDS";
export const TAX_ID = "33-2135326";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const GIFT_AMOUNTS = [25, 50, 100, 250] as const;
export const DEFAULT_AMOUNT = 50;
// Social-proof callout on the gift array (+27.5%, NextAfter exp. #55676).
export const MOST_POPULAR_AMOUNT = 50;
export const DEFAULT_FREQUENCY = "monthly" as const;

export const CURRENCY = "usd";

export const MIN_DONATION = 5;
export const MAX_DONATION = 50000;

export const AREAS_OF_WORK = [
  {
    title: "Government",
    description: "Working with policymakers to create pro-family legislation and incentives.",
    icon: "Landmark",
  },
  {
    title: "Healthcare",
    description: "Partnering with medical professionals to support family health and fertility.",
    icon: "Heart",
  },
  {
    title: "Education",
    description: "Reshaping curricula to value family formation and demographic literacy.",
    icon: "GraduationCap",
  },
  {
    title: "Media",
    description: "Changing the cultural narrative around children and family life.",
    icon: "Tv",
  },
  {
    title: "Faith Communities",
    description: "Empowering religious leaders to champion the gift of children.",
    icon: "Church",
  },
  {
    title: "Academia",
    description: "Advancing rigorous demographic research and publishing findings.",
    icon: "BookOpen",
  },
  {
    title: "Celebrities",
    description: "Engaging public figures to normalize and celebrate larger families.",
    icon: "Star",
  },
] as const;

export const FOOTER_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;
