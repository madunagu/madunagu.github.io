import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let clock = new THREE.Clock();
let delta = 0;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1500,
);
camera.position.z = 200;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
// scene.fog = new THREE.Fog(0xc0f0ff, 0.0015);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const light = new THREE.HemisphereLight(0xd6e6ff, 0xa38c08, 1);
// scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 20);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0xffffff, 100, 100);

spotlight.position.set(17, 17, 15);
// scene.add(spotlight);

const pointLight = new THREE.PointLight(0x0000ff, 100);
pointLight.intensity = 1000;
pointLight.distance = 1000;
pointLight.scale.set(2, 2, 2);
pointLight.position.set(12, 12, 15);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 3);
scene.add(pointLight);
scene.add(pointLightHelper);

const sphereGeometry = new THREE.SphereGeometry(20, 25);
const boxGeometry = new THREE.BoxGeometry(20, 20, 20);

const meshGeometry = new THREE.WireframeGeometry(sphereGeometry);

const basicMaterial = new THREE.MeshStandardMaterial({ color: 0x252525 });

const mainObject = new THREE.Mesh(sphereGeometry, basicMaterial);
// circleMesh.position.set(0, 0, 0);
// circleMesh.scale.set(2, 3, 3);

scene.add(mainObject);

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", onWindowResize);

animate();

function animate() {
  requestAnimationFrame(animate);
  mainObject.rotation.y += 0.005;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
