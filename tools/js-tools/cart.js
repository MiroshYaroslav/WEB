import { displayCars } from "../../js/display.js";

const CART_API = 'http://127.0.0.1:8000/api/cart';

async function fetchCart() {
    try {
        const res = await fetch(CART_API);
        const cartCars = await res.json();

        displayCars(cartCars, false, true);

        const totalPrice = cartCars.reduce((acc, car) => acc + car.price, 0);
        document.getElementById('total').textContent = `Total Price: $${totalPrice}`;
    } catch (err) {
        console.error('Error loading cart:', err);
    }
}

document.getElementById("clear-cart").addEventListener("click", async () => {
    try {
        await fetch(CART_API, { method: 'DELETE' });
        await fetchCart();
    } catch (err) {
        console.error(err);
    }
});

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-cart-btn")) {
        const id = e.target.dataset.id;

        if (!confirm("Видалити авто з кошика?")) return;

        try {
            const res = await fetch(`${CART_API}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Не вдалося видалити авто з кошика");
            await fetchCart();
        } catch (err) {
            console.error("Error removing car from cart:", err);
        }
    }
});

fetchCart().then(() => {});

