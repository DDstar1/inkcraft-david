---
name: InkCraft
colors:
  surface: '#18120a'
  surface-dim: '#18120a'
  surface-bright: '#40382e'
  surface-container-lowest: '#130d06'
  surface-container-low: '#211b12'
  surface-container: '#251f16'
  surface-container-high: '#302920'
  surface-container-highest: '#3b342a'
  on-surface: '#eee0d3'
  on-surface-variant: '#d6c4ae'
  inverse-surface: '#eee0d3'
  inverse-on-surface: '#372f26'
  outline: '#9e8e7a'
  outline-variant: '#514534'
  surface-tint: '#ffb94c'
  primary: '#ffbe5b'
  on-primary: '#442b00'
  primary-container: '#e8a020'
  on-primary-container: '#5b3b00'
  inverse-primary: '#815500'
  secondary: '#ffb3ac'
  on-secondary: '#680007'
  secondary-container: '#8e1c1c'
  on-secondary-container: '#ff9e96'
  tertiary: '#94d0ff'
  on-tertiary: '#00344f'
  tertiary-container: '#4ab7fc'
  on-tertiary-container: '#004668'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb2'
  primary-fixed-dim: '#ffb94c'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#624000'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ac'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#8a1a1a'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#8dcdff'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b70'
  background: '#18120a'
  on-background: '#eee0d3'
  surface-variant: '#3b342a'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for a premium print-on-demand service that bridges the gap between digital precision and physical craftsmanship. The brand personality is professional, authoritative, and sophisticated, targeting artists and businesses who value high-fidelity production.

The visual style utilizes a **Modern Corporate** foundation enriched with **Glassmorphism**. It creates a sense of depth and luxury through high-contrast accents against a deep, immersive background. The interface should feel like a high-end gallery space: dark, focused, and meticulously organized, allowing the user's creative work to become the focal point.

## Colors

The palette is anchored by a deep, nocturnal Navy (#0D2B3E) that provides a stable, professional canvas. 

- **Primary Accent (Golden Orange):** Reserved exclusively for primary actions, success states, and brand highlights. It represents the "spark" of creativity and the premium nature of the service.
- **Secondary Accent (Dark Red):** Used sparingly for critical alerts, destructive actions, or high-priority badges.
- **Surface Strategy:** Backgrounds use the primary navy. Components sit on semi-transparent "glass" layers to maintain a sense of lightness and modern sophistication.

## Typography

This design system utilizes **Hanken Grotesk** across all levels to maintain a sharp, contemporary, and highly legible aesthetic. 

- **Headlines:** Should be tightly tracked (negative letter spacing) to appear intentional and impactful. 
- **Body Text:** Uses a generous line height (1.6) to ensure readability against the dark background.
- **Labels:** Small labels use uppercase and slightly increased tracking to create a "technical" or "curated" feel, typical of luxury catalogs.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain the "gallery" feel, centered on the screen with wide margins. 

- **Grid:** 12-column system on desktop, 4-column on mobile.
- **Rhythm:** An 8px base unit governs all dimensions. Use `md` (24px) for standard guttering and internal component padding.
- **Reflow:** On mobile, margins reduce to 16px, and complex data tables or wide-format galleries should transition to vertical stacks or horizontally scrollable carousels.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 1 (Base):** The Primary Background (#0D2B3E).
- **Level 2 (Cards/Containers):** Semi-transparent white fill (5-8% opacity) with a `backdrop-filter: blur(12px)`.
- **Level 3 (Modals/Popovers):** A slightly lighter tint (12% opacity) with a subtle 1px white border at 10% opacity to define the edge against the dark background.
- **Shadows:** Use extremely soft, large-radius glows (Primary Accent color at 10% opacity) for active elements like hovered buttons or focused input fields.

## Shapes

The design system uses a **Rounded** (Level 2) shape language to soften the high-contrast professional aesthetic. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Hero sections or main content cards use 1rem (16px) to emphasize the "contained" gallery look.
- **Interactive States:** When a component is active or focused, the shape remains consistent, but the stroke weight may increase.

## Components

- **Buttons:** 
  - **Primary:** Solid Golden Orange (#E8A020) with Navy text. No border.
  - **Secondary:** Transparent with a 1px Golden Orange border and white text.
- **Cards:** Use the glassmorphism style defined in Elevation. 8px rounded corners. Include a subtle inner 1px border on the top and left edges to simulate light hitting the edge.
- **Input Fields:** Darker than the background (Primary Navy at 50% luminosity) with a subtle 1px border. On focus, the border transitions to Golden Orange.
- **Chips & Badges:** 
  - **Status:** Dark Red (#8B1A1A) with white text for alerts.
  - **Category:** Glass style with white text.
- **Lists:** Separated by low-opacity white lines (5%). Each item should have a generous 16px vertical padding.
- **Selection Controls:** Checkboxes and Radios use the Golden Orange for the "checked" state.