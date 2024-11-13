import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";


// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6); // Позиция камеры внутри параллелепипеда

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xD3D3D3); // Устанавливаем цвет фона в серый
document.body.appendChild(renderer.domElement);

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD3D3D3); // Устанавливаем цвет фона сцены в серый

// Геометрия параллелепипеда
let width = 2, height = 3, depth = 2;
const geometry = new THREE.BoxGeometry(width, height, depth);

// Материалы для каждой стороны с эффектом блеска
const materials = [
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 }), // Левая сторона
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 }), // Правая сторона
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 }), // Верхняя сторона (потолок)
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 }), // Нижняя сторона (пол)
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 }), // Передняя сторона (дверь)
    new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, roughness: 0.1, metalness: 0.8 })  // Задняя сторона
];

const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Освещение для блеска
const light = new THREE.PointLight(0xffffff, 6);
light.position.set(0, height- 0.1, 0).normalize();

scene.add(light);

      // Геометрия и материал для табло
const infoBoardGeometry = new THREE.PlaneGeometry(0.7, 1.5);
const infoBoardMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // Изменить на THREE.FrontSide
const infoBoard = new THREE.Mesh(infoBoardGeometry, infoBoardMaterial);

// Устанавливаем позицию табло относительно параллелепипеда
infoBoard.position.set(0.999, 0.5, 0.25); // Поднимаем табло выше до y = 0.5
infoBoard.rotation.y = Math.PI / 2; // Поворачиваем табло, чтобы оно было параллельно стене

// Добавляем табло как дочерний элемент параллелепипеда
cube.add(infoBoard);

// Функция обновления размера лифта
function updateCubeSize(newWidth, newHeight, newDepth) {
    // Удаляем старую геометрию и создаем новую
    cube.geometry.dispose();
    cube.geometry = new THREE.BoxGeometry(newWidth, newHeight, newDepth);

    // Обновляем позицию табло
    infoBoard.position.set(newWidth / 2 - 0.0001, newHeight / 5.5, 0.25); // Устанавливаем табло на нужную позицию
}

const sizeSelect = document.getElementById('size-select');

sizeSelect.addEventListener('change', () => {
  const selectedSize = sizeSelect.value;

  switch (selectedSize) {
    case '40x40':
      updateCubeSize(2, 3, 2);
      break;
    case '40x60':
      updateCubeSize(2, 3, 3);
      break;
    case '50x70':
      updateCubeSize(2.5, 3, 3.5);
      break;
    default:
      break;
  }
});


// Отображение первоначальных материалов лифта
function MakeStartLift(){
    loadTexture('./Lift/Стены/texture20.png', 0, 'walls')
    loadTexture('./Lift/Стены/texture20.png', 1, 'walls')
    loadTexture('./Lift/Стены/texture20.png', 5, 'walls')
    loadTexture('./Lift/Потолок/texture21.png', 2, 'ceiling')
    loadTexture('./Lift/Пол/texture8.png', 3, 'floor')
    loadTexture('./Lift/Двери/texture19.png', 4, 'door')
    loadTexture('./Lift/Табло/texture18.png', 0, 'board')
}

MakeStartLift();


function loadTexture(imageUrl, index, target) {
    const textureLoader = new THREE.TextureLoader();

    // Загрузка текстуры из URL
    textureLoader.load(imageUrl, (texture) => {
        if (target === 'board') {
            // Применяем текстуру к табло
            infoBoard.material.map = texture;
            infoBoard.material.needsUpdate = true; // Обновляем материал табло
 
            // Обновляем словарь с текстурами
            //updateTexture('board', imageUrl);
        } else {
            // Применяем текстуру к соответствующей стороне параллелепипеда
            materials[index].map = texture;
            materials[index].color.set(0xffffff); // Устанавливаем цвет в белый
            materials[index].needsUpdate = true; // Обновляем материал
            
            // Обновляем словарь с текстурами
            //updateTexture(target, imageUrl);
        }
    }, undefined, (error) => {
        console.error('Ошибка загрузки текстуры:', error);
    });
}


    export { loadTexture };


      // Управление камерой
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;

 
// Анимация
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Получаем направление на камеру
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Нормаль левой стенки (если табло прикреплено к ней)
    const wallNormal = new THREE.Vector3(-1, 0, 0); // Нормаль для левой стенки

    // Вычисляем скалярное произведение между нормалью и направлением на камеру
    const dotProduct = wallNormal.dot(cameraDirection);

    // Устанавливаем порог для видимости (например, -0.1 для некоторой гибкости)
    const visibilityThreshold = 0.1;

    // Табло будет видно, если стенка обращена к камере
    infoBoard.visible = dotProduct < visibilityThreshold;

    renderer.render(scene, camera);
}
      animate();

      // Обработка изменения размеров окна
      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });