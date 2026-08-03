"use strict";

/* =========================================================
   БАРБЕРШОП «ТОПОР»
   Яндекс Карта
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initYandexMap();
});


function initYandexMap() {
    const mapContainer = document.getElementById("barbershopMap");

    if (!mapContainer) {
        return;
    }

    if (typeof ymaps === "undefined") {
        showMapError(
            mapContainer,
            "Карта не загрузилась. Проверьте подключение к интернету."
        );

        return;
    }

    ymaps.ready(() => {
        createMap(mapContainer);
    });
}


function createMap(mapContainer) {
    try {
        /*
         * Координаты сейчас примерные.
         * Перед публикацией сайта замените их на точные координаты
         * реального адреса барбершопа.
         */
        const barbershopCoordinates = [
            59.9318,
            30.3553
        ];

        const map = new ymaps.Map(
            mapContainer,
            {
                center: barbershopCoordinates,
                zoom: 16,
                controls: [
                    "zoomControl",
                    "fullscreenControl"
                ]
            },
            {
                suppressMapOpenBlock: true
            }
        );

        const placemark = new ymaps.Placemark(
            barbershopCoordinates,
            {
                balloonContentHeader: "Барбершоп «Топор»",
                balloonContentBody:
                    "Санкт-Петербург, Невский проспект, 88",
                balloonContentFooter:
                    "Ежедневно с 10:00"
            },
            {
                preset: "islands#brownBarberIcon",
                iconColor: "#B87333"
            }
        );

        map.geoObjects.add(placemark);

        map.behaviors.disable("scrollZoom");

        map.events.add("click", () => {
            map.behaviors.enable("scrollZoom");
        });

        mapContainer.addEventListener("mouseleave", () => {
            map.behaviors.disable("scrollZoom");
        });

        if (window.innerWidth <= 768) {
            map.behaviors.disable("drag");
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 768) {
                map.behaviors.disable("drag");
            } else {
                map.behaviors.enable("drag");
            }
        });
    } catch (error) {
        console.error("Ошибка инициализации карты:", error);

        showMapError(
            mapContainer,
            "Не удалось отобразить карту."
        );
    }
}


function showMapError(container, message) {
    container.innerHTML = `
        <div
            style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                min-height: 320px;
                padding: 30px;
                color: #c4c4c4;
                background: #131313;
                text-align: center;
            "
        >
            <p style="margin: 0;">
                ${message}
            </p>
        </div>
    `;
}
