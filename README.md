# Maria Gura — Women's Haircut Specialist

The website of an independent hairstylist in Hallandale Beach, Florida: six pages, thirty years of craft, and a single button that books the chair.

**[mariagura.com](https://mariagura.com)**

> "A good haircut isn't a copy of a photo. It's precise work with geometry, hair structure and the shape of the head." — Maria Gura

No framework, no build step, no server code. Plain HTML pages, one stylesheet, two small scripts, served as static files from Cloudflare.

---

## Design

### A room lit by one lamp

The page is a dark, warm room. The only light in it is the booking button, drawn as a frosted bulb with a filament glowing behind the glass. Everything else on the page is lit by it.

- **The lamp breathes.** The bulb, the light it spills across the wall and the warmth of the room brighten and dim together on a slow nine-second cycle, with a gleam passing over the glass once per cycle. Barely noticeable, but noticeable.
- **Shadows fall away from the lamp.** Text to the left of the button casts its shadow left; text above it, up; text below it, down. The further a heading is from the lamp, the longer and fainter its shadow, as with a real bulb. A few lines in `js/main.js` work out the direction for every piece of text from where it actually sits, and recalculate when the layout changes — on a phone, where the lamp sits under the headline, the shadows turn upward.
- **Gold words glow.** The champagne-coloured word in each section heading gives off a soft light of its own and warms the wall around it, quieter than the lamp. It marks where a new section begins. Because it is a light source, it casts almost no shadow.
- **The walls have grain.** A fine noise texture over everything keeps the dark from looking like a flat screen.

Every page opens in the same room: its heading on the left, the lamp on the right, the shadows falling away from it. The final call to action has its own lamp, so each page ends the way it begins: in light, next to the button.

### What is deliberately not here

No illustrations, icons or diagrams of haircuts. A drawn bob looks nothing like a real one, and this is a page about real hair. The only image is Maria's own photograph, lit from the same side as the page.

### Type and colour

| | |
|---|---|
| Display | **Instrument Serif**, upright and italic |
| Text | **Manrope**, 300–600 |
| Wall | `#0B0704`, warming to `#3D2C1C` near the lamp |
| Text | `#F0E6D9` cream, `#A39281` for secondary lines |
| Accent | `#E6CCA0` champagne, `#FBEED6` at the peak of a gleam |

The whole palette is set once, at the top of `css/style.css`.

### Motion and accessibility

Everything moves slowly or not at all. Visitors who ask their system for reduced motion get a still page: no breathing, no gleam, nothing sliding into place. Without JavaScript, the page still renders in full, with the light assumed to come from the right.

The favicon is a gold **G** on a dark circle, set in Google Sans and converted to outlines, so it doesn't depend on any font being installed.

---

## Security

A static page with no forms and no accounts has a small attack surface, and the aim is to keep it that way. The full threat model is in [`SECURITY.md`](SECURITY.md); every header, with the reason for it, is in [`_headers`](_headers).

**Content-Security-Policy** starts from `default-src 'none'` and opens only what the page uses:

| | Allowed |
|---|---|
| Scripts | this site; Google Analytics (`*.googletagmanager.com`) |
| Styles, fonts | this site only |
| Images | this site; Google Analytics measurement pixels |
| Connections | this site; Google Analytics endpoints |
| Frames, forms, `<base>`, embedding by others | nothing |

To make that possible:

- **No inline code.** No `<script>` blocks, no `style=""` attributes, no `unsafe-inline`. Google's own analytics setup snippet, normally inline, lives in `js/analytics.js`.
- **No third-party fonts.** Both typefaces are served from `assets/fonts` rather than Google Fonts.
- **No widgets.** Booking, WhatsApp, Instagram and TikTok are plain links that open in a new tab. Nobody else's code runs on this page except Google Analytics, and Google Tag Manager is deliberately not used: it would let any script be added from a dashboard, bypassing this policy.
- **Analytics only on the real domain.** Local previews and `*.workers.dev` URLs load nothing and count nothing.

Alongside it: HSTS, `X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin` referrers, a `Permissions-Policy` that denies every hardware API, and same-origin resource and opener policies. `.assetsignore` keeps the git history and project files from ever being served, and `/.well-known/security.txt` says where to report a problem.

---

## Structure

```
index.html              home: first screen, key facts, a way into every page, location
haircuts/index.html     how a haircut works, specialties, hair types, corrections
prices/index.html       prices and how often to refresh a cut
about/index.html        Maria, her work and her teaching
contact/index.html      location, hours, phone and how to book
faq/index.html          questions and answers, with FAQ structured data
404.html                shown for any address that doesn't exist
css/style.css           all styles; palette and lighting variables at the top
js/main.js              header on scroll, shadows cast from the lamp, mobile menu
js/analytics.js         Google Analytics, loaded only on mariagura.com
assets/fonts/           Instrument Serif and Manrope, Latin subset
assets/grain.svg        the wall texture
images/                 Maria's photograph, WebP with a JPEG fallback
favicon.*               the gold G, plus the iPhone home-screen icon
_headers                security headers, with the reasoning for each
robots.txt, sitemap.xml for search engines
wrangler.toml           Cloudflare Workers configuration
```

## Deployment

Hosted as static assets on Cloudflare Workers. Every push to `main` builds and deploys automatically. Each page lives in its own folder as `index.html`, so addresses stay clean (`/prices/`) both on Cloudflare and in a local preview.

The `name` in `wrangler.toml` must match the Worker's name in the Cloudflare dashboard, or the build refuses to run.

---

Design and development by **Painted Fox Studio**. Content and photograph © Maria Gura. Instrument Serif, Manrope and Google Sans are used under the SIL Open Font License.
