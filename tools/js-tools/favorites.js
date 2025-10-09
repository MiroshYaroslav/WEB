import { displayCars } from "../../js/display.js";

document.addEventListener('DOMContentLoaded', () => {
    function renderFavorites() {
        let favoritesIds = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesIds = favoritesIds.map(id => Number(id));

        let allCars = JSON.parse(localStorage.getItem('cars'));

        if (!allCars) {
            fetch('../data/cars.json')
                .then(res => res.json())
                .then(cars => {
                    localStorage.setItem('cars', JSON.stringify(cars));
                    showFavorites(cars, favoritesIds);
                })
                .catch(err => console.error('Error loading cars:', err));
        } else {
            showFavorites(allCars, favoritesIds);
        }
    }

    function showFavorites(allCars, favoritesIds) {
        const favoriteCars = allCars.filter(car => favoritesIds.includes(Number(car.id)));
        displayCars(favoriteCars, false);
    }

    renderFavorites();

    const clearBtn = document.getElementById("clear-favorites");
    if (clearBtn) clearBtn.addEventListener("click", () => {
        localStorage.removeItem("favorites");
        renderFavorites();
    });
});
