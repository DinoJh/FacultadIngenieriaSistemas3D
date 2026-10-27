import { Geometry } from '../core/Geometry.js';

/** Geometría paramétrica con posiciones, normales y UV. */
export class CylinderGeometry extends Geometry {
    constructor(rInf = 0.5, rSup = 0.5, altura = 1.0, segmentos = 20) {
        const data = crearCilindro(rInf, rSup, altura, segmentos);
        super(data.vertices, data.indices);
    }
}

function crearCilindro(rInf = 0.5, rSup = 0.5, altura = 1.0, segmentos = 20) {
    const vertices = [];
    const indices = [];
    const ha = altura / 2.0;

    for (let i = 0; i <= segmentos; i++) {
        const u = i / segmentos;
        const theta = u * Math.PI * 2.0;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        vertices.push(
            rInf * cosT, -ha, rInf * sinT,
            cosT, 0.0, sinT,
            u, 0.0
        );

        vertices.push(
            rSup * cosT,  ha, rSup * sinT,
            cosT, 0.0, sinT,
            u, 1.0
        );
    }

    for (let i = 0; i < segmentos; i++) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, c, b);
        indices.push(b, c, d);
    }

    // Tapas
    const centroInf = vertices.length / 8;
    vertices.push(0, -ha, 0,  0, -1, 0,  0.5, 0.5);
    const baseInf = vertices.length / 8;
    for (let i = 0; i <= segmentos; i++) {
        const theta = (i / segmentos) * Math.PI * 2.0;
        vertices.push(rInf * Math.cos(theta), -ha, rInf * Math.sin(theta),  0, -1, 0,  0.5, 0.5);
    }
    for (let i = 0; i < segmentos; i++) {
        indices.push(centroInf, baseInf + i, baseInf + i + 1);
    }

    const centroSup = vertices.length / 8;
    vertices.push(0, ha, 0,  0, 1, 0,  0.5, 0.5);
    const baseSup = vertices.length / 8;
    for (let i = 0; i <= segmentos; i++) {
        const theta = (i / segmentos) * Math.PI * 2.0;
        vertices.push(rSup * Math.cos(theta), ha, rSup * Math.sin(theta),  0, 1, 0,  0.5, 0.5);
    }
    for (let i = 0; i < segmentos; i++) {
        indices.push(centroSup, baseSup + i + 1, baseSup + i);
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };
}
