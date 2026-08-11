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
