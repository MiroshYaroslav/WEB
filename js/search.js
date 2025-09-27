import { updateCarList } from "./main.js";

const searchInput = document.getElementById('search');

export function filterBySearch(data) {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return data;
    return data.filter(car =>
        (car.brand || '').toLowerCase().includes(query) ||
        (car.year || '').toString().includes(query) ||
        (car.power || '').toString().includes(query) ||
        (car.price || '').toString().includes(query) ||
        (car.color || '').toLowerCase().includes(query)
    );
}

if (searchInput) {
    searchInput.addEventListener('input', updateCarList);
}
