import { Geometry } from '../core/Geometry.js';

/**
 * Calcula la elevación natural de la montaña en coordenadas de mundo (X, Z).
 * Permite que los árboles, vegetación y rocas se anclen con precisión milimétrica a la superficie.
 */
export function calcularAlturaMontana(x, z) {
    const zInicio = -15.5;
    const zFin = -88.0;
    if (z > zInicio) return 0.5;

    const tz = Math.min(Math.max((zInicio - z) / (zInicio - zFin), 0.0), 1.0);
    // Pendiente base ascendente hacia el fondo
    const hBase = 0.5 + 25.0 * Math.pow(tz, 1.15);
    // Cordillera lateral que abraza el campus a la izquierda y derecha
    const hLados = 7.5 * Math.pow(x / 65.0, 2) * tz;
    // Crestas y cerros principales ondulados
    const hCrestas = (4.8 * Math.cos(x * 0.055) + 3.2 * Math.sin(x * 0.11 + 0.4)) * Math.sqrt(tz);
    // Ondulaciones secundarias naturales del relieve andino
    const hOndul = (2.2 * Math.sin(x * 0.14 - z * 0.09) + 1.4 * Math.cos(x * 0.22 + z * 0.12)) * tz;

    return Math.max(0.5, hBase + hLados + hCrestas + hOndul);
}

/**
 * Malla 3D de montaña ondulada con normales de superficie calculadas por diferencias finitas.
 */
export class MountainGeometry extends Geometry {
    constructor(ancho = 130, zInicio = -15.5, zFin = -88.0, segX = 36, segZ = 24) {
        const vertices = [];
        const indices = [];

        const xMin = -ancho * 0.5;
        const xMax = ancho * 0.5;
        const dx = ancho / segX;
        const dz = (zInicio - zFin) / segZ;
        const delta = 0.15;

        for (let j = 0; j <= segZ; j++) {
            const z = zInicio - j * dz;
            const tz = j / segZ;

            for (let i = 0; i <= segX; i++) {
                const x = xMin + i * dx;
                const y = calcularAlturaMontana(x, z);

                // Cálculo numérico exacto del vector normal de la superficie
                const hL = calcularAlturaMontana(x - delta, z);
                const hR = calcularAlturaMontana(x + delta, z);
                const hD = calcularAlturaMontana(x, z - delta);
                const hU = calcularAlturaMontana(x, z + delta);

                const dhdx = (hR - hL) / (2.0 * delta);
                const dhdz = (hU - hD) / (2.0 * delta);

                let nx = -dhdx;
                let ny = 1.0;
                let nz = -dhdz;
                const len = Math.hypot(nx, ny, nz) || 1.0;
                nx /= len;
                ny /= len;
                nz /= len;

                // Coordenadas UV para texturizado repetitivo de césped y roca
                const u = (i / segX) * 8.0;
                const v = tz * 6.0;

                vertices.push(
                    x, y, z,
                    nx, ny, nz,
                    u, v
                );
            }
        }

        const stride = segX + 1;
        for (let j = 0; j < segZ; j++) {
            for (let i = 0; i < segX; i++) {
                const v00 = j * stride + i;
                const v10 = j * stride + (i + 1);
                const v01 = (j + 1) * stride + i;
                const v11 = (j + 1) * stride + (i + 1);

                // Orden CCW para visión superior
                indices.push(v00, v10, v01);
                indices.push(v10, v11, v01);
            }
        }

        super(new Float32Array(vertices), new Uint16Array(indices));
    }
}
