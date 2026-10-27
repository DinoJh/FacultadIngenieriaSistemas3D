import { Renderer } from './core/Renderer.js';
import { Scene } from './core/Scene.js';
import { PerspectiveCamera } from './cameras/PerspectiveCamera.js';
import { OrbitControls } from './controls/OrbitControls.js';
import { Facultad } from './scenes/Facultad.js';
import { Montana } from './objects/Montana.js';
import { SistemaCeleste } from './objects/SistemaCeleste.js';
import { crearTexturasEdificio } from './textures/BuildingTextures.js';
import { Interfaz } from './ui/Interfaz.js';

// main compone la escena; Renderer concentra los detalles de WebGL.
const canvas = document.getElementById('glCanvas');
const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(52, renderer.resize(), 0.2, 260);
const textures = crearTexturasEdificio(renderer.gl);

// Montaña ondulada andina con bosque de árboles detrás de la universidad
const montana = new Montana(textures);
scene.add(montana);

// Recreación arquitectónica de la facultad
const facultad = new Facultad(textures);
scene.add(facultad);

// Sol, Luna, estrellas y ciclo dinámico diurno-nocturno
const sistemaCeleste = new SistemaCeleste(scene, textures);
scene.add(sistemaCeleste);

const estado = { puertasAbiertas: false, ventanasAbiertas: true, luzNocturna: false };
const controls = new OrbitControls(camera, canvas, action => interfaz.execute(action));
const interfaz = new Interfaz(
    controls,
    estado,
    nocturna => sistemaCeleste.alternarModo(nocturna),
    () => sistemaCeleste.alternarAutoCiclo()
);

let previousTime = performance.now();
let frameId;
function animate(time) {
    const dt = Math.min((time - previousTime) * 0.001, 0.1);
    previousTime = time;
    controls.update(dt);
    facultad.update(dt, estado);
    sistemaCeleste.update(dt);
    renderer.render(scene, camera);
    interfaz.update(dt);
    frameId = requestAnimationFrame(animate);
}
frameId = requestAnimationFrame(animate);

// Liberar recursos al abandonar la pagina (sin interferir con la cache de navegacion).
window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    cancelAnimationFrame(frameId);
    controls.dispose();
    interfaz.dispose();
    renderer.dispose();
    for (const texture of Object.values(textures)) renderer.gl.deleteTexture(texture);
});
