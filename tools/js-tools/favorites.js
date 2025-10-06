import { displayCars } from "../../js/display.js";

const FAV_API = 'http://127.0.0.1:8000/api/favorites';

async function fetchFavorites() {
    try {
        const res = await fetch(FAV_API);
        const favorites = await res.json();
        displayCars(favorites, false, true);
    } catch (err) {
        console.error('Error loading favorites:', err);
    }
}

document.getElementById("clear-favorites").addEventListener("click", async () => {
    try {
        await fetch(FAV_API, { method: 'DELETE' });
        await fetchFavorites();
    } catch (err) {
        console.error(err);
    }
});

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-fav-btn")) {
        const id = e.target.dataset.id;

        if (!confirm("Видалити авто з уподобаних?")) return;

        try {
            const res = await fetch(`${FAV_API}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Не вдалося видалити авто з уподобаних");
            await fetchFavorites();
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    }
});

fetchFavorites().then(() => {});

