import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class DiskGeometry extends Geometry {
    constructor(radio = 0.5, segmentos = 16) {
        const data = crearDisco(radio, segmentos);
        super(data.vertices, data.indices);
    }
}

function crearDisco(radio = 0.5, segmentos = 16) {
    const vertices = [];
    const indices = [];

    // Centro
    vertices.push(0, 0, 0,   0, -1, 0,   0.5, 0.5);

    for (let i = 0; i <= segmentos; i++) {
        const theta = (i / segmentos) * Math.PI * 2.0;
        const x = radio * Math.cos(theta);
        const z = radio * Math.sin(theta);
        const u = 0.5 + 0.5 * Math.cos(theta);
        const v = 0.5 + 0.5 * Math.sin(theta);
        vertices.push(x, 0, z,   0, -1, 0,   u, v);
    }

    for (let i = 1; i <= segmentos; i++) {
        indices.push(0, i, i + 1);
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
