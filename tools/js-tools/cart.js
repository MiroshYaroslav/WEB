import { displayCars } from "../../js/display.js";

document.addEventListener('DOMContentLoaded', () => {
    function renderCart() {
        let cartIds = JSON.parse(localStorage.getItem('cart')) || [];
        cartIds = cartIds.map(id => Number(id));

        let allCars = JSON.parse(localStorage.getItem('cars'));

        if (!allCars) {
            fetch('../data/cars.json')
                .then(res => res.json())
                .then(cars => {
                    localStorage.setItem('cars', JSON.stringify(cars));
                    showCart(cars, cartIds);
                })
                .catch(err => console.error('Error loading cars:', err));
        } else {
            showCart(allCars, cartIds);
        }
    }

    function showCart(allCars, cartIds) {
        const cartCars = allCars.filter(car => cartIds.includes(Number(car.id)));
        displayCars(cartCars, false);

        const totalPrice = cartCars.reduce((acc, car) => acc + Number(car.price || 0), 0);
        const totalEl = document.getElementById('total');
        if (totalEl) totalEl.textContent = `Total Price: $${totalPrice}`;
    }

    renderCart();

    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) clearBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        renderCart();
    });
});
