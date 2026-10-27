import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class BoxGeometry extends Geometry {
    constructor(sx = 1.0, sy = 1.0, sz = 1.0, repU = 1.0, repV = 1.0) {
        const data = crearCubo(sx, sy, sz, repU, repV);
        super(data.vertices, data.indices);
    }
}

function crearCubo(sx = 1.0, sy = 1.0, sz = 1.0, repU = 1.0, repV = 1.0) {
    const hx = sx / 2.0;
    const hy = sy / 2.0;
    const hz = sz / 2.0;

    const vertices = [
        // Cara Frontal (+Z)
        -hx, -hy,  hz,   0, 0, 1,   0, 0,
         hx, -hy,  hz,   0, 0, 1,   repU, 0,
         hx,  hy,  hz,   0, 0, 1,   repU, repV,
        -hx,  hy,  hz,   0, 0, 1,   0, repV,

        // Cara Posterior (-Z)
         hx, -hy, -hz,   0, 0, -1,  0, 0,
        -hx, -hy, -hz,   0, 0, -1,  repU, 0,
        -hx,  hy, -hz,   0, 0, -1,  repU, repV,
         hx,  hy, -hz,   0, 0, -1,  0, repV,

        // Cara Superior (+Y)
        -hx,  hy,  hz,   0, 1, 0,   0, 0,
         hx,  hy,  hz,   0, 1, 0,   repU, 0,
         hx,  hy, -hz,   0, 1, 0,   repU, repV,
        -hx,  hy, -hz,   0, 1, 0,   0, repV,

        // Cara Inferior (-Y)
        -hx, -hy, -hz,   0, -1, 0,  0, 0,
         hx, -hy, -hz,   0, -1, 0,  repU, 0,
         hx, -hy,  hz,   0, -1, 0,  repU, repV,
        -hx, -hy,  hz,   0, -1, 0,  0, repV,

        // Cara Derecha (+X)
         hx, -hy,  hz,   1, 0, 0,   0, 0,
         hx, -hy, -hz,   1, 0, 0,   repU, 0,
         hx,  hy, -hz,   1, 0, 0,   repU, repV,
         hx,  hy,  hz,   1, 0, 0,   0, repV,

        // Cara Izquierda (-X)
        -hx, -hy, -hz,  -1, 0, 0,   0, 0,
        -hx, -hy,  hz,  -1, 0, 0,   repU, 0,
        -hx,  hy,  hz,  -1, 0, 0,   repU, repV,
        -hx,  hy, -hz,  -1, 0, 0,   0, repV
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
