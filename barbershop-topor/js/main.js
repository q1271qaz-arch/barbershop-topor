"use strict";


/* =========================================================
   БАРБЕРШОП «ТОПОР»
   Основной JavaScript сайта
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initAOS();
    initMobileMenu();
    initHeaderScroll();
    initWorksSlider();
    initScrollTop();
    initCurrentYear();
});


/* =========================================================
   1. AOS — АНИМАЦИИ ПРИ ПРОКРУТКЕ
   ========================================================= */

function initAOS() {
    if (typeof AOS === "undefined") {
        return;
    }

    AOS.init({
        duration: 850,
        easing: "ease-out-cubic",
        once: true,
        offset: 70,
        delay: 0,
        anchorPlacement: "top-bottom",
        disable: false
    });
}


/* =========================================================
   2. МОБИЛЬНОЕ МЕНЮ
   ========================================================= */

function initMobileMenu() {
    const navigation = document.getElementById("navigation");
    const menuOpenButton = document.getElementById("menuOpen");
    const menuCloseButton = document.getElementById("menuClose");
    const pageOverlay = document.getElementById("pageOverlay");
    const navigationLinks = document.querySelectorAll(".navigation__link");

    if (
        !navigation ||
        !menuOpenButton ||
        !menuCloseButton ||
        !pageOverlay
    ) {
        return;
    }

    const openMenu = () => {
        navigation.classList.add("active");
        pageOverlay.classList.add("active");
        document.body.classList.add("menu-open");

        menuOpenButton.setAttribute("aria-expanded", "true");
        menuCloseButton.focus();
    };

    const closeMenu = () => {
        navigation.classList.remove("active");
        pageOverlay.classList.remove("active");
        document.body.classList.remove("menu-open");

        menuOpenButton.setAttribute("aria-expanded", "false");
    };

    menuOpenButton.addEventListener("click", openMenu);
    menuCloseButton.addEventListener("click", closeMenu);
    pageOverlay.addEventListener("click", closeMenu);

    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("active")) {
            closeMenu();
            menuOpenButton.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });
}


/* =========================================================
   3. ИЗМЕНЕНИЕ ШАПКИ ПРИ ПРОКРУТКЕ
   ========================================================= */

function initHeaderScroll() {
    const header = document.getElementById("header");

    if (!header) {
        return;
    }

    const updateHeader = () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });
}


/* =========================================================
   4. СЛАЙДЕР РАБОТ
   ========================================================= */

function initWorksSlider() {
    const sliderElement = document.querySelector(".works-slider");

    if (!sliderElement || typeof Swiper === "undefined") {
        return;
    }

    new Swiper(sliderElement, {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 750,
        loop: true,
        grabCursor: true,
        watchOverflow: true,

        autoplay: {
            delay: 4200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },

        navigation: {
            nextEl: ".works-slider-next",
            prevEl: ".works-slider-prev"
        },

        pagination: {
            el: ".works-pagination",
            clickable: true
        },

        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        a11y: {
            enabled: true,
            prevSlideMessage: "Предыдущая работа",
            nextSlideMessage: "Следующая работа",
            firstSlideMessage: "Это первая работа",
            lastSlideMessage: "Это последняя работа",
            paginationBulletMessage: "Перейти к работе {{index}}"
        },

        breakpoints: {
            576: {
                slidesPerView: 1.35,
                spaceBetween: 18
            },

            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },

            1100: {
                slidesPerView: 3,
                spaceBetween: 22
            }
        }
    });
}


/* =========================================================
   5. КНОПКА «НАВЕРХ»
   ========================================================= */

function initScrollTop() {
    const scrollTopButton = document.getElementById("scrollTop");

    if (!scrollTopButton) {
        return;
    }

    const updateButtonVisibility = () => {
        if (window.scrollY > 500) {
            scrollTopButton.classList.add("visible");
        } else {
            scrollTopButton.classList.remove("visible");
        }
    };

    updateButtonVisibility();

    window.addEventListener("scroll", updateButtonVisibility, {
        passive: true
    });

    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   6. ТЕКУЩИЙ ГОД В ПОДВАЛЕ
   ========================================================= */

function initCurrentYear() {
    const currentYearElement = document.getElementById("currentYear");

    if (!currentYearElement) {
        return;
    }

    currentYearElement.textContent = new Date().getFullYear();
}
