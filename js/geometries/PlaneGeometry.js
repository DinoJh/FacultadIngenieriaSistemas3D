import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class PlaneGeometry extends Geometry {
    constructor(ancho = 1.0, largo = 1.0, repU = 1.0, repV = 1.0) {
        const data = crearPlanoHorizontal(ancho, largo, repU, repV);
        super(data.vertices, data.indices);
    }
}

function crearPlanoHorizontal(ancho = 1.0, largo = 1.0, repU = 1.0, repV = 1.0) {
    const hx = ancho / 2.0;
    const hz = largo / 2.0;

    const vertices = [
        -hx, 0,  hz,   0, 1, 0,   0, 0,
         hx, 0,  hz,   0, 1, 0,   repU, 0,
         hx, 0, -hz,   0, 1, 0,   repU, repV,
        -hx, 0, -hz,   0, 1, 0,   0, repV
    ];

    const indices = [0, 1, 2,  0, 2, 3];

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
