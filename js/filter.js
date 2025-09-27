import {updateCarList} from "./main.js";

const filterSelect = document.getElementById('filter-select');

export function filterByBrand(data) {
    const selectedBrand = filterSelect.value;
    if (!selectedBrand) return data;
    return data.filter(car => car.brand === selectedBrand);
}

export function populateFilterOptions(cars) {
    if (!filterSelect) return;
    const brands = [...new Set(cars.map(car => car.brand))];
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        filterSelect.appendChild(option);
    });
}

filterSelect.addEventListener('change', () => updateCarList());
