import { displayCars } from "../../js/display.js";

const API_URL = 'https://carstorebackend-jaco.onrender.com/api';

async function fetchFavorites() {
    const user = window.user || JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;

    if (!user_id) {
        document.getElementById('list').innerHTML = '<p>Please log in to view favorites.</p>';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/favorites/${user_id}`);
        if (!res.ok) throw new Error("Failed to load favorites");
        const favorites = await res.json();

        await displayCars(favorites, false, true);
    } catch (err) {
        console.error('Error loading favorites:', err);
    }
}

document.getElementById("clear-favorites").addEventListener("click", async () => {
    const user = window.user || JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    if (!user_id) {
        alert("Please log in first.");
        return;
    }

    if (!confirm("Clear all favorites?")) return;

    try {
        const res = await fetch(`${API_URL}/favorites/${user_id}`, { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Failed to clear favorites");
        }
        await fetchFavorites();
        alert("Favorites cleared");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

await fetchFavorites();
