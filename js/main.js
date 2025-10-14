import { displayCars } from "./display.js";

const API_URL = "https://carstorebackend-jaco.onrender.com/api/cars";
const SORT_OPTIONS_URL = "data/sort_options.json";

const filterSelect = document.getElementById("filter-select");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search");

let allCars = [];

export async function fetchCars({ brand = "", search = "", sort = "" } = {}) {
    try {
        const params = new URLSearchParams();
        if (brand) params.append("brand", brand);
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);

        const res = await fetch(`${API_URL}?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch cars");

        allCars = await res.json();
        await displayCars(allCars, true, false);
        populateFilterOptions();
    } catch (err) {
        console.error("Error fetching cars:", err);
    }
}

function populateFilterOptions() {
    if (!filterSelect || !allCars.length) return;

    const firstOption = filterSelect.querySelector("option");
    filterSelect.innerHTML = "";
    if (firstOption) filterSelect.appendChild(firstOption);

    const brands = [...new Set(allCars.map(car => car.brand))];
    brands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand;
        option.textContent = brand;
        filterSelect.appendChild(option);
    });
}

async function populateSortOptions() {
    if (!sortSelect) return;

    try {
        const res = await fetch(SORT_OPTIONS_URL);
        const options = await res.json();

        const firstOption = sortSelect.querySelector("option");
        sortSelect.innerHTML = "";
        if (firstOption) sortSelect.appendChild(firstOption);

        options.forEach((opt) => {
            const optionEl = document.createElement("option");
            optionEl.value = opt.value;
            optionEl.textContent = opt.text;
            sortSelect.appendChild(optionEl);
        });
    } catch (err) {
        console.error("Error loading sort options:", err);
    }
}

export async function updateCarList() {
    const brand = filterSelect?.value || "";
    const search = searchInput?.value || "";
    const sort = sortSelect?.value || "";

    const params = new URLSearchParams();
    if (brand) params.append("brand", brand);
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);

    try {
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const cars = await res.json();
        allCars = cars;
        await displayCars(cars, true, false);
    } catch (err) {
        console.error("Error fetching cars:", err);
    }
}


filterSelect?.addEventListener("change", updateCarList);
sortSelect?.addEventListener("change", updateCarList);
searchInput?.addEventListener("input", updateCarList);

await populateSortOptions();
await fetchCars();
