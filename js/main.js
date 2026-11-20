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

/* ── тіні від лампи ──────────────────────────────────
   Кнопка запису — лампа. Кожному тексту з тінню тут
   рахується, де він стоїть відносно найближчої лампи, і
   тінь лягає в протилежний бік: ліворуч від лампи — уліво,
   над нею — угору, під нею — униз.

   Що далі текст від лампи, то довша й блідіша тінь, як від
   справжньої лампочки. Значення йдуть у CSS-змінні
   --lx/--ly/--ld/--la, а самі тіні описані в style.css.

   Без JavaScript лишаються значення за замовчуванням із
   :root, тобто світло праворуч — сторінка виглядає як раніше.

   Змінні ставляться через style.setProperty: це CSSOM, а не
   атрибут style="", тож CSP (style-src 'self') його пропускає.
   ─────────────────────────────────────────────────── */
const SHADOWED = [
  ".mark", ".headline", ".lede", ".proof", ".quiet",
  ".s-head h2", ".s-head p", ".process h3", ".cut h3",
  ".price-big .num", "blockquote", ".loc .addr",
  ".cta h2", ".cta p", ".teaser h3",
].join(",");

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function centre(el, onPage) {
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null; // схований, напр. display:none
  const dx = onPage ? window.scrollX : 0;
  const dy = onPage ? window.scrollY : 0;
  return { x: r.left + r.width / 2 + dx, y: r.top + r.height / 2 + dy };
}

function castShadows() {
  // Лампи на сторінці: на першому екрані й у фінальному заклику.
  // Шапка закріплена, тож її текст світить лише її власна лампа,
  // і рахується в координатах вікна, а не сторінки.
  const pageLamps = [...document.querySelectorAll(".center .lamp, .cta .lamp")]
    .map((l) => centre(l, true))
    .filter(Boolean);
  const headerLamp = centre(document.querySelector(".top .lamp"), false);

  for (const el of document.querySelectorAll(SHADOWED)) {
    const inHeader = el.closest(".top") !== null;
    const at = centre(el, !inHeader);
    if (!at) continue;

    let lamp = null;
    if (inHeader) {
      lamp = headerLamp;
    } else {
      let best = Infinity;
      for (const l of pageLamps) {
        const d = Math.hypot(at.x - l.x, at.y - l.y);
        if (d < best) { best = d; lamp = l; }
      }
    }
    if (!lamp) continue; // лишаються значення за замовчуванням

    const dx = at.x - lamp.x;
    const dy = at.y - lamp.y;
    const dist = Math.hypot(dx, dy) || 1;

    el.style.setProperty("--lx", (dx / dist).toFixed(3));
    el.style.setProperty("--ly", (dy / dist).toFixed(3));
    el.style.setProperty("--ld", clamp(dist / 650, 0.6, 1.5).toFixed(3));
    el.style.setProperty("--la", clamp(1.15 - dist / 2600, 0.45, 1).toFixed(3));
  }
}

// Перерахунок при зміні розміру вікна чи розкладки — не частіше
// за раз на кадр. Прокрутка нічого не змінює: і лампи, і тексти
// рахуються в координатах сторінки.
let pending = false;
function scheduleShadows() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; castShadows(); });
}

castShadows();
document.fonts.ready.then(scheduleShadows);
new ResizeObserver(scheduleShadows).observe(document.body);

/* ── меню на вузьких екранах ─────────────────────────
   <details> відкривається сам; тут лише закриваємо його,
   коли пункт вибрано, клікнули повз або натиснули Esc.
   ─────────────────────────────────────────────────── */
const menu = document.querySelector(".menu");

if (menu) {
  menu.addEventListener("click", (e) => {
    if (e.target.closest("nav a")) menu.open = false;
  });
  document.addEventListener("click", (e) => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
}
