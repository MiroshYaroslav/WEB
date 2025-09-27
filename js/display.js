export function displayCars(cars, renderButtons = true) {
    const carList = document.getElementById('list');
    carList.innerHTML = '';

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <h3>${car.brand} (${car.year})</h3>
            <p>Power: ${car.power}hp</p>
            <p>Price: ${car.price}$</p>
            <p>Color: ${car.color}</p>
            ${renderButtons ? `<div class="buttons">
                <button class="buy-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="like-btn"><i class="fa-solid fa-heart"></i></button>
            </div>` : ''}
        `;

        carList.appendChild(carItem);

        if (renderButtons) {
            const buyBtn = carItem.querySelector('.buy-btn');
            buyBtn.addEventListener('click', () => {
                let cartIds = new Set(JSON.parse(localStorage.getItem('cart')) || []);
                if (!cartIds.has(car.id)) {
                    cartIds.add(car.id);
                    localStorage.setItem('cart', JSON.stringify([...cartIds]));
                    alert(`${car.brand} (${car.year}) added to cart`);
                } else {
                    alert(`${car.brand} (${car.year}) is already in the cart`);
                }
            });

            const likeBtn = carItem.querySelector('.like-btn');
            likeBtn.addEventListener('click', () => {
                let favoritesIds = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
                if (favoritesIds.has(car.id)) {
                    favoritesIds.delete(car.id);
                    alert(`${car.brand} (${car.year}) removed from favorites`);
                } else {
                    favoritesIds.add(car.id);
                    alert(`${car.brand} (${car.year}) added to favorites`);
                }
                localStorage.setItem('favorites', JSON.stringify([...favoritesIds]));
            });
        }
    });
}
