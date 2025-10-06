import { displayCars } from "./display.js";
import { filterByBrand, populateFilterOptions } from "./filter.js";
import { sortCars, populateSortOptions } from "./sort.js";
import { filterBySearch } from "./search.js";

let cars = [];

const API_URL = "http://127.0.0.1:8000/api/cars";

export async function fetchCars() {
    try {
        const res = await fetch(API_URL);
        cars = await res.json();
        populateFilterOptions(cars);
        populateSortOptions();
        updateCarList();
    } catch (err) {
        console.error("Error fetching cars:", err);
    }
}

export function updateCarList() {
    let result = [...cars];
    result = filterBySearch(result);
    result = filterByBrand(result);
    result = sortCars(result);
    displayCars(result, true, false);
}

fetchCars().then(r => {});
