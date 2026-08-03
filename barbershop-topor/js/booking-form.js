"use strict";

/* =========================================================
   БАРБЕРШОП «ТОПОР»
   Валидация и отправка формы через EmailJS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initBookingForm();
});


function initBookingForm() {
    const form = document.getElementById("bookingForm");

    if (!form) {
        return;
    }

    const nameInput = document.getElementById("clientName");
    const phoneInput = document.getElementById("clientPhone");
    const serviceSelect = document.getElementById("serviceSelect");
    const masterSelect = document.getElementById("masterSelect");
    const dateInput = document.getElementById("bookingDate");
    const privacyCheckbox = document.getElementById("privacyConsent");
    const submitButton = document.getElementById("bookingSubmit");
    const formStatus = document.getElementById("formStatus");

    setMinimumBookingDate(dateInput);
    setMasterFromUrl(masterSelect);
    initPhoneMask(phoneInput);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearFormStatus(formStatus);

        const isValid = validateForm({
            nameInput,
            phoneInput,
            serviceSelect,
            masterSelect,
            dateInput,
            privacyCheckbox
        });

        if (!isValid) {
            showFormStatus(
                formStatus,
                "Проверьте заполнение обязательных полей.",
                "error"
            );

            focusFirstInvalidField(form);
            return;
        }

        setSubmitLoading(submitButton, true);

        try {
            await simulateFormSending();

            showFormStatus(
                formStatus,
                "Заявка отправлена. Администратор свяжется с вами для подтверждения записи.",
                "success"
            );

            form.reset();
            setMinimumBookingDate(dateInput);
            setMasterFromUrl(masterSelect);
        } catch (error) {
            console.error("Ошибка отправки формы:", error);

            showFormStatus(
                formStatus,
                "Не удалось отправить заявку. Проверьте настройки EmailJS или попробуйте позже.",
                "error"
            );
        } finally {
            setSubmitLoading(submitButton, false);
        }
    });

    const fields = [
        nameInput,
        phoneInput,
        serviceSelect,
        masterSelect,
        dateInput,
        privacyCheckbox
    ];

    fields.forEach((field) => {
        if (!field) {
            return;
        }

        const eventName =
            field.type === "checkbox" || field.tagName === "SELECT"
                ? "change"
                : "input";

        field.addEventListener(eventName, () => {
            validateSingleField(field);
        });
    });
}


/* =========================================================
   ДАТА
   ========================================================= */

function setMinimumBookingDate(dateInput) {
    if (!dateInput) {
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}


/* =========================================================
   ВЫБОР МАСТЕРА ИЗ ССЫЛКИ
   ========================================================= */

function setMasterFromUrl(masterSelect) {
    if (!masterSelect) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const masterName = urlParams.get("master");

    if (!masterName) {
        return;
    }

    const optionExists = Array.from(masterSelect.options).some(
        (option) => option.value === masterName
    );

    if (optionExists) {
        masterSelect.value = masterName;
    }
}


/* =========================================================
   МАСКА ТЕЛЕФОНА
   ========================================================= */

function initPhoneMask(phoneInput) {
    if (!phoneInput) {
        return;
    }

    phoneInput.addEventListener("input", () => {
        let digits = phoneInput.value.replace(/\D/g, "");

        if (!digits) {
            phoneInput.value = "";
            return;
        }

        if (digits.startsWith("8")) {
            digits = `7${digits.slice(1)}`;
        }

        if (!digits.startsWith("7")) {
            digits = `7${digits}`;
        }

        digits = digits.slice(0, 11);

        const country = digits.slice(0, 1);
        const area = digits.slice(1, 4);
        const firstPart = digits.slice(4, 7);
        const secondPart = digits.slice(7, 9);
        const thirdPart = digits.slice(9, 11);

        let formatted = `+${country}`;

        if (area) {
            formatted += ` (${area}`;
        }

        if (area.length === 3) {
            formatted += ")";
        }

        if (firstPart) {
            formatted += ` ${firstPart}`;
        }

        if (secondPart) {
            formatted += `-${secondPart}`;
        }

        if (thirdPart) {
            formatted += `-${thirdPart}`;
        }

        phoneInput.value = formatted;
    });

    phoneInput.addEventListener("keydown", (event) => {
        if (
            event.key === "Backspace" &&
            phoneInput.value.replace(/\D/g, "").length <= 1
        ) {
            phoneInput.value = "";
        }
    });
}


/* =========================================================
   ВАЛИДАЦИЯ ВСЕЙ ФОРМЫ
   ========================================================= */

function validateForm(fields) {
    const results = [
        validateName(fields.nameInput),
        validatePhone(fields.phoneInput),
        validateRequiredSelect(fields.serviceSelect),
        validateRequiredSelect(fields.masterSelect),
        validateDate(fields.dateInput),
        validatePrivacy(fields.privacyCheckbox)
    ];

    return results.every(Boolean);
}


/* =========================================================
   ВАЛИДАЦИЯ ОДНОГО ПОЛЯ
   ========================================================= */

function validateSingleField(field) {
    if (!field) {
        return true;
    }

    switch (field.id) {
        case "clientName":
            return validateName(field);

        case "clientPhone":
            return validatePhone(field);

        case "serviceSelect":
        case "masterSelect":
            return validateRequiredSelect(field);

        case "bookingDate":
            return validateDate(field);

        case "privacyConsent":
            return validatePrivacy(field);

        default:
            return true;
    }
}


/* =========================================================
   ПРОВЕРКА ИМЕНИ
   ========================================================= */

function validateName(input) {
    const value = input.value.trim();
    const namePattern = /^[А-Яа-яЁёA-Za-z\s-]+$/;

    if (!value) {
        setFieldError(input, "Введите ваше имя.");
        return false;
    }

    if (value.length < 2) {
        setFieldError(input, "Имя должно содержать минимум 2 символа.");
        return false;
    }

    if (!namePattern.test(value)) {
        setFieldError(
            input,
            "Используйте только буквы, пробелы и дефис."
        );
        return false;
    }

    clearFieldError(input);
    return true;
}


/* =========================================================
   ПРОВЕРКА ТЕЛЕФОНА
   ========================================================= */

function validatePhone(input) {
    const digits = input.value.replace(/\D/g, "");

    if (!digits) {
        setFieldError(input, "Введите номер телефона.");
        return false;
    }

    if (digits.length !== 11 || !digits.startsWith("7")) {
        setFieldError(
            input,
            "Введите номер в формате +7 (999) 999-99-99."
        );
        return false;
    }

    clearFieldError(input);
    return true;
}


/* =========================================================
   ПРОВЕРКА SELECT
   ========================================================= */

function validateRequiredSelect(select) {
    if (!select.value) {
        setFieldError(select, "Выберите вариант из списка.");
        return false;
    }

    clearFieldError(select);
    return true;
}


/* =========================================================
   ПРОВЕРКА ДАТЫ
   ========================================================= */

function validateDate(input) {
    if (!input.value) {
        setFieldError(input, "Выберите дату посещения.");
        return false;
    }

    const selectedDate = new Date(`${input.value}T00:00:00`);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        setFieldError(input, "Нельзя выбрать прошедшую дату.");
        return false;
    }

    clearFieldError(input);
    return true;
}


