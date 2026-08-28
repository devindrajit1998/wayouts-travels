$(function () {
  if (typeof window !== "undefined" && (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/account'))) {
    return;
  }

  if (document.querySelector('.admin-page') || document.querySelector('.account-page')) {
    return;
  }

  if (typeof gsap !== "undefined" && typeof ScrollSmoother !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollTrigger.normalizeScroll(false);

    // create the smooth scroller only on frontend pages that have #smooth-content
    if (document.getElementById('smooth-content')) {
      let smoother = ScrollSmoother.create({
        smooth: 2,
        effects: true,
      });
    }
  }
});