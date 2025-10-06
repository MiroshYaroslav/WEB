import { fetchCars } from "../../js/main.js";

const addCarModal = document.getElementById("addCarModal");
const editCarModal = document.getElementById("editCarModal");
const deleteCarModal = document.getElementById("deleteCarModal");

const addCarBtn = document.getElementById("add-car-btn");
const editCarBtn = document.getElementById("edit-car-btn");
const deleteCarBtn = document.getElementById("delete-car-btn");

const saveCarBtn = document.getElementById("saveCarBtn");
const updateCarBtn = document.getElementById("updateCarBtn");
const deleteBtn = document.getElementById("deleteBtn");

const API_URL = "http://127.0.0.1:8000/api/cars";

addCarBtn?.addEventListener("click", () => addCarModal.classList.add("show"));
editCarBtn?.addEventListener("click", () => editCarModal.classList.add("show"));
deleteCarBtn?.addEventListener("click", () => deleteCarModal.classList.add("show"));

document.querySelector(".add-close").addEventListener("click", () => addCarModal.classList.remove("show"));
document.querySelector(".edit-close").addEventListener("click", () => editCarModal.classList.remove("show"));
document.querySelector(".delete-close").addEventListener("click", () => deleteCarModal.classList.remove("show"));

saveCarBtn.addEventListener("click", async () => {
    const newCar = {
        brand: document.getElementById("carBrand").value,
        year: parseInt(document.getElementById("carYear").value),
        power: parseInt(document.getElementById("carPower").value),
        price: parseFloat(document.getElementById("carPrice").value),
        color: document.getElementById("carColor").value
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCar)
        });
        if (!res.ok) throw new Error("Failed to add car");
        alert("Car added!");
        addCarModal.classList.remove("show");
        await fetchCars();
    } catch (err) {
        console.error(err);
        alert(" Error adding car!");
    }
});

updateCarBtn.addEventListener("click", async () => {
    const id = parseInt(document.getElementById("editCarId").value);
    const updatedCar = {};
    const brand = document.getElementById("editCarBrand").value;
    const year = parseInt(document.getElementById("editCarYear").value);
    const power = parseInt(document.getElementById("editCarPower").value);
    const price = parseFloat(document.getElementById("editCarPrice").value);
    const color = document.getElementById("editCarColor").value;

    if (brand) updatedCar.brand = brand;
    if (year) updatedCar.year = year;
    if (power) updatedCar.power = power;
    if (price) updatedCar.price = price;
    if (color) updatedCar.color = color;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCar)
        });
        if (!res.ok) throw new Error("Failed to update car");
        alert("Car updated!");
        editCarModal.classList.remove("show");
        await fetchCars();
    } catch (err) {
        console.error(err);
        alert("Error updating car!");
    }
});

deleteBtn.addEventListener("click", async () => {
    const id = parseInt(document.getElementById("deleteCarId").value);

    if (!id) {
        alert("Please enter a valid car ID to delete.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete car");
        alert(`Car with ID ${id} deleted!`);
        deleteCarModal.classList.remove("show");
        await fetchCars();
    } catch (err) {
        console.error(err);
        alert("Error deleting car!");
    }
});
