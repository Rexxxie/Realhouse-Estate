# Realhouse Estate — Official Website

A modern, premium, mobile-responsive real estate website built for **Realhouse Estate**, a full-service property consultancy with offices in London, Edinburgh, and Manchester. Built entirely with pure HTML, CSS, and vanilla JavaScript — no frameworks required.

---

## Live Preview

> Open `index.html` in your browser, or run a local dev server:
> ```bash
> python3 -m http.server 3000
> ```
> Then visit [http://localhost:3000](http://localhost:3000)

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero slideshow, property listings teaser, city explorer, process steps, testimonials CTA |
| Properties | `properties.html` | Full listings grid with filter pills, sort controls, and grid/list toggle |
| Services | `services.html` | 6 service cards, Why Choose Us section, 4-step process |
| About Us | `about.html` | Company story, stats counter, mission/vision/values, leadership team, awards |
| Testimonials | `testimonials.html` | Star rating summary, 9 client reviews, video testimonials |
| Contact | `contact.html` | 3 office cards, enquiry form, map, FAQ accordion |
| Blog | `blog.html` | Featured article, 9 blog cards with categories, sidebar with tags & newsletter |

---

## Features

- **Fully responsive** — mobile, tablet and desktop optimised with CSS Grid & Flexbox
- **Animated hero** — auto-sliding background with overlay text and search bar
- **Scroll animations** — elements fade and slide in using the Intersection Observer API
- **Animated counters** — statistics count up when scrolled into view
- **Property filters** — filter by type (For Sale / For Rent / Short Let / Land etc.)
- **Grid / List view toggle** — switch property listings between layouts
- **FAQ accordion** — smooth open/close with CSS max-height transitions
- **Sticky header** — transparent on home, becomes white on scroll; solid on inner pages
- **Real city photography** — premium Unsplash photos for London, Edinburgh, Manchester, Birmingham, Bristol
- **Blog with sidebar** — featured post, category pills, tag cloud, recent posts widget
- **WhatsApp float button** — quick contact accessible on every page
- **Back-to-top button** — appears after scrolling down
- **Newsletter form** — in footer and blog sidebar
- **RICS & NAEA Propertymark branding** — accreditation badges in footer

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Scripting | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6.5.0 (CDN) |
| Fonts | Google Fonts — Playfair Display + Inter |
| Images | Unsplash (free, no attribution required) |
| Dev Server | Python 3 (`http.server`) |

---

## CSS Architecture

All styles live in a single `css/style.css` file, organised into clearly commented sections:

```
:root                  → Design tokens (colours, spacing, fonts, shadows)
Reset & Base           → Box-sizing, body defaults
Typography             → Headings, paragraphs
Utilities              → Container, section, buttons, tags
Header & Nav           → Sticky header, mobile menu, logo
Hero                   → Slideshow, search bar, overlay
Marquee Ticker         → Scrolling property alert bar
Property Cards         → Listing cards, badges, price tags
City Explorer          → 5-city photo grid
Stats Section          → Animated counters bar
Testimonials           → Star ratings, review cards
CTA Banner             → Dark call-to-action strip
Footer                 → 5-column footer grid
Page Banner            → Inner page hero with breadcrumb
Services               → Service cards, why-grid, process steps
About                  → Story grid, team cards, awards
Testimonials Page      → Full grid, video cards
Contact                → Office cards, form, FAQ accordion
Properties Page        → Search bar, filters, listing controls
Blog                   → Hero post, card grid, sidebar widgets
Responsive             → Breakpoints at 1024px, 768px, 600px
```

---

## Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1a3a6b` | Navy blue — brand primary |
| `--primary-dark` | `#0f2347` | Darker navy — headings |
| `--gold` | `#c9a84c` | Gold — accents, CTAs, highlights |
| `--gold-light` | `#e8c96d` | Lighter gold — hover states |
| `--white` | `#ffffff` | Backgrounds, cards |
| `--gray-800` | `#1f2937` | Body text |
| `--gray-500` | `#6b7280` | Secondary text |

---

## JavaScript Features

`js/main.js` handles:

- **Header scroll effect** — adds `.scrolled` class after 60px (home page only)
- **Mobile nav toggle** — hamburger menu open/close
- **Hero slideshow** — auto-advance every 5 seconds with dot indicators
- **Search form** — input focus animations and submit handler
- **Intersection Observer** — scroll-triggered `.revealed` animations on all pages
- **Counter animation** — counts up `data-count` values using `requestAnimationFrame`
- **Property filters** — pill click toggles active state
- **View toggle** — grid ↔ list layout switch
- **FAQ accordion** — click to expand/collapse, only one open at a time
- **Newsletter form** — success message on submit
- **Back-to-top button** — shows/hides based on scroll, smooth scrolls to top

---

## Running Locally

**Option 1 – Python (recommended)**
```bash
python3 -m http.server 3000
# Open http://localhost:3000
```

**Option 2 – VS Code Live Server**
Install the "Live Server" extension in VS Code, right-click `index.html` → *Open with Live Server*.

**Option 3 – Node.js**
```bash
npx serve .
```

---

## Image Credits

All photography sourced from [Unsplash](https://unsplash.com) under the free Unsplash License (no attribution required, commercial use permitted).

| City | Unsplash Photo ID |
|------|------------------|
| London | `1513635269975-59663e0ac1ad` |
| Edinburgh | `1506377247377-2a5b3b417ebb` |
| Manchester | `1515586838455-8f8f940d6853` |
| Birmingham | `1601042879364-f3947d3f9c16` |
| Bristol | `1569336415962-a4bd9f69cd83` |

---

## Brand Information

**Realhouse Estate Ltd**
- Founded: London, 2009
- Offices: London · Edinburgh · Manchester
- Certifications: RICS · NAEA Propertymark · ISO 9001:2015
- Phone: +44 7796 370134

---

## Developer Notes

- No build step required — pure static files
- No npm / node_modules — open in browser directly
- CSS variables make rebranding trivial — update `:root` tokens only
- All inner pages use `class="header header--solid"` for the always-white header
- The home page uses `class="header"` (transparent → white on scroll)
- Reveal animations require scroll; use `IntersectionObserver` threshold of `0.1`

---

*Built with ❤️ for Realhouse Estate · © 2026 All rights reserved*
