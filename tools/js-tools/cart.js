import { displayCars } from "../../js/display.js";

function renderCart() {
    let cartIds = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('../data/cars.json')
        .then(res => res.json())
        .then(cars => {
            const cartCars = cars.filter(car => cartIds.includes(car.id));
            displayCars(cartCars, false);

            const totalPrice = cartCars.reduce((acc, car) => acc + car.price, 0);
            document.getElementById('total').textContent = `Total Price: $${totalPrice}`;
        })
        .catch(err => console.error('Error loading cars:', err));
}

renderCart();

document.getElementById("clear-cart").addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
});
