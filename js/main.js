/* ── шапка ───────────────────────────────────────────
   Прозора на першому екрані, стає непрозорою,
   щойно сторінка зрушила вниз.
   ─────────────────────────────────────────────────── */
const topBar = document.getElementById("top-bar");

function updateTopBar() {
  topBar.classList.toggle("scrolled", window.scrollY > 40);
}

updateTopBar();
window.addEventListener("scroll", updateTopBar, { passive: true });
