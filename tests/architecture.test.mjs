import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Object3D } from '../js/core/Object3D.js';
import { Mesh } from '../js/objects/Mesh.js';
import { BasicMaterial } from '../js/materials/BasicMaterial.js';
import { Facultad } from '../js/scenes/Facultad.js';
import { Montana } from '../js/objects/Montana.js';
import { SistemaCeleste } from '../js/objects/SistemaCeleste.js';
import { Scene } from '../js/core/Scene.js';
import { PerspectiveCamera } from '../js/cameras/PerspectiveCamera.js';
import { BoxGeometry } from '../js/geometries/BoxGeometry.js';
import { PlaneGeometry } from '../js/geometries/PlaneGeometry.js';
import { CylinderGeometry } from '../js/geometries/CylinderGeometry.js';
import { DiskGeometry } from '../js/geometries/DiskGeometry.js';
import { SphereGeometry } from '../js/geometries/SphereGeometry.js';
import { StairGeometry } from '../js/geometries/StairGeometry.js';
import { TrapezoidGeometry } from '../js/geometries/TrapezoidGeometry.js';
import { MountainGeometry, calcularAlturaMontana } from '../js/geometries/MountainGeometry.js';

test('Los hijos heredan posición, rotación y escala; se pueden reasignar de padre', () => {
    const parent = new Object3D();
    const child = new Object3D();
    parent.position.x = 10;
    parent.rotation.z = Math.PI / 2;
    parent.scale.x = 2;
    child.position.x = 3;
    parent.add(child);
    parent.updateMatrixWorld();
    assert.ok(Math.abs(child.matrixWorld[12] - 10) < 1e-5);
    assert.ok(Math.abs(child.matrixWorld[13] - 6) < 1e-5);
    assert.equal(child.matrix[12], 3);
    const other = new Object3D();
    other.add(child);
    other.updateMatrixWorld();
    assert.equal(parent.children.length, 0);
    assert.equal(child.matrixWorld[12], 3);
    assert.throws(() => child.add(other), /ciclos/);
    other.remove(child);
    assert.equal(child.parent, null);
});

test('Cambiar la escala de un Mesh no modifica su geometría compartida', () => {
    const geometry = new BoxGeometry();
    const before = geometry.vertices.slice();
    const a = new Mesh(geometry, new BasicMaterial());
    const b = new Mesh(geometry, new BasicMaterial());
    a.scale.x = 4;
    a.updateMatrixWorld();
    b.updateMatrixWorld();
    assert.equal(a.geometry, b.geometry);
    assert.deepEqual(geometry.vertices, before);
    assert.equal(a.matrixWorld[0], 4);
    assert.equal(b.matrixWorld[0], 1);
});

test('Todas las geometrías contienen triángulos válidos, normales y UV finitas', () => {
    for (const Type of [BoxGeometry, PlaneGeometry, CylinderGeometry, DiskGeometry,
        SphereGeometry, StairGeometry, TrapezoidGeometry, MountainGeometry]) {
        const geometry = new Type();
        assert.equal(geometry.vertices.length % 8, 0, Type.name);
        assert.equal(geometry.indices.length % 3, 0, Type.name);
        assert.ok(geometry.vertices.every(Number.isFinite), Type.name);
        assert.ok(geometry.indices.every(index => index < geometry.vertices.length / 8), Type.name);
    }
});

test('La facultad se construye sin WebGL, conserva sus nodos y anima bisagras', () => {
    const facultad = new Facultad({});
    let meshCount = 0;
    const geometries = new Set();
    facultad.traverse(object => {
        if (object instanceof Mesh) { meshCount++; geometries.add(object.geometry); }
    });
    assert.ok(meshCount > 100);
    assert.equal(geometries.size, 6);
    const children = facultad.children.slice();
    const puerta = facultad.puertas.bisagras[0];
    const hoja = puerta.children[0];
    for (let i = 0; i < 120; i++) facultad.update(1 / 60, { puertasAbiertas: true, ventanasAbiertas: false });
    const abierta = puerta.rotation.y;
    assert.ok(abierta < -1);
    facultad.update(1 / 60, { puertasAbiertas: false, ventanasAbiertas: false });
    assert.ok(puerta.rotation.y < 0, 'El cierre no debe ser instantáneo');
    assert.ok(puerta.rotation.y > abierta);
    assert.ok(facultad.ventanas.apertura < 0.001);
    assert.deepEqual(facultad.children, children);
    assert.equal(puerta.children[0], hoja);
    facultad.updateMatrixWorld();
    const originalX = hoja.matrixWorld[12];
    facultad.position.x = 10;
    facultad.updateMatrixWorld();
    assert.ok(Math.abs(hoja.matrixWorld[12] - originalX - 10) < 1e-5);
});

test('La montaña andina con bosque distribuye árboles y relieve natural', () => {
    const montana = new Montana({});
    let meshCount = 0;
    montana.traverse(obj => {
        if (obj instanceof Mesh) meshCount++;
    });
    // Debe contener terreno de montaña, decenas de árboles (troncos y copas), arbustos y rocas
    assert.ok(meshCount > 150, `Se esperaban más de 150 piezas en el bosque, se encontraron ${meshCount}`);

    // Verificar que la función de elevación de montaña asciende correctamente
    const hBorde = calcularAlturaMontana(0, -15.5);
    const hMedio = calcularAlturaMontana(0, -45.0);
    const hFondo = calcularAlturaMontana(0, -85.0);
    assert.ok(hBorde <= hMedio, 'La elevación debe ascender hacia el fondo');
    assert.ok(hMedio <= hFondo, 'El fondo de la montaña debe ser más alto que la base');
    assert.ok(hFondo > 18.0, 'La cresta de la montaña debe superar los 18 metros');
});

test('El sistema celeste gestiona la órbita del Sol, la Luna, estrellas y ciclo día/noche', () => {
    const scene = new Scene();
    const sistema = new SistemaCeleste(scene, {});

    // Sol y Luna deben estar en posiciones opuestas
    const posSol = sistema.meshSol.position;
    const posLuna = sistema.meshLuna.position;
    assert.ok(posSol.y > 0, 'El sol debe iniciar sobre el horizonte durante el día');
    assert.ok(posLuna.y < 0, 'La luna debe iniciar bajo el horizonte durante el día');

    // Cambiar a modo noche
    sistema.alternarModo(true);
    for (let i = 0; i < 60; i++) sistema.update(0.1);
    assert.ok(sistema.meshLuna.position.y > 0, 'La luna debe elevarse en el cielo de noche');
    assert.ok(sistema.meshSol.position.y < 0, 'El sol debe ponerse bajo el horizonte de noche');
    assert.ok(scene.background[0] < 0.1, 'El fondo de la escena debe ser oscuro en la noche');
});

test('La cámara actualiza perspectiva y respeta la posición mundial del padre', () => {
    const parent = new Object3D();
    parent.position.x = 5;
    const camera = new PerspectiveCamera(52, 1, 0.2, 200);
    camera.position.z = 10;
    parent.add(camera);
    camera.updateViewMatrix();
    assert.equal(camera.matrixWorld[12], 5);
    assert.ok(camera.viewMatrix.every(Number.isFinite));
    const before = camera.projectionMatrix[0];
    camera.aspect = 2;
    camera.updateProjectionMatrix();
    assert.ok(Math.abs(camera.projectionMatrix[0] - before / 2) < 1e-6);
});
