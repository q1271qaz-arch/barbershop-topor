"use strict";

/* =========================================================
   БАРБЕРШОП «ТОПОР»
   Фильтрация услуг без перезагрузки страницы
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initServicesFilter();
});


function initServicesFilter() {
    const filterButtons = document.querySelectorAll(".filter-button");
    const serviceCards = document.querySelectorAll(".service-card");

    if (!filterButtons.length || !serviceCards.length) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            serviceCards.forEach((card) => {
                const cardCategory = card.dataset.category;
                const shouldShow =
                    selectedFilter === "all" ||
                    cardCategory === selectedFilter;

                if (shouldShow) {
                    card.classList.remove("hidden");
                    restartCardAnimation(card);
                } else {
                    card.classList.add("hidden");
                }
            });

            refreshAOS();
        });
    });
}


function restartCardAnimation(card) {
    card.style.animation = "none";

    void card.offsetWidth;

    card.style.animation = "";
}


function refreshAOS() {
    if (typeof AOS !== "undefined") {
        AOS.refreshHard();
    }
}
