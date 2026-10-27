/**
 * ============================================================================
 * PROYECTO 3D: RECREACIÓN DE LA ESCENA DE INGENIERÍA DE SISTEMAS - UNA PUNO
 * Computación Gráfica 2026-II
 * Estudiante: Condori Churata Dino Jhoel (Cód. 236262)
 * 
 * ARCHIVO: js/math/Matrix4.js
 * Utilidades matemáticas para matrices 4x4, vectores 3D y transformaciones
 * ============================================================================
 */

// Retorna una matriz identidad de 4x4 en orden columna mayor (estándar WebGL)
function matrizIdentidad() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

// Multiplica dos matrices de 4x4 (a * b)
function multiplicarMat4(a, b) {
    const r = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
        for (let f = 0; f < 4; f++) {
            let suma = 0.0;
            for (let k = 0; k < 4; k++) {
                suma += a[k * 4 + f] * b[c * 4 + k];
            }
            r[c * 4 + f] = suma;
        }
    }
    return r;
}

// Matriz de traslación
function traslacion(x, y, z) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    ]);
}

// Matriz de escala
function escala(x, y, z) {
    return new Float32Array([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    ]);
}

// Matriz de rotación en el eje X
function rotacionX(anguloRad) {
    const c = Math.cos(anguloRad);
    const s = Math.sin(anguloRad);
    return new Float32Array([
        1,  0, 0, 0,
        0,  c, s, 0,
        0, -s, c, 0,
        0,  0, 0, 1
    ]);
}

// Matriz de rotación en el eje Y
function rotacionY(anguloRad) {
    const c = Math.cos(anguloRad);
    const s = Math.sin(anguloRad);
    return new Float32Array([
         c, 0, -s, 0,
         0, 1,  0, 0,
         s, 0,  c, 0,
         0, 0,  0, 1
    ]);
}

// Matriz de rotación en el eje Z
function rotacionZ(anguloRad) {
    const c = Math.cos(anguloRad);
    const s = Math.sin(anguloRad);
    return new Float32Array([
         c, s, 0, 0,
        -s, c, 0, 0,
         0, 0, 1, 0,
         0, 0, 0, 1
    ]);
}

// Resta de dos vectores 3D: a - b
function restar(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// Suma de dos vectores 3D: a + b
function sumar(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

// Escalar vector 3D
function escalar(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
}

// Normalización de vector 3D
function normalizar(v) {
    const l = Math.hypot(v[0], v[1], v[2]);
    if (l === 0) return [0, 0, 0];
    return [v[0] / l, v[1] / l, v[2] / l];
}

// Producto cruz: a × b
function cruz(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

// Producto punto: a · b
function punto(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Matriz de vista Cámara (LookAt)
function lookAt(eye, target, up) {
    const z = normalizar(restar(eye, target));
    const x = normalizar(cruz(up, z));
    const y = cruz(z, x);

    return new Float32Array([
        x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,
        -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
        -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
        -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]),
        1
    ]);
}

// Matriz de proyección en perspectiva
function perspectiva(fovRad, aspect, near, far) {
    const f = 1.0 / Math.tan(fovRad / 2.0);
    const nf = 1.0 / (near - far);

    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2.0 * far * near * nf, 0
    ]);
}

// Matriz normal 3x3 (inversa transpuesta de la submatriz 3x3 del modelo)
// Permite que las normales se transformen correctamente ante escalados no uniformes
function matrizNormal3x3(m4) {
    const a00 = m4[0], a01 = m4[1], a02 = m4[2];
    const a10 = m4[4], a11 = m4[5], a12 = m4[6];
    const a20 = m4[8], a21 = m4[9], a22 = m4[10];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
        return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }
    const invDet = 1.0 / det;

    return new Float32Array([
        b01 * invDet,
        (-a22 * a01 + a02 * a21) * invDet,
        (a12 * a01 - a02 * a11) * invDet,

        b11 * invDet,
        (a22 * a00 - a02 * a20) * invDet,
        (-a12 * a00 + a02 * a10) * invDet,

        b21 * invDet,
        (-a21 * a00 + a01 * a20) * invDet,
        (a11 * a00 - a01 * a10) * invDet
    ]);
}

/** Operaciones matriciales del mini motor (Paso 16). */
export class Matrix4 {
    static identidad(...args) { return matrizIdentidad(...args); }
    static multiplicar(...args) { return multiplicarMat4(...args); }
    static traslacion(...args) { return traslacion(...args); }
    static escala(...args) { return escala(...args); }
    static rotacionX(...args) { return rotacionX(...args); }
    static rotacionY(...args) { return rotacionY(...args); }
    static rotacionZ(...args) { return rotacionZ(...args); }
    static lookAt(...args) { return lookAt(...args); }
    static perspectiva(...args) { return perspectiva(...args); }
    static normal3x3(...args) { return matrizNormal3x3(...args); }
    static compose(position, rotation, scale) {
        const T = traslacion(position.x, position.y, position.z);
        const R = multiplicarMat4(rotacionZ(rotation.z), multiplicarMat4(rotacionY(rotation.y), rotacionX(rotation.x)));
        return multiplicarMat4(T, multiplicarMat4(R, escala(scale.x, scale.y, scale.z)));
    }
}
