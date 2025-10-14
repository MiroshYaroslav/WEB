import { displayCars } from "../../js/display.js";

const API_URL = 'https://carstorebackend-jaco.onrender.com/api';

async function fetchCart() {
    const user = window.user || JSON.parse(localStorage.getItem("user"));
    const user_id = user?.user_id;

    if (!user_id) {
        document.getElementById('list').innerHTML = '<p>Please log in to view your cart.</p>';
        document.getElementById('total').textContent = '';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/cart/${user_id}`);
        if (!res.ok) throw new Error("Failed to load cart");
        const cartCars = await res.json();

        await displayCars(cartCars, false, true);

        const totalPrice = cartCars.reduce((acc, car) => acc + car.price, 0);
        document.getElementById('total').textContent = `Total Price: $${totalPrice}`;
    } catch (err) {
        console.error('Error loading cart:', err);
    }
}

document.getElementById("clear-cart").addEventListener("click", async () => {
    const user = window.user || JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    if (!user_id) {
        alert("Please log in first.");
        return;
    }

    if (!confirm("Clear all items from your cart?")) return;

    try {
        const res = await fetch(`${API_URL}/cart/${user_id}`, { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Failed to clear cart");
        }
        await fetchCart();
        alert("Cart cleared");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

await fetchCart();
