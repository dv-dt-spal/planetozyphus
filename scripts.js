import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from './OrbitControls.js';

// Initialize scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(1000, 0, 0);
scene.add(pointLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1, 0);
pointLight1.position.set(0, 0, 1000);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1, 0);
pointLight2.position.set(0, 1000, 0);
scene.add(pointLight2);

// Create WebGL renderer
// const renderer = new THREE.WebGLRenderer();
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere for Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('2k_earth_daymap1.jpeg');

// const earthMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });


const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

const atmosphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x00001f,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.2
});
const atmosphereGeometry = new THREE.SphereGeometry(210, 64, 64);
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);


// function for loading GPS data and creating satellite meshes
const satellites = [];

function loadGPSData() {
  const satelliteGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const satelliteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

  const orbitRadius = 1.6;
  const numSatellites = 10;

  for (let i = 0; i < numSatellites; i++) {
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);

    const orbitSpeed = Math.random() * 0.2 + 0.1;
    const orbitRadiusX = orbitRadius + Math.random() * 0.3 - 0.15;
    const orbitRadiusZ = orbitRadius + Math.random() * 0.3 - 0.15;

    satellites.push({
      mesh: satellite,
      orbitSpeed: orbitSpeed,
      orbitRadiusX: orbitRadiusX,
      orbitRadiusZ: orbitRadiusZ,
      orbitTilt: Math.random() * Math.PI * 2,
    });

    scene.add(satellite);
  }
}



// Create an update function to animate the satellites' positions:
function update(time) {
  satellites.forEach((satellite) => {
    const { mesh, orbitSpeed, orbitRadiusX, orbitRadiusZ, orbitTilt } = satellite;
    const theta = (time * orbitSpeed) % (2 * Math.PI);

    const x = orbitRadiusX * Math.cos(theta);
    const z = orbitRadiusZ * Math.sin(theta);
    const y = z * Math.tan(orbitTilt);

    mesh.position.set(x, y, z);
  });
}


// Position camera and set up controls
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

function render(time) {
  time *= 0.001; // Convert time to seconds

  update(time); // Add this line

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

// Load GPS data and start animation
loadGPSData();
animate();
requestAnimationFrame(render);

const lightColorInput = document.getElementById('lightColor');
lightColorInput.addEventListener('input', function (event) {
  const color = event.target.value;
  pointLight.color.set(color);

});

const lightXInput = document.getElementById('lightX');
const lightYInput = document.getElementById('lightY');
const lightZInput = document.getElementById('lightZ');

function updateLightPosition() {
  const x = parseInt(lightXInput.value, 10);
  const y = parseInt(lightYInput.value, 10);
  const z = parseInt(lightZInput.value, 10);

  pointLight.position.set(x, y, z);
}

lightXInput.addEventListener('input', updateLightPosition);
lightYInput.addEventListener('input', updateLightPosition);
lightZInput.addEventListener('input', updateLightPosition);
