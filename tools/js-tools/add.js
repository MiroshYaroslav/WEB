import { cars, updateCarList, saveCars } from "../../js/main.js";
import { validateId, validateYear, validateNonNegativeNumber, validateString } from "./validation.js";

const saveBtn = document.getElementById('saveCarBtn');

export function addCar(car){
    try {
        validateId(car.id);
        validateYear(car.year);
        validateNonNegativeNumber(car.power, "Power");
        validateNonNegativeNumber(car.price, "Price");
        validateString(car.brand, "Brand");
        validateString(car.color, "Color");

        cars.push(car);
        saveCars();
        updateCarList();
        alert(`Car ID ${car.id} added!`);
    } catch(err) {
        alert(err.message);
    }
}

saveBtn.addEventListener('click', () => {
    const brand = document.getElementById('carBrand').value.trim();
    const year = +document.getElementById('carYear').value;
    const power = +document.getElementById('carPower').value;
    const price = +document.getElementById('carPrice').value;
    const color = document.getElementById('carColor').value.trim();

    if (!brand || !year || !power || !price || !color) {
        return alert("Fill all fields!");
    }

    const newCar = { id: Date.now(), brand, year, power, price, color };
    addCar(newCar);
});
