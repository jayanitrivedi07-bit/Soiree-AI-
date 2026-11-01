---
name: Soirée AI
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#534345'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#867275'
  outline-variant: '#d8c1c3'
  surface-tint: '#934657'
  primary: '#3f0417'
  on-primary: '#ffffff'
  primary-container: '#5b1a2b'
  on-primary-container: '#d97f91'
  inverse-primary: '#ffb2bf'
  secondary: '#765a26'
  on-secondary: '#ffffff'
  secondary-container: '#fed798'
  on-secondary-container: '#785c29'
  tertiary: '#2a1819'
  on-tertiary: '#ffffff'
  tertiary-container: '#402d2d'
  on-tertiary-container: '#af9393'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb2bf'
  on-primary-fixed: '#3d0316'
  on-primary-fixed-variant: '#762f40'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#e6c184'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5c4211'
  tertiary-fixed: '#fbdbdb'
  tertiary-fixed-dim: '#debfbf'
  on-tertiary-fixed: '#281718'
  on-tertiary-fixed-variant: '#574142'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system expresses a luxury wine-brand editorial aesthetic blended with the precision of a modern bespoke concierge. Built for high-profile hosts, event curators, and discerning celebrants, it evokes refinement, effortless sophistication, and celebration.

The visual narrative bridges haute editorial publishing with intelligent agency. Generous whitespace, razor-thin champagne metallic rules, high-contrast serif headlines, and subtle luminescence convey the exclusivity of a sommelier’s private cellar combined with modern generative assistance. Rather than feeling clinical, the interface provides warmth, prestige, and quiet luxury.

## Colors

The palette is anchored by vintage varietals and celebration cues:
- **Primary (`#5B1A2B`)**: Deep Burgundy / Bordeaux. Used for foundational brand presence, primary interactive controls, impactful headlines, and anchor states.
- **Secondary (`#C9A66B`)**: Warm Champagne Gold. Used for metallic badge accents, focused highlights, active tabs, AI curation badges, and glowing borders.
- **Tertiary (`#E8C9C9`)**: Soft Blush. Serves as a light tint for micro-interactions, decorative tags, celebratory states, and delicate contextual backgrounds.
- **Neutral Dark (`#2B2B2B`)**: Charcoal. Replaces pure black to ensure editorial softness on typography, iconography, and structured elements.
- **Neutral Light (`#FAF6F0`)**: Ivory / Cream. Replaces stark optical white as the canvas backdrop, instilling immediate organic warmth.
- **Surface Container (`#F5EFE6`)**: Deepened Cream. Applied to stacked cards, modal backdrops, and navigation panels.
- **Dividers & Strokes (`#DFD0B8` / `#C9A66B`)**: Thin hairline borders that frame and elevate content without heavy visual weight.

Avoid high-saturation primaries or neon utility tones. System statuses (success, warning, error) must be muted and tinted to sit naturally alongside deep wine and champagne tones.

## Typography

The typographic hierarchy establishes tension between the high-contrast flourishes of Playfair Display and the clean geometric precision of Plus Jakarta Sans.

- **Playfair Display**: Reserved for headline scales, celebratory focal points, section milestones, and hero event titles. Display italics may be introduced selectively for secondary descriptors or curation intros.
- **Plus Jakarta Sans**: Handles UI structure, dense data feeds, guest manifests, AI interaction transcripts, and form controls. Provides clarity without compromising the luxury motif.
- **Editorial Sub-labels**: Labels using `label-sm` or `label-md` should render in uppercase with positive letter spacing (`0.06em` to `0.08em`) to mirror luxury catalog typography.

## Layout & Spacing

Layouts follow a structured 12-column grid system built around editorial breathing room and intentional pacing.

- **Breakpoints**: Mobile (320px–767px, 4 columns), Tablet (768px–1023px, 8 columns), Desktop (1024px–1440px+, 12 columns).
- **Rhythm & White Space**: Avoid cramped data densities. Complex event tables and menus must balance actionable metrics with comfortable vertical negative space (`space-xl` to `space-2xl`).
- **Masonry Layouts**: Gallery curation, moodboards, and table arrangement visualizations rely on flexible masonry grids with asymmetric visual balance rather than uniform cards.

