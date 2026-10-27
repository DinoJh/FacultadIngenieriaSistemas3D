import { Object3D } from '../core/Object3D.js';
import { Mesh } from '../objects/Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Puertas } from '../objects/Puertas.js';
import { Ventanas } from '../objects/Ventanas.js';
import { BoxGeometry } from '../geometries/BoxGeometry.js';
import { PlaneGeometry } from '../geometries/PlaneGeometry.js';
import { CylinderGeometry } from '../geometries/CylinderGeometry.js';
import { DiskGeometry } from '../geometries/DiskGeometry.js';
import { TrapezoidGeometry } from '../geometries/TrapezoidGeometry.js';
import { SphereGeometry } from '../geometries/SphereGeometry.js';

const { identidad: matrizIdentidad, multiplicar: multiplicarMat4,
    traslacion, escala, rotacionX, rotacionY, rotacionZ } = Matrix4;

/** Ensambla la arquitectura del edificio; no conoce WebGL ni la interfaz. */
export class Facultad extends Object3D {
    constructor(texturas) {
        super('Facultad de Ingeniería de Sistemas');
        this.cubo = new BoxGeometry();
        this.plano = new PlaneGeometry();
        this.cilindro = new CylinderGeometry(0.5, 0.5, 1, 18);
        this.discoLuz = new DiskGeometry(0.5, 16);
        this.paredTrapezoide = new TrapezoidGeometry(1.80, 0.65, 5.70, 0.90);
        this.esfera = new SphereGeometry(0.5, 10, 14);
        this.construir(texturas);
    }

    agregarPieza(geometry, matrix, opciones = {}) {
        const material = new BasicMaterial({
            texture: opciones.textura,
            color: opciones.color,
            emissive: opciones.emisivo,
            shininess: opciones.brillo
        });
        const mesh = new Mesh(geometry, material, 'Pieza arquitectónica').setMatrix(matrix);
        this.add(mesh);
        return mesh;
    }

    update(dt, estado) {
        this.puertas.update(dt, estado.puertasAbiertas);
        this.ventanas.update(dt, estado.ventanasAbiertas);
    }

