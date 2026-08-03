"use strict";


/* =========================================================
   БАРБЕРШОП «ТОПОР»
   Модальное окно с информацией о мастерах
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initMastersModal();
});


function initMastersModal() {
    const modal = document.getElementById("masterModal");
    const closeButton = document.getElementById("masterModalClose");
    const masterCards = document.querySelectorAll(".master-card");

    if (!modal || !closeButton || !masterCards.length) {
        return;
    }

    const masterData = {
        alexander: {
            name: "Александр Морозов",
            label: "Топ-барбер",
            role: "Мужские стрижки и классический стиль",
            description:
                "Александр специализируется на классических мужских стрижках, точных формах и работе с бородой. Умеет подобрать образ, который легко поддерживать дома.",
            experience: "9 лет",
            specialization: "Классика, борода, бритьё",
            schedule: "Пн, Вт, Чт, Пт, Сб",
            photo: "images/masters/master-01.jpg",
            gallery: [
    "images/master-galleries/master-01/classic-01.jpg"
]
        },

        maxim: {
            name: "Максим Волков",
            label: "Барбер-стилист",
            role: "Современные формы и текстурные стрижки",
            description:
                "Максим работает с современными мужскими образами, текстурой и удлинёнными формами. Особое внимание уделяет деталям и естественной укладке.",
            experience: "6 лет",
            specialization: "Текстура, удлинённые формы, укладка",
            schedule: "Вт, Ср, Пт, Сб, Вс",
            photo: "images/masters/master-02.jpg",
            gallery: [
    "images/master-galleries/master-03/beard-01.jpg"
]
        },

        dmitry: {
            name: "Дмитрий Орлов",
            label: "Мастер бороды",
            role: "Моделирование бороды и королевское бритьё",
            description:
                "Дмитрий специализируется на бороде, усах и классическом бритье. Подбирает форму с учётом роста волос и особенностей лица.",
            experience: "7 лет",
            specialization: "Борода, усы, опасная бритва",
            schedule: "Пн, Ср, Чт, Сб, Вс",
            photo: "images/masters/master-03.jpg",
            gallery: [
    "images/master-galleries/master-03/beard-01.jpg"
]
        },

        artem: {
            name: "Артём Крылов",
            label: "Барбер",
            role: "Короткие стрижки и спортивный стиль",
            description:
                "Артём любит чистые короткие формы, практичные стрижки и аккуратную геометрию. Работает быстро, внимательно и без лишней суеты.",
            experience: "4 года",
            specialization: "Короткие стрижки, кроп, машинка",
            schedule: "Пн, Вт, Ср, Пт, Вс",
            photo: "images/masters/master-04.jpg",
            gallery: [
    "images/master-galleries/master-04/long-01.jpg"
]
        },

        roman: {
            name: "Роман Беляев",
            label: "Топ-барбер",
            role: "Сложные формы и полный образ",
            description:
                "Роман работает со сложными формами, коррекцией образа и комплексными услугами. Часто помогает клиентам полностью изменить стиль.",
            experience: "10 лет",
            specialization: "Сложные формы, комбо, камуфляж",
            schedule: "Вт, Ср, Чт, Сб, Вс",
            photo: "images/masters/master-05.jpg",
            gallery: [
    "images/master-galleries/master-05/modern-01.jpg"
]
        },

        nikita: {
            name: "Никита Серов",
            label: "Fade-специалист",
            role: "Плавные переходы и современная геометрия",
            description:
                "Никита специализируется на fade-техниках, чётких контурах и современных коротких стрижках. Особенно внимателен к симметрии и деталям.",
            experience: "5 лет",
            specialization: "Fade, crop, короткие формы",
            schedule: "Пн, Ср, Чт, Пт, Сб",
            photo: "images/masters/master-06.jpg",
            gallery: [
    "images/master-galleries/master-06/premium-01.jpg"
]
        }
    };

    const modalPhoto = document.getElementById("modalMasterPhoto");
    const modalName = document.getElementById("modalMasterName");
    const modalLabel = document.getElementById("modalMasterLabel");
    const modalRole = document.getElementById("modalMasterRole");
    const modalDescription = document.getElementById(
        "modalMasterDescription"
    );
    const modalExperience = document.getElementById(
        "modalMasterExperience"
    );
    const modalSpecialization = document.getElementById(
        "modalMasterSpecialization"
    );
    const modalSchedule = document.getElementById(
        "modalMasterSchedule"
    );
    const modalGallery = document.getElementById(
        "modalMasterGallery"
    );
    const modalBookingLink = document.getElementById(
        "modalBookingLink"
    );

    let lastFocusedElement = null;

    const openModal = (masterKey) => {
        const master = masterData[masterKey];

        if (!master) {
            return;
        }

        lastFocusedElement = document.activeElement;

        modalPhoto.src = master.photo;
        modalPhoto.alt = master.name;

        modalName.textContent = master.name;
        modalLabel.textContent = master.label;
        modalRole.textContent = master.role;
        modalDescription.textContent = master.description;
        modalExperience.textContent = master.experience;
        modalSpecialization.textContent = master.specialization;
        modalSchedule.textContent = master.schedule;

        modalBookingLink.href =
            `contacts.html?master=${encodeURIComponent(master.name)}#booking`;

        modalGallery.innerHTML = "";

        master.gallery.forEach((imagePath, index) => {
            const image = document.createElement("img");

            image.src = imagePath;
            image.alt = `${master.name}, работа ${index + 1}`;
            image.loading = "lazy";

            modalGallery.appendChild(image);
        });

        modal.classList.add("active");
        document.body.classList.add("modal-open");

        closeButton.focus();
    };

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    masterCards.forEach((card) => {
        card.addEventListener("click", () => {
            openModal(card.dataset.master);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(card.dataset.master);
            }
        });
    });

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }

        if (event.key === "Tab" && modal.classList.contains("active")) {
            trapFocus(event, modal);
        }
    });
}


function trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement =
        focusableElements[focusableElements.length - 1];

    if (
        event.shiftKey &&
        document.activeElement === firstElement
    ) {
        event.preventDefault();
        lastElement.focus();
    } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
    ) {
        event.preventDefault();
        firstElement.focus();
    }
}
