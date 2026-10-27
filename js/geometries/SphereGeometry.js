import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class SphereGeometry extends Geometry {
    constructor(radio = 0.5, latBands = 10, lonBands = 14) {
        const data = crearEsfera(radio, latBands, lonBands);
        super(data.vertices, data.indices);
    }
}

function crearEsfera(radio = 0.5, latBands = 10, lonBands = 14) {
    const vertices = [];
    const indices = [];

    for (let lat = 0; lat <= latBands; lat++) {
        const theta = (lat * Math.PI) / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= lonBands; lon++) {
            const phi = (lon * 2 * Math.PI) / lonBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            const u = lon / lonBands;
            const v = lat / latBands;

            vertices.push(
                radio * x, radio * y, radio * z,
                x, y, z,
                u, v
            );
        }
    }

    for (let lat = 0; lat < latBands; lat++) {
        for (let lon = 0; lon < lonBands; lon++) {
            const first = lat * (lonBands + 1) + lon;
            const second = first + lonBands + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
