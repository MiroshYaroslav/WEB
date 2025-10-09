import { displayCars } from "./display.js";
import {filterByBrand, populateFilterOptions} from "./filter.js";
import { filterBySearch } from "./search.js";
import {populateSortOptions, sortCars} from "./sort.js";

export let cars = [];
export let deletedIds = [];

export async function loadCars() {
    const storedCars = localStorage.getItem('cars');
    const storedDeleted = localStorage.getItem('deletedIds');

    deletedIds = storedDeleted ? JSON.parse(storedDeleted) : [];

    if (storedCars) {
        cars = JSON.parse(storedCars);
    } else {
        const res = await fetch('./data/cars.json');
        const jsonCars = await res.json();

        cars = jsonCars.filter(car => !deletedIds.includes(car.id));
        saveCars();
    }

    displayCars(cars);
    populateFilterOptions(cars);
    populateSortOptions();
}

export function updateCarList() {
    let updatedCars = [...cars];

    updatedCars = filterByBrand(updatedCars);

    updatedCars = filterBySearch(updatedCars);

    updatedCars = sortCars(updatedCars);

    displayCars(updatedCars);
}

export function saveCars() {
    localStorage.setItem('cars', JSON.stringify(cars));
    localStorage.setItem('deletedIds', JSON.stringify(deletedIds));
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadCars();
});
