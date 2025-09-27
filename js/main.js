import { displayCars } from "./display.js";
import { filterByBrand, populateFilterOptions } from "./filter.js";
import { sortCars, populateSortOptions } from "./sort.js";
import { filterBySearch } from "./search.js";

let cars = [];

fetch('data/cars.json')
    .then(res => res.json())
    .then(data => {
        cars = data;
        populateFilterOptions(cars);
        populateSortOptions();
        updateCarList();
    })
    .catch(err => console.error('Error fetching car data:', err));

export function updateCarList() {
    let result = [...cars];
    result = filterBySearch(result);
    result = filterByBrand(result);
    result = sortCars(result);
    displayCars(result);
}
