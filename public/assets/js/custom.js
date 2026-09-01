/*-----------------------------------------------------------------------------------
    Theme Name: Tourvex Template
    Theme URI: https://duruthemes.com/demo/html/tourvex
    Description: Travel Agency Template
    Author: DuruThemes
    Author URI: https://themeforest.net/user/duruthemes
    Version: 1.0

    ==========================================================================
    TABLE OF CONTENTS
    ==========================================================================
    1. GSAP CONFIG
    2. DOCUMENT READY & WOW ANIMATION
    3. CURSOR ANIMATION
    4. SMOOTH SCROLL NAV (SCROLLIT)
    5. ONEPAGE MENU CLICK
    6. NAVBAR SCROLL BACKGROUND
    7. MOBILE MENU CLOSE
    8. ROLLING TEXT
    9. DYNAMIC BACKGROUND IMAGE
    10. YOUTUBE POPUP
    11. MAGNIFIC POPUP
    12. ISOTOPE GALLERY
    13. SCROLL BACK TO TOP
    14. ACCORDION FAQ
    15. CUSTOM MAGNIFIC POPUP
    16. BUTTON ACTIVE TOGGLE
    17. GSAP SVG PRELOADER
    18. GSAP SCROLLTRIGGER ANIMATIONS
    19. MARQUEE
    20. COUNTER
    21. SWIPER SLIDER
    22. TESTIMONIALS 2 OWLCAROUSEL
    23. WINDOW LOAD
    24. ELASTIC CARD ANIMATION
    25. TEAM SLIDER
    26. GALLERY SCROLL SLIDER
    27. TRAVEL HERO SLIDER
    28. CONTENT-AWARE RE-INITIALIZATION (React/Firestore support)
-----------------------------------------------------------------------------------*/

