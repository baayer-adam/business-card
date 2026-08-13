(function () {
  var toggle = document.getElementById("navToggle");
  var backdrop = document.getElementById("navBackdrop");
  var nav = document.getElementById("siteNav");

  function closeNav() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    var isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  toggle.addEventListener("click", toggleNav);
  backdrop.addEventListener("click", closeNav);
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
})();

/* ---------- Цели Яндекс.Метрики: клики в мессенджеры ----------
   Все заявки уходят из сайта в WhatsApp / Telegram / Instagram, поэтому без
   этих целей Метрика покажет 100% отказов и ничего полезного. Цели с такими
   же идентификаторами нужно создать в интерфейсе Метрики:
   whatsapp, telegram, tg_store, instagram. */
(function () {
  document.addEventListener("click", function (e) {
    if (!window.YM_ID || typeof window.ym !== "function") return;

    // В кнопках лежат inline-<svg>, поэтому e.target часто SVG-элемент —
    // поднимаемся до ближайшего узла, у которого есть closest().
    var node = e.target;
    while (node && typeof node.closest !== "function") node = node.parentNode;
    if (!node) return;

    var link = node.closest("a[href]");
    if (!link) return;

    var href = link.href || "";
    var goal =
      href.indexOf("wa.me") > -1 ? "whatsapp" :
      href.indexOf("t.me/AdamNewBalance") > -1 ? "tg_store" :
      href.indexOf("t.me") > -1 ? "telegram" :
      href.indexOf("instagram.com") > -1 ? "instagram" : null;

    if (goal) window.ym(window.YM_ID, "reachGoal", goal);
  });
})();
