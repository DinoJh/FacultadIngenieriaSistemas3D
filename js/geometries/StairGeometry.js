import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class StairGeometry extends Geometry {
    constructor(numPeldanios = 14, ancho = 3.8, huella = 0.34, contrahuella = 0.17) {
        const data = crearEscalinataSolida(numPeldanios, ancho, huella, contrahuella);
        super(data.vertices, data.indices);
    }
}

function crearEscalinataSolida(numPeldanios = 14, ancho = 3.8, huella = 0.34, contrahuella = 0.17) {
    const vertices = [];
    const indices = [];
    const ha = ancho / 2.0;

    let vIdx = 0;

    for (let i = 0; i < numPeldanios; i++) {
        const zFront = i * huella;
        const zBack  = (i + 1) * huella;
        const yBase  = i * contrahuella;
        const yTop   = (i + 1) * contrahuella;

        // Contrahuella (cara vertical hacia -Z)
        vertices.push(
            -ha, yBase, zFront,   0, 0, -1,   0, 0,
             ha, yBase, zFront,   0, 0, -1,   1, 0,
             ha, yTop,  zFront,   0, 0, -1,   1, 1,
            -ha, yTop,  zFront,   0, 0, -1,   0, 1
        );
        indices.push(vIdx, vIdx + 1, vIdx + 2,  vIdx, vIdx + 2, vIdx + 3);
        vIdx += 4;

        // Huella (cara horizontal hacia +Y)
        vertices.push(
            -ha, yTop, zFront,   0, 1, 0,   0, 0,
             ha, yTop, zFront,   0, 1, 0,   1, 0,
             ha, yTop, zBack,    0, 1, 0,   1, 1,
            -ha, yTop, zBack,    0, 1, 0,   0, 1
        );
        indices.push(vIdx, vIdx + 1, vIdx + 2,  vIdx, vIdx + 2, vIdx + 3);
        vIdx += 4;

        // Lados laterales de cada peldaño (izquierdo y derecho) para solidez
        // Lado izquierdo (-X)
        vertices.push(
            -ha, 0,     zFront,  -1, 0, 0,   0, 0,
            -ha, yTop,  zFront,  -1, 0, 0,   1, 0,
            -ha, yTop,  zBack,   -1, 0, 0,   1, 1,
            -ha, 0,     zBack,   -1, 0, 0,   0, 1
        );
        indices.push(vIdx, vIdx + 1, vIdx + 2,  vIdx, vIdx + 2, vIdx + 3);
        vIdx += 4;

        // Lado derecho (+X)
        vertices.push(
             ha, 0,     zBack,    1, 0, 0,   0, 0,
             ha, yTop,  zBack,    1, 0, 0,   1, 0,
             ha, yTop,  zFront,   1, 0, 0,   1, 1,
             ha, 0,     zFront,   1, 0, 0,   0, 1
        );
        indices.push(vIdx, vIdx + 1, vIdx + 2,  vIdx, vIdx + 2, vIdx + 3);
        vIdx += 4;
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