## Elevation & Depth

Visual hierarchy uses ambient luminescence, layered paper textures, and hairline outlines rather than heavy drop shadows:

- **Tonal Layering**: Depth is achieved primarily by placing `#F5EFE6` (Surface Container) over `#FAF6F0` (Base Canvas), trimmed with `#DFD0B8` borders.
- **Ambient Gold Illumination**: Floating overlays, modals, and spotlighted AI recommendation cards use a multi-stage tinted shadow: `0 12px 32px -4px rgba(91, 26, 43, 0.06), 0 4px 16px -2px rgba(201, 166, 107, 0.12)`.
- **Inner Metallic Rim**: Premium cards, VIP guest drawers, and celebratory milestone modules feature an inset border glow (`inset 0 0 0 1px rgba(201, 166, 107, 0.35)`).
- **Glassmorphism**: Sticky navigation bars and floating AI concierge prompts employ `backdrop-filter: blur(12px)` over a 90% semi-opaque ivory surface (`rgba(250, 246, 240, 0.9)`).

## Shapes

The design system maintains balanced structural curves:
- Architectural cards, planning tables, and large event sections utilize classic medium radii (`0.5rem` to `1rem`).
- Interactive micro-elements—such as guest categorization tags, status chips, AI suggestion prompts, and key primary CTA triggers—use full pill radii (`9999px`) to echo champagne bubbles and celebratory motifs.
- Border definitions should remain thin (1px) across all components to preserve an editorial feel.

## Components

### Buttons
- **Primary CTA**: Deep Burgundy (`#5B1A2B`) fill, Ivory (`#FAF6F0`) text, pill radius. On hover, transitions to a rich wine sheen with an ambient gold aura (`box-shadow: 0 4px 20px rgba(91, 26, 43, 0.25)`).
- **Secondary (Editorial Concierge)**: Transparent fill, 1px champagne border (`#C9A66B`), Charcoal (`#2B2B2B`) text. On hover, fills with a 10% champagne gold tint.
- **AI Sparkle Action**: Gradient fill from Burgundy (`#5B1A2B`) to a darker wine hue, accompanied by a trailing Warm Champagne (`#C9A66B`) sparkle icon.

### Chips & Badges
- **Status & Category Chips**: Pill shape, 1px border (`#DFD0B8`), tinted cream background (`#F5EFE6`), `label-md` uppercase typography.
- **Celebratory Pill**: Soft Blush (`#E8C9C9`) background with Burgundy text for countdown tags and VIP designations.

### Cards & AI Suggestions
- **Event / Masonry Cards**: Cream container surface (`#F5EFE6`), 1px outline in `#DFD0B8`, and `rounded-lg`. Images are framed with subtle 1px inner borders.
- **AI Suggestion Cards**: Elevated with the ambient gold glow, featuring an inset metallic gold hairline (`#C9A66B`) and an illuminated header with a champagne sparkle badge.

### Inputs & Form Fields
- Understated elegance: Light ivory backgrounds (`#FAF6F0`), crisp Charcoal text, and hairline borders (`#DFD0B8`).
- Focus state: Border transitions to Warm Champagne Gold (`#C9A66B`) with a soft matching ambient glow ring.

### Lists & Interactive Tables
- Seating charts, wine lists, and budget sheets feature generous vertical padding (`space-md`). Rows are demarcated by fine hairline dividers (`#DFD0B8`) without vertical grid lines, mimicking luxury restaurant menus.

### Dedicated Celebration Widgets
- **Stat Rings**: Thin, circular SVG progress meters rendered in Warm Champagne Gold (`#C9A66B`) against a faded blush track (`#E8C9C9`), highlighting RSVPs and budget allocations.
- **Countdown Module**: Monospaced tabular numbering paired with small uppercase Playfair Display labels, framed within a burgundy-lined ivory card.
- **Progress Bars**: 4px slim tracks with a champagne gold gradient fill to monitor celebration preparation milestones.