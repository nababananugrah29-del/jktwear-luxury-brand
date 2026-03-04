/* ============================================================
   JKTWear — Luxury Motion System
   Pre-Loader + GSAP + ScrollTrigger + SplitType + Lenis
   ============================================================ */

// --- FORCE START AT TOP (HERO SECTION) ---
// Prevent browser from remembering last scroll position
if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Remove hash from URL so it doesn't auto-jump
if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname);
}

// Ensure we're still at top after everything loads
window.addEventListener("load", () => {
    setTimeout(() => window.scrollTo(0, 0), 10);
});

// --- MAIN APPLICATION ---
(() => {
    "use strict";

    // ── 0. REGISTER GSAP PLUGINS ────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ── 1. LENIS SMOOTH SCROLL ──────────────────────────────
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
    });

    // Lock scroll during preloader
    lenis.stop();

    // Sync Lenis → GSAP ticker
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ── 2. GLOBAL EASING ────────────────────────────────────
    const EASE_EXPO = "expo.out";
    const EASE_POWER = "power4.out";

    // ── 3. PRE-LOADER ANIMATION ─────────────────────────────
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            // Remove preloader from DOM after animation
            document.getElementById("preloader").remove();
            // Unlock smooth scroll
            lenis.start();
            // Launch entrance animations
            playEntranceAnimations();
            // Initialize scroll-triggered animations
            initScrollAnimations();
        },
    });

    // 3a. Logo fades in
    preloaderTl.from(".preloader-logo", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: EASE_POWER,
    });

    // 3b. Gold line expands
    preloaderTl.to(".preloader-line", {
        width: 80,
        duration: 0.6,
        ease: EASE_EXPO,
    }, "-=0.3");

    // 3c. Sub-text appears
    preloaderTl.to(".preloader-sub", {
        opacity: 0.5,
        duration: 0.5,
        ease: EASE_POWER,
    }, "-=0.2");

    // 3d. Hold for a beat
    preloaderTl.to({}, { duration: 0.4 });

    // 3e. Everything fades up & out
    preloaderTl.to(".preloader-inner", {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
    });

    // 3f. Overlay itself fades away
    preloaderTl.to("#preloader", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
    }, "-=0.3");

    // ── 4. ENTRANCE ANIMATIONS (after preloader) ────────────
    function playEntranceAnimations() {
        const masterTl = gsap.timeline();

        // 4a. Nav slides down
        masterTl.from("nav", {
            yPercent: -100,
            opacity: 0,
            duration: 1.2,
            ease: EASE_EXPO,
        });

        // 4b. Hero tag line
        masterTl.from(".hero-tag", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: EASE_POWER,
        }, "-=0.8");

        // 4c. Hero title — split into individual characters
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) {
            const heroSplit = new SplitType(heroTitle, { types: "chars" });
            masterTl.from(heroSplit.chars, {
                y: 100,
                opacity: 0,
                rotateX: -50,
                stagger: 0.03,
                duration: 1.4,
                ease: EASE_EXPO,
            }, "-=0.6");
        }

        // 4d. CTA Button
        masterTl.from(".btn-gold", {
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: EASE_POWER,
        }, "-=0.7");
    }

    // ── 5. SCROLL-TRIGGERED ANIMATIONS ──────────────────────
    function initScrollAnimations() {

        // ── 5a. Text splitting for h2 headings ──────────────
        document.querySelectorAll("[data-split]").forEach((el) => {
            if (el.classList.contains("hero-title")) return;

            const split = new SplitType(el, { types: "chars" });

            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                rotateX: -30,
                stagger: 0.025,
                duration: 1,
                ease: EASE_EXPO,
            });
        });

        // ── 5b. Philosophy section ──────────────────────────
        gsap.from(".divider-gold", {
            scrollTrigger: {
                trigger: ".philosophy",
                start: "top 75%",
            },
            scaleX: 0,
            duration: 1.5,
            ease: EASE_EXPO,
        });

        gsap.from(".philosophy p", {
            scrollTrigger: {
                trigger: ".philosophy p",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1.4,
            ease: EASE_POWER,
            delay: 0.3,
        });

        // ── 5c. Section header ──────────────────────────────
        gsap.from(".section-header", {
            scrollTrigger: {
                trigger: ".section-header",
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: EASE_POWER,
        });

        // ── 5d. Product cards — staggered entrance ──────────
        gsap.from(".product-card", {
            scrollTrigger: {
                trigger: ".grid-container",
                start: "top 80%",
            },
            y: 120,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: EASE_EXPO,
        });

        // ── 5e. Product images — parallax (slower movement) ─
        document.querySelectorAll(".product-image img").forEach((img) => {
            gsap.fromTo(img, {
                yPercent: -15,
                scale: 1.15,
            }, {
                yPercent: 15,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: img.closest(".product-image"),
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                },
            });
        });

        // ── 5f. Quality section ─────────────────────────────
        const qualitySection = document.querySelector(".quality-section");
        if (qualitySection) {
            gsap.from(".quality-content p", {
                scrollTrigger: {
                    trigger: ".quality-content",
                    start: "top 75%",
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: EASE_POWER,
                delay: 0.4,
            });

            gsap.from(".btn-text-gold", {
                scrollTrigger: {
                    trigger: ".quality-content",
                    start: "top 70%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: EASE_POWER,
                delay: 0.6,
            });

            // Quality image — parallax scale reveal
            gsap.from(".quality-image-wrapper", {
                scrollTrigger: {
                    trigger: ".quality-section",
                    start: "top 80%",
                    end: "bottom 30%",
                    scrub: 1,
                },
                y: 80,
                scale: 0.92,
                opacity: 0,
                ease: "none",
            });

            // Inner image parallax
            gsap.fromTo(".quality-image-wrapper img", {
                yPercent: -10,
                scale: 1.2,
            }, {
                yPercent: 10,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".quality-section",
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1.5,
                },
            });
        }

        // ── 5g. Footer columns — staggered ──────────────────
        gsap.from(".footer-column", {
            scrollTrigger: {
                trigger: ".footer-grid",
                start: "top 85%",
            },
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: EASE_EXPO,
        });

        gsap.from(".footer-bottom", {
            scrollTrigger: {
                trigger: ".footer-bottom",
                start: "top 95%",
            },
            y: 20,
            opacity: 0,
            duration: 1,
            ease: EASE_POWER,
        });
    }

    // ── 6. MAGNETIC CURSOR on CTA BUTTONS ───────────────────
    document.querySelectorAll(".btn-gold, .btn-text-gold").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out",
            });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.4)",
            });
        });
    });

    // ── 7. SMOOTH ANCHOR LINK SCROLLING ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            lenis.scrollTo(targetEl, {
                offset: -80,
                duration: 1.6,
            });
        });
    });

    // ── 8. CUSTOM LUXURY CURSOR ─────────────────────────────
    const cursorRing = document.getElementById("cursor-ring");
    const cursorDot = document.getElementById("cursor-dot");

    if (cursorRing && cursorDot) {
        // GSAP quickTo for smooth, performant trailing
        const ringX = gsap.quickTo(cursorRing, "left", { duration: 0.15, ease: "power2.out" });
        const ringY = gsap.quickTo(cursorRing, "top", { duration: 0.15, ease: "power2.out" });
        const dotX = gsap.quickTo(cursorDot, "left", { duration: 0.08, ease: "power2.out" });
        const dotY = gsap.quickTo(cursorDot, "top", { duration: 0.08, ease: "power2.out" });

        // Show cursor on first move
        let cursorVisible = false;
        window.addEventListener("mousemove", (e) => {
            if (!cursorVisible) {
                cursorVisible = true;
                gsap.to([cursorRing, cursorDot], { opacity: 1, duration: 0.4 });
            }
            ringX(e.clientX);
            ringY(e.clientY);
            dotX(e.clientX);
            dotY(e.clientY);
        });

        // Hide when mouse leaves window
        document.addEventListener("mouseleave", () => {
            cursorVisible = false;
            gsap.to([cursorRing, cursorDot], { opacity: 0, duration: 0.3 });
        });

        // Hover effect on interactive elements
        const interactiveEls = document.querySelectorAll("a, button, input, .product-card");
        interactiveEls.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursorRing.classList.add("cursor-hover");
                cursorDot.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                cursorRing.classList.remove("cursor-hover");
                cursorDot.classList.remove("cursor-hover");
            });
        });
    }

    // ── 9. 3D TILT EFFECT on PRODUCT IMAGES ─────────────────
    const MAX_TILT = 8; // degrees — subtle & elegant

    document.querySelectorAll(".product-image").forEach((card) => {
        const img = card.querySelector("img");

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            // Mouse position relative to center (-0.5 to 0.5)
            const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
            const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

            // Invert Y for natural tilt feel (tilt toward cursor)
            const rotateY = xRatio * MAX_TILT * 2;
            const rotateX = -yRatio * MAX_TILT * 2;

            gsap.to(img, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 800,
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(img, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.5)",
                transformPerspective: 800,
            });
        });
    });

    // ── 10. MOBILE HAMBURGER MENU ───────────────────────────
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu-links a");
    const mobileTag = document.querySelector(".mobile-menu-tag");
    let menuOpen = false;

    function openMenu() {
        menuOpen = true;
        hamburger.classList.add("active");
        mobileMenu.classList.add("open");
        lenis.stop();

        // GSAP stagger entrance
        const tl = gsap.timeline();
        tl.fromTo(mobileMenu, {
            opacity: 0,
        }, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        });
        tl.fromTo(".mobile-menu-links li", {
            y: 60,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: EASE_EXPO,
        }, "-=0.2");
        tl.fromTo(mobileTag, {
            opacity: 0,
        }, {
            opacity: 0.25,
            duration: 0.5,
        }, "-=0.3");
    }

    function closeMenu() {
        menuOpen = false;
        hamburger.classList.remove("active");

        gsap.to(".mobile-menu-links li", {
            y: -40,
            opacity: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: "power2.in",
        });
        gsap.to(mobileMenu, {
            opacity: 0,
            duration: 0.4,
            delay: 0.2,
            ease: "power2.in",
            onComplete: () => {
                mobileMenu.classList.remove("open");
                lenis.start();
            },
        });
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            menuOpen ? closeMenu() : openMenu();
        });

        // Backup close button
        const closeBtn = document.getElementById("mobile-menu-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => closeMenu());
        }

        // Close menu when a link is clicked & smooth scroll
        mobileLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;

                e.preventDefault();
                closeMenu();

                // Scroll after menu close animation finishes
                setTimeout(() => {
                    lenis.scrollTo(targetEl, {
                        offset: -80,
                        duration: 1.6,
                    });
                }, 600);
            });
        });
    }

    // ── 11. VIP ACCESS MODAL ────────────────────────────────
    const btnInquire = document.getElementById("btn-inquire");
    const modal = document.getElementById("access-modal");
    const modalBox = modal ? modal.querySelector(".modal-box") : null;
    const modalCloseBtn = document.getElementById("modal-close");
    const modalForm = document.getElementById("modal-form");

    function openModal() {
        if (!modal) return;
        console.log("Button Clicked! Opening VIP Modal...");
        modal.classList.add("active");
        lenis.stop();

        const tl = gsap.timeline();
        tl.fromTo(modal, { opacity: 0 }, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        });
        tl.fromTo(modalBox, {
            scale: 0.9,
            opacity: 0,
            y: 30,
        }, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "expo.out",
        }, "-=0.2");
    }

    function closeModal() {
        if (!modal) return;
        gsap.to(modalBox, {
            scale: 0.95,
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
        });
        gsap.to(modal, {
            opacity: 0,
            duration: 0.35,
            delay: 0.15,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.remove("active");
                lenis.start();
            },
        });
    }

    if (btnInquire) {
        btnInquire.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // Also open modal from "Privé Access" nav link(s)
    document.querySelectorAll('a[href="#prive"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeModal);
    }

    // Close on overlay click (outside modal box)
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Form submit — secret code validation
    const SECRET_CODE = "JKTWEAR";
    const modalError = document.getElementById("modal-error");

    if (modalForm) {
        modalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const codeInput = document.getElementById("modal-code");
            if (!codeInput) return;

            const value = codeInput.value.trim();

            if (value.toUpperCase() === SECRET_CODE) {
                // ✅ Correct code
                codeInput.classList.remove("error");
                if (modalError) modalError.classList.remove("visible");

                closeModal();
                setTimeout(() => {
                    alert("Welcome to the Inner Circle.");
                    codeInput.value = "";

                    // Scroll to Collection section
                    const collection = document.querySelector("#collection");
                    if (collection && lenis) {
                        lenis.scrollTo(collection, { offset: -80, duration: 1.6 });
                    }
                }, 500);
            } else {
                // ❌ Wrong code — shake + red border
                codeInput.classList.add("error");
                if (modalError) modalError.classList.add("visible");

                // Remove shake after animation ends so it can re-trigger
                setTimeout(() => codeInput.classList.remove("error"), 600);
                // Auto-hide error after 3s
                setTimeout(() => {
                    if (modalError) modalError.classList.remove("visible");
                }, 3000);
            }
        });
    }

})();
