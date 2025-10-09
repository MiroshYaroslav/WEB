import { cars, updateCarList, deletedIds, saveCars } from "../../js/main.js";
import { validateId } from "./validation.js";

const deleteBtn = document.getElementById('deleteBtn');

export function deleteCar(id){
    try {
        validateId(id);
        if (!cars.some(c => c.id === id)) return alert("Car not found!");

        // Логічне видалення
        if (!deletedIds.includes(id)) deletedIds.push(id);

        saveCars();
        updateCarList();
        alert(`Car ID ${id} deleted!`);
    } catch(err) {
        alert(err.message);
    }
}

deleteBtn.addEventListener('click', () => {
    const id = +document.getElementById('deleteCarId').value;
    if (!id && id !== 0) return alert("Enter valid Car ID!");
    deleteCar(id);
});
