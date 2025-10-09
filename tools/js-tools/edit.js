import { cars, updateCarList, saveCars } from "../../js/main.js";
import { validateId, validateYear, validateNonNegativeNumber, validateString } from "./validation.js";

const updateBtn = document.getElementById('updateCarBtn');

export function editCar(id, updatedCar){
    try {
        validateId(id);
        if (updatedCar.year !== undefined) validateYear(updatedCar.year);
        if (updatedCar.power !== undefined) validateNonNegativeNumber(updatedCar.power, "Power");
        if (updatedCar.price !== undefined) validateNonNegativeNumber(updatedCar.price, "Price");
        if (updatedCar.brand !== undefined) validateString(updatedCar.brand, "Brand");
        if (updatedCar.color !== undefined) validateString(updatedCar.color, "Color");

        const car = cars.find(c => c.id === id);
        if(car){
            Object.assign(car, updatedCar);
            saveCars();
            updateCarList();
            alert(`Car ID ${id} updated!`);
        } else {
            alert("Car not found!");
        }
    } catch(err) {
        alert(err.message);
    }
}

updateBtn.addEventListener('click', () => {
    const id = +document.getElementById('editCarId').value;

    const updatedCar = {};
    const brand = document.getElementById('editCarBrand').value.trim();
    const year = document.getElementById('editCarYear').value.trim();
    const power = document.getElementById('editCarPower').value.trim();
    const price = document.getElementById('editCarPrice').value.trim();
    const color = document.getElementById('editCarColor').value.trim();

    if (brand) updatedCar.brand = brand;
    if (year) updatedCar.year = +year;
    if (power) updatedCar.power = +power;
    if (price) updatedCar.price = +price;
    if (color) updatedCar.color = color;

    if (Object.keys(updatedCar).length === 0) {
        return alert("Fill at least one field to update!");
    }

    editCar(id, updatedCar);
});
