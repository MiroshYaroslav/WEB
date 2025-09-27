import {updateCarList} from "./main.js";

const sortSelect = document.getElementById('sort-select');

export function sortCars(data) {
    const sortBy = sortSelect.value;
    let sortedCars = [...data];
    switch (sortBy) {
        case 'price-asc': sortedCars.sort((a, b) => a.price - b.price); break;
        case 'price-desc': sortedCars.sort((a, b) => b.price - a.price); break;
        case 'year-asc': sortedCars.sort((a, b) => a.year - b.year); break;
        case 'year-desc': sortedCars.sort((a, b) => b.year - a.year); break;
        case 'power-asc': sortedCars.sort((a, b) => a.power - b.power); break;
        case 'power-desc': sortedCars.sort((a, b) => b.power - a.power); break;
    }
    return sortedCars;
}

export function populateSortOptions() {
    fetch('data/sort_options.json')
        .then(res => res.json())
        .then(options => {
            if (!sortSelect) return;
            options.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt.value;
                optionEl.textContent = opt.text;
                sortSelect.appendChild(optionEl);
            });
        })
        .catch(err => console.error('Error loading sort options:', err));
}

sortSelect.addEventListener('change', () => updateCarList());