    construir(texturas) {
        const M_Mundo = matrizIdentidad();

        // ====================================================================
        // 1. TERRENO, CALZADA Y ENTORNO EXPANDIDO (Frontal, Lateral y Posterior)
        // ====================================================================
        // Suelo / Explanada base general del campus (expande el piso en todas las direcciones)
        let mSueloBase = multiplicarMat4(M_Mundo, traslacion(0.0, -0.09, 10.0));
        mSueloBase = multiplicarMat4(mSueloBase, escala(140.0, 1.0, 56.0));
        this.agregarPieza(this.plano, mSueloBase, {
            textura: texturas.cespedMontana,
            color: [0.70, 0.85, 0.65, 1.0],
            brillo: 2.0
        });

        // Calzada frontal de asfalto ampliada a lo largo de la fachada
        let mPista = multiplicarMat4(M_Mundo, traslacion(-5.0, -0.05, 9.5));
        mPista = multiplicarMat4(mPista, escala(86.0, 1.0, 11.5));
        this.agregarPieza(this.plano, mPista, { textura: texturas.asfalto, brillo: 6.0 });

        // Explanada de vereda / acceso peatonal frontal ampliada hacia la izquierda
        let mVereda = multiplicarMat4(M_Mundo, traslacion(-3.5, 0.08, 2.2));
        mVereda = multiplicarMat4(mVereda, escala(42.0, 0.18, 5.8));
        this.agregarPieza(this.cubo, mVereda, { color: [0.78, 0.80, 0.82, 1.0], brillo: 12.0 });

        // Sardinel amarillo de seguridad al borde de la vereda
        let mSardinel = multiplicarMat4(M_Mundo, traslacion(-3.5, 0.14, 5.0));
        mSardinel = multiplicarMat4(mSardinel, escala(42.0, 0.28, 0.35));
        this.agregarPieza(this.cubo, mSardinel, { color: [0.93, 0.73, 0.08, 1.0], brillo: 24.0 });

        // Vereda / explanada lateral izquierda hacia el campus universitario
        let mVeredaIzq = multiplicarMat4(M_Mundo, traslacion(-15.5, 0.06, -1.8));
        mVeredaIzq = multiplicarMat4(mVeredaIzq, escala(12.0, 0.14, 13.0));
        this.agregarPieza(this.cubo, mVeredaIzq, { color: [0.73, 0.75, 0.78, 1.0], brillo: 10.0 });

        // Calle en pendiente suave hacia la derecha (FacultadLadoDerecho.jpeg)
        let mCalleSubida = multiplicarMat4(M_Mundo, traslacion(15.2, 0.6, 3.0));
        mCalleSubida = multiplicarMat4(mCalleSubida, rotacionZ(0.08));
        mCalleSubida = multiplicarMat4(mCalleSubida, escala(12, 0.2, 15));
        this.agregarPieza(this.cubo, mCalleSubida, { textura: texturas.asfalto });

        // Baranda de seguridad en la curva de la calle a la derecha
        this._crearBarandaCurvaCalle(M_Mundo, 10.2, 0.25, 4.6);

        // Entorno posterior (patio de aulas y cerro de UNA Puno)
        let mPatioPosterior = multiplicarMat4(M_Mundo, traslacion(0.0, 0.02, -11.5));
        mPatioPosterior = multiplicarMat4(mPatioPosterior, escala(50.0, 0.14, 10.0));
        this.agregarPieza(this.cubo, mPatioPosterior, { color: [0.68, 0.71, 0.75, 1.0], brillo: 8.0 });

        let mCespedPost = multiplicarMat4(M_Mundo, traslacion(0.0, 0.4, -17.5));
        mCespedPost = multiplicarMat4(mCespedPost, escala(54.0, 0.8, 4.5));
        this.agregarPieza(this.cubo, mCespedPost, { color: [0.20, 0.42, 0.18, 1.0] });

        let mMuroCerco = multiplicarMat4(M_Mundo, traslacion(0.0, 1.3, -16.0));
        mMuroCerco = multiplicarMat4(mMuroCerco, escala(52.0, 1.8, 0.4));
        this.agregarPieza(this.cubo, mMuroCerco, { color: [0.45, 0.48, 0.52, 1.0] });

        // ====================================================================
        // 2. BASE ESTRUCTURAL Y ZÓCALO MONOLÍTICO
        // ====================================================================
        let mZocalo = multiplicarMat4(M_Mundo, traslacion(2.5, 0.55, -3.8));
        mZocalo = multiplicarMat4(mZocalo, escala(23.5, 1.1, 13.5));
        this.agregarPieza(this.cubo, mZocalo, { color: [0.20, 0.22, 0.26, 1.0] });

        // ====================================================================
        // 3. BALCÓN FRONTAL IZQUIERDO Y BALCÓN DE ENTRADA (CUBIERTOS POR REJAS)
        // ====================================================================
        const yNivelPlanta1 = 2.80; // Altura de piso elevada para escalinata monumental

        // A) BALCÓN FRONTAL IZQUIERDO (Se extiende hacia la izquierda frente a la torre)
        let mLosaBalconIzq = multiplicarMat4(M_Mundo, traslacion(-4.15, yNivelPlanta1 - 0.10, 2.55));
        mLosaBalconIzq = multiplicarMat4(mLosaBalconIzq, escala(6.00, 0.20, 1.70));
        this.agregarPieza(this.cubo, mLosaBalconIzq, { color: [0.22, 0.25, 0.29, 1.0], brillo: 16.0 });

        // Muro zócalo del sótano bajo el balcón izquierdo (con buñas horizontales)
        let mMuroSotanoIzq = multiplicarMat4(M_Mundo, traslacion(-4.15, 1.30, 2.55));
        mMuroSotanoIzq = multiplicarMat4(mMuroSotanoIzq, escala(6.00, 2.60, 1.70));
        this.agregarPieza(this.cubo, mMuroSotanoIzq, { color: [0.16, 0.18, 0.22, 1.0] });

        // Buñas / franjas horizontales decorativas del sótano bajo el balcón izquierdo
        for (let b = 0; b < 5; b++) {
            let mBuna = multiplicarMat4(M_Mundo, traslacion(-4.15, 0.40 + b * 0.48, 3.41));
            mBuna = multiplicarMat4(mBuna, escala(6.02, 0.04, 0.03));
            this.agregarPieza(this.cubo, mBuna, { color: [0.09, 0.10, 0.12, 1.0] });
        }

        // B) BALCÓN / TERRAZA DE LLEGADA AL ATRIO (Frente a la puerta principal)
        let mLosaBalconEntrada = multiplicarMat4(M_Mundo, traslacion(0.80, yNivelPlanta1 - 0.10, 0.50));
        mLosaBalconEntrada = multiplicarMat4(mLosaBalconEntrada, escala(4.60, 0.20, 1.80));
        this.agregarPieza(this.cubo, mLosaBalconEntrada, { color: [0.22, 0.25, 0.29, 1.0], brillo: 16.0 });

        // Muro base sólido debajo del balcón de entrada
        let mMuroBalconEntrada = multiplicarMat4(M_Mundo, traslacion(0.80, 1.30, 0.50));
        mMuroBalconEntrada = multiplicarMat4(mMuroBalconEntrada, escala(4.60, 2.60, 1.80));
        this.agregarPieza(this.cubo, mMuroBalconEntrada, { color: [0.15, 0.17, 0.21, 1.0] });

        // --------------------------------------------------------------------
        // REJAS / BARANDAS DEL BALCÓN FRONTAL IZQUIERDO Y BALCÓN DE ENTRADA
        // --------------------------------------------------------------------
        // 1. Reja frontal continua del balcón izquierdo (a lo largo de z = 3.40)
        this._crearBarandaAlongX(M_Mundo, -4.15, yNivelPlanta1, 3.40, 6.00, 7);

        // 2. Reja lateral izquierda del balcón (a lo largo de x = -7.15)
        this._crearBarandaAlongZ(M_Mundo, -7.15, yNivelPlanta1, 1.70, 3.40, 3);

        // 3. Reja del balcón de llegada a la derecha antes de la entrada (a lo largo de x = 2.70)
        this._crearBarandaAlongZ(M_Mundo, 2.70, yNivelPlanta1, 1.35, -0.35, 4);

        // 4. Reja de protección lateral del balcón de llegada hacia la columna de piedra
        this._crearBarandaAlongX(M_Mundo, 2.95, yNivelPlanta1, 1.35, 0.60, 2);

        // ====================================================================
        // 4. ESCALINATA MONUMENTAL APOYADA EN POSTES ESTRUCTURALES Y REJAS
        // (Escalera abierta con losa inclinada sostenida por columnas de concreto)
        // ====================================================================
        const numPeldanios = 18;
        const zPldIni = 5.60;
        const zPldFin = 1.35;
        const yPldIni = 0.00;
        const yPldFin = yNivelPlanta1 + 0.08;
        const anchoEsc = 3.80;
        const xEsc = 0.80;

        const dzP = (zPldIni - zPldFin) / numPeldanios;
        const dyP = (yPldFin - yPldIni) / numPeldanios;

        // Peldaños abiertos (huella y contrahuella sobre la losa inclinada, sin macizo hasta el suelo)
        for (let k = 0; k < numPeldanios; k++) {
            const zk = zPldIni - k * dzP - dzP * 0.5;
            const yk = yPldIni + (k + 0.5) * dyP;

            // Bloque del peldaño con su espesor de contrahuella
            let mStep = multiplicarMat4(M_Mundo, traslacion(xEsc, yk, zk));
            mStep = multiplicarMat4(mStep, escala(anchoEsc, dyP, dzP));
            this.agregarPieza(this.cubo, mStep, { color: [0.16, 0.18, 0.22, 1.0], brillo: 20.0 });

            // Bocel / borde de huella sobresaliente
            let mBocel = multiplicarMat4(M_Mundo, traslacion(xEsc, yPldIni + (k + 1) * dyP - 0.015, zk + dzP * 0.48));
            mBocel = multiplicarMat4(mBocel, escala(anchoEsc + 0.04, 0.03, 0.05));
            this.agregarPieza(this.cubo, mBocel, { color: [0.26, 0.29, 0.34, 1.0], brillo: 32.0 });
        }

        // Losa inclinada estructural de soporte de la escalera (rampa inferior de concreto)
        const thetaEsc = Math.atan2(yPldFin - yPldIni, zPldIni - zPldFin);
        const longEsc = Math.hypot(yPldFin - yPldIni, zPldIni - zPldFin);
        const yMidEsc = (yPldIni + yPldFin) * 0.5 - 0.10;
        const zMidEsc = (zPldIni + zPldFin) * 0.5;

        let mSlab = multiplicarMat4(M_Mundo, traslacion(xEsc, yMidEsc, zMidEsc));
        mSlab = multiplicarMat4(mSlab, rotacionX(thetaEsc));
        mSlab = multiplicarMat4(mSlab, escala(anchoEsc, 0.18, longEsc));
        this.agregarPieza(this.cubo, mSlab, { color: [0.20, 0.23, 0.27, 1.0], brillo: 16.0 });

        // Vigas zancas inclinadas laterales y central (acompañan la pendiente dejando libre el fondo)
        let mZancaIzq = multiplicarMat4(M_Mundo, traslacion(xEsc - anchoEsc * 0.5 - 0.08, yMidEsc + 0.08, zMidEsc));
        mZancaIzq = multiplicarMat4(mZancaIzq, rotacionX(thetaEsc));
        mZancaIzq = multiplicarMat4(mZancaIzq, escala(0.16, 0.38, longEsc));
        this.agregarPieza(this.cubo, mZancaIzq, { color: [0.15, 0.17, 0.20, 1.0] });

        let mZancaDer = multiplicarMat4(M_Mundo, traslacion(xEsc + anchoEsc * 0.5 + 0.08, yMidEsc + 0.08, zMidEsc));
        mZancaDer = multiplicarMat4(mZancaDer, rotacionX(thetaEsc));
        mZancaDer = multiplicarMat4(mZancaDer, escala(0.16, 0.38, longEsc));
        this.agregarPieza(this.cubo, mZancaDer, { color: [0.15, 0.17, 0.20, 1.0] });

        let mZancaCen = multiplicarMat4(M_Mundo, traslacion(xEsc, yMidEsc - 0.06, zMidEsc));
        mZancaCen = multiplicarMat4(mZancaCen, rotacionX(thetaEsc));
        mZancaCen = multiplicarMat4(mZancaCen, escala(0.24, 0.28, longEsc));
        this.agregarPieza(this.cubo, mZancaCen, { color: [0.14, 0.16, 0.19, 1.0] });

        // --------------------------------------------------------------------
        // POSTES Y COLUMNAS ESTRUCTURALES DEBAJO DE LAS ESCALERAS
        // (Espacio abierto y pasante debajo de la escalera, tal como en FacultadLadoFrontal1.jpeg)
        // --------------------------------------------------------------------
        const colorPoste = [0.18, 0.21, 0.25, 1.0];

        // 1. Postes del tramo inferior-medio (z = 3.90)
        const hCol1 = 1.15;
        let mPoste1Izq = multiplicarMat4(M_Mundo, traslacion(xEsc - 1.30, hCol1 * 0.5, 3.90));
        mPoste1Izq = multiplicarMat4(mPoste1Izq, escala(0.36, hCol1, 0.36));
        this.agregarPieza(this.cubo, mPoste1Izq, { color: colorPoste, brillo: 16.0 });

        let mPoste1Der = multiplicarMat4(M_Mundo, traslacion(xEsc + 1.30, hCol1 * 0.5, 3.90));
        mPoste1Der = multiplicarMat4(mPoste1Der, escala(0.36, hCol1, 0.36));
        this.agregarPieza(this.cubo, mPoste1Der, { color: colorPoste, brillo: 16.0 });

        let mVigaTrans1 = multiplicarMat4(M_Mundo, traslacion(xEsc, hCol1 - 0.10, 3.90));
        mVigaTrans1 = multiplicarMat4(mVigaTrans1, escala(anchoEsc - 0.20, 0.22, 0.38));
        this.agregarPieza(this.cubo, mVigaTrans1, { color: [0.15, 0.17, 0.21, 1.0], brillo: 16.0 });

        // 2. Postes del tramo superior-medio (z = 2.45)
        const hCol2 = 2.12;
        let mPoste2Izq = multiplicarMat4(M_Mundo, traslacion(xEsc - 1.30, hCol2 * 0.5, 2.45));
        mPoste2Izq = multiplicarMat4(mPoste2Izq, escala(0.38, hCol2, 0.38));
        this.agregarPieza(this.cubo, mPoste2Izq, { color: colorPoste, brillo: 16.0 });

        let mPoste2Der = multiplicarMat4(M_Mundo, traslacion(xEsc + 1.30, hCol2 * 0.5, 2.45));
        mPoste2Der = multiplicarMat4(mPoste2Der, escala(0.38, hCol2, 0.38));
        this.agregarPieza(this.cubo, mPoste2Der, { color: colorPoste, brillo: 16.0 });

        let mVigaTrans2 = multiplicarMat4(M_Mundo, traslacion(xEsc, hCol2 - 0.10, 2.45));
        mVigaTrans2 = multiplicarMat4(mVigaTrans2, escala(anchoEsc - 0.20, 0.22, 0.38));
        this.agregarPieza(this.cubo, mVigaTrans2, { color: [0.15, 0.17, 0.21, 1.0], brillo: 16.0 });

        // 3. Pilar bajo el descanso superior (z = 1.35)
        let mPilarDescansoIzq = multiplicarMat4(M_Mundo, traslacion(xEsc - 1.30, 1.40, 1.35));
        mPilarDescansoIzq = multiplicarMat4(mPilarDescansoIzq, escala(0.40, 2.80, 0.40));
        this.agregarPieza(this.cubo, mPilarDescansoIzq, { color: colorPoste, brillo: 16.0 });

        // --------------------------------------------------------------------
        // REJAS DE LA ESCALERA (CUBREN TODA LA ESCALERA DE ARRIBA A ABAJO)
        // --------------------------------------------------------------------
        // 1. Reja lateral izquierda (conecta arriba con el balcón)
        this._crearBarandillaEscalera(M_Mundo, xEsc - anchoEsc * 0.5 + 0.06, yPldIni, zPldIni, yPldFin, zPldFin, 8);
        // 2. Reja central divisoria
        this._crearBarandillaEscalera(M_Mundo, xEsc, yPldIni, zPldIni, yPldFin, zPldFin, 8);
        // 3. Reja lateral derecha
        this._crearBarandillaEscalera(M_Mundo, xEsc + anchoEsc * 0.5 - 0.06, yPldIni, zPldIni, yPldFin, zPldFin, 8);

        // --------------------------------------------------------------------
        // JARDINERA LATERAL CON PLANTITAS Y FLORES ORGÁNICAS 3D
        // (Follaje realista con flores de colores, tal como en FacultadLadoFrontal1.jpeg)
        // --------------------------------------------------------------------
        // Jardinera de concreto con borde amarillo
        let mJardinera = multiplicarMat4(M_Mundo, traslacion(-2.10, 0.40, 4.40));
        mJardinera = multiplicarMat4(mJardinera, escala(1.80, 0.80, 2.00));
        this.agregarPieza(this.cubo, mJardinera, { color: [0.90, 0.72, 0.12, 1.0], brillo: 16.0 });

        // Tierra fértil oscura en el interior de la jardinera
        let mTierra = multiplicarMat4(M_Mundo, traslacion(-2.10, 0.74, 4.40));
        mTierra = multiplicarMat4(mTierra, escala(1.65, 0.14, 1.85));
        this.agregarPieza(this.cubo, mTierra, { color: [0.18, 0.14, 0.10, 1.0], brillo: 4.0 });

        // Arbustos orgánicos de diferentes alturas y tonalidades verdes
        const arbustos = [
            { pos: [-2.45, 1.05, 3.95], escala: [0.75, 0.58, 0.75], col: [0.13, 0.38, 0.14, 1.0] },
            { pos: [-1.90, 1.18, 4.35], escala: [0.88, 0.72, 0.88], col: [0.18, 0.48, 0.17, 1.0] },
            { pos: [-1.55, 0.98, 4.80], escala: [0.70, 0.54, 0.70], col: [0.24, 0.56, 0.21, 1.0] },
            { pos: [-2.48, 0.92, 4.85], escala: [0.65, 0.50, 0.65], col: [0.20, 0.44, 0.15, 1.0] },
            { pos: [-1.50, 1.08, 3.90], escala: [0.72, 0.62, 0.72], col: [0.15, 0.40, 0.15, 1.0] },
            { pos: [-2.05, 1.32, 4.25], escala: [0.62, 0.55, 0.62], col: [0.28, 0.62, 0.23, 1.0] }
        ];

        for (let a of arbustos) {
            let mArbusto = multiplicarMat4(M_Mundo, traslacion(a.pos[0], a.pos[1], a.pos[2]));
            mArbusto = multiplicarMat4(mArbusto, escala(a.escala[0], a.escala[1], a.escala[2]));
            this.agregarPieza(this.esfera, mArbusto, { color: a.col, brillo: 8.0 });
        }

        // Flores de colores (rojas, rosadas/magenta y amarillas) sobre los arbustos
        const flores = [
            { pos: [-1.90, 1.48, 4.30], col: [0.92, 0.18, 0.22, 1.0], rad: 0.11 },
            { pos: [-1.52, 1.24, 4.75], col: [0.95, 0.20, 0.25, 1.0], rad: 0.10 },
            { pos: [-2.35, 1.18, 4.05], col: [0.92, 0.18, 0.22, 1.0], rad: 0.10 },
            { pos: [-2.40, 1.08, 4.75], col: [0.96, 0.35, 0.55, 1.0], rad: 0.11 },
            { pos: [-1.80, 1.32, 4.55], col: [0.96, 0.35, 0.55, 1.0], rad: 0.09 },
            { pos: [-1.45, 1.22, 3.85], col: [0.96, 0.35, 0.55, 1.0], rad: 0.10 },
            { pos: [-2.15, 1.42, 4.10], col: [0.98, 0.80, 0.15, 1.0], rad: 0.09 },
            { pos: [-1.65, 1.15, 4.40], col: [0.98, 0.80, 0.15, 1.0], rad: 0.09 },
            { pos: [-2.55, 1.00, 4.45], col: [0.98, 0.80, 0.15, 1.0], rad: 0.09 }
        ];

        for (let f of flores) {
            let mFlor = multiplicarMat4(M_Mundo, traslacion(f.pos[0], f.pos[1], f.pos[2]));
            mFlor = multiplicarMat4(mFlor, escala(f.rad * 2.0, f.rad * 2.0, f.rad * 2.0));
            this.agregarPieza(this.esfera, mFlor, { color: f.col, brillo: 24.0 });
        }

        // ====================================================================
        // ====================================================================
        // 5. SÓTANO: DEBAJO DEL DESCANSO DE LAS ESCALERAS
        // ====================================================================
        const colorParedSotano = [0.23, 0.26, 0.30, 1.0];

        // Muro de fachada del sótano bajo el descanso (x = 2.40 a 4.10)
        let mMuroSotanoDer = multiplicarMat4(M_Mundo, traslacion(3.25, 1.35, 0.50));
        mMuroSotanoDer = multiplicarMat4(mMuroSotanoDer, escala(1.70, 2.70, 1.80));
        this.agregarPieza(this.cubo, mMuroSotanoDer, { color: colorParedSotano, brillo: 16.0 });

        // Puerta peatonal del sótano (mismo color homogéneo de la pared)
        let mMarcoPuertaSotano = multiplicarMat4(M_Mundo, traslacion(3.30, 1.04, 1.41));
        mMarcoPuertaSotano = multiplicarMat4(mMarcoPuertaSotano, escala(1.08, 2.10, 0.06));
        this.agregarPieza(this.cubo, mMarcoPuertaSotano, { color: [0.13, 0.15, 0.18, 1.0] });

        let mPuertaSotano = multiplicarMat4(M_Mundo, traslacion(3.30, 1.04, 1.43));
        mPuertaSotano = multiplicarMat4(mPuertaSotano, escala(1.00, 2.02, 0.04));
        this.agregarPieza(this.cubo, mPuertaSotano, { color: colorParedSotano, brillo: 24.0 });

        // Manija vertical cromada de la puerta del sótano
        let mManijaSotano = multiplicarMat4(M_Mundo, traslacion(2.90, 1.04, 1.46));
        mManijaSotano = multiplicarMat4(mManijaSotano, escala(0.035, 0.18, 0.035));
        this.agregarPieza(this.cubo, mManijaSotano, { color: [0.88, 0.90, 0.94, 1.0], brillo: 96.0 });

        // Tragaluz con lamas de ventilación sobre la puerta del sótano
        let mTragaluzSotano = multiplicarMat4(M_Mundo, traslacion(3.30, 2.38, 1.42));
        mTragaluzSotano = multiplicarMat4(mTragaluzSotano, escala(1.00, 0.44, 0.04));
        this.agregarPieza(this.cubo, mTragaluzSotano, { textura: texturas.parasoles, brillo: 48.0 });

        // ====================================================================
        // 6. TORRE IZQUIERDA: MURO CORTINA AZUL, MARCO Y VENTANAS 3D QUE SE ABREN
        // (Escalada proporcionalmente más alta para acompañar el nuevo piso)
        // ====================================================================
        const xTorre = -4.5;
        const yTorre = 7.8;
        const zTorre = -2.8;

        // Volumen estructural cerrado de la torre
        let mCuerpoTorre = multiplicarMat4(M_Mundo, traslacion(xTorre, yTorre, zTorre));
        mCuerpoTorre = multiplicarMat4(mCuerpoTorre, escala(5.4, 14.8, 9.8));
        this.agregarPieza(this.cubo, mCuerpoTorre, { textura: texturas.alucobond });

        // Fachada de Vidrio Azul Reflectante con vanos preparados
        let mVidrioFrontal = multiplicarMat4(M_Mundo, traslacion(xTorre, yTorre + 1.40, 2.05));
        mVidrioFrontal = multiplicarMat4(mVidrioFrontal, escala(4.6, 10.6, 0.12));
        this.agregarPieza(this.cubo, mVidrioFrontal, { textura: texturas.vidrioAzul, brillo: 96.0 });

        // Ventanas proyectantes 3D interactivas
        this.ventanas = new Ventanas(this.cubo);
        this.add(this.ventanas);

        // Marco envolvente de Alucobond gris antracita
        let mMarcoSup = multiplicarMat4(M_Mundo, traslacion(xTorre, yTorre + 7.0, 2.15));
        mMarcoSup = multiplicarMat4(mMarcoSup, escala(5.4, 0.9, 0.55));
        this.agregarPieza(this.cubo, mMarcoSup, { textura: texturas.alucobond, brillo: 32.0 });

        let mMarcoIzq = multiplicarMat4(M_Mundo, traslacion(xTorre - 2.45, yTorre + 1.4, 2.15));
        mMarcoIzq = multiplicarMat4(mMarcoIzq, escala(0.55, 11.2, 0.55));
        this.agregarPieza(this.cubo, mMarcoIzq, { textura: texturas.alucobond, brillo: 32.0 });

        let mMarcoDer = multiplicarMat4(M_Mundo, traslacion(xTorre + 2.45, yTorre + 1.4, 2.15));
        mMarcoDer = multiplicarMat4(mMarcoDer, escala(0.55, 11.2, 0.55));
        this.agregarPieza(this.cubo, mMarcoDer, { textura: texturas.alucobond, brillo: 32.0 });

        let mMarcoInfVoladizo = multiplicarMat4(M_Mundo, traslacion(xTorre, 4.30, 2.25));
        mMarcoInfVoladizo = multiplicarMat4(mMarcoInfVoladizo, escala(5.4, 0.65, 0.95));
        this.agregarPieza(this.cubo, mMarcoInfVoladizo, { textura: texturas.alucobond, brillo: 32.0 });

        // Luces dicroicas empotradas bajo el alero de la torre izquierda
        const xLucesTorre = [-5.7, -4.5, -3.3];
        for (let xl of xLucesTorre) {
            let mFoco = multiplicarMat4(M_Mundo, traslacion(xl, 3.96, 2.25));
            mFoco = multiplicarMat4(mFoco, escala(0.35, 1, 0.35));
            this.agregarPieza(this.discoLuz, mFoco, { color: [1.0, 0.98, 0.85, 1.0], emisivo: true });

            let mAnillo = multiplicarMat4(M_Mundo, traslacion(xl, 3.97, 2.25));
            mAnillo = multiplicarMat4(mAnillo, escala(0.44, 0.04, 0.44));
            this.agregarPieza(this.cilindro, mAnillo, { color: [0.7, 0.72, 0.75, 1.0], brillo: 64.0 });
        }

        // Planta baja bajo la torre: Paneles negros pulidos
        let mPlantaBajaNegra = multiplicarMat4(M_Mundo, traslacion(xTorre, 3.35, 1.70));
        mPlantaBajaNegra = multiplicarMat4(mPlantaBajaNegra, escala(5.2, 1.7, 1.5));
        this.agregarPieza(this.cubo, mPlantaBajaNegra, { color: [0.08, 0.10, 0.13, 1.0], brillo: 64.0 });

        // Letrero tótem verde institucional en el jardín
        let mPoste1 = multiplicarMat4(M_Mundo, traslacion(xTorre - 0.95, 0.85, 4.8));
        mPoste1 = multiplicarMat4(mPoste1, escala(0.08, 1.7, 0.08));
        this.agregarPieza(this.cubo, mPoste1, { color: [0.15, 0.15, 0.15, 1.0] });

        let mPoste2 = multiplicarMat4(M_Mundo, traslacion(xTorre + 0.95, 0.85, 4.8));
        mPoste2 = multiplicarMat4(mPoste2, escala(0.08, 1.7, 0.08));
        this.agregarPieza(this.cubo, mPoste2, { color: [0.15, 0.15, 0.15, 1.0] });

        let mTotemVerde = multiplicarMat4(M_Mundo, traslacion(xTorre, 1.65, 4.8));
        mTotemVerde = multiplicarMat4(mTotemVerde, escala(2.2, 1.15, 0.1));
        this.agregarPieza(this.cubo, mTotemVerde, { textura: texturas.letreroFrontal, brillo: 24.0 });

        let mTechoTotem = multiplicarMat4(M_Mundo, traslacion(xTorre, 2.30, 4.8));
        mTechoTotem = multiplicarMat4(mTechoTotem, escala(2.45, 0.14, 0.55));
        this.agregarPieza(this.cubo, mTechoTotem, { color: [0.65, 0.22, 0.18, 1.0] });

        // ====================================================================
        // 7. PÓRTICO ARQUITECTÓNICO DE PIEDRA LAJA (ATRIO Y ENTRADA)
        // (Pared trapezoidal gris ubicada abajo, con borde diagonal correcto)
        // ====================================================================
        // Pared vidriada del atrio con LETRAS ILUMINADAS
        let mAtrioVidrio = multiplicarMat4(M_Mundo, traslacion(0.70, 5.35, -0.35));
        mAtrioVidrio = multiplicarMat4(mAtrioVidrio, escala(4.80, 5.10, 0.15));
        this.agregarPieza(this.cubo, mAtrioVidrio, { textura: texturas.letreroEntrada, brillo: 96.0 });

        // Las hojas son hijas de pivotes en sus bisagras.
        this.puertas = new Puertas(this.cubo);
        this.add(this.puertas);

        // PARED TRAPEZOIDAL DE PIEDRA LAJA (A LA DERECHA DE LA ENTRADA, SOLO EN LA PARTE INFERIOR)
        // - Ubicada abajo: de y = 2.70 a y = 8.40 (altura = 5.70m, prof = 0.90m)
        // - Borde derecho vertical en x = 4.10
        // - Borde diagonal interior: ancha arriba (x = 2.30) y más angosta abajo (x = 3.45)
        let mParedPiedra = multiplicarMat4(M_Mundo, traslacion(3.20, 5.55, 0.05));
        this.agregarPieza(this.paredTrapezoide, mParedPiedra, { textura: texturas.piedra, brillo: 8.0 });

        // DINTEL Y ALERO SUPERIOR DEL PÓRTICO EN PIEDRA LAJA (y = 7.40 a 8.40)
        let mDintelPiedra = multiplicarMat4(M_Mundo, traslacion(1.175, 7.90, 0.05));
        mDintelPiedra = multiplicarMat4(mDintelPiedra, escala(5.85, 1.00, 0.90));
        this.agregarPieza(this.cubo, mDintelPiedra, { textura: texturas.piedra, brillo: 8.0 });

        // CIELO RASO / SOFFIT CON LUCES DICROICAS EMPOTRADAS (y = 7.39)
        const xLucesEntrada = [-0.20, 0.85, 1.90];
        for (let xl of xLucesEntrada) {
            let mFocoEntrada = multiplicarMat4(M_Mundo, traslacion(xl, 7.39, 0.05));
            mFocoEntrada = multiplicarMat4(mFocoEntrada, escala(0.38, 1, 0.38));
            this.agregarPieza(this.discoLuz, mFocoEntrada, { color: [1.0, 0.96, 0.82, 1.0], emisivo: true });

            let mAnilloEntrada = multiplicarMat4(M_Mundo, traslacion(xl, 7.40, 0.05));
            mAnilloEntrada = multiplicarMat4(mAnilloEntrada, escala(0.48, 0.04, 0.48));
            this.agregarPieza(this.cilindro, mAnilloEntrada, { color: [0.82, 0.84, 0.87, 1.0], brillo: 64.0 });
        }

        // ====================================================================
        // 8. VENTANA CON RAYAS INTERMEDIA Y BANNER INSTITUCIONAL
        // (Retrocedida un poco en z=-0.40, a la misma altura exacta y mismo grosor de rayas que la derecha)
        // ====================================================================
        // A) Módulo de VENTANA CON RAYAS (x = -1.75 a 4.10, y = 8.40 a 11.65, altura = 3.25m)
        let mVentanaRayasMedia = multiplicarMat4(M_Mundo, traslacion(1.175, 10.025, -0.48));
        mVentanaRayasMedia = multiplicarMat4(mVentanaRayasMedia, escala(5.85, 3.25, 0.16));
        this.agregarPieza(this.cubo, mVentanaRayasMedia, { textura: texturas.parasoles, brillo: 64.0 });

        // Perfiles metálicos de marco para la ventana con rayas
        let mMarcoSupRayas = multiplicarMat4(M_Mundo, traslacion(1.175, 11.65, -0.40));
        mMarcoSupRayas = multiplicarMat4(mMarcoSupRayas, escala(5.89, 0.08, 0.20));
        this.agregarPieza(this.cubo, mMarcoSupRayas, { color: [0.18, 0.21, 0.25, 1.0] });

        let mMarcoInfRayas = multiplicarMat4(M_Mundo, traslacion(1.175, 8.40, -0.40));
        mMarcoInfRayas = multiplicarMat4(mMarcoInfRayas, escala(5.89, 0.08, 0.20));
        this.agregarPieza(this.cubo, mMarcoInfRayas, { color: [0.18, 0.21, 0.25, 1.0] });

        // B) Balcón del piso 4 sobre la ventana con rayas
        let mBalconPiso4 = multiplicarMat4(M_Mundo, traslacion(1.175, 11.70, 0.20));
        mBalconPiso4 = multiplicarMat4(mBalconPiso4, escala(5.85, 0.20, 1.30));
        this.agregarPieza(this.cubo, mBalconPiso4, { color: [0.88, 0.90, 0.92, 1.0] });

        this._crearBarandaAlongX(M_Mundo, 1.175, 11.80, 0.80, 5.65, 7);

        // C) Banner institucional: "INTELIGENCIA ARTIFICIAL Y CIENCIA DE DATOS"
        let mBannerIA = multiplicarMat4(M_Mundo, traslacion(1.175, 12.35, 0.82));
        mBannerIA = multiplicarMat4(mBannerIA, escala(5.20, 0.85, 0.08));
        this.agregarPieza(this.cubo, mBannerIA, { textura: texturas.bannerIA, brillo: 24.0 });

        // D) Muro cortina de VENTANAS CELESTES del 4to piso (detrás y arriba del banner)
        let mVentanasCelestes = multiplicarMat4(M_Mundo, traslacion(1.175, 13.00, -0.45));
        mVentanasCelestes = multiplicarMat4(mVentanasCelestes, escala(5.85, 2.50, 0.15));
        this.agregarPieza(this.cubo, mVentanasCelestes, { textura: texturas.ventanasCelestes, brillo: 96.0 });

        // ====================================================================
        // 9. LA AZOTEA (Rooftop Terrace Completa a mayor altura)
        // ====================================================================
        const yAzotea = 14.35;
        let mLosaAzotea = multiplicarMat4(M_Mundo, traslacion(2.80, yAzotea, -3.80));
        mLosaAzotea = multiplicarMat4(mLosaAzotea, escala(17.80, 0.35, 11.80));
        this.agregarPieza(this.cubo, mLosaAzotea, { textura: texturas.azotea, brillo: 12.0 });

        let mPretilFrontal = multiplicarMat4(M_Mundo, traslacion(2.80, yAzotea + 0.60, 0.80));
        mPretilFrontal = multiplicarMat4(mPretilFrontal, escala(17.80, 0.85, 0.28));
        this.agregarPieza(this.cubo, mPretilFrontal, { textura: texturas.hormigonBlanco });

        let mRematePretil = multiplicarMat4(M_Mundo, traslacion(2.80, yAzotea + 1.05, 0.80));
        mRematePretil = multiplicarMat4(mRematePretil, escala(17.90, 0.08, 0.36));
        this.agregarPieza(this.cubo, mRematePretil, { color: [0.25, 0.28, 0.32, 1.0], brillo: 32.0 });

        let mPretilIzq = multiplicarMat4(M_Mundo, traslacion(-6.0, yAzotea + 0.60, -3.80));
        mPretilIzq = multiplicarMat4(mPretilIzq, escala(0.28, 0.85, 11.80));
        this.agregarPieza(this.cubo, mPretilIzq, { textura: texturas.hormigonBlanco });

        let mPretilDer = multiplicarMat4(M_Mundo, traslacion(11.60, yAzotea + 0.60, -3.80));
        mPretilDer = multiplicarMat4(mPretilDer, escala(0.28, 0.85, 11.80));
        this.agregarPieza(this.cubo, mPretilDer, { textura: texturas.hormigonBlanco });

        let mPretilPost = multiplicarMat4(M_Mundo, traslacion(2.80, yAzotea + 0.60, -9.60));
        mPretilPost = multiplicarMat4(mPretilPost, escala(17.80, 0.85, 0.28));
        this.agregarPieza(this.cubo, mPretilPost, { textura: texturas.hormigonBlanco });

        this._crearBarandaAlongX(M_Mundo, 0.80, yAzotea + 1.07, 0.80, 6.20, 7);

        let mCaseton = multiplicarMat4(M_Mundo, traslacion(0.80, yAzotea + 1.65, -3.80));
        mCaseton = multiplicarMat4(mCaseton, escala(4.80, 2.95, 3.80));
        this.agregarPieza(this.cubo, mCaseton, { textura: texturas.hormigonBlanco });

        let mTechoCaseton = multiplicarMat4(M_Mundo, traslacion(0.80, yAzotea + 3.20, -3.80));
        mTechoCaseton = multiplicarMat4(mTechoCaseton, escala(5.40, 0.25, 4.40));
        this.agregarPieza(this.cubo, mTechoCaseton, { color: [0.28, 0.32, 0.38, 1.0], brillo: 32.0 });

        let mPuertaAzotea = multiplicarMat4(M_Mundo, traslacion(0.80, yAzotea + 1.10, -1.85));
        mPuertaAzotea = multiplicarMat4(mPuertaAzotea, escala(1.10, 1.85, 0.08));
        this.agregarPieza(this.cubo, mPuertaAzotea, { color: [0.18, 0.20, 0.24, 1.0], brillo: 48.0 });

        let mRejilla1 = multiplicarMat4(M_Mundo, traslacion(-1.55, yAzotea + 2.15, -3.80));
        mRejilla1 = multiplicarMat4(mRejilla1, escala(0.08, 0.90, 1.80));
        this.agregarPieza(this.cubo, mRejilla1, { color: [0.12, 0.14, 0.18, 1.0], brillo: 64.0 });

        let mMastil = multiplicarMat4(M_Mundo, traslacion(2.20, yAzotea + 4.45, -3.80));
        mMastil = multiplicarMat4(mMastil, escala(0.06, 2.50, 0.06));
        this.agregarPieza(this.cilindro, mMastil, { color: [0.90, 0.92, 0.95, 1.0], brillo: 96.0 });

        let mBaliza = multiplicarMat4(M_Mundo, traslacion(2.20, yAzotea + 5.70, -3.80));
        mBaliza = multiplicarMat4(mBaliza, escala(0.12, 0.16, 0.12));
        this.agregarPieza(this.discoLuz, mBaliza, { color: [1.0, 0.15, 0.15, 1.0], emisivo: true });

        let mTechoBlanco = multiplicarMat4(M_Mundo, traslacion(0.80, yAzotea + 0.10, -0.10));
        mTechoBlanco = multiplicarMat4(mTechoBlanco, escala(6.60, 0.45, 3.60));
        this.agregarPieza(this.cubo, mTechoBlanco, { color: [0.94, 0.96, 0.98, 1.0], brillo: 24.0 });

        for (let xl of [-0.5, 0.8, 2.1]) {
            let mFocoTecho = multiplicarMat4(M_Mundo, traslacion(xl, yAzotea - 0.14, 0.50));
            mFocoTecho = multiplicarMat4(mFocoTecho, escala(0.32, 1, 0.32));
            this.agregarPieza(this.discoLuz, mFocoTecho, { color: [1.0, 0.98, 0.9, 1.0], emisivo: true });
        }

        // ====================================================================
        // 10. MÓDULO LATERAL DERECHO (Parasoles, Cochera y Torre de Aulas)
        // (1. Torre posterior retrasada en segundo plano z = -3.80)
        // (2. Fachada de parasoles a la misma altura, grosor de rayas y profundidad z = -0.40 que la frontal)
        // (3. Portón de cochera montado al ras en la fachada, del mismo color que la pared)
        // ====================================================================
        const xDer = 6.85; // Centrado exactamente entre x = 4.10 y x = 9.60 (ancho = 5.50)
        const anchoDer = 5.50;
        const profDer = 5.60;
        const zDerCenter = -3.20; // Frontal exactamente en z = -0.40, alineado con la ventana central con rayas
        const colorParedDerecha = [0.90, 0.92, 0.94, 1.0]; // Hormigón blanco / enlucido claro

        // A) MURO INFERIOR DE PLANTA BAJA (y = 0.0 a 8.40)
        let mMuroInfDer = multiplicarMat4(M_Mundo, traslacion(xDer, 4.20, zDerCenter));
        mMuroInfDer = multiplicarMat4(mMuroInfDer, escala(anchoDer, 8.40, profDer));
        this.agregarPieza(this.cubo, mMuroInfDer, { color: colorParedDerecha, brillo: 24.0 });

        // B) ALERO / CORNISA INTERMEDIA ENTRE PLANTA BAJA Y PARASOLES (y = 8.35)
        let mAleroP3Der = multiplicarMat4(M_Mundo, traslacion(xDer, 8.35, -0.28));
        mAleroP3Der = multiplicarMat4(mAleroP3Der, escala(anchoDer + 0.20, 0.22, 0.32));
        this.agregarPieza(this.cubo, mAleroP3Der, { color: [0.94, 0.96, 0.98, 1.0], brillo: 32.0 });

        // C) VENTANA DE OFICINA EN 2DO PISO (x = 4.30 a 6.40, y = 4.10 a 6.30)
        let mMarcoOficina = multiplicarMat4(M_Mundo, traslacion(5.35, 5.20, -0.37));
        mMarcoOficina = multiplicarMat4(mMarcoOficina, escala(2.18, 2.28, 0.06));
        this.agregarPieza(this.cubo, mMarcoOficina, { color: [0.18, 0.20, 0.24, 1.0] });

        let mVentanaOficina = multiplicarMat4(M_Mundo, traslacion(5.35, 5.20, -0.35));
        mVentanaOficina = multiplicarMat4(mVentanaOficina, escala(2.10, 2.20, 0.08));
        this.agregarPieza(this.cubo, mVentanaOficina, { textura: texturas.ventanaOficina, brillo: 64.0 });

        // Rejilla inferior de ventilación de oficina (y = 1.30)
        let mRejillaOficina = multiplicarMat4(M_Mundo, traslacion(5.35, 1.30, -0.36));
        mRejillaOficina = multiplicarMat4(mRejillaOficina, escala(2.10, 0.80, 0.06));
        this.agregarPieza(this.cubo, mRejillaOficina, { textura: texturas.parasoles, brillo: 32.0 });

        // D) PORTÓN DE LA COCHERA (ITEM 3):
        // - Ubicado al ras de la pared donde corresponde (z = -0.37, x = 6.40 a 9.30)
        // - DEL MISMO COLOR QUE LA PARED EN DONDE ESTÁ (colorParedDerecha = [0.90, 0.92, 0.94, 1.0])
        const xCochera = 7.85;
        const wCochera = 2.90;
        const hCochera = 3.60;

        // Marco envolvente de la cochera
        let mMarcoCochera = multiplicarMat4(M_Mundo, traslacion(xCochera, 1.80, -0.38));
        mMarcoCochera = multiplicarMat4(mMarcoCochera, escala(wCochera + 0.16, hCochera + 0.08, 0.06));
        this.agregarPieza(this.cubo, mMarcoCochera, { color: [0.82, 0.85, 0.88, 1.0] });

        // Hoja del portón enrollable metálico (mismo color de la pared)
        let mPortonCochera = multiplicarMat4(M_Mundo, traslacion(xCochera, 1.40, -0.36));
        mPortonCochera = multiplicarMat4(mPortonCochera, escala(wCochera, 2.70, 0.05));
        this.agregarPieza(this.cubo, mPortonCochera, { color: colorParedDerecha, brillo: 24.0 });

        // Ranuras horizontales de las lamas del portón enrollable (para relieve visual sutil)
        for (let yLama = 0.35; yLama <= 2.65; yLama += 0.30) {
            let mLama = multiplicarMat4(M_Mundo, traslacion(xCochera, yLama, -0.34));
            mLama = multiplicarMat4(mLama, escala(wCochera - 0.06, 0.025, 0.05));
            this.agregarPieza(this.cubo, mLama, { color: [0.80, 0.83, 0.86, 1.0] });
        }

        // Panel superior / tapajunta del enrollable
        let mPanelSupCochera = multiplicarMat4(M_Mundo, traslacion(xCochera, 3.15, -0.36));
        mPanelSupCochera = multiplicarMat4(mPanelSupCochera, escala(wCochera, 0.70, 0.05));
        this.agregarPieza(this.cubo, mPanelSupCochera, { color: [0.86, 0.88, 0.91, 1.0] });

        // Rampa de acceso a la cochera conectando al asfalto
        let mRampaCochera = multiplicarMat4(M_Mundo, traslacion(xCochera, 0.06, 0.61));
        mRampaCochera = multiplicarMat4(mRampaCochera, escala(wCochera + 0.20, 0.12, 1.95));
        this.agregarPieza(this.cubo, mRampaCochera, { color: [0.75, 0.77, 0.80, 1.0], brillo: 16.0 });

        // E) CELOSÍAS / PARASOLES LATERALES DERECHOS (ITEM 2):
        // - Altura idéntica: y = 8.40 a 11.65 (altura = 3.25m, centro y = 10.025)
        // - Mismo grosor de lamas y textura que la ventana frontal bajo IA
        // - Retrocedida a z = -0.40, unida en ángulo recto perfecto con la frontal
        let mVolumenParasoles = multiplicarMat4(M_Mundo, traslacion(xDer, 10.025, zDerCenter));
        mVolumenParasoles = multiplicarMat4(mVolumenParasoles, escala(anchoDer, 3.25, profDer));
        this.agregarPieza(this.cubo, mVolumenParasoles, { textura: texturas.parasoles, brillo: 48.0 });

        // F) PENTHOUSE / PISO 4 DERECHO (y = 11.65 a 14.35, altura = 2.70m)
        let mCornisaP4Der = multiplicarMat4(M_Mundo, traslacion(xDer, 11.65, -0.30));
        mCornisaP4Der = multiplicarMat4(mCornisaP4Der, escala(anchoDer + 0.20, 0.20, 0.32));
        this.agregarPieza(this.cubo, mCornisaP4Der, { color: [0.94, 0.96, 0.98, 1.0] });

        let mPenthouseDer = multiplicarMat4(M_Mundo, traslacion(xDer, 13.00, zDerCenter));
        mPenthouseDer = multiplicarMat4(mPenthouseDer, escala(anchoDer, 2.70, profDer));
        this.agregarPieza(this.cubo, mPenthouseDer, { textura: texturas.hormigonBlanco });

        let mPenthouseVidrioFront = multiplicarMat4(M_Mundo, traslacion(xDer, 13.00, -0.38));
        mPenthouseVidrioFront = multiplicarMat4(mPenthouseVidrioFront, escala(anchoDer - 0.40, 2.30, 0.08));
        this.agregarPieza(this.cubo, mPenthouseVidrioFront, { textura: texturas.vidrioAzul, brillo: 96.0 });

        let mPenthouseVidrioLat = multiplicarMat4(M_Mundo, traslacion(9.62, 13.00, zDerCenter));
        mPenthouseVidrioLat = multiplicarMat4(mPenthouseVidrioLat, escala(0.08, 2.30, profDer - 0.80));
        this.agregarPieza(this.cubo, mPenthouseVidrioLat, { textura: texturas.vidrioAzul, brillo: 96.0 });

        // G) TORRE POSTERIOR DE AULAS (ITEM 1):
        // - Movida más atrás (segundo plano, z = -8.20 con frente en z = -3.80)
        let mTorreAulasPost = multiplicarMat4(M_Mundo, traslacion(11.4, 8.50, -8.20));
        mTorreAulasPost = multiplicarMat4(mTorreAulasPost, escala(4.6, 16.5, 8.8));
        this.agregarPieza(this.cubo, mTorreAulasPost, { textura: texturas.hormigonBlanco });

        for (let p = 0; p < 4; p++) {
            const yv = 3.0 + p * 3.4;
            let mVentPost = multiplicarMat4(M_Mundo, traslacion(11.4, yv, -3.78));
            mVentPost = multiplicarMat4(mVentPost, escala(3.6, 1.35, 0.12));
            this.agregarPieza(this.cubo, mVentPost, { color: [0.12, 0.15, 0.20, 1.0], brillo: 64.0 });
        }

        // ====================================================================
        // 11. CUERPO POSTERIOR Y CIERRE DE HUECOS (ELIMINACIÓN TOTAL DE VACÍOS)
        // ====================================================================
        let mNucleoCentral = multiplicarMat4(M_Mundo, traslacion(0.80, 7.80, -4.60));
        mNucleoCentral = multiplicarMat4(mNucleoCentral, escala(6.20, 13.6, 7.80));
        this.agregarPieza(this.cubo, mNucleoCentral, { color: [0.85, 0.87, 0.90, 1.0] });

        let mMuroFondoAtrio = multiplicarMat4(M_Mundo, traslacion(0.70, 5.30, -1.60));
        mMuroFondoAtrio = multiplicarMat4(mMuroFondoAtrio, escala(4.90, 5.00, 0.20));
        this.agregarPieza(this.cubo, mMuroFondoAtrio, { color: [0.70, 0.73, 0.78, 1.0] });

        let mPisoHall = multiplicarMat4(M_Mundo, traslacion(0.70, yNivelPlanta1, -2.40));
        mPisoHall = multiplicarMat4(mPisoHall, escala(4.80, 0.05, 3.80));
        this.agregarPieza(this.cubo, mPisoHall, { color: [0.90, 0.92, 0.94, 1.0], brillo: 48.0 });

        let mFachadaPosterior = multiplicarMat4(M_Mundo, traslacion(2.80, 7.30, -9.20));
        mFachadaPosterior = multiplicarMat4(mFachadaPosterior, escala(17.40, 14.20, 0.30));
        this.agregarPieza(this.cubo, mFachadaPosterior, { textura: texturas.fachadaPosterior, brillo: 48.0 });

        let mPtaEmergencia = multiplicarMat4(M_Mundo, traslacion(2.80, 1.20, -9.38));
        mPtaEmergencia = multiplicarMat4(mPtaEmergencia, escala(1.80, 2.20, 0.08));
        this.agregarPieza(this.cubo, mPtaEmergencia, { color: [0.15, 0.18, 0.22, 1.0], brillo: 32.0 });

        let mAleroPost = multiplicarMat4(M_Mundo, traslacion(2.80, 2.45, -9.80));
        mAleroPost = multiplicarMat4(mAleroPost, escala(2.60, 0.15, 1.20));
        this.agregarPieza(this.cubo, mAleroPost, { color: [0.85, 0.88, 0.92, 1.0] });
    }

