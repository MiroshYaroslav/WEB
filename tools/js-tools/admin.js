const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("login-btn");
const closeModal = document.getElementById("closeModal");
const submitPass = document.getElementById("submitPass");
const adminPassInput = document.getElementById("adminPass");

window.isAdmin = localStorage.getItem("isAdmin") === "true";
updateAdminHeader();

loginBtn.addEventListener("click", () => {
    modal.classList.add("show");
    const isLogin = !window.isAdmin;
    adminPassInput.style.display = isLogin ? "block" : "none";
    submitPass.textContent = isLogin ? "Login" : "Logout";
});

function closeLoginModal() {
    modal.classList.remove("show");
    adminPassInput.value = "";
}

closeModal.addEventListener("click", closeLoginModal);
window.addEventListener("click", e => e.target === modal && closeLoginModal());

submitPass.addEventListener("click", () => {
    if (!window.isAdmin) {
        if (adminPassInput.value === "1234") {
            alert("Successful login!");
            window.isAdmin = true;
        } else {
            alert("Incorrect password!");
            return;
        }
    } else {
        alert("You have logged out of admin mode!");
        window.isAdmin = false;
    }

    localStorage.setItem("isAdmin", window.isAdmin);
    closeLoginModal();
    updateAdminHeader();
});

function updateAdminHeader() {
    const leftHeader = document.querySelector(".head-buttons.left");
    leftHeader.querySelectorAll(".admin-btn").forEach(btn => btn.remove());

    if (window.isAdmin) {
        const adminButtons = [
            { id: "add-car-btn", icon: "fa-plus", action: openAddCarModal },
            { id: "edit-car-btn", icon: "fa-pen", action: openEditCarModal },
            { id: "delete-car-btn", icon: "fa-trash", action: openDeleteCarModal },
        ];

        adminButtons.forEach(({ id, icon, action }) => {
            const btn = document.createElement("button");
            btn.id = id;
            btn.classList.add("admin-btn");
            btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
            btn.addEventListener("click", action);
            leftHeader.appendChild(btn);
        });
    }
}

function openAddCarModal() {
    document.getElementById("addCarModal").classList.add("show");
}
function openEditCarModal() {
    document.getElementById("editCarModal").classList.add("show");
}
function openDeleteCarModal() {
    document.getElementById("deleteCarModal").classList.add("show");
}

window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal.show").forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove("show");
            modal.querySelectorAll("input").forEach(input => input.value = "");
        }
    });
});
