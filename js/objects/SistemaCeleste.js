import { Object3D } from '../core/Object3D.js';
import { Mesh } from './Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { SphereGeometry } from '../geometries/SphereGeometry.js';
import { focos } from '../scenes/Lighting.js';

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpVec3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/**
 * Sistema celeste con Sol radiante, Luna llena con textura lunar y campo de estrellas.
 * Implementa el ciclo diurno-nocturno con órbita continua y transición suave de luz y cielo.
 */
export class SistemaCeleste extends Object3D {
    constructor(scene, texturas) {
        super('Sistema Celeste');
        this.scene = scene;
        this.radioOrbita = 94.0;
        this.centroOrbita = { x: 0.0, y: 3.0, z: -18.0 };

        // Ángulo solar en radianes:
        // PI * 0.5 = Mediodía (Sol en el cenit)
        // PI = Atardecer / Ocaso (Sol en el horizonte oeste)
        // PI * 1.5 = Medianoche (Luna en el cenit)
        // 0 o 2*PI = Amanecer (Sol en el horizonte este)
        this.angulo = Math.PI * 0.5;
        this.anguloObjetivo = Math.PI * 0.5;
        this.autoCiclo = true;
        this.velocidadCiclo = 0.085; // Un ciclo completo dura aprox. 74 segundos

        // 1. Sol 3D y halo radiante
        const geomSol = new SphereGeometry(3.6, 14, 18);
        const matSol = new BasicMaterial({
            color: [1.0, 0.96, 0.55, 1.0],
            emissive: true
        });
        this.meshSol = new Mesh(geomSol, matSol, 'Sol');
        this.add(this.meshSol);

        const geomHaloSol = new SphereGeometry(5.0, 10, 14);
        const matHaloSol = new BasicMaterial({
            color: [1.0, 0.82, 0.25, 0.45],
            emissive: true
        });
        this.meshHaloSol = new Mesh(geomHaloSol, matHaloSol, 'Halo Solar');
        this.add(this.meshHaloSol);

        // 2. Luna 3D con textura procedimental y halo plateado
        const geomLuna = new SphereGeometry(2.7, 14, 18);
        const matLuna = new BasicMaterial({
            texture: texturas.luna,
            color: [0.94, 0.96, 1.0, 1.0],
            emissive: true
        });
        this.meshLuna = new Mesh(geomLuna, matLuna, 'Luna');
        this.add(this.meshLuna);

        const geomHaloLuna = new SphereGeometry(3.7, 10, 14);
        const matHaloLuna = new BasicMaterial({
            color: [0.65, 0.78, 1.0, 0.35],
            emissive: true
        });
        this.meshHaloLuna = new Mesh(geomHaloLuna, matHaloLuna, 'Halo Lunar');
        this.add(this.meshHaloLuna);

        // 3. Campo de estrellas titilantes en el firmamento nocturno
        this.estrellas = [];
        const geomEstrella = new SphereGeometry(0.32, 6, 8);
        const matEstrella = new BasicMaterial({
            color: [0.95, 0.98, 1.0, 1.0],
            emissive: true
        });

        const numEstrellas = 84;
        for (let i = 0; i < numEstrellas; i++) {
            const theta = (i * 0.618033) * Math.PI * 2.0;
            const phi = 0.15 + ((i * 0.381966) % 1.0) * (Math.PI * 0.42); // Solo hemisferio superior
            const r = 98.0 + (i % 5) * 2.0;

            const xs = this.centroOrbita.x + r * Math.sin(phi) * Math.cos(theta);
            const ys = this.centroOrbita.y + r * Math.cos(phi);
            const zs = this.centroOrbita.z + r * Math.sin(phi) * Math.sin(theta);

            const meshEstrella = new Mesh(geomEstrella, matEstrella, 'Estrella');
            meshEstrella.position = { x: xs, y: ys, z: zs };
            this.add(meshEstrella);
            this.estrellas.push({ mesh: meshEstrella, fase: i * 0.7 });
        }

        // Actualizar posiciones e iluminación inicial
        this.actualizarTransformaciones(0);
    }

    /**
     * Alterna suavemente entre Modo Día y Modo Noche (activado por tecla L o botón UI).
     */
    alternarModo(luzNocturna) {
        if (luzNocturna) {
            this.autoCiclo = false;
            this.anguloObjetivo = Math.PI * 1.5; // Noche (Luna en cenit)
        } else {
            this.autoCiclo = false;
            this.anguloObjetivo = Math.PI * 0.5; // Día (Sol en cenit)
        }
    }

    /**
     * Alterna la rotación continua automática del ciclo día/noche.
     */
    alternarAutoCiclo() {
        this.autoCiclo = !this.autoCiclo;
    }

