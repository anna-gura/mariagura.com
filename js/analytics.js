/* ── Google Analytics 4 ──────────────────────────────
   The only place on the site where the measurement ID lives.

   Google's own snippet is two parts: an inline <script> that sets up
   gtag(), and a <script src> that loads Google's library. The CSP
   forbids inline script, so the first part lives here, and this file
   adds the second part itself — which also keeps the ID in one place
   instead of two.

   While the ID below is still the placeholder, nothing is loaded and
   no request leaves the page.
   ─────────────────────────────────────────────────── */
const MEASUREMENT_ID = "G-NNK6EY45KF";

if (/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) && MEASUREMENT_ID !== "G-XXXXXXXXXX") {
  window.dataLayer = window.dataLayer || [];

  // Google's library reads the "arguments" object pushed here, not an
  // array, so this stays a plain function rather than an arrow.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

  const library = document.createElement("script");
  library.async = true;
  library.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
  document.head.append(library);
}
