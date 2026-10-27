import { Object3D } from '../core/Object3D.js';
import { Mesh } from './Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { MountainGeometry, calcularAlturaMontana } from '../geometries/MountainGeometry.js';
import { CylinderGeometry } from '../geometries/CylinderGeometry.js';
import { SphereGeometry } from '../geometries/SphereGeometry.js';
import { Matrix4 } from '../math/Matrix4.js';

const { identidad: matrizIdentidad, multiplicar: multiplicarMat4,
    traslacion, escala, rotacionY, rotacionZ } = Matrix4;

/**
 * Montaña 3D con relieve andino ondulado y denso bosque de árboles (pinos y queñuales)
 * ubicado en la parte posterior de la Facultad de Ingeniería de Sistemas (UNA Puno).
 */
export class Montana extends Object3D {
    constructor(texturas) {
        super('Montaña y Bosque Posterior');

        // 1. Relieve de la montaña
        const geomMontana = new MountainGeometry(140, -15.5, -88.0, 36, 24);
        const matMontana = new BasicMaterial({
            texture: texturas.cespedMontana,
            color: [0.92, 0.98, 0.92, 1.0],
            shininess: 4.0
        });
        const meshMontana = new Mesh(geomMontana, matMontana, 'Terreno de Montaña');
        this.add(meshMontana);

        // 2. Geometrías compartidas para los árboles del bosque (reutilizan VAO en GPU)
        const geomTronco = new CylinderGeometry(0.22, 0.28, 1.8, 8);
        const geomPino1 = new CylinderGeometry(1.65, 0.12, 2.2, 9);
        const geomPino2 = new CylinderGeometry(1.25, 0.08, 2.0, 9);
        const geomPino3 = new CylinderGeometry(0.85, 0.04, 1.8, 9);
        const geomCopa = new SphereGeometry(1.25, 8, 10);
        const geomArbusto = new SphereGeometry(0.85, 7, 9);
        const geomRoca = new SphereGeometry(0.95, 6, 8);

        // 3. Materiales del bosque
        const matTronco = new BasicMaterial({
            texture: texturas.cortezaArbol,
            color: [0.52, 0.35, 0.22, 1.0],
            shininess: 4.0
        });

        const matPinoOscuro = new BasicMaterial({ color: [0.12, 0.36, 0.16, 1.0], shininess: 8.0 });
        const matPinoMedio = new BasicMaterial({ color: [0.16, 0.44, 0.20, 1.0], shininess: 8.0 });
        const matPinoClaro = new BasicMaterial({ color: [0.22, 0.52, 0.24, 1.0], shininess: 10.0 });
        const matPinoLima = new BasicMaterial({ color: [0.26, 0.56, 0.26, 1.0], shininess: 10.0 });

        const matQuenual1 = new BasicMaterial({ color: [0.20, 0.48, 0.20, 1.0], shininess: 10.0 });
        const matQuenual2 = new BasicMaterial({ color: [0.28, 0.56, 0.26, 1.0], shininess: 12.0 });

        const matArbusto = new BasicMaterial({ color: [0.32, 0.50, 0.22, 1.0], shininess: 6.0 });
        const matRoca = new BasicMaterial({ color: [0.55, 0.56, 0.58, 1.0], shininess: 16.0 });

        // 4. Generación determinista del bosque sobre la ladera de la montaña
        const M_Mundo = matrizIdentidad();
        const numArboles = 96;

        for (let i = 0; i < numArboles; i++) {
            // Distribución orgánica determinista mediante funciones trigonométricas
            const u = (i * 0.6180339887) % 1.0;
            const v = (i * 0.3819660113) % 1.0;

            const x = -60.0 + u * 120.0;
            const z = -18.0 - v * 64.0;
            const yBase = calcularAlturaMontana(x, z);

            const escalaBase = 0.85 + ((i * 17) % 10) * 0.06;
            const esPino = (i % 3 !== 0); // 66% pinos/coníferas, 33% queñuales frondosos
            const rotY = (i * 1.37) % (Math.PI * 2);

            if (esPino) {
                // Tronco
                let mTr = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.9 * escalaBase, z));
                mTr = multiplicarMat4(mTr, rotacionY(rotY));
                mTr = multiplicarMat4(mTr, escala(escalaBase, escalaBase, escalaBase));
                const meshTr = new Mesh(geomTronco, matTronco, 'Tronco Pino').setMatrix(mTr);
                this.add(meshTr);

                // Nivel inferior del pino
                let mC1 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 2.1 * escalaBase, z));
                mC1 = multiplicarMat4(mC1, rotacionY(rotY + 0.2));
                mC1 = multiplicarMat4(mC1, escala(escalaBase, escalaBase, escalaBase));
                const meshC1 = new Mesh(geomPino1, (i % 2 === 0 ? matPinoOscuro : matPinoMedio), 'Copa Pino 1').setMatrix(mC1);
                this.add(meshC1);

                // Nivel medio del pino
                let mC2 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 3.3 * escalaBase, z));
                mC2 = multiplicarMat4(mC2, rotacionY(rotY + 0.5));
                mC2 = multiplicarMat4(mC2, escala(escalaBase, escalaBase, escalaBase));
                const meshC2 = new Mesh(geomPino2, (i % 2 === 0 ? matPinoMedio : matPinoClaro), 'Copa Pino 2').setMatrix(mC2);
                this.add(meshC2);

                // Nivel superior del pino
                let mC3 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 4.3 * escalaBase, z));
                mC3 = multiplicarMat4(mC3, rotacionY(rotY + 0.9));
                mC3 = multiplicarMat4(mC3, escala(escalaBase, escalaBase, escalaBase));
                const meshC3 = new Mesh(geomPino3, (i % 2 === 0 ? matPinoClaro : matPinoLima), 'Copa Pino 3').setMatrix(mC3);
                this.add(meshC3);
            } else {
                // Árbol frondoso / Queñual andino
                let mTr = multiplicarMat4(M_Mundo, traslacion(x, yBase + 1.1 * escalaBase, z));
                mTr = multiplicarMat4(mTr, rotacionZ(((i % 5) - 2) * 0.05));
                mTr = multiplicarMat4(mTr, escala(escalaBase * 1.1, escalaBase * 1.2, escalaBase * 1.1));
                const meshTr = new Mesh(geomTronco, matTronco, 'Tronco Queñual').setMatrix(mTr);
                this.add(meshTr);

                // Follaje esférico principal
                let mCp1 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 2.6 * escalaBase, z));
                mCp1 = multiplicarMat4(mCp1, escala(escalaBase * 1.4, escalaBase * 1.2, escalaBase * 1.3));
                const meshCp1 = new Mesh(geomCopa, matQuenual1, 'Follaje Queñual 1').setMatrix(mCp1);
                this.add(meshCp1);

                // Follaje superior desplazado
                let mCp2 = multiplicarMat4(M_Mundo, traslacion(x + 0.4 * escalaBase, yBase + 3.4 * escalaBase, z - 0.2 * escalaBase));
                mCp2 = multiplicarMat4(mCp2, escala(escalaBase * 1.1, escalaBase * 1.0, escalaBase * 1.1));
                const meshCp2 = new Mesh(geomCopa, matQuenual2, 'Follaje Queñual 2').setMatrix(mCp2);
                this.add(meshCp2);
            }
        }

        // 5. Arbustos y matas de pasto ichu dispersos por la ladera
        for (let j = 0; j < 36; j++) {
            const u = (j * 0.4321) % 1.0;
            const v = (j * 0.8765) % 1.0;
            const x = -55.0 + u * 110.0;
            const z = -17.0 - v * 60.0;
            const yBase = calcularAlturaMontana(x, z);
            const s = 0.8 + (j % 4) * 0.25;

            let mArb = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.4 * s, z));
            mArb = multiplicarMat4(mArb, escala(1.4 * s, 0.7 * s, 1.4 * s));
            const meshArb = new Mesh(geomArbusto, matArbusto, 'Arbusto de Ladera').setMatrix(mArb);
            this.add(meshArb);
        }

        // 6. Rocas y peñascos andinos en la ladera
        for (let k = 0; k < 18; k++) {
            const u = (k * 0.6789) % 1.0;
            const v = (k * 0.2345) % 1.0;
            const x = -50.0 + u * 100.0;
            const z = -22.0 - v * 55.0;
            const yBase = calcularAlturaMontana(x, z);
            const s = 1.0 + (k % 5) * 0.4;

            let mRoc = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.3 * s, z));
            mRoc = multiplicarMat4(mRoc, rotacionY(k * 0.8));
            mRoc = multiplicarMat4(mRoc, escala(1.6 * s, 0.9 * s, 1.2 * s));
            const meshRoc = new Mesh(geomRoca, matRoca, 'Roca de Montaña').setMatrix(mRoc);
            this.add(meshRoc);
        }
    }
}
