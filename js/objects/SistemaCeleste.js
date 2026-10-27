import { Object3D } from '../core/Object3D.js';
import { Mesh } from './Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { SphereGeometry } from '../geometries/SphereGeometry.js';
import { calcularIluminacionCeleste } from '../scenes/Lighting.js';

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpVec4(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
}

/**
 * Sistema celeste con Sol radiante (textura y corona solar), Luna llena plateada
 * con mares basálticos y campo de estrellas titilantes.
 * Coordina el ciclo diurno-nocturno delegando el cálculo fotométrico a Lighting.js.
 */
export class SistemaCeleste extends Object3D {
    constructor(scene, texturas = {}) {
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

        // 1. Sol 3D con textura de plasma incandescente y halo radiante
        const geomSol = new SphereGeometry(3.8, 18, 22);
        const matSol = new BasicMaterial({
            texture: texturas?.sol || null,
            color: [1.0, 0.98, 0.88, 1.0],
            emissive: true
        });
        this.meshSol = new Mesh(geomSol, matSol, 'Sol');
        this.add(this.meshSol);

        const geomHaloSol = new SphereGeometry(6.2, 14, 18);
        const matHaloSol = new BasicMaterial({
            color: [1.0, 0.88, 0.38, 0.32],
            emissive: true,
            depthWrite: false
        });
        this.meshHaloSol = new Mesh(geomHaloSol, matHaloSol, 'Halo Solar');
        this.add(this.meshHaloSol);

        // 2. Luna 3D con textura procedimental y halo plateado etéreo
        const geomLuna = new SphereGeometry(2.8, 18, 22);
        const matLuna = new BasicMaterial({
            texture: texturas?.luna || null,
            color: [0.96, 0.98, 1.0, 1.0],
            emissive: true
        });
        this.meshLuna = new Mesh(geomLuna, matLuna, 'Luna');
        this.add(this.meshLuna);

        const geomHaloLuna = new SphereGeometry(4.4, 14, 18);
        const matHaloLuna = new BasicMaterial({
            color: [0.65, 0.80, 1.0, 0.28],
            emissive: true,
            depthWrite: false
        });
        this.meshHaloLuna = new Mesh(geomHaloLuna, matHaloLuna, 'Halo Lunar');
        this.add(this.meshHaloLuna);

        // 3. Campo de estrellas titilantes en el firmamento nocturno
        this.estrellas = [];
        const geomEstrella = new SphereGeometry(0.32, 6, 8);
        const matEstrella = new BasicMaterial({
            color: [0.96, 0.98, 1.0, 1.0],
            emissive: true
        });

        const numEstrellas = 110;
        for (let i = 0; i < numEstrellas; i++) {
            const theta = (i * 0.618033) * Math.PI * 2.0;
            const phi = 0.12 + ((i * 0.381966) % 1.0) * (Math.PI * 0.44); // Hemisferio superior
            const r = 98.0 + (i % 6) * 1.8;

            const xs = this.centroOrbita.x + r * Math.sin(phi) * Math.cos(theta);
            const ys = this.centroOrbita.y + r * Math.cos(phi);
            const zs = this.centroOrbita.z + r * Math.sin(phi) * Math.sin(theta);

            const meshEstrella = new Mesh(geomEstrella, matEstrella, 'Estrella');
            meshEstrella.position = { x: xs, y: ys, z: zs };
            this.add(meshEstrella);
            this.estrellas.push({
                mesh: meshEstrella,
                fase: i * 0.72,
                escalaBase: 0.8 + ((i * 13) % 10) * 0.05
            });
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

        // Rotación axial suave de los astros para mayor dinamismo
        this.meshSol.rotation.y += 0.06 * dt;
        this.meshLuna.rotation.y += 0.03 * dt;

        this.actualizarTransformaciones(dt);
    }

    actualizarTransformaciones(dt = 0) {
        // Cálculo fotométrico centralizado en Lighting.js
        const ilum = calcularIluminacionCeleste(this.angulo, this.centroOrbita, this.radioOrbita);

        // 1. Posicionamiento y corona del Sol
        const solPos = { x: ilum.datosSol.x, y: ilum.datosSol.y, z: ilum.datosSol.z };
        this.meshSol.position = solPos;
        this.meshHaloSol.position = solPos;
        this.meshSol.visible = ilum.datosSol.visible;
        this.meshHaloSol.visible = ilum.datosSol.visible;

        // El halo solar se expande y se tiñe de ámbar rojizo en la hora dorada (atardecer/amanecer)
        const factorOcaso = ilum.datosSol.factorOcaso;
        const escalaHaloSol = 1.0 + factorOcaso * 0.45;
        this.meshHaloSol.scale = { x: escalaHaloSol, y: escalaHaloSol, z: escalaHaloSol };
        const colorHaloDia = [1.0, 0.88, 0.38, 0.32];
        const colorHaloOcaso = [1.0, 0.50, 0.18, 0.52];
        this.meshHaloSol.material.color = lerpVec4(colorHaloDia, colorHaloOcaso, factorOcaso);

        // 2. Posicionamiento y corona de la Luna
        const lunaPos = { x: ilum.datosLuna.x, y: ilum.datosLuna.y, z: ilum.datosLuna.z };
        this.meshLuna.position = lunaPos;
        this.meshHaloLuna.position = lunaPos;
        this.meshLuna.visible = ilum.datosLuna.visible;
        this.meshHaloLuna.visible = ilum.datosLuna.visible;

        // El halo lunar despliega su fulgor plateado al elevarse en la noche
        const escalaHaloLuna = 1.0 + ilum.datosLuna.factorNoche * 0.22;
        this.meshHaloLuna.scale = { x: escalaHaloLuna, y: escalaHaloLuna, z: escalaHaloLuna };

        // 3. Estrellas titilantes en el firmamento
        const visibilidadEstrellas = 1.0 - ilum.datosSol.factorDia;
        for (let i = 0; i < this.estrellas.length; i++) {
            const e = this.estrellas[i];
            const titileo = 0.82 + 0.18 * Math.sin(this.angulo * 7.0 + e.fase);
            const s = visibilidadEstrellas * titileo * e.escalaBase;
            e.mesh.scale = { x: s, y: s, z: s };
            e.mesh.visible = s > 0.04;
        }

        // 4. Actualización del fondo y de la iluminación en la escena
        this.scene.background = ilum.background;
        this.scene.lighting = {
            sunDirection: ilum.sunDirection,
            sunColor: ilum.sunColor,
            ambientColor: ilum.ambientColor,
            shadowIntensity: ilum.shadowIntensity,
            pointLights: ilum.pointLights
        };
    }
}
