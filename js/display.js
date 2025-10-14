export async function displayCars(cars, renderButtons = true, renderButtonDelete = false) {
    const carList = document.getElementById('list');
    if (!carList) return;

    const API_BASE = "https://carstorebackend-jaco.onrender.com/api";
    const user = window.user || JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    const isAdmin = user?.is_admin === true;

    const currentPage = window.location.pathname;
    const isCartPage = currentPage.includes('cart');
    const isFavoritesPage = currentPage.includes('favorites');

    carList.innerHTML = '';

    cars.forEach(car => {
        const carItem = document.createElement('div');
        carItem.className = 'car-item';
        carItem.innerHTML = `
            <h3>${car.brand} (${car.year})</h3>
            <p>Power: ${car.power}hp</p>
            <p>Price: ${car.price}$</p>
            <p>Color: ${car.color}</p>
        `;

        const buttons = document.createElement('div');
        buttons.className = 'buttons';


        if (!isCartPage && !isFavoritesPage && renderButtons) {
            const buyBtn = document.createElement('button');
            buyBtn.className = 'car-button buy-btn';
            buyBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
            buyBtn.addEventListener('click', async () => {
                if (!user_id) return alert("Please log in first.");
                try {
                    const res = await fetch(`${API_BASE}/cart/${user_id}/${car.id}`, {method: 'POST'});
                    if (!res.ok) throw new Error((await res.json()).detail || "Failed to add to cart");
                    alert(`${car.brand} (${car.year}) added to cart`);
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });

            const likeBtn = document.createElement('button');
            likeBtn.className = 'car-button like-btn';
            likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            likeBtn.addEventListener('click', async () => {
                if (!user_id) return alert("Please log in first.");
                try {
                    const res = await fetch(`${API_BASE}/favorites/${user_id}/${car.id}`, {method: 'POST'});
                    if (!res.ok) throw new Error((await res.json()).detail || "Failed to add to favorites");
                    alert(`${car.brand} (${car.year}) added to favorites`);
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });

            buttons.appendChild(buyBtn);
            buttons.appendChild(likeBtn);
        }


        if (isAdmin && !isCartPage && !isFavoritesPage) {
            const editBtn = document.createElement('button');
            editBtn.className = 'car-button edit-btn';
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editBtn.addEventListener('click', () => {
                const modal = document.getElementById('editCarModal');
                modal.querySelector('#editCarId').value = car.id;
                modal.querySelector('#editCarBrand').value = car.brand;
                modal.querySelector('#editCarYear').value = car.year;
                modal.querySelector('#editCarPower').value = car.power;
                modal.querySelector('#editCarPrice').value = car.price;
                modal.querySelector('#editCarColor').value = car.color;
                modal.classList.add('show');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'car-button delete-btn';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.addEventListener('click', () => {
                const modal = document.getElementById('deleteCarModal');
                modal.querySelector('#deleteCarId').value = car.id;
                modal.classList.add('show');
            });

            buttons.appendChild(editBtn);
            buttons.appendChild(deleteBtn);
        }


        if ((isCartPage || isFavoritesPage) && renderButtonDelete) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'car-button delete-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', async () => {
                if (!user_id) return alert("Please log in first.");
                const endpoint = isCartPage ? 'cart' : 'favorites';
                try {
                    const res = await fetch(`${API_BASE}/${endpoint}/${user_id}/${car.id}`, {method: 'DELETE'});
                    if (!res.ok) throw new Error((await res.json()).detail || "Failed to remove");
                    alert(`${car.brand} removed from ${endpoint}`);
                    carItem.remove();
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            });
            buttons.appendChild(removeBtn);
        }

        carItem.appendChild(buttons);
        carList.appendChild(carItem);
    });
}