/* =========================================================
   ПРОВЕРКА СОГЛАСИЯ
   ========================================================= */

function validatePrivacy(checkbox) {
    if (!checkbox.checked) {
        setFieldError(
            checkbox,
            "Необходимо согласиться на обработку данных."
        );
        return false;
    }

    clearFieldError(checkbox);
    return true;
}


/* =========================================================
   ВЫВОД ОШИБОК
   ========================================================= */

function setFieldError(field, message) {
    const errorElement = findErrorElement(field);

    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");

    if (errorElement) {
        errorElement.textContent = message;
    }
}


function clearFieldError(field) {
    const errorElement = findErrorElement(field);

    field.classList.remove("error");
    field.removeAttribute("aria-invalid");

    if (errorElement) {
        errorElement.textContent = "";
    }
}


function findErrorElement(field) {
    if (!field) {
        return null;
    }

    if (field.id) {
        const directError = document.getElementById(`${field.id}Error`);

        if (directError) {
            return directError;
        }
    }

    const formGroup = field.closest(".form-group");

    if (!formGroup) {
        return null;
    }

    return formGroup.querySelector(".form-error");
}


/* =========================================================
   ФОКУС НА ПЕРВОМ ПОЛЕ С ОШИБКОЙ
   ========================================================= */

function focusFirstInvalidField(form) {
    const invalidField = form.querySelector(
        ".form-control.error, input.error"
    );

    if (invalidField) {
        invalidField.focus();
    }
}


/* =========================================================
   EMAILJS
   ========================================================= */

async function sendBookingEmail(form) {
    if (typeof emailjs === "undefined") {
        throw new Error("Библиотека EmailJS не подключена.");
    }

    /*
     * ВАЖНО:
     * Замените значения ниже на данные из вашего кабинета EmailJS.
     */
    const publicKey = "YOUR_PUBLIC_KEY";
    const serviceId = "YOUR_SERVICE_ID";
    const templateId = "YOUR_TEMPLATE_ID";

    if (
        publicKey.startsWith("YOUR_") ||
        serviceId.startsWith("YOUR_") ||
        templateId.startsWith("YOUR_")
    ) {
        throw new Error(
            "Не заполнены PUBLIC KEY, SERVICE ID или TEMPLATE ID EmailJS."
        );
    }

    emailjs.init({
        publicKey
    });

    return emailjs.sendForm(
        serviceId,
        templateId,
        form
    );
}


/* =========================================================
   СОСТОЯНИЕ КНОПКИ
   ========================================================= */

function setSubmitLoading(button, isLoading) {
    if (!button) {
        return;
    }

    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);

    button.textContent = isLoading
        ? "Отправляем"
        : "Отправить заявку";
}


/* =========================================================
   СТАТУС ФОРМЫ
   ========================================================= */

function showFormStatus(element, message, type) {
    if (!element) {
        return;
    }

    element.className = `form-status ${type}`;
    element.textContent = message;
}


function clearFormStatus(element) {
    if (!element) {
        return;
    }

    element.className = "form-status";
    element.textContent = "";
}

function simulateFormSending() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1200);
    });
}
