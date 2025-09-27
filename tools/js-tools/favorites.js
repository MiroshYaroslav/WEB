import { displayCars } from "../../js/display.js";

let favoritesIds = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

fetch('../data/cars.json')
    .then(res => res.json())
    .then(cars => {
        const favoriteCars = cars.filter(car => favoritesIds.has(car.id));
        displayCars(favoriteCars, false);
    })
    .catch(err => console.error('Error loading cars:', err));

document.getElementById("clear-favorites").addEventListener("click", () => {
    localStorage.removeItem("favorites");
    favoritesIds = new Set();
    displayCars([], false);
});