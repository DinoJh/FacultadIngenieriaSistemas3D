import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class TrapezoidGeometry extends Geometry {
    constructor(anchoTop = 1.80, anchoBot = 0.65, altura = 6.4, prof = 1.3) {
        const data = crearParedTrapezoidePiedra(anchoTop, anchoBot, altura, prof);
        super(data.vertices, data.indices);
    }
}

function crearParedTrapezoidePiedra(anchoTop = 1.80, anchoBot = 0.65, altura = 6.4, prof = 1.3) {
    const ha_x = anchoTop / 2.0; // Borde derecho vertical en +ha_x
    const ha = altura / 2.0;
    const hp = prof / 2.0;

    // Cara derecha: xRight = +ha_x (vertical continua)
    const xRight = ha_x;
    // Cara izquierda arriba: xLeftTop = -ha_x (ancho arriba = anchoTop)
    const xLeftTop = -ha_x;
    // Cara izquierda abajo: xLeftBot = +ha_x - anchoBot (se retira a la derecha)
    const xLeftBot = ha_x - anchoBot;

    // Normal calculada para la cara diagonal izquierda inclinada
    const dx = xLeftTop - xLeftBot; // Negativo (hacia la izquierda al subir)
    const dy = 2.0 * ha;           // Positivo
    const lenDiag = Math.hypot(dy, dx);
    const nxDiag = -dy / lenDiag;   // Normal exterior hacia -X
    const nyDiag = dx / lenDiag;    // Normal hacia abajo/inclinación

    const vertices = [
        // 1. Frontal (+Z) - Trapezoide
        xLeftBot, -ha,  hp,   0, 0, 1,   0, 0,
        xRight,   -ha,  hp,   0, 0, 1,   1, 0,
        xRight,    ha,  hp,   0, 0, 1,   1, 1,
        xLeftTop,  ha,  hp,   0, 0, 1,   0, 1,

        // 2. Posterior (-Z) - Trapezoide
        xRight,   -ha, -hp,   0, 0, -1,  0, 0,
        xLeftBot, -ha, -hp,   0, 0, -1,  1, 0,
        xLeftTop,  ha, -hp,   0, 0, -1,  1, 1,
        xRight,    ha, -hp,   0, 0, -1,  0, 1,

        // 3. Tapa Superior (+Y) - Rectangular
        xLeftTop,  ha,  hp,   0, 1, 0,   0, 0,
        xRight,    ha,  hp,   0, 1, 0,   1, 0,
        xRight,    ha, -hp,   0, 1, 0,   1, 1,
        xLeftTop,  ha, -hp,   0, 1, 0,   0, 1,

        // 4. Base Inferior (-Y) - Rectangular
        xLeftBot, -ha, -hp,   0, -1, 0,  0, 0,
        xRight,   -ha, -hp,   0, -1, 0,  1, 0,
        xRight,   -ha,  hp,   0, -1, 0,  1, 1,
        xLeftBot, -ha,  hp,   0, -1, 0,  0, 1,

        // 5. Cara Derecha (+X) - Plana y Vertical
        xRight,   -ha,  hp,   1, 0, 0,   0, 0,
        xRight,   -ha, -hp,   1, 0, 0,   1, 0,
        xRight,    ha, -hp,   1, 0, 0,   1, 1,
        xRight,    ha,  hp,   1, 0, 0,   0, 1,

        // 6. Cara Izquierda (Diagonal / Inclinada)
        xLeftBot, -ha, -hp,   nxDiag, nyDiag, 0,   0, 0,
        xLeftBot, -ha,  hp,   nxDiag, nyDiag, 0,   1, 0,
        xLeftTop,  ha,  hp,   nxDiag, nyDiag, 0,   1, 1,
        xLeftTop,  ha, -hp,   nxDiag, nyDiag, 0,   0, 1
    ];

    const indices = [];
    for (let c = 0; c < 6; c++) {
        const base = c * 4;
        indices.push(base, base + 1, base + 2);
        indices.push(base, base + 2, base + 3);
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
