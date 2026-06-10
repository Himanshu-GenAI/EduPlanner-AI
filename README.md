# InAmigos Foundation – Awareness & Community Landing Page

This repository contains the official, single-page web landing page for **InAmigos Foundation**, a registered Section 8 NGO based in Bilaspur, Chhattisgarh, working across 28 states in India.

The page is designed to showcase the foundation's six pillars of change, track live impact statistics, display volunteer/donation opportunities, and capture interest through interactive forms.

---

## 🌟 Key Features

- **Pillars of Change Section**: Highlights ongoing initiatives: Project SEVA (Food & Clothing), Bachpanshala (Education), Project Jeev (Animal Welfare), Project Udaan (Women Empowerment), Project Prakriti (Environment), and Project Vikas (Skill Development).
- **Responsive Navigation & Mobile Menu**: Stick-to-top navigation with responsive hamburger overlay for mobile screens.
- **Scroll-Triggered Reveal Animations**: Smooth scroll viewport animations utilizing the browser's `IntersectionObserver` API.
- **Dynamic Counters**: Count-up animation for tracking beneficiary metrics when stats scroll into view.
- **Interactive Forms**:
  - **Volunteer / Inquiry Form**: Features real-time client-side field validation, outline glows, shake animations on errors, and asynchronous loading spinners.
  - **Newsletter Subscription**: Instant status notification upon click.
- **Lightbox Media Gallery**: Click-to-enlarge popups for community action highlights with keyboard Escape close support.
- **Configurable Design System**: Clean, modular CSS custom variables (`:root`) for easily custom-branding the entire theme.

---

## 🎨 Theme & Customization System

The project uses semantic CSS custom properties in the `:root` pseudo-class, allowing visual color overhauls without modifying individual class styles:

```css
:root {
  --green:      #1a7a45;             /* Primary Accent Color */
  --green2:     #2daa65;             /* Secondary Highlight Color */
  --green-deep: #0d5c30;             /* Primary Accent hover/active */
  --green-lt:   #d4f0e0;             /* Badge backgrounds & focus rings */
  --green-glow: rgba(45,170,101,.25); /* Focused input shadow overlays */
  --gold:       #e5a01e;             /* Secondary warning/warning highlights */
  --gold-lt:    #fdf3e0;             /* Sub-section alternating cards bg */
  --dark:       #0b1a10;             /* Footer & header opacity blocks */
  --charcoal:   #141f18;             /* Alternate dark section panels */
  --text:       #1d2b22;             /* High accessibility typography */
  --muted:      #5a7362;             /* Muted details details font */
  --white:      #f7fcf8;             /* Default page backdrop background */
  --border:     rgba(27,122,71,.12); /* Default divider outlines */
}
```

---

## 🚀 How to Run Locally

Since this landing page is built using pure **HTML5, CSS3, and Vanilla JavaScript**, it has zero dependencies and requires no build steps or dev servers:

1. Clone or download this project folder.
2. Open the main file [index.html](index.html) directly in any modern web browser (Chrome, Firefox, Safari, Edge).
3. (Optional) If hosting locally with live-reload during development, you can use any static server extension, for example:
   ```bash
   # Using Node's npx static-server
   npx serve .
   ```
