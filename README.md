# LandMark Realty Nigeria — Official Website

A modern, mobile-responsive real estate website built for **LandMark Realty Nigeria**, a full-service property company with offices in Lagos, Abuja, and Port Harcourt. Built entirely with pure HTML, CSS, and vanilla JavaScript — no frameworks required.

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
- **Real city photography** — Unsplash photos for Lagos, Abuja, Port Harcourt, Ibadan, Enugu
- **Blog with sidebar** — featured post, category pills, tag cloud, recent posts widget
- **WhatsApp float button** — quick contact accessible on every page
- **Back-to-top button** — appears after scrolling down
- **Newsletter form** — in footer and blog sidebar
- **LASRERA & ARCON branding** — certification badges in footer

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

## Project Structure

```
Real house Estate/
├── index.html              # Home page
├── properties.html         # Properties listing page
├── services.html           # Services page
├── about.html              # About Us page
├── testimonials.html       # Testimonials page
├── contact.html            # Contact page
├── blog.html               # Blog / news page
│
├── css/
│   └── style.css           # All styles (~3,200+ lines)
│
├── js/
│   └── main.js             # All interactivity
│
├── images/
│   ├── city-lagos.jpg      # Lagos – Victoria Island aerial (Unsplash)
│   ├── city-abuja.jpg      # Abuja – National Mosque (Unsplash)
│   ├── city-portharcourt.jpg  # Port Harcourt aerial (Unsplash)
│   ├── city-ibadan.jpg     # Ibadan cityscape (Unsplash)
│   └── city-enugu.jpg      # Enugu city view (Unsplash)
│
└── .claude/
    └── launch.json         # Dev server config for Claude Code
```

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
cd "Real house Estate"
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
| Lagos | `1618828665011-0abd973f7bb8` |
| Abuja | `1609657726788-44564a8f304a` |
| Port Harcourt | `1580239808463-daf9766788a7` |
| Ibadan | `1685266326184-0b570fe834fa` |
| Enugu | `1577900190299-7316c32fe85f` |

---

## Brand Information

**LandMark Realty Nigeria Ltd**
- Founded: Lagos, 2009
- Offices: Lagos · Abuja · Port Harcourt
- Certifications: LASRERA · ARCON · ISO 9001:2015
- Phone: +234 800 000 0000

---

## Developer Notes

- No build step required — pure static files
- No npm / node_modules — open in browser directly
- CSS variables make rebranding trivial — update `:root` tokens only
- All inner pages use `class="header header--solid"` for the always-white header
- The home page uses `class="header"` (transparent → white on scroll)
- Reveal animations require scroll; use `IntersectionObserver` threshold of `0.1`

---

*Built with ❤️ for LandMark Realty Nigeria · © 2025 All rights reserved*
