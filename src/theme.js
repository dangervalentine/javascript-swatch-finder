const darkColors = {
  primary: { light: "#AFC6FF", main: "#82AAFF", dark: "#4976A1" },
  secondary: { light: "#A3B7C7", main: "#8DA0AF", dark: "#2A3F51" },
  accent: {
    cyan: "#7fdbca", coral: "#FFAB70", green: "#C3E88D",
    pink: "#F07178", yellow: "#FFCB6B", purple: "#C792EA",
  },
  neutral: { white: "#FFFFFF", lightGray: "#D6DEEB", gray: "#637777", darkGray: "#1D3B53", black: "#000000" },
  background: {
    light: "#D6DEEB", medium: "#1D3B53", elevated: "#132A3E",
    surface: "#0A1E30", base: "#011627", floor: "#010E18",
    scrim: "rgba(1, 22, 39, 0.6)",
  },
  text: { primary: "#D6DEEB", secondary: "#9DB2C0", inverse: "#011627", muted: "#7E8E94" },
};

const lightColors = {
  primary: { light: "#6FBEF6", main: "#4876D6", dark: "#288ED7" },
  secondary: { light: "#A9C4D8", main: "#87A4B8", dark: "#5E7484" },
  accent: {
    cyan: "#176D67", coral: "#9B3F3D", green: "#0B6B51",
    pink: "#92215F", yellow: "#7A5B00", purple: "#6B2FA0",
  },
  neutral: { white: "#FFFFFF", lightGray: "#93A1A1", gray: "#697098", darkGray: "#403F53", black: "#000000" },
  background: {
    light: "#FBFBFB", medium: "#F6F6F6", base: "#EFEFEF",
    surface: "#E7ECF2", floor: "#D6E4F2",
    scrim: "rgba(64, 63, 83, 0.5)",
  },
  text: { primary: "#403F53", secondary: "#5A607A", inverse: "#FBFBFB", muted: "#78808A" },
};

function applyTokens(tokens) {
  const s = document.documentElement.style;
  s.setProperty("--bg-base", tokens.background.base);
  s.setProperty("--bg-surface", tokens.background.surface);
  s.setProperty("--bg-elevated", tokens.background.elevated || tokens.background.medium);
  s.setProperty("--bg-floor", tokens.background.floor);
  s.setProperty("--bg-medium", tokens.background.medium);
  s.setProperty("--bg-scrim", tokens.background.scrim);
  s.setProperty("--text-primary", tokens.text.primary);
  s.setProperty("--text-secondary", tokens.text.secondary);
  s.setProperty("--text-inverse", tokens.text.inverse);
  s.setProperty("--text-muted", tokens.text.muted);
  s.setProperty("--primary", tokens.primary.main);
  s.setProperty("--primary-light", tokens.primary.light);
  s.setProperty("--primary-dark", tokens.primary.dark);
  s.setProperty("--accent-cyan", tokens.accent.cyan);
  s.setProperty("--accent-coral", tokens.accent.coral);
  s.setProperty("--accent-green", tokens.accent.green);
  s.setProperty("--accent-pink", tokens.accent.pink);
  s.setProperty("--accent-yellow", tokens.accent.yellow);
  s.setProperty("--accent-purple", tokens.accent.purple);
  s.setProperty("--border", tokens.neutral.darkGray);
  s.setProperty("--neutral-gray", tokens.neutral.gray);
  s.setProperty("--secondary-main", tokens.secondary.main);
  s.setProperty("--secondary-dark", tokens.secondary.dark);
}

export function getInitialTheme() {
  const stored = localStorage.getItem("swatch-finder-theme");
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function setTheme(mode) {
  applyTokens(mode === "light" ? lightColors : darkColors);
  localStorage.setItem("swatch-finder-theme", mode);
}
