import {fetchCars} from "../../js/main.js";
import {validateId, validateYear, validateNonNegativeNumber, validateString} from "./validation.js";

const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("login-btn");
const submitBtn = document.getElementById("submitPass");
const adminPassInput = document.getElementById("adminPass");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const showLoginBtn = document.getElementById("showLogin");
const showRegisterBtn = document.getElementById("showRegister");


const addCarModal = document.getElementById("addCarModal");
const editCarModal = document.getElementById("editCarModal");
const deleteCarModal = document.getElementById("deleteCarModal");

const API_URL = "https://carstorebackend-jaco.onrender.com/api/cars";

let isRegisterMode = false;
window.user = JSON.parse(localStorage.getItem("user")) || null;

function openModal(modal) {
    modal.classList.add("show");
}

function closeModal(modal) {
    modal.classList.remove("show");
    modal.querySelectorAll("input").forEach(input => input.value = "");
    if (modal === loginModal) {
        adminPassInput.style.display = isRegisterMode ? "block" : "none";
        submitBtn.textContent = isRegisterMode ? "Register" : "Login";
    }
}

// Click outside / close buttons
[loginModal, addCarModal, editCarModal, deleteCarModal].forEach(modal => {
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal(modal);
    });
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
});


function setActiveSwitchButton() {
    if (isRegisterMode) {
        showRegisterBtn.classList.add("active");
        showLoginBtn.classList.remove("active");
    } else {
        showLoginBtn.classList.add("active");
        showRegisterBtn.classList.remove("active");
    }
}

function openLoginModal() {
    if (window.user) return;
    openModal(loginModal);
    adminPassInput.style.display = isRegisterMode ? "block" : "none";
    submitBtn.textContent = isRegisterMode ? "Register" : "Login";
    setActiveSwitchButton();
}

showLoginBtn.onclick = () => {
    isRegisterMode = false;
    document.getElementById("modalTitle").textContent = "Login";
    adminPassInput.style.display = "none";
    submitBtn.textContent = "Login";
    setActiveSwitchButton();
};

showRegisterBtn.onclick = () => {
    isRegisterMode = true;
    document.getElementById("modalTitle").textContent = "Register";
    adminPassInput.style.display = "block";
    submitBtn.textContent = "Register";
    setActiveSwitchButton();
};

submitBtn.onclick = async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const adminCode = adminPassInput.value.trim();

    try {
        validateString(username, "Username");
    } catch (err) {
        return alert(err.message);
    }

    const url = isRegisterMode ? "http://127.0.0.1:8000/api/register" : "http://127.0.0.1:8000/api/login";
    const body = isRegisterMode ? {username, password, admin_code: adminCode || undefined} : {username, password};

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error((await res.json()).detail || (isRegisterMode ? "Registration failed" : "Login failed"));

        const data = await res.json();
        window.user = data;
        localStorage.setItem("user", JSON.stringify(data));
        closeModal(loginModal);

        location.reload();

        alert(`Welcome, ${data.username}${data.is_admin ? " (Admin)" : ""}!`);
    } catch (err) {
        alert(err.message);
    }
};

function logoutUser() {
    if (!window.user) return;
    if (confirm("Do you want to log out?")) {
        window.user = null;
        localStorage.removeItem("user");

        location.reload();

        alert("You have been logged out.");
    }
}


function setupCarCRUD() {
    const saveCarBtn = document.getElementById("saveCarBtn");
    const updateCarBtn = document.getElementById("updateCarBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    if (saveCarBtn) saveCarBtn.onclick = async () => {
        try {
            const brand = document.getElementById("carBrand").value;
            const year = parseInt(document.getElementById("carYear").value);
            const power = parseInt(document.getElementById("carPower").value);
            const price = parseFloat(document.getElementById("carPrice").value);
            const color = document.getElementById("carColor").value;

            validateString(brand, "Brand");
            validateYear(year);
            validateNonNegativeNumber(power, "Power");
            validateNonNegativeNumber(price, "Price");
            validateString(color, "Color");

            const car = {brand, year, power, price, color};
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(car)
            });
            if (!res.ok) throw new Error("Failed to add car");

            alert("Car added!");
            closeModal(addCarModal);
            await fetchCars();
        } catch (err) {
            alert(err.message);
        }
    };

    if (updateCarBtn) updateCarBtn.onclick = async () => {
        try {
            const id = parseInt(document.getElementById("editCarId").value);
            validateId(id);

            const updated = {};

            const brand = document.getElementById("editCarBrand").value.trim();
            const year = document.getElementById("editCarYear").value;
            const power = document.getElementById("editCarPower").value;
            const price = document.getElementById("editCarPrice").value;
            const color = document.getElementById("editCarColor").value;

            if (brand !== "") {
                validateString(brand, "Brand");
                updated.brand = brand;
            }

            if (year !== "") {
                const yearNum = parseInt(year);
                validateYear(yearNum);
                updated.year = yearNum;
            }

            if (power !== "") {
                const powerNum = parseInt(power);
                validateNonNegativeNumber(powerNum, "Power");
                updated.power = powerNum;
            }

            if (price !== "") {
                const priceNum = parseFloat(price);
                validateNonNegativeNumber(priceNum, "Price");
                updated.price = priceNum;
            }

            if (color !== "") {
                validateString(color, "Color");
                updated.color = color;
            }

            if (Object.keys(updated).length === 0) {
                return alert("Enter at least one field");
            }

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw new Error("Failed to update car");

            alert("Car updated!");
            closeModal(editCarModal);
            await fetchCars();
        } catch (err) {
            alert(err.message);
        }
    };


    if (deleteBtn) deleteBtn.onclick = async () => {
        try {
            const id = parseInt(document.getElementById("deleteCarId").value);
            validateId(id);

            const res = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
            if (!res.ok) throw new Error("Failed to delete car");

            alert(`Car with ID ${id} deleted!`);
            closeModal(deleteCarModal);
            await fetchCars();
        } catch (err) {
            alert(err.message);
        }
    };
}


function updateAdminHeader() {
    const leftHeader = document.querySelector(".head-buttons.left");
    leftHeader.querySelectorAll(".admin-btn").forEach(b => b.remove());

    const loginIcon = loginBtn.querySelector("i");
    if (window.user) {
        loginIcon.classList.replace("fa-user", "fa-right-from-bracket");
        loginBtn.onclick = logoutUser;
    } else {
        loginIcon.classList.replace("fa-right-from-bracket", "fa-user");
        loginBtn.onclick = openLoginModal;
    }

    if (window.user?.is_admin) {
        const buttons = [
            {id: "add-car-btn", icon: "fa-plus", action: () => openModal(addCarModal)},
            {id: "edit-car-btn", icon: "fa-pen", action: () => openModal(editCarModal)},
            {id: "delete-car-btn", icon: "fa-trash", action: () => openModal(deleteCarModal)},
        ];

        buttons.forEach(({id, icon, action}) => {
            if (!document.getElementById(id)) {
                const btn = document.createElement("button");
                btn.id = id;
                btn.classList.add("admin-btn");
                btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
                btn.onclick = action;
                leftHeader.appendChild(btn);
            }
        });
        setupCarCRUD();
    }
}


updateAdminHeader();