(function ($) {
    "use strict";

    var wind = $(window);

    /* ==========================================================================
       1. GSAP CONFIG
       ========================================================================== */
    if (typeof gsap !== "undefined") {
        gsap.config({
            nullTargetWarn: false
        });
        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    /* ==========================================================================
       28. CONTENT-AWARE RE-INITIALIZATION
       --------------------------------------------------------------------------
       Public pages fetch content from Firestore asynchronously. When custom.js
       first runs, the DOM may only contain loading spinners. This section keeps
       track of every animation instance created against the DOM so they can be
       torn down and re-created once real content mounts.

       - window.wayoutsRefreshAnimations(): full teardown + rebuild. Safe to call
         any number of times.
       - A MutationObserver watches #smooth-wrapper for added nodes and triggers
         a debounced refresh, so late-mounted React content always gets animated.
       ========================================================================== */
    var wayoutsState = {
        scrollCtx: null,        // gsap.context() for all ScrollTrigger animations
        swipers: [],            // live Swiper instances
        isotopes: [],           // live Isotope instances
        marquees: [],           // live marquee instances
        counters: [],           // live counterUp instances
        wow: null,              // WOW instance
        observer: null,         // MutationObserver for late content
        refreshTimer: null,     // debounce timer
        galleryFilterBound: false, // delegated gallery filter handler flag
        introDone: false,          // preloader intro timeline has run
        introFallback: null,       // timer that dismisses preloader if hero never mounts
        initialized: false
    };

    function isAdminPage() {
        if (typeof window === "undefined") return false;
        return window.location.pathname.startsWith('/admin') ||
            window.location.pathname.startsWith('/account');
    }

    var isRefreshing = false;

    function teardownAnimations() {
        // Kill GSAP ScrollTrigger animations created inside our context
        if (wayoutsState.scrollCtx) {
            try { wayoutsState.scrollCtx.revert(); } catch (e) { /* noop */ }
            wayoutsState.scrollCtx = null;
        }
        // Destroy Swipers
        wayoutsState.swipers.forEach(function (s) {
            try { s.destroy(true, true); } catch (e) { /* noop */ }
        });
        wayoutsState.swipers = [];
        // Destroy Isotope instances
        wayoutsState.isotopes.forEach(function (i) {
            try { i.destroy(); } catch (e) { /* noop */ }
        });
        wayoutsState.isotopes = [];
        // Destroy marquees
        wayoutsState.marquees.forEach(function (m) {
            try { m.destroy(); } catch (e) { /* noop */ }
        });
        wayoutsState.marquees = [];
        // Note: counters are intentionally NOT torn down — counterUp has no
        // destroy() and re-initializing would double-bind its internals.
        // initCounters() skips already-initialized elements instead.
        wayoutsState.counters = [];
        // Note: WOW is intentionally NOT stopped — its live MutationObserver
        // automatically picks up newly mounted .wow elements.
    }

    function initScrollAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        wayoutsState.scrollCtx = gsap.context(function () {
            function createScrollAnimation(selector, options) {
                gsap.utils.toArray(selector).forEach((el) => {
                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: el,
                            scrub: options.scrub || 1,
                            start: options.start || "top 90%",
                            end: options.end || "bottom 60%",
                            toggleActions: "play none none reverse",
                            markers: false
                        }
                    });

                    tl.set(el, {
                        transformOrigin: 'center center'
                    });

                    if (options.fromTo) {
                        tl.fromTo(el, options.from, options.to);
                    } else {
                        tl.from(el, options.from, options.to);
                    }
                });
            }

            // Section effects
            createScrollAnimation('.duru-section-scale-bg-reveal', {
                start: "top 80%",
                end: "bottom 60%",
                from: { background: "#171717", scale: .8 },
                to: { background: "inherit", scale: 1, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-section-shrink', {
                scrub: 1, start: "top 80%", end: "bottom 20%", fromTo: true,
                from: { scale: 1, opacity: 1 },
                to: { scale: 0.9, opacity: 0.6, ease: "none" }
            });
            // CTA / UI effects
            createScrollAnimation('.duru-cta-slide-up', {
                start: "top 90%", end: "top 70%",
                from: { opacity: 1, y: "+=300" },
                to: { opacity: 1, y: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-popup-scale-in', {
                start: "top 95%", end: "top 70%", fromTo: true,
                from: { scale: 0 },
                to: { scale: 1, duration: .5, immediateRender: false }
            });
            // Slide / Move animations
            createScrollAnimation('.duru-slide-left', {
                from: { x: "-=100" },
                to: { x: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-slide-right', {
                from: { x: "+=100" },
                to: { x: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-slide-up', {
                start: "top 85%",
                from: { y: "+=100" },
                to: { y: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-slide-down', {
                start: "top 85%",
                from: { y: "-=100" },
                to: { y: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-move-from-right', {
                start: "top 85%", end: "bottom 60%", scrub: 1, fromTo: true,
                from: { opacity: 0, scale: 0.8, xPercent: 100, transformOrigin: "center center" },
                to: { opacity: 1, scale: 1, xPercent: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-move-from-left', {
                start: "top 85%", end: "bottom 60%", scrub: 1, fromTo: true,
                from: { opacity: 0, scale: 0.8, xPercent: -100, transformOrigin: "center center" },
                to: { opacity: 1, scale: 1, xPercent: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-image-slide-right', {
                scrub: 2, start: "top 80%", end: "top 70%", fromTo: true,
                from: { xPercent: -100 },
                to: { xPercent: 0, duration: 1, immediateRender: false }
            });
            // Zoom / Scale animations
            createScrollAnimation('.duru-image-zoom', {
                start: "top 85%", fromTo: true, target: 'img', scrub: 0.3,
                from: { scale: 1 },
                to: { scale: 1.5, ease: "none", immediateRender: false }
            });
            createScrollAnimation('.duru-zoom-out', {
                start: "top 85%", fromTo: true,
                from: { scale: 1 },
                to: { scale: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-scale-down-large', {
                start: "top 85%", end: "bottom 50%", fromTo: true,
                from: { scale: 2 },
                to: { scale: 1, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-scale-down-medium', {
                start: "top 85%", end: "bottom 50%", fromTo: true,
                from: { scale: 1.5 },
                to: { scale: 1, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-scale-in', {
                start: "top 95%", end: "top 70%", fromTo: true,
                from: { scale: .8 },
                to: { scale: 1, duration: .5, immediateRender: false }
            });
            createScrollAnimation('.duru-bounce-reveal', {
                start: "top 85%",
                from: { scale: 0.6, opacity: 0 },
                to: { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
            });
            // Text animations
            createScrollAnimation('.duru-text-color-light', {
                start: "top 70%", end: "bottom 40%", fromTo: true,
                from: { color: "#171717" },
                to: { color: "#fff", duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-stagger-reveal', {
                start: "top 85%", fromTo: true,
                from: { opacity: 0, y: 40 },
                to: { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }
            });
            createScrollAnimation('.duru-text-blur-reveal', {
                start: "top 85%",
                from: { opacity: 0, y: 20, filter: "blur(6px)" },
                to: { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.05 }
            });
            // Reveal / Mask effects
            createScrollAnimation('.duru-reveal-up', {
                start: "top 85%", fromTo: true,
                from: { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 30 },
                to: { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0, duration: 1, ease: "power3.out", immediateRender: false }
            });
            createScrollAnimation('.duru-clip-expand', {
                scrub: 2, start: "top 80%", end: "top 60%", fromTo: true,
                from: { clipPath: "polygon(30% 0, 70% 0, 70% 100%, 30% 100%)" },
                to: { clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)", duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-mask-reveal-horizontal', {
                start: "top 85%", fromTo: true,
                from: { clipPath: "inset(0 100% 0 0)" },
                to: { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.out" }
            });
            // Rotate / 3D effects
            createScrollAnimation('.duru-rotate-scale-reveal', {
                from: { opacity: 1, rotateZ: 45, scale: 0.5, y: "+=100" },
                to: { opacity: 1, rotateZ: 0, scale: 1, y: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-rotate-on-scroll', {
                scrub: 3, start: "top 70%", end: "top 50%", fromTo: true,
                from: { rotateZ: 360 },
                to: { rotateZ: 0, duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-flip-3d', {
                start: "top 85%", fromTo: true,
                from: { rotationX: 60, opacity: 0, transformPerspective: 1000 },
                to: { rotationX: 0, opacity: 1, duration: 1, ease: "power3.out" }
            });
            // Image / Parallax effects
            createScrollAnimation('.duru-background-parallax', {
                scrub: 1, start: "top bottom", end: "bottom top", fromTo: true,
                from: { backgroundPosition: "50% 0%" },
                to: { backgroundPosition: "50% 100%", ease: "none" }
            });
            createScrollAnimation('.duru-image-parallax', {
                scrub: 1.2, start: "top bottom", end: "bottom top", fromTo: true,
                from: { scale: 1.2, y: -50 },
                to: { scale: 1, y: 50, ease: "none" }
            });
            createScrollAnimation('.duru-horizontal-parallax', {
                scrub: 1, start: "top bottom", end: "bottom top", fromTo: true,
                from: { x: -200 },
                to: { x: 200, ease: "none" }
            });
            createScrollAnimation('.duru-vertical-parallax', {
                scrub: 1, start: "top bottom", end: "bottom top", fromTo: true,
                from: { y: -200 },
                to: { y: 200, ease: "none" }
            });
            // Color / Filter effects
            createScrollAnimation('.duru-bg-dark-transition', {
                start: "top 70%", end: "bottom 40%", fromTo: true,
                from: { backgroundColor: "var(--clr-primary)" },
                to: { backgroundColor: "#171717", duration: 1, immediateRender: false }
            });
            createScrollAnimation('.duru-hue-rotate', {
                scrub: 1, start: "top 80%", end: "bottom 20%", fromTo: true,
                from: { filter: "hue-rotate(0deg)" },
                to: { filter: "hue-rotate(180deg)", ease: "none" }
            });

            // Elastic card animation (was section 24)
            const elasticCards = gsap.utils.toArray(".image-stack-card");
            if (elasticCards.length) {
                elasticCards.forEach((card, i) => {
                    card.style.zIndex = elasticCards.length - i;
                });
                const elasticTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".image-stack",
                        start: "top 80%",
                        end: "+=350",
                        scrub: 1
                    }
                });
                elasticCards.forEach((card, i) => {
                    const offset = i - (elasticCards.length - 1) / 2;
                    elasticTl.to(card, {
                        x: offset * 180,
                        rotation: offset * 8,
                        ease: "none"
                    }, 0);
                });
                let highestZ = elasticCards.length;
                const onElasticEnter = (e) => {
                    const card = e.currentTarget;
                    highestZ++;
                    gsap.to(card, {
                        zIndex: highestZ,
                        scale: 1.05,
                        y: -10,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };
                const onElasticLeave = (e) => {
                    gsap.to(e.currentTarget, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };
                elasticCards.forEach(card => {
                    card.addEventListener("mouseenter", onElasticEnter);
                    card.addEventListener("mouseleave", onElasticLeave);
                });
                // Cleanup runs when the gsap.context is reverted on refresh
                return function () {
                    elasticCards.forEach(card => {
                        card.removeEventListener("mouseenter", onElasticEnter);
                        card.removeEventListener("mouseleave", onElasticLeave);
                    });
                };
            }

            // Stackcard animation (was section 18b). The original template pinned
            // .stsec .stack-title based on viewport width alone — requiring
            // .stackCard elements was a regression that disabled the pinned
            // stack-title scroll effect entirely (the tours section has no
            // .stackCard markup). Pin is restored; the card-stacking loop only
            // runs when .stackCard elements actually exist.
            var currentWidth = $(window).width();
            if (currentWidth > 991 && document.querySelector('.stsec .stack-title')) {
                const fe = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".stsec .stack-title",
                        start: "center center",
                        endTrigger: ".stsec",
                        end: "bottom bottom",
                        pin: true,
                        pinSpacing: false,
                    }
                });
                let cardsList = gsap.utils.toArray(".stackCard");
                if (cardsList.length) {
                    let stickDistance = 0;
                    let lastCardST = ScrollTrigger.create({
                        trigger: cardsList[cardsList.length - 1],
                        start: "center center"
                    });
                    cardsList.forEach((card, index) => {
                        ScrollTrigger.create({
                            trigger: card,
                            start: "center center",
                            end: () => lastCardST.start + stickDistance,
                            pin: true,
                            pinSpacing: false,
                            scrub: true,
                            snap: true,
                            ease: "power4.out",
                            onUpdate: (self) => {
                                const progress = self.progress;
                                const EvenOdd = index % 2 === 0;
                                gsap.to(card, {
                                    scaleX: 1 - progress * 0.2,
                                    x: index * 20,
                                    filter: `grayscale(${progress * 20}%)`,
                                    top: index * 20,
                                    rotate: EvenOdd ? -3 * progress : 3 * progress,
                                });
                            }
                        });
                    });
                }
            }
        });
    }

    function initSwipers() {
        if (typeof Swiper === "undefined") return;

        var parallaxSlider;
        var parallaxSliderOptions = {
            speed: 1000,
            autoplay: true,
            parallax: true,
            loop: true,
            on: {
                init: function () {
                    var swiper = this;
                    for (var i = 0; i < swiper.slides.length; i++) {
                        $(swiper.slides[i]).find('.bg-img').attr({
                            'data-swiper-parallax': 0.75 * swiper.width
                        });
                    }
                },
                resize: function () {
                    this.update();
                }
            },
            pagination: {
                el: '.slider-prlx .parallax-slider .swiper-pagination',
                type: 'fraction',
                clickable: true
            },
            navigation: {
                nextEl: '.slider-prlx .parallax-slider .next-ctrl',
                prevEl: '.slider-prlx .parallax-slider .prev-ctrl'
            }
        };
        if ($('.slider-prlx .parallax-slider').length) {
            parallaxSlider = new Swiper('.slider-prlx .parallax-slider', parallaxSliderOptions);
            wayoutsState.swipers.push(parallaxSlider);
        }

        if ($('.swiper-testim').length) {
            var swiperTestim = new Swiper('.swiper-testim', {
                spaceBetween: 0,
                speed: 1000,
                loop: true,
                pagination: {
                    el: '.swiper-testim .swiper-pagination',
                },
                navigation: {
                    nextEl: '.swiper-testim .swiper-button-next',
                    prevEl: '.swiper-testim .swiper-button-prev'
                },
            });
            wayoutsState.swipers.push(swiperTestim);
        }

        if ($('.testimonials .swiper-img').length) {
            var swiperTestimImg = new Swiper('.testimonials .swiper-img', {
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 800,
                loop: true,
                effect: 'fade',
                pagination: {
                    el: '.testimonials .controls .swiper-pagination',
                    type: 'fraction',
                },
                navigation: {
                    nextEl: '.testimonials .controls .next-ctrl',
                    prevEl: '.testimonials .controls .prev-ctrl'
                },
            });
            wayoutsState.swipers.push(swiperTestimImg);
        }

        if ($('.testimonials .swiper-content').length) {
            var swiperTestimContent = new Swiper('.testimonials .swiper-content', {
                slidesPerView: 1,
                spaceBetween: 0,
                speed: 800,
                loop: true,
                pagination: {
                    el: '.testimonials .controls .swiper-pagination',
                    type: 'fraction',
                },
                navigation: {
                    nextEl: '.testimonials .controls .next-ctrl',
                    prevEl: '.testimonials .controls .prev-ctrl'
                },
            });
            wayoutsState.swipers.push(swiperTestimContent);
        }

        if ($(".work-crsol").length) {
            var swiperWork = new Swiper(".work-crsol", {
                slidesPerView: "auto",
                spaceBetween: 60,
                loop: true
            });
            wayoutsState.swipers.push(swiperWork);
        }

        // Team slider (was section 25)
        if ($(".team-slider").length) {
            var swiperTeam = new Swiper(".team-slider", {
                slidesPerView: 4,
                spaceBetween: 25,
                loop: true,
                speed: 900,
                autoplay: false,
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    768: {
                        slidesPerView: 2
                    },
                    1200: {
                        slidesPerView: 4
                    }
                }
            });
            wayoutsState.swipers.push(swiperTeam);
        }

        // Gallery scroll slider (was section 26)
        if ($(".galleryscroll-slider").length) {
            var swiperGalleryScroll = new Swiper(".galleryscroll-slider", {
                slidesPerView: 4,
                spaceBetween: 25,
                loop: true,
                speed: 900,
                autoplay: false,
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    768: {
                        slidesPerView: 2
                    },
                    1200: {
                        slidesPerView: 4
                    }
                }
            });
            wayoutsState.swipers.push(swiperGalleryScroll);
        }

        // Travel hero slider (was section 27)
        if ($('.travel-hero-slider').length) {
            var travelHeroSlider = new Swiper(".travel-hero-slider", {
                grabCursor: true,
                speed: 500,
                effect: "slide",
                loop: false,
                mousewheel: {
                    invert: false,
                    sensitivity: 1,
                    releaseOnEdges: true,
                },
            });
            travelHeroSlider.enable();
            wayoutsState.swipers.push(travelHeroSlider);
        }
    }

    function initIsotope() {
        var $grid = $('.gallery-wrap');
        if ($grid.length && $.fn.isotope) {
            $grid.isotope({
                itemSelector: '.gallery-item',
                percentPosition: true,
                layoutMode: 'masonry',
                transitionDuration: '0.6s'
            });
            var gridIso = $grid.data('isotope');
            if (gridIso) wayoutsState.isotopes.push(gridIso);
            if ($.fn.imagesLoaded) {
                $grid.imagesLoaded(function () {
                    $grid.isotope('layout');
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                });
            }
            // Delegated filter handler — bound once per document, reads the
            // live grid from the DOM so it survives animation refreshes.
            if (!wayoutsState.galleryFilterBound) {
                wayoutsState.galleryFilterBound = true;
                $(document).on('click', '.gallery-filter li', function () {
                    $('.gallery-filter li').removeClass('active');
                    $(this).addClass('active');
                    var filterValue = $(this).attr('data-filter');
                    var $liveGrid = $(this).closest('.gallery-wrap').length
                        ? $(this).closest('.gallery-wrap')
                        : $('.gallery-wrap');
                    $liveGrid.isotope({
                        filter: filterValue
                    });
                    setTimeout(function () {
                        $liveGrid.isotope('layout');
                    }, 50);
                });
            }
        }

        if ($.fn.isotope) {
            var $toursGrid = $('.tours-isotope');
            if ($toursGrid.length) {
                $toursGrid.isotope({
                    itemSelector: '.items'
                });
                var toursIso = $toursGrid.data('isotope');
                if (toursIso) wayoutsState.isotopes.push(toursIso);
            }
        }
    }

    function initMarquee() {
        if ($.fn.marquee) {
            var $marquee = $('.js-marquee-wrapper');
            if ($marquee.length) {
                $marquee.marquee({
                    speed: 100,
                    gap: 30,
                    delayBeforeStart: 0,
                    direction: 'left',
                    duplicated: true,
                    pauseOnHover: true,
                    startVisible: true,
                });
                var mq = $marquee.data('plugin_marquee');
                if (mq) wayoutsState.marquees.push(mq);
            }
        }
    }

    function initCounters() {
        if ($.fn.counterUp) {
            $('.counter').each(function () {
                var $c = $(this);
                if ($c.attr('data-counter-initialized')) return;
                $c.attr('data-counter-initialized', '1');
                $c.counterUp({
                    delay: 10,
                    time: 3000
                });
                wayoutsState.counters.push($c);
            });
        }
    }

    var t2HandlerBound = false;

    function layoutTestimonials2(valueObj) {
        var totalWidth = valueObj.outerWidth(),
            slidingLength = valueObj.find('.item').length;
        if (!slidingLength) return;
        var devideRightPadding = parseInt(valueObj.css('padding-right')) / slidingLength,
            devideLeftPadding = parseInt(valueObj.css('padding-left')) / slidingLength,
            usageWidth = (slidingLength * 12.5) + 12.5 + devideRightPadding + devideLeftPadding,
            useWidth = totalWidth - usageWidth,
            devideLength = slidingLength + 1,
            devideWidth = (useWidth / devideLength),
            activeWidth = devideWidth * 2;
        valueObj.find('.item, .img, .item .cont').css('width', devideWidth);
        valueObj.find('.item .cont').css('left', devideWidth);
        valueObj.find('.item.active').css('width', activeWidth);
    }

    function initTestimonials2() {
        $('.testimonials2').each(function (index, value) {
            layoutTestimonials2($(value));
        });
        // Bind the delegated hover handler only once — it recalculates widths
        // from the live DOM so it stays correct after content refreshes.
        if (!t2HandlerBound) {
            t2HandlerBound = true;
            $(document).on('mouseenter', '.testimonials2 .item', function () {
                var $item = $(this);
                var valueObj = $item.closest('.testimonials2');
                $item.siblings().removeClass('active');
                $item.addClass('active');
                layoutTestimonials2(valueObj);
            });
        }
    }

    function initRollingText() {
        $('.rolling-text').each(function () {
            const $el = $(this);
            if ($el.attr('data-rolling-initialized')) return;
            $el.attr('data-rolling-initialized', '1');
            const innerText = $el.text();
            $el.empty();
            const $textContainer = $('<div>').addClass('block');
            for (const letter of innerText) {
                const $span = $('<span>').addClass('letter').text(letter.trim() === '' ? '\xa0' : letter);
                $textContainer.append($span);
            }
            $el.append($textContainer).append($textContainer.clone());
        });
    }

    function initDataBackgrounds() {
        var pageSection = $(".bg-img, section");
        pageSection.each(function () {
            if ($(this).attr("data-background")) {
                $(this).css("background-image", "url(" + $(this).data("background") + ")");
            }
        });
    }

    function initWOW() {
        if (typeof WOW !== "undefined" && !wayoutsState.wow) {
            var wow = new WOW({
                animateClass: 'animated',
                offset: 100
            });
            wow.init();
            wayoutsState.wow = wow;
        }
    }

    function initPreloaderIntro(force) {
        // Preloader dismissal + hero entrance. In the original static template
        // this ran at document-ready against fully-rendered HTML. Under Next.js
        // the hero header mounts only after Firestore content arrives, so the
        // entrance is deferred until `header .container` exists; a fallback
        // timer guarantees the preloader is dismissed even if content never
        // mounts (error/loading states). Runs exactly once.
        if (wayoutsState.introDone || typeof gsap === "undefined") return;
        var svg = document.getElementById("svg");
        if (!svg) return;

        // Capture the live elements once — selectors evaluated later inside the
        // timeline could match a re-mounted node and orphan the animation.
        var heroHeader = document.querySelector("header");
        var heroContainer = document.querySelector("header .container");

        if (!heroContainer && !force) {
            if (!wayoutsState.introFallback) {
                wayoutsState.introFallback = setTimeout(function () {
                    wayoutsState.introFallback = null;
                    initPreloaderIntro(true);
                }, 2000);
            }
            return;
        }
        if (wayoutsState.introFallback) {
            clearTimeout(wayoutsState.introFallback);
            wayoutsState.introFallback = null;
        }
        wayoutsState.introDone = true;

        const tl = gsap.timeline();
        const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
        const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";
        tl.to(".loader-wrap-heading .load-text, .loader-wrap-heading .cont", {
            delay: 1.5,
            y: -100,
            opacity: 0,
        });
        tl.to(svg, {
            duration: 0.5,
            attr: {
                d: curve
            },
            ease: "power2.easeIn",
        }).to(svg, {
            duration: 0.5,
            attr: {
                d: flat
            },
            ease: "power2.easeOut",
        });
        tl.to(".loader-wrap", {
            y: -1500,
        });
        tl.to(".loader-wrap", {
            zIndex: -1,
            display: "none",
        });
        if (heroHeader && heroContainer) {
            // clearProps on completion so React-owned elements can never be
            // orphaned at opacity:0 / translated if the timeline is interrupted.
            tl.from(heroHeader, {
                y: 200,
                clearProps: "transform",
            }, "-=1.5");
            tl.from(heroContainer, {
                y: 40,
                opacity: 0,
                delay: 0.3,
                clearProps: "opacity,transform",
            }, "-=1.5");
        }
    }

    function refreshSmoother() {
        if (typeof gsap === "undefined" || typeof ScrollSmoother === "undefined") return;
        var smoother = ScrollSmoother.get();
        if (!smoother) return;
        // Re-target the smoother at the current #smooth-content element (React may
        // have re-created it) and re-scan data-speed/data-lag effects.
        try {
            var currentContent = smoother.content();
            var liveContent = document.getElementById('smooth-content');
            if (liveContent && currentContent !== liveContent) {
                smoother.content('#smooth-content');
            }
        } catch (e) { /* noop */ }
        try {
            smoother.effects('[data-speed], [data-lag]');
        } catch (e) { /* noop */ }
    }

    var missedMutations = false;

    function wayoutsRefreshAnimations() {
        if (isAdminPage()) return;

        isRefreshing = true;
        missedMutations = false;
        // Dismiss the preloader / play the hero entrance as soon as the hero
        // header exists (deferred from document.ready while content loads).
        initPreloaderIntro();
        try {
            teardownAnimations();
            initRollingText();
            initDataBackgrounds();
            initWOW();
            initScrollAnimations();
            initSwipers();
            initIsotope();
            initMarquee();
            initCounters();
            initTestimonials2();
            refreshSmoother();

            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
                // Images inside freshly mounted content change the page height
                // as they load. Refresh once more after they arrive.
                var pendingImgs = Array.prototype.slice.call(
                    document.querySelectorAll('#smooth-content img')
                ).filter(function (img) { return !img.complete; });
                if (pendingImgs.length && typeof imagesLoaded !== "undefined") {
                    imagesLoaded(pendingImgs, function () {
                        if (typeof ScrollTrigger !== "undefined") {
                            ScrollTrigger.refresh();
                        }
                    });
                }
            }
        } finally {
            // Quiet period: swallow mutations caused by our own init (Swiper
            // clones, isotope node reordering, rolling-text spans) so the
            // observer never re-triggers itself. If real content arrived
            // during the quiet period, run one more refresh afterwards.
            setTimeout(function () {
                isRefreshing = false;
                if (missedMutations) {
                    missedMutations = false;
                    wayoutsRefreshAnimations();
                }
            }, 400);
        }
        wayoutsState.initialized = true;
    }

    // Expose for React (ScriptLoader / AnimationRefresh component)
    window.wayoutsRefreshAnimations = wayoutsRefreshAnimations;

    /* ==========================================================================
       2. DOCUMENT READY
       ========================================================================== */
    $(document).ready(function () {

        /* ==========================================================================
           WOW ANIMATION
           ========================================================================== */
        initWOW();

        /* ==========================================================================
           3. CURSOR ANIMATION
           ========================================================================== */
        (function () {
            const cursor = document.querySelector('.cursor');
            if (!cursor) return;

            const animateit = function (e) {
                const hoverAnim = this.querySelector('.hover-anim');
                if (!hoverAnim) return;
                const { offsetX: x, offsetY: y } = e;
                const { offsetWidth: width, offsetHeight: height } = this;
                const move = 100;
                const xMove = x / width * (move * 2) - move;
                const yMove = y / height * (move * 2) - move;

                hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
                if (e.type === 'mouseleave') {
                    hoverAnim.style.transform = '';
                }
            };

            const editCursor = e => {
                const { clientX: x, clientY: y } = e;
                cursor.style.left = x + 'px';
                cursor.style.top = y + 'px';
            };

            // Delegated binding — works for .hover-this elements mounted at
            // any time (React/Firestore content included).
            $(document).on('mousemove', '.hover-this', animateit);
            $(document).on('mouseleave', '.hover-this', animateit);
            window.addEventListener('mousemove', editCursor);

            $(document).on('mouseenter', 'a, .cursor-pointer', function () {
                $(".cursor").addClass("cursor-active");
            });
            $(document).on('mouseleave', 'a, .cursor-pointer', function () {
                $(".cursor").removeClass("cursor-active");
            });
        })();

        /* ==========================================================================
           4. SMOOTH SCROLL NAV (SCROLLIT)
           ========================================================================== */
        if ($.scrollIt) {
            $.scrollIt({
                upKey: 38,
                downKey: 40,
                easing: 'linear',
                scrollTime: 600,
                activeClass: 'active',
                onPageChange: null,
                topOffset: -100
            });
        }

        /* ==========================================================================
           5. ONEPAGE MENU CLICK
           ========================================================================== */
        $(document).on('click', 'a[data-scroll-nav]', function (e) {
            var href = $(this).attr('href');
            if (href && href !== "#" && href !== "javascript:void(0)") {
                return;
            }
            e.preventDefault();
            var target = parseInt($(this).attr('data-scroll-nav'), 10);
            var targetSection = $('[data-scroll-index="' + target + '"]');
            if (targetSection.length) {
                $('html, body').animate({
                    scrollTop: targetSection.offset().top - 100
                }, 600);
            }
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-collapse').collapse('hide');
            }
        });

        /* ==========================================================================
           6. NAVBAR SCROLL BACKGROUND
           ========================================================================== */
        wind.on("scroll", function () {
            var bodyScroll = wind.scrollTop(),
                navbar = $(".navbar"),
                logo = $(".navbar .logo > img");
            if (bodyScroll > 100) {
                navbar.addClass("nav-scroll");
                if (navbar.hasClass("nav-inner")) {
                    logo.attr('src', '/assets/img/logo-light.png');
                }
            } else {
                navbar.removeClass("nav-scroll");
                if (navbar.hasClass("nav-inner")) {
                    logo.attr('src', '/assets/img/logo-dark.png');
                } else {
                    logo.attr('src', '/assets/img/logo-light.png');
                }
            }
        });

        /* ==========================================================================
           7. MOBILE MENU CLOSE
           ========================================================================== */
        $(document).on('click', '.navbar-nav .dropdown-item a', function () {
            $(".navbar-collapse").removeClass("show");
        });

        /* ==========================================================================
           8. ROLLING TEXT
           ========================================================================== */
        initRollingText();
        $(document).on('mouseenter', '.rolling-text', function () {
            $(this).removeClass('play');
        });



        /* ==========================================================================
           9. DYNAMIC BACKGROUND IMAGE
           ========================================================================== */
        initDataBackgrounds();

        /* ==========================================================================
           10. YOUTUBE POPUP
           ========================================================================== */
        $(document).on('click', 'a.vid', function (e) {
            e.preventDefault();
            if ($(this).YouTubePopUp) {
                $(this).YouTubePopUp();
            }
        });

        /* ==========================================================================
           11. MAGNIFIC POPUP
           ========================================================================== */
        if ($.fn.magnificPopup) {
            // Delegated bindings — galleries and zoom links may be mounted by
            // React after Firestore data arrives, long after document-ready.
            $(document).magnificPopup({
                delegate: '.gallery .popimg',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
            $(document).magnificPopup({
                delegate: '.img-zoom',
                type: "image",
                closeOnContentClick: true,
                mainClass: "mfp-fade",
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                }
            });
            $(document).magnificPopup({
                delegate: '.magnific-youtube, .magnific-vimeo, .magnific-custom',
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 300,
                preloader: false,
                fixedContentPos: false
            });
            $(document).magnificPopup({
                delegate: '.image-popup-vertical-fit',
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-img-mobile',
                image: {
                    verticalFit: true
                }
            });
        }

        /* ==========================================================================
           12. ISOTOPE GALLERY
           ========================================================================== */
        initIsotope();

        /* ==========================================================================
           13. SCROLL BACK TO TOP
           ========================================================================== */
        var progressPath = document.querySelector('.progress-wrap path');
        if (progressPath) {
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            var updateProgress = function () {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            };
            updateProgress();
            $(window).on('scroll', updateProgress);
            var offset = 150;
            var duration = 550;
            jQuery(window).on('scroll', function () {
                if (jQuery(this).scrollTop() > offset) {
                    jQuery('.progress-wrap').addClass('active-progress');
                } else {
                    jQuery('.progress-wrap').removeClass('active-progress');
                }
            });
            jQuery('.progress-wrap').on('click', function (event) {
                event.preventDefault();
                jQuery('html, body').animate({
                    scrollTop: 0
                }, duration);
                return false;
            });
        }

        /* ==========================================================================
           14. ACCORDION FAQ
           ========================================================================== */
        if ($(".accordion-box").length) {
            $(document).on("click", ".accordion-box .acc-btn", function () {
                var outerBox = $(this).closest(".accordion-box");
                var target = $(this).closest(".accordion");
                if ($(this).next(".acc-content").is(":visible")) {
                    $(this).removeClass("active");
                    $(this).next(".acc-content").slideUp(300);
                    outerBox.children(".accordion").removeClass("active-block");
                } else {
                    outerBox.find(".accordion .acc-btn").removeClass("active");
                    $(this).addClass("active");
                    outerBox.children(".accordion").removeClass("active-block");
                    outerBox.find(".accordion").children(".acc-content").slideUp(300);
                    target.addClass("active-block");
                    $(this).next(".acc-content").slideDown(300);
                }
            });
        }

        /* ==========================================================================
           15. CUSTOM MAGNIFIC POPUP
           ========================================================================== */
        $(document).on('click', '.popup-img', function (e) {
            e.preventDefault();
            var src = $(this).attr('href') || $(this).data('src');
            var galleryName = $(this).data('gallery');
            var items;
            var galleryEnabled = false;
            var index = 0;
            if (galleryName) {
                items = $('.popup-img').filter('[data-gallery="' + galleryName + '"]').map(function () {
                    return {
                        src: $(this).attr('href') || $(this).data('src')
                    };
                }).get();
                galleryEnabled = true;
                index = items.findIndex(function (it) {
                    return it.src === src;
                });
            } else {
                items = {
                    src: src
                };
            }
            $.magnificPopup.open({
                items: items,
                type: 'image',
                gallery: {
                    enabled: galleryEnabled
                },
                image: {
                    markup: '<div class="mfp-figure">' + '<div class="close-btn close-icon" role="button">&#215;</div>' + '<div class="mfp-img"></div>' + '<div class="close-btn close-bottom" role="button">閉じる</div>' + '</div>'
                },
                index: index,
                callbacks: {
                    open: function () {
                        $(document).off('click.mfpClose', '.close-btn').on('click.mfpClose', '.close-btn', function () {
                            $.magnificPopup.close();
                        });
                    },
                    close: function () {
                        $(document).off('click.mfpClose', '.close-btn');
                    }
                }
            });
        });

        /* ==========================================================================
           16. BUTTON ACTIVE TOGGLE
           ========================================================================== */
        $(document).on('click', '.butn-arrow, .butn-arrow2', function () {
            $(this).toggleClass('active');
        });

        /* ==========================================================================
           17. GSAP SVG PRELOADER + HERO INTRO (deferred until hero mounts —
               re-invoked from wayoutsRefreshAnimations when content arrives)
           ========================================================================== */
        initPreloaderIntro();



        /* ==========================================================================
           18. GSAP SCROLLTRIGGER ANIMATIONS
           ========================================================================== */
        initScrollAnimations();

        /* ==========================================================================
           19. MARQUEE
           ========================================================================== */
        initMarquee();

        /* ==========================================================================
           20. COUNTER
           ========================================================================== */
        initCounters();

        /* ==========================================================================
           21. SWIPER SLIDER
           ========================================================================== */
        initSwipers();

        /* ==========================================================================
           22. TESTIMONIALS 2 OWLCAROUSEL
           ========================================================================== */
        initTestimonials2();

        /* ==========================================================================
           28b. MUTATION OBSERVER — re-init animations when React mounts content
           ========================================================================== */
        if (!isAdminPage() && 'MutationObserver' in window) {
            var refreshPending = false;
            wayoutsState.observer = new MutationObserver(function (mutations) {
                // Ignore mutations caused by our own animation setup — the
                // isRefreshing quiet period in wayoutsRefreshAnimations()
                // covers Swiper clones, isotope reordering and rolling-text
                // spans, all of which are applied synchronously during init.
                // Real content arriving during the quiet period is flagged
                // and triggers one follow-up refresh.
                if (isRefreshing) {
                    missedMutations = true;
                    return;
                }

                var hasRelevantChange = false;
                for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.type === 'childList' && m.addedNodes.length > 0) {
                        hasRelevantChange = true;
                        break;
                    }
                }
                if (!hasRelevantChange) return;

                if (refreshPending) return;
                refreshPending = true;
                // Debounce: wait for the DOM to settle (React commits + images start
                // loading) before tearing down and rebuilding animations.
                setTimeout(function () {
                    refreshPending = false;
                    wayoutsRefreshAnimations();
                }, 300);
            });
            wayoutsState.observer.observe(document.getElementById('smooth-wrapper') || document.body, {
                childList: true,
                subtree: true
            });
        }
    });

    /* ==========================================================================
       23. WINDOW LOAD
       ========================================================================== */
    wind.on("load", function () {
        var body = $('body');
        body.addClass('loaded');
        setTimeout(function () {
            body.removeClass('loaded');
        }, 1500);
    });

})(jQuery);
