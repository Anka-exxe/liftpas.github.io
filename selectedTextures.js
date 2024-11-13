// selectedTextures.js

// Объект для хранения выбранных текстур
const selectedTextures = {
    walls: "",
    ceiling: "",
    floor: "",
    board: "",
    door: ""
};

/// Глобальная функция для обновления текстур
function updateTexture(element, path) {
    if (selectedTextures.hasOwnProperty(element)) {
        selectedTextures[element] = path;
    } else {
        console.error(`Элемент ${element} не существует в словаре текстур.`);
    }
};

updateTexture('./Lift/Двери/texture11.png','door');
updateTexture('./Lift/Стены/texture10.png','walls');
updateTexture('./Lift/Потолок/texture15.png','ceiling');
updateTexture('./Lift/Пол/texture12.png','floor');
updateTexture('./Lift/Табло/texture17.png','board');

// Функция для получения выбранных текстур
function getSelectedTextures() {
    return selectedTextures;
}

// Экспортируем функции для использования в других файлах
