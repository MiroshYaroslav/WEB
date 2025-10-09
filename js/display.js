export function displayCars(cars, renderButtons = true) {
    const carList = document.getElementById('list');
    if (!carList) return;

    const deletedIdsRaw = JSON.parse(localStorage.getItem('deletedIds')) || [];
    const deletedIds = deletedIdsRaw.map(id => Number(id));

    carList.innerHTML = '';

    const visibleCars = cars.filter(car => !deletedIds.includes(Number(car.id)));

    visibleCars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <h3>${car.brand} (${car.year})</h3>
            <p>Power: ${car.power}hp</p>
            <p>Price: ${car.price}$</p>
            <p>Color: ${car.color}</p>
        `;

        if (renderButtons) {
            const userButtons = document.createElement('div');
            userButtons.className = 'buttons';
            userButtons.innerHTML = `
                <button class="buy-btn"><i class="fa-solid fa-cart-shopping"></i></button>
                <button class="like-btn"><i class="fa-solid fa-heart"></i></button>
            `;
            carItem.appendChild(userButtons);

            const buyBtn = userButtons.querySelector('.buy-btn');
            buyBtn.addEventListener('click', () => {
                let cartIds = JSON.parse(localStorage.getItem('cart')) || [];
                cartIds = cartIds.map(Number);
                if (!cartIds.includes(Number(car.id))) {
                    cartIds.push(Number(car.id));
                    localStorage.setItem('cart', JSON.stringify(cartIds));
                    alert(`${car.brand} (${car.year}) added to cart`);
                } else {
                    alert(`${car.brand} (${car.year}) is already in the cart`);
                }
            });

            const likeBtn = userButtons.querySelector('.like-btn');
            likeBtn.addEventListener('click', () => {
                let favoritesIds = JSON.parse(localStorage.getItem('favorites')) || [];
                favoritesIds = favoritesIds.map(Number);
                if (favoritesIds.includes(Number(car.id))) {
                    favoritesIds = favoritesIds.filter(id => id !== Number(car.id));
                    alert(`${car.brand} (${car.year}) removed from favorites`);
                } else {
                    favoritesIds.push(Number(car.id));
                    alert(`${car.brand} (${car.year}) added to favorites`);
                }
                localStorage.setItem('favorites', JSON.stringify(favoritesIds));
            });
        }

        if (window.isAdmin) {
            const adminButtons = document.createElement('div');
            adminButtons.className = 'buttons';
            adminButtons.innerHTML = `
                <button class="edit-btn"><i>Edit</i></button>
                <button class="delete-btn"><i>Delete</i></button>
            `;
            carItem.appendChild(adminButtons);

            const editBtn = adminButtons.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                document.getElementById('editCarId').value = car.id;
                document.getElementById('editCarBrand').value = car.brand;
                document.getElementById('editCarYear').value = car.year;
                document.getElementById('editCarPower').value = car.power;
                document.getElementById('editCarPrice').value = car.price;
                document.getElementById('editCarColor').value = car.color;
                document.getElementById('editCarModal').classList.add('show');
            });

            const deleteBtn = adminButtons.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete ${car.brand} (${car.year})?`)) {
                    deletedIds.push(Number(car.id));
                    localStorage.setItem('deletedIds', JSON.stringify(deletedIds));
                    // оновлюємо список на сторінці
                    displayCars(cars, renderButtons);
                }
            });
        }

        carList.appendChild(carItem);
    });
}