    update(dt) {
        if (this.autoCiclo) {
            this.angulo += this.velocidadCiclo * dt;
            if (this.angulo > Math.PI * 2) this.angulo -= Math.PI * 2;
            this.anguloObjetivo = this.angulo;
        } else {
            // Interpolación suave hacia el objetivo seleccionado
            let diff = this.anguloObjetivo - this.angulo;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            this.angulo += diff * (1.0 - Math.exp(-3.5 * dt));
        }

        this.actualizarTransformaciones(dt);
    }

    actualizarTransformaciones(dt = 0) {
        const R = this.radioOrbita;
        const C = this.centroOrbita;
        const ang = this.angulo;

        // Órbita solar: de Este (+X) a Oeste (-X), cruzando hacia el sur
        const solX = C.x + Math.cos(ang) * R;
        const solY = C.y + Math.sin(ang) * R;
        const solZ = C.z + Math.sin(ang * 0.5) * 16.0;

        this.meshSol.position = { x: solX, y: solY, z: solZ };
        this.meshHaloSol.position = { x: solX, y: solY, z: solZ };
        const solVisible = solY > -0.5;
        this.meshSol.visible = solVisible;
        this.meshHaloSol.visible = solVisible;

        // Órbita lunar: exactamente opuesta al Sol (diferencia de PI)
        const angLuna = ang + Math.PI;
        const lunaX = C.x + Math.cos(angLuna) * R;
        const lunaY = C.y + Math.sin(angLuna) * R;
        const lunaZ = C.z + Math.sin(angLuna * 0.5) * 16.0;

        this.meshLuna.position = { x: lunaX, y: lunaY, z: lunaZ };
        this.meshHaloLuna.position = { x: lunaX, y: lunaY, z: lunaZ };
        const lunaVisible = lunaY > -0.5;
        this.meshLuna.visible = lunaVisible;
        this.meshHaloLuna.visible = lunaVisible;

        // Altura normalizada del Sol (-1 a +1)
        const sinSol = Math.sin(ang);
        // Factor de día: 1.0 (día pleno), 0.0 (noche plena)
        const factorDia = clamp((sinSol + 0.15) / 0.55, 0.0, 1.0);
        // Factor crepuscular / atardecer: pico cuando el sol está tocando el horizonte
        const factorOcaso = Math.max(0.0, 1.0 - Math.abs(sinSol) * 3.5);

        // Visibilidad y escala de estrellas según presencia solar
        const visibilidadEstrellas = 1.0 - factorDia;
        for (let i = 0; i < this.estrellas.length; i++) {
            const e = this.estrellas[i];
            const titileo = 0.85 + 0.15 * Math.sin(ang * 6.0 + e.fase);
            const s = visibilidadEstrellas * titileo;
            e.mesh.scale = { x: s, y: s, z: s };
            e.mesh.visible = s > 0.05;
        }

        // Color del cielo (fondo de la escena)
        const cieloDia = [0.46, 0.68, 0.90, 1.0];
        const cieloOcaso = [0.82, 0.44, 0.32, 1.0];
        const cieloNoche = [0.03, 0.04, 0.08, 1.0];

        let cieloActual = lerpVec3(cieloNoche, cieloDia, factorDia);
        cieloActual = lerpVec3(cieloActual, cieloOcaso, factorOcaso * 0.75);
        this.scene.background = [cieloActual[0], cieloActual[1], cieloActual[2], 1.0];

        // Dirección de la luz direccional principal (desde el astro visible hacia el centro)
        let dirLuz;
        if (solY > -5.0) {
            const l = Math.hypot(solX, solY, solZ) || 1.0;
            dirLuz = [-solX / l, -solY / l, -solZ / l];
        } else {
            const l = Math.hypot(lunaX, lunaY, lunaZ) || 1.0;
            dirLuz = [-lunaX / l, -lunaY / l, -lunaZ / l];
        }

        // Color de la luz direccional
        const luzSolDia = [0.98, 0.96, 0.92];
        const luzSolOcaso = [1.0, 0.65, 0.35];
        const luzLunaNoche = [0.22, 0.28, 0.42];

        let colorLuzActual = lerpVec3(luzLunaNoche, luzSolDia, factorDia);
        colorLuzActual = lerpVec3(colorLuzActual, luzSolOcaso, factorOcaso * 0.8);

        // Color de luz ambiental
        const ambientDia = [0.40, 0.42, 0.46];
        const ambientOcaso = [0.32, 0.24, 0.26];
        const ambientNoche = [0.07, 0.08, 0.12];

        let ambientActual = lerpVec3(ambientNoche, ambientDia, factorDia);
        ambientActual = lerpVec3(ambientActual, ambientOcaso, factorOcaso * 0.6);

        // Intensidad de los focos dicroicos del edificio (se encienden de noche)
        const intensFocos = lerp(4.8, 1.2, factorDia);

        this.scene.lighting = {
            sunDirection: dirLuz,
            sunColor: colorLuzActual,
            ambientColor: ambientActual,
            pointLights: focos.map(foco => ({
                ...foco,
                color: [1, 0.95, 0.82],
                intensity: intensFocos
            }))
        };
    }
}
