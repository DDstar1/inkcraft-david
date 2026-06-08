// Single source of truth for all InkCraft design tokens.
// Consumed by tailwind.config.ts and app code.

export const colors = {
  // Surfaces
  "surface":                    "#18120a",
  "surface-dim":                "#18120a",
  "surface-bright":             "#40382e",
  "surface-container-lowest":   "#130d06",
  "surface-container-low":      "#211b12",
  "surface-container":          "#251f16",
  "surface-container-high":     "#302920",
  "surface-container-highest":  "#3b342a",
  "surface-variant":            "#3b342a",
  "surface-tint":               "#ffb94c",
  // On-surface
  "on-surface":                 "#eee0d3",
  "on-surface-variant":         "#d6c4ae",
  "inverse-surface":            "#eee0d3",
  "inverse-on-surface":         "#372f26",
  // Outline
  "outline":                    "#9e8e7a",
  "outline-variant":            "#514534",
  // Primary (Golden Orange)
  "primary":                    "#ffbe5b",
  "on-primary":                 "#442b00",
  "primary-container":          "#e8a020",
  "on-primary-container":       "#5b3b00",
  "inverse-primary":            "#815500",
  "primary-fixed":              "#ffddb2",
  "primary-fixed-dim":          "#ffb94c",
  "on-primary-fixed":           "#291800",
  "on-primary-fixed-variant":   "#624000",
  // Secondary (Dark Red)
  "secondary":                  "#ffb3ac",
  "on-secondary":               "#680007",
  "secondary-container":        "#8e1c1c",
  "on-secondary-container":     "#ff9e96",
  "secondary-fixed":            "#ffdad6",
  "secondary-fixed-dim":        "#ffb3ac",
  "on-secondary-fixed":         "#410003",
  "on-secondary-fixed-variant": "#8a1a1a",
  // Tertiary (Blue)
  "tertiary":                   "#94d0ff",
  "on-tertiary":                "#00344f",
  "tertiary-container":         "#4ab7fc",
  "on-tertiary-container":      "#004668",
  "tertiary-fixed":             "#cae6ff",
  "tertiary-fixed-dim":         "#8dcdff",
  "on-tertiary-fixed":          "#001e30",
  "on-tertiary-fixed-variant":  "#004b70",
  // Error
  "error":                      "#ffb4ab",
  "on-error":                   "#690005",
  "error-container":            "#93000a",
  "on-error-container":         "#ffdad6",
  // Background
  "background":                 "#18120a",
  "on-background":              "#eee0d3",
} as const;

export const spacing = {
  "xs":             "4px",
  "base":           "8px",
  "sm":             "12px",
  "md":             "24px",
  "lg":             "48px",
  "xl":             "80px",
  "gutter":         "24px",
  "margin-mobile":  "16px",
  "margin-desktop": "64px",
} as const;

export const fontSize = {
  "display": [
    "48px",
    { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
  ],
  "headline-lg": [
    "32px",
    { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
  ],
  "headline-lg-mobile": [
    "24px",
    { lineHeight: "1.2", fontWeight: "600" },
  ],
  "title-md": [
    "20px",
    { lineHeight: "1.4", fontWeight: "500" },
  ],
  "body-lg": [
    "18px",
    { lineHeight: "1.6", fontWeight: "400" },
  ],
  "body-md": [
    "16px",
    { lineHeight: "1.6", fontWeight: "400" },
  ],
  "label-md": [
    "14px",
    { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" },
  ],
  "caption": [
    "12px",
    { lineHeight: "1.4", fontWeight: "400" },
  ],
} as const;

export const fontFamily = {
  "display":              ["Hanken Grotesk", "sans-serif"],
  "headline-lg":          ["Hanken Grotesk", "sans-serif"],
  "headline-lg-mobile":   ["Hanken Grotesk", "sans-serif"],
  "title-md":             ["Hanken Grotesk", "sans-serif"],
  "body-lg":              ["Hanken Grotesk", "sans-serif"],
  "body-md":              ["Hanken Grotesk", "sans-serif"],
  "label-md":             ["Hanken Grotesk", "sans-serif"],
  "caption":              ["Hanken Grotesk", "sans-serif"],
} as const;

export const borderRadius = {
  "DEFAULT": "0.5rem",
  "sm":      "0.25rem",
  "md":      "0.75rem",
  "lg":      "1rem",
  "xl":      "1.5rem",
  "full":    "9999px",
} as const;