    /**
     * Crea una baranda inclinada para escaleras con pasamanos, 3 tubos intermedios y montantes verticales.
     * Matemáticamente exacta según la pendiente de la escalera.
     */
    _crearBarandillaEscalera(MMundo, x, yInicio, zInicio, yFin, zFin, numPostes = 6) {
        const dy = yFin - yInicio;
        const dz = zFin - zInicio; // dz es negativo hacia el podio
        const distHoriz = Math.abs(dz);
        const L = Math.hypot(dy, dz);
        const theta = Math.atan2(dy, distHoriz); // Ángulo positivo de inclinación

        const yMid = (yInicio + yFin) * 0.5;
        const zMid = (zInicio + zFin) * 0.5;

        // 4 tubos longitudinales paralelos (pasamanos superior + 3 tubos intermedios)
        const alturas = [0.92, 0.69, 0.46, 0.23];
        const grosores = [0.055, 0.038, 0.038, 0.038];

        for (let i = 0; i < alturas.length; i++) {
            const h = alturas[i];
            const g = grosores[i];

            let mBarra = multiplicarMat4(MMundo, traslacion(x, yMid + h, zMid));
            mBarra = multiplicarMat4(mBarra, rotacionX(theta));
            mBarra = multiplicarMat4(mBarra, escala(g, g, L));
            this.agregarPieza(this.cubo, mBarra, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }

        // Postes verticales (plumb vertical en Y)
        for (let p = 0; p < numPostes; p++) {
            const t = p / (numPostes - 1);
            const zp = zInicio + t * dz;
            const yBase = yInicio + t * dy;
            const yCenter = yBase + 0.92 * 0.5;

            let mPoste = multiplicarMat4(MMundo, traslacion(x, yCenter, zp));
            mPoste = multiplicarMat4(mPoste, escala(0.048, 0.92, 0.048));
            this.agregarPieza(this.cubo, mPoste, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }
    }

    /**
     * Crea una baranda horizontal a lo largo del eje Z (para laterales de terrazas y descansos).
     */
    _crearBarandaAlongZ(MMundo, x, yBase, zStart, zEnd, numPostes = 4) {
        const dz = zEnd - zStart;
        const L = Math.abs(dz);
        const zMid = (zStart + zEnd) * 0.5;

        const alturas = [0.92, 0.69, 0.46, 0.23];
        const grosores = [0.055, 0.038, 0.038, 0.038];

        for (let i = 0; i < alturas.length; i++) {
            let mBarra = multiplicarMat4(MMundo, traslacion(x, yBase + alturas[i], zMid));
            mBarra = multiplicarMat4(mBarra, escala(grosores[i], grosores[i], L));
            this.agregarPieza(this.cubo, mBarra, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }

        for (let p = 0; p < numPostes; p++) {
            const t = p / (numPostes - 1);
            const zp = zStart + t * dz;
            let mPoste = multiplicarMat4(MMundo, traslacion(x, yBase + 0.46, zp));
            mPoste = multiplicarMat4(mPoste, escala(0.048, 0.92, 0.048));
            this.agregarPieza(this.cubo, mPoste, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }
    }

    /**
     * Crea una baranda horizontal a lo largo del eje X (para frentes de balcones y terrazas).
     */
    _crearBarandaAlongX(MMundo, xCenter, yBase, z, ancho, numPostes = 5) {
        const alturas = [0.92, 0.69, 0.46, 0.23];
        const grosores = [0.055, 0.038, 0.038, 0.038];

        for (let i = 0; i < alturas.length; i++) {
            let mBarra = multiplicarMat4(MMundo, traslacion(xCenter, yBase + alturas[i], z));
            mBarra = multiplicarMat4(mBarra, escala(ancho, grosores[i], grosores[i]));
            this.agregarPieza(this.cubo, mBarra, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }

        const dx = ancho / (numPostes - 1);
        for (let i = 0; i < numPostes; i++) {
            const xi = (xCenter - ancho * 0.5) + i * dx;
            let mPoste = multiplicarMat4(MMundo, traslacion(xi, yBase + 0.46, z));
            mPoste = multiplicarMat4(mPoste, escala(0.048, 0.92, 0.048));
            this.agregarPieza(this.cubo, mPoste, { color: [0.95, 0.96, 0.98, 1.0], brillo: 80.0 });
        }
    }

    /**
     * Baranda de seguridad en la curva de la calle en pendiente lateral derecha.
     */
    _crearBarandaCurvaCalle(MMundo, x, y, z) {
        let mBar = multiplicarMat4(MMundo, traslacion(x, y + 0.55, z));
        mBar = multiplicarMat4(mBar, rotacionY(0.25));
        mBar = multiplicarMat4(mBar, escala(4.8, 0.06, 0.06));
        this.agregarPieza(this.cubo, mBar, { color: [0.85, 0.88, 0.90, 1.0], brillo: 64.0 });

        let mBarInf = multiplicarMat4(MMundo, traslacion(x, y + 0.28, z));
        mBarInf = multiplicarMat4(mBarInf, rotacionY(0.25));
        mBarInf = multiplicarMat4(mBarInf, escala(4.8, 0.04, 0.04));
        this.agregarPieza(this.cubo, mBarInf, { color: [0.85, 0.88, 0.90, 1.0], brillo: 64.0 });

        for (let i = 0; i < 4; i++) {
            const xi = x - 1.8 + i * 1.2;
            const zi = z - 0.4 + i * 0.3;
            let mP = multiplicarMat4(MMundo, traslacion(xi, y + 0.28, zi));
            mP = multiplicarMat4(mP, escala(0.06, 0.60, 0.06));
            this.agregarPieza(this.cubo, mP, { color: [0.85, 0.88, 0.90, 1.0] });
        }
    }
}
