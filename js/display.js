export function displayCars(cars, renderButtons = true, renderButtonDelete = false) {
    const carList = document.getElementById('list');
    const API_URL = "http://127.0.0.1:8000/api";
    carList.innerHTML = '';

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <h3>${car.brand} (${car.year})</h3>
            <p>Power: ${car.power}hp</p>
            <p>Price: ${car.price}$</p>
            <p>Color: ${car.color}</p>
            ${renderButtons ? `
                <div class="buttons">
                    <button class="buy-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                    <button class="like-btn"><i class="fa-solid fa-heart"></i></button>
                </div>
            ` : ''}
            ${renderButtonDelete ? `
                <div class="buttons">
                    <button class="delete-btn" data-id="${car.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        `;

        carList.appendChild(carItem);

        if (renderButtons) {
            const buyBtn = carItem.querySelector('.buy-btn');
            buyBtn.addEventListener('click', async () => {
                try {
                    const res = await fetch(`${API_URL}/cart/${car.id}`, { method: 'POST' });
                    if (!res.ok) throw new Error('Failed to add to cart');
                    alert(`${car.brand} (${car.year}) added to cart`);
                } catch (err) {
                    console.error(err);
                    alert('Error adding to cart!');
                }
            });

            const likeBtn = carItem.querySelector('.like-btn');
            likeBtn.addEventListener('click', async () => {
                try {
                    const res = await fetch(`${API_URL}/favorites/${car.id}`, { method: 'POST' });
                    if (!res.ok) throw new Error('Failed to update favorites');
                    alert(`${car.brand} (${car.year}) toggled favorite`);
                } catch (err) {
                    console.error(err);
                    alert('Error updating favorites!');
                }
            });
        }

        if (renderButtonDelete) {
            const deleteBtn = carItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', async () => {
                const currentPage = window.location.pathname;

                try {
                    let endpoint;
                    if (currentPage.includes('cart')) {
                        endpoint = 'cart';
                    } else if (currentPage.includes('favorites')) {
                        endpoint = 'favorites';
                    } else {
                        throw new Error('Unknown page for deletion');
                    }

                    const res = await fetch(`${API_URL}/${endpoint}/${car.id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error(`Failed to delete from ${endpoint}`);
                    alert(`${car.brand} (${car.year}) removed from ${endpoint}`);

                    deleteBtn.closest('.car-item').remove();
                } catch (err) {
                    console.error(err);
                    alert('Error deleting car!');
                }
            });
        }

    });
}
