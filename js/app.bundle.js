// GENERADO por tools/build_bundle.py. Editar los módulos fuente y regenerar.
// Conserva cada módulo en su propio ámbito; funciona también desde file://.
(() => {
'use strict';
const modules = Object.create(null);
try {

// --- js/math/Matrix4.js ---
modules["js/math/Matrix4.js"] = (() => {
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

// Matriz de proyección ortográfica (para mapas de sombras y vistas paralelas)
function ortografica(left, right, bottom, top, near, far) {
    const lr = 1.0 / (left - right);
    const bt = 1.0 / (bottom - top);
    const nf = 1.0 / (near - far);

    return new Float32Array([
        -2.0 * lr, 0, 0, 0,
        0, -2.0 * bt, 0, 0,
        0, 0, 2.0 * nf, 0,
        (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
    ]);
}

/** Operaciones matriciales del mini motor (Paso 16). */
class Matrix4 {
    static identidad(...args) { return matrizIdentidad(...args); }
    static multiplicar(...args) { return multiplicarMat4(...args); }
    static traslacion(...args) { return traslacion(...args); }
    static escala(...args) { return escala(...args); }
    static rotacionX(...args) { return rotacionX(...args); }
    static rotacionY(...args) { return rotacionY(...args); }
    static rotacionZ(...args) { return rotacionZ(...args); }
    static lookAt(...args) { return lookAt(...args); }
    static perspectiva(...args) { return perspectiva(...args); }
    static ortografica(...args) { return ortografica(...args); }
    static normal3x3(...args) { return matrizNormal3x3(...args); }
    static compose(position, rotation, scale) {
        const T = traslacion(position.x, position.y, position.z);
        const R = multiplicarMat4(rotacionZ(rotation.z), multiplicarMat4(rotacionY(rotation.y), rotacionX(rotation.x)));
        return multiplicarMat4(T, multiplicarMat4(R, escala(scale.x, scale.y, scale.z)));
    }
}

return { Matrix4 };
})();

// --- js/shaders/buildingShaders.js ---
modules["js/shaders/buildingShaders.js"] = (() => {
/** Shaders GLSL ES 3.00: materiales, normales, sombras dinámicas y Blinn-Phong. */
const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

out vec3 vWorldPos;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;

    vNormal = normalize(uNormalMatrix * aNormal);
    vTexCoord = aTexCoord;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
precision mediump int;
precision lowp sampler2D;
precision lowp sampler2DShadow;

in vec3 vWorldPos;
in vec3 vNormal;
in vec2 vTexCoord;

// Uniforms de Material
uniform sampler2D uTexture;
uniform bool uUseTexture;
uniform vec4 uColor;
uniform bool uEmissive;
uniform float uSpecularPower;

// Uniforms de Cámara
uniform vec3 uCameraPos;

// Iluminación Solar / Lunar
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uAmbientColor;

// Sombras Proyectadas (Shadow Mapping)
uniform mat4 uLightSpaceMatrix;
uniform sampler2DShadow uShadowMap;
uniform float uShadowIntensity;

// Focos Dicroicos Empotrados Múltiples (Soffit y Pórtico)
#define MAX_LUCES 7
uniform int uNumLuces;
uniform vec3 uLuzPos[MAX_LUCES];
uniform vec3 uLuzColor[MAX_LUCES];
uniform float uLuzIntensidad[MAX_LUCES];
uniform float uLuzRadio[MAX_LUCES];

out vec4 fragColor;

float calcularSombra(vec3 worldPos, vec3 N, vec3 L) {
    if (uShadowIntensity <= 0.01) return 0.0;

    vec4 lightSpacePos = uLightSpaceMatrix * vec4(worldPos, 1.0);
    vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
    projCoords = projCoords * 0.5 + 0.5;

    // Si está fuera del volumen ortográfico de la luz
    if (projCoords.z > 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0) {
        return 0.0;
    }

    float cosTheta = max(dot(N, L), 0.0);
    // Cara en sombra propia (espalda a la luz)
    if (cosTheta <= 0.001) return 1.0 * uShadowIntensity;

    float bias = max(0.0035 * (1.0 - cosTheta), 0.0008);
    float currentDepth = projCoords.z - bias;

    // Filtrado PCF 3x3 para bordes suaves en las sombras del edificio y árboles
    float shadow = 0.0;
    vec2 texelSize = vec2(1.0 / 2048.0);
    for (int x = -1; x <= 1; ++x) {
        for (int y = -1; y <= 1; ++y) {
            vec3 coord = vec3(projCoords.xy + vec2(x, y) * texelSize, currentDepth);
            shadow += 1.0 - texture(uShadowMap, coord);
        }
    }
    shadow /= 9.0;
    return shadow * uShadowIntensity;
}

void main() {
    // Si la pieza es una fuente emisora directa (Sol, Luna, halos, texto neón o bombillas)
    if (uEmissive) {
        vec4 texColor = uUseTexture ? texture(uTexture, vTexCoord) : vec4(1.0);
        vec3 colorBase = texColor.rgb * uColor.rgb;
        float alfa = uColor.a * texColor.a;
        fragColor = vec4(colorBase * 1.35, alfa);
        return;
    }

    vec4 texColor = uUseTexture ? texture(uTexture, vTexCoord) : vec4(1.0);
    vec3 albedo = texColor.rgb * uColor.rgb;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);

    // 1. Luz Ambiental Hemisférica (Cielo cenital vs Rebote del suelo)
    // Superficies mirando al cielo (+Y) reciben la luz ambiental de la bóveda celeste.
    // Superficies mirando hacia abajo (-Y) reciben el rebote atenuado y cálido del terreno.
    float factorHemi = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 ambientCielo = uAmbientColor;
    vec3 ambientSuelo = uAmbientColor * vec3(0.55, 0.50, 0.45) * 0.75;
    vec3 ambiente = mix(ambientSuelo, ambientCielo, factorHemi) * albedo;

    // 2. Luz Solar / Lunar Direccional con Sombras
    // L_sol apunta hacia la fuente de luz
    vec3 L_sol = normalize(-uSunDirection);
    float NdotL = max(dot(N, L_sol), 0.0);

    // Cálculo de sombra arrojada (Shadow Mapping con PCF)
    float factorSombra = calcularSombra(vWorldPos, N, L_sol);
    float factorLuzDirecta = NdotL * (1.0 - factorSombra);

    vec3 difusaSol = uSunColor * factorLuzDirecta * albedo;

    // Especular Blinn-Phong con efecto Fresnel (Schlick)
    vec3 H_sol = normalize(L_sol + V);
    float NdotH = max(dot(N, H_sol), 0.0);
    float specSol = pow(NdotH, max(uSpecularPower, 4.0));

    // Efecto Fresnel: a ángulos rasantes los vidrios y metales reflejan más luz
    float VdotH = max(dot(V, H_sol), 0.0);
    float fresnel = 0.04 + 0.96 * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
    float factorEspecular = uSpecularPower > 25.0 ? (0.35 + 0.50 * fresnel) : (0.08 + 0.12 * fresnel);
    vec3 especularSol = uSunColor * (specSol * (1.0 - factorSombra)) * factorEspecular;

    // 3. Focos Dicroicos Empotrados (Cálculo acumulativo con atenuación cuadrática suave)
    vec3 luzDicroicosTotal = vec3(0.0);

    for (int i = 0; i < uNumLuces; i++) {
        vec3 L_vec = uLuzPos[i] - vWorldPos;
        float dist = length(L_vec);

        if (dist < uLuzRadio[i]) {
            vec3 L = normalize(L_vec);
            // Mayor intensidad cuando la luz apunta hacia abajo (-Y)
            float factorCono = clamp(dot(L, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5, 0.2, 1.0);

            float diff = max(dot(N, L), 0.0);
            float factorDist = clamp(1.0 - dist / uLuzRadio[i], 0.0, 1.0);
            float aten = factorDist * factorDist * factorCono;

            vec3 H = normalize(L + V);
            float spec = pow(max(dot(N, H), 0.0), uSpecularPower);

            vec3 difusa = uLuzColor[i] * (diff * aten * uLuzIntensidad[i]) * albedo;
            vec3 especular = uLuzColor[i] * (spec * aten * uLuzIntensidad[i] * 0.25);

            luzDicroicosTotal += (difusa + especular);
        }
    }

    // 4. Composición Lumínica y Mapeo Tonal (Tonemapping)
    vec3 colorIluminado = ambiente + difusaSol + especularSol + luzDicroicosTotal;

    // Curva de mapeo tonal tipo Reinhard extendido para evitar quemado blanco
    vec3 colorMapeado = colorIluminado / (colorIluminado + vec3(0.75)) * 1.20;
    vec3 colorFinal = clamp(colorMapeado, 0.0, 1.0);

    fragColor = vec4(colorFinal, uColor.a * texColor.a);
}
`;

return { vertexShaderSource, fragmentShaderSource };
})();

// --- js/core/Renderer.js ---
modules["js/core/Renderer.js"] = (() => {
const { Matrix4 } = modules["js/math/Matrix4.js"];
const { vertexShaderSource, fragmentShaderSource } = modules["js/shaders/buildingShaders.js"];

const shadowVsSource = `#version 300 es
layout(location = 0) in vec3 aPosition;
uniform mat4 uLightSpaceMatrix;
uniform mat4 uModelMatrix;
void main() {
    gl_Position = uLightSpaceMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
`;

const shadowFsSource = `#version 300 es
precision highp float;
void main() {}
`;

/** Traduce Scene + Camera a WebGL2 con iluminación y sombras dinámicas. */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
        if (!gl) throw new Error('WebGL2 no está disponible en este navegador.');
        this.gl = gl;
        this.geometries = new Map();
        this.info = { drawCalls: 0 };

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Programa principal de renderizado
        this.program = this.createProgramWithShaders(vertexShaderSource, fragmentShaderSource);
        const location = name => gl.getUniformLocation(this.program, name);
        this.uniforms = {
            modelLoc: location('uModelMatrix'), viewLoc: location('uViewMatrix'),
            projectionLoc: location('uProjectionMatrix'), normalMatrixLoc: location('uNormalMatrix'),
            textureLoc: location('uTexture'), useTextureLoc: location('uUseTexture'),
            colorLoc: location('uColor'), emissiveLoc: location('uEmissive'),
            specularPowerLoc: location('uSpecularPower'), cameraPosLoc: location('uCameraPos'),
            sunDirLoc: location('uSunDirection'), sunColorLoc: location('uSunColor'),
            ambientColorLoc: location('uAmbientColor'), numLucesLoc: location('uNumLuces'),
            lightSpaceMatrixLoc: location('uLightSpaceMatrix'),
            shadowMapLoc: location('uShadowMap'),
            shadowIntensityLoc: location('uShadowIntensity'),
            lights: Array.from({ length: 7 }, (_, i) => ({
                position: location(`uLuzPos[${i}]`), color: location(`uLuzColor[${i}]`),
                intensity: location(`uLuzIntensidad[${i}]`), radius: location(`uLuzRadio[${i}]`)
            }))
        };

        // Programa y FBO para mapas de sombras proyectadas (Shadow Mapping)
        this.shadowProgram = this.createProgramWithShaders(shadowVsSource, shadowFsSource);
        this.shadowUniforms = {
            lightSpaceMatrixLoc: gl.getUniformLocation(this.shadowProgram, 'uLightSpaceMatrix'),
            modelLoc: gl.getUniformLocation(this.shadowProgram, 'uModelMatrix')
        };

        this.shadowSize = 2048;
        this.shadowDepth = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.shadowDepth);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.shadowSize, this.shadowSize, 0,
            gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);

        this.shadowFbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.shadowDepth, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error('Error compilando shader: ' + error);
        }
        return shader;
    }

    createProgramWithShaders(vsSource, fsSource) {
        const gl = this.gl;
        const vs = this.createShader(gl.VERTEX_SHADER, vsSource);
        const fs = this.createShader(gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error('Error enlazando programa: ' + error);
        }
        return program;
    }

    /** Sube cada geometría compartida una sola vez a la GPU. */
    initGeometry(geometry) {
        if (this.geometries.has(geometry)) return this.geometries.get(geometry);
        const gl = this.gl;
        const vao = gl.createVertexArray();
        const vbo = gl.createBuffer();
        const ebo = gl.createBuffer();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
        const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
        // Los shaders declaran layout(location = 0/1/2).
        for (const [location, size, offset] of [[0, 3, 0], [1, 3, 3], [2, 2, 6]]) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset * 4);
        }
        gl.bindVertexArray(null);
        const resource = { vao, vbo, ebo };
        this.geometries.set(geometry, resource);
        return resource;
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
        const height = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.gl.viewport(0, 0, width, height);
        return width / height;
    }

    render(scene, camera) {
        const gl = this.gl;
        const u = this.uniforms;

        scene.updateMatrixWorld();
        camera.updateViewMatrix();

        const light = scene.lighting;
        const sunDir = light.sunDirection || [-0.6, -0.8, -0.4];

        // 1. CÁLCULO DE LA MATRIZ DE ESPACIO DE LUZ (Para sombras del Sol)
        const distLuz = 80.0;
        const centroEscena = [0.0, 5.0, 0.0];
        const eyeLuz = [
            centroEscena[0] - sunDir[0] * distLuz,
            centroEscena[1] - sunDir[1] * distLuz,
            centroEscena[2] - sunDir[2] * distLuz
        ];
        const upLuz = Math.abs(sunDir[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0];
        const lightView = Matrix4.lookAt(eyeLuz, centroEscena, upLuz);
        const lightProj = Matrix4.ortografica(-48, 48, -35, 45, 10, 170);
        const lightSpaceMatrix = Matrix4.multiplicar(lightProj, lightView);

        // 2. PASO DE SOMBRAS (Genera el mapa de profundidad cuando hay luz solar activa)
        const shadowIntensity = light.shadowIntensity !== undefined ? light.shadowIntensity : 0.82;
        if (shadowIntensity > 0.01) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFbo);
            gl.viewport(0, 0, this.shadowSize, this.shadowSize);
            gl.clear(gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.shadowProgram);
            gl.uniformMatrix4fv(this.shadowUniforms.lightSpaceMatrixLoc, false, lightSpaceMatrix);
            this.renderShadowObject(scene);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        // 3. PASO PRINCIPAL DE COLOR
        const aspect = this.resize();
        if (camera.aspect !== aspect) {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }

        gl.clearColor(...scene.background);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.program);
        gl.uniformMatrix4fv(u.viewLoc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(u.projectionLoc, false, camera.projectionMatrix);
        gl.uniform3f(u.cameraPosLoc, camera.matrixWorld[12], camera.matrixWorld[13], camera.matrixWorld[14]);

        gl.uniform3fv(u.sunDirLoc, light.sunDirection);
        gl.uniform3fv(u.sunColorLoc, light.sunColor);
        gl.uniform3fv(u.ambientColorLoc, light.ambientColor);

        // Uniforms de sombras
        gl.uniformMatrix4fv(u.lightSpaceMatrixLoc, false, lightSpaceMatrix);
        gl.uniform1f(u.shadowIntensityLoc, shadowIntensity);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.shadowDepth);
        gl.uniform1i(u.shadowMapLoc, 1);

        // Luces puntuales dicroicas
        const lights = light.pointLights.slice(0, u.lights.length);
        gl.uniform1i(u.numLucesLoc, lights.length);
        lights.forEach((point, i) => {
            gl.uniform3fv(u.lights[i].position, point.position);
            gl.uniform3fv(u.lights[i].color, point.color);
            gl.uniform1f(u.lights[i].intensity, point.intensity);
            gl.uniform1f(u.lights[i].radius, point.radius);
        });

        this.info.drawCalls = 0;
        this.renderObject(scene);
    }

    renderShadowObject(object) {
        if (!object.visible) return;
        if (object.geometry && object.material && !object.material.emissive) {
            const resource = this.initGeometry(object.geometry);
            this.gl.uniformMatrix4fv(this.shadowUniforms.modelLoc, false, object.matrixWorld);
            this.gl.bindVertexArray(resource.vao);
            this.gl.drawElements(this.gl.TRIANGLES, object.geometry.indexCount, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
        }
        for (const child of object.children) this.renderShadowObject(child);
    }

    renderObject(object) {
        if (!object.visible) return;
        if (object.geometry && object.material) this.drawMesh(object);
        for (const child of object.children) this.renderObject(child);
    }

    drawMesh(mesh) {
        const gl = this.gl;
        const u = this.uniforms;
        const material = mesh.material;
        const resource = this.initGeometry(mesh.geometry);

        if (material.depthWrite === false) gl.depthMask(false);
        gl.uniformMatrix4fv(u.modelLoc, false, mesh.matrixWorld);
        gl.uniformMatrix3fv(u.normalMatrixLoc, false, Matrix4.normal3x3(mesh.matrixWorld));
        gl.uniform4fv(u.colorLoc, material.color);
        gl.uniform1i(u.emissiveLoc, material.emissive ? 1 : 0);
        gl.uniform1f(u.specularPowerLoc, material.shininess);
        gl.uniform1i(u.useTextureLoc, material.texture ? 1 : 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, material.texture);
        gl.uniform1i(u.textureLoc, 0);

        gl.bindVertexArray(resource.vao);
        gl.drawElements(gl.TRIANGLES, mesh.geometry.indexCount, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);

        if (material.depthWrite === false) gl.depthMask(true);
        this.info.drawCalls++;
    }

    dispose() {
        for (const { vao, vbo, ebo } of this.geometries.values()) {
            this.gl.deleteVertexArray(vao);
            this.gl.deleteBuffer(vbo);
            this.gl.deleteBuffer(ebo);
        }
        this.geometries.clear();
        this.gl.deleteTexture(this.shadowDepth);
        this.gl.deleteFramebuffer(this.shadowFbo);
        this.gl.deleteProgram(this.shadowProgram);
        this.gl.deleteProgram(this.program);
    }
}

return { Renderer };
})();

// --- js/core/Object3D.js ---
modules["js/core/Object3D.js"] = (() => {
const { Matrix4 } = modules["js/math/Matrix4.js"];

/** Nodo espacial. Sus hijos heredan su transformación. */
class Object3D {
    constructor(name = '') {
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.parent = null;
        this.children = [];
        this.matrix = Matrix4.identidad();
        this.matrixWorld = Matrix4.identidad();
        this.matrixAutoUpdate = true;
        this.visible = true;
    }

    add(child) {
        for (let ancestor = this; ancestor; ancestor = ancestor.parent) {
            if (ancestor === child) throw new Error('La jerarquía no puede contener ciclos.');
        }
        if (child.parent) child.parent.remove(child);
        child.parent = this;
        this.children.push(child);
        return this;
    }

    remove(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
        return this;
    }

    updateMatrix() {
        this.matrix = Matrix4.compose(this.position, this.rotation, this.scale);
    }

    /** Para piezas estáticas cuya matriz ya está compuesta. */
    setMatrix(matrix) {
        this.matrix = new Float32Array(matrix);
        this.matrixAutoUpdate = false;
        return this;
    }

    updateMatrixWorld(parentMatrix = null) {
        if (this.matrixAutoUpdate) this.updateMatrix();
        this.matrixWorld = parentMatrix
            ? Matrix4.multiplicar(parentMatrix, this.matrix)
            : this.matrix;
        for (const child of this.children) child.updateMatrixWorld(this.matrixWorld);
    }

    traverse(callback) {
        callback(this);
        for (const child of this.children) child.traverse(callback);
    }
}

return { Object3D };
})();

// --- js/core/Scene.js ---
modules["js/core/Scene.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];

/** Raíz del árbol de objetos y configuración de ambiente de la escena. */
class Scene extends Object3D {
    constructor() {
        super('Escena de la facultad');
        this.background = [0.50, 0.68, 0.88, 1];
        this.lighting = {
            sunDirection: [-0.6, -0.8, -0.4],
            sunColor: [0.98, 0.96, 0.92],
            ambientColor: [0.38, 0.40, 0.44],
            pointLights: []
        };
    }
}

return { Scene };
})();

// --- js/cameras/Camera.js ---
modules["js/cameras/Camera.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Matrix4 } = modules["js/math/Matrix4.js"];

class Camera extends Object3D {
    constructor() {
        super('Cámara');
        this.target = { x: 0, y: 0, z: 0 };
        this.up = { x: 0, y: 1, z: 0 };
        this.viewMatrix = Matrix4.identidad();
        this.projectionMatrix = Matrix4.identidad();
    }

    updateViewMatrix() {
        // La cámara también puede pertenecer a una jerarquía.
        let root = this;
        while (root.parent) root = root.parent;
        root.updateMatrixWorld();
        this.viewMatrix = Matrix4.lookAt(
            [this.matrixWorld[12], this.matrixWorld[13], this.matrixWorld[14]],
            [this.target.x, this.target.y, this.target.z],
            [this.up.x, this.up.y, this.up.z]
        );
    }
}

return { Camera };
})();

// --- js/cameras/PerspectiveCamera.js ---
modules["js/cameras/PerspectiveCamera.js"] = (() => {
const { Camera } = modules["js/cameras/Camera.js"];
const { Matrix4 } = modules["js/math/Matrix4.js"];

class PerspectiveCamera extends Camera {
    constructor(fov = 52, aspect = 1, near = 0.2, far = 200) {
        super();
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        this.projectionMatrix = Matrix4.perspectiva(this.fov * Math.PI / 180, this.aspect, this.near, this.far);
    }
}

return { PerspectiveCamera };
})();

// --- js/controls/OrbitControls.js ---
modules["js/controls/OrbitControls.js"] = (() => {
/** Navegación del Paso 15, independiente del motor y de los botones de la página. */
class OrbitControls {
    constructor(camera, canvas, onAction = () => {}) {
        this.camera = camera;
        this.distancia = this.distanciaObjetivo = 19;
        this.azimut = this.azimutObjetivo = 0.03;
        this.elevacion = this.elevacionObjetivo = 0.12;
        this.distanciaMin = 4;
        this.distanciaMax = 65;
        this.elevacionMin = -0.15;
        this.elevacionMax = Math.PI * 0.46;
        this.autoOrbit = false;
        this.velocidadAutoOrbit = 0.20;
        Object.assign(camera.target, { x: 0.6, y: 6.2, z: 0 });
        this.events = new AbortController();
        const signal = this.events.signal;
        let dragging = false, lastX = 0, lastY = 0, touchDistance = 0;
        const start = (x, y) => { dragging = true; lastX = x; lastY = y; };
        const move = (x, y) => {
            if (!dragging) return;
            this.orbit(-(x - lastX) * 0.005, (y - lastY) * 0.005);
            lastX = x; lastY = y;
        };
        canvas.addEventListener('mousedown', e => start(e.clientX, e.clientY), { signal });
        window.addEventListener('mousemove', e => move(e.clientX, e.clientY), { signal });
        window.addEventListener('mouseup', () => { dragging = false; }, { signal });
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            this.zoom(e.deltaY > 0 ? 1.08 : 0.92);
        }, { passive: false, signal });
        const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY);
        canvas.addEventListener('touchstart', e => {
            if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY);
            else if (e.touches.length === 2) { dragging = false; touchDistance = distance(e.touches); }
        }, { signal });
        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY);
            else if (e.touches.length === 2) {
                const next = distance(e.touches);
                if (next > 0 && touchDistance > 0) this.zoom(touchDistance / next);
                touchDistance = next;
            }
        }, { passive: false, signal });
        canvas.addEventListener('touchend', e => {
            dragging = false;
            if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY);
        }, { signal });
        canvas.addEventListener('touchcancel', () => { dragging = false; }, { signal });
        window.addEventListener('keydown', e => {
            if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
            const key = e.key.toLowerCase();
            const directions = { arrowleft: [0.05, 0], a: [0.05, 0], arrowright: [-0.05, 0], d: [-0.05, 0],
                arrowup: [0, 0.04], w: [0, 0.04], arrowdown: [0, -0.04], s: [0, -0.04] };
            if (directions[key]) { e.preventDefault(); this.orbit(...directions[key]); }
            else if (['q', '+', '='].includes(key)) this.zoom(0.93);
            else if (['-', '_'].includes(key)) this.zoom(1.07);
            else if (!e.repeat) {
                const action = { e: 'alternarPuertas', v: 'alternarVentanas', r: 'restablecerCamara',
                    c: 'alternarAutoOrbit', l: 'alternarLuzNocturna', k: 'alternarAutoCiclo' }[key];
                if (action) onAction(action);
            }
        }, { signal });
        this.update(0);
    }

    orbit(horizontal, vertical) {
        this.azimutObjetivo += horizontal;
        this.elevacionObjetivo = Math.max(this.elevacionMin,
            Math.min(this.elevacionMax, this.elevacionObjetivo + vertical));
    }

    zoom(factor) {
        this.distanciaObjetivo = Math.max(this.distanciaMin,
            Math.min(this.distanciaMax, this.distanciaObjetivo * factor));
    }

    setView(azimut, elevacion, distancia, target) {
        this.azimutObjetivo = azimut;
        this.elevacionObjetivo = elevacion;
        this.distanciaObjetivo = distancia;
        Object.assign(this.camera.target, { x: target[0], y: target[1], z: target[2] });
        this.autoOrbit = false;
    }

    update(dt) {
        if (this.autoOrbit) this.azimutObjetivo += this.velocidadAutoOrbit * dt;
        const smoothing = 1 - Math.exp(-8 * dt);
        this.azimut += (this.azimutObjetivo - this.azimut) * smoothing;
        this.elevacion += (this.elevacionObjetivo - this.elevacion) * smoothing;
        this.distancia += (this.distanciaObjetivo - this.distancia) * smoothing;
        const target = this.camera.target;
        this.camera.position.x = target.x + this.distancia * Math.cos(this.elevacion) * Math.sin(this.azimut);
        this.camera.position.y = target.y + this.distancia * Math.sin(this.elevacion);
        this.camera.position.z = target.z + this.distancia * Math.cos(this.elevacion) * Math.cos(this.azimut);
    }

    dispose() { this.events.abort(); }
}

return { OrbitControls };
})();

// --- js/objects/Mesh.js ---
modules["js/objects/Mesh.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];

/** Objeto visible = geometría + material + transformación. */
class Mesh extends Object3D {
    constructor(geometry, material, name = '') {
        super(name);
        this.geometry = geometry;
        this.material = material;
    }
}

return { Mesh };
})();

// --- js/materials/BasicMaterial.js ---
modules["js/materials/BasicMaterial.js"] = (() => {
/** Apariencia de un Mesh; no contiene posiciones ni llamadas a WebGL. */
class BasicMaterial {
    constructor({ texture = null, color = [1, 1, 1, 1], emissive = false, shininess = 16, depthWrite = true } = {}) {
        this.texture = texture;
        this.color = color;
        this.emissive = emissive;
        this.shininess = shininess;
        this.depthWrite = depthWrite;
    }
}

return { BasicMaterial };
})();

// --- js/objects/Puertas.js ---
modules["js/objects/Puertas.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Mesh } = modules["js/objects/Mesh.js"];
const { BasicMaterial } = modules["js/materials/BasicMaterial.js"];

/** Cada hoja hereda la rotación del pivote colocado en su bisagra. */
class Puertas extends Object3D {
    constructor(geometry) {
        super('Puertas de entrada');
        this.apertura = 0;
        const material = new BasicMaterial({ color: [0.25, 0.45, 0.65, 0.9], shininess: 64 });
        this.bisagras = [-0.15, 1.55].map((x, index) => {
            const pivot = new Object3D(index === 0 ? 'Bisagra izquierda' : 'Bisagra derecha');
            Object.assign(pivot.position, { x, y: 3.82, z: -0.25 });
            const hoja = new Mesh(geometry, material, 'Hoja de vidrio');
            hoja.position.x = index === 0 ? 0.42 : -0.42;
            Object.assign(hoja.scale, { x: 0.84, y: 1.95, z: 0.06 });
            pivot.add(hoja);
            this.add(pivot);
            return pivot;
        });
    }

    update(dt, abiertas) {
        this.apertura += ((abiertas ? 1 : 0) - this.apertura) * (1 - Math.exp(-5 * dt));
        const angle = this.apertura * Math.PI * 0.45;
        this.bisagras[0].rotation.y = -angle;
        this.bisagras[1].rotation.y = angle;
    }
}

return { Puertas };
})();

// --- js/objects/Ventanas.js ---
modules["js/objects/Ventanas.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Mesh } = modules["js/objects/Mesh.js"];
const { BasicMaterial } = modules["js/materials/BasicMaterial.js"];

/** Torre -> ventana -> bisagra -> marcos y cristal. Los brazos siguen la apertura. */
class Ventanas extends Object3D {
    constructor(geometry) {
        super('Ventanas proyectantes');
        this.apertura = 1;
        const marco = new BasicMaterial({ color: [0.18, 0.22, 0.26, 1], shininess: 64 });
        const cristal = new BasicMaterial({ color: [0.18, 0.45, 0.72, 0.9], shininess: 96 });
        const metal = new BasicMaterial({ color: [0.82, 0.85, 0.90, 1], shininess: 96 });
        this.ventanas = [];
        for (const [x, y] of [[-5.08, 11.85], [-3.92, 11.85], [-5.08, 9.20], [-3.92, 9.20]]) {
            const ventana = new Object3D('Ventana proyectante');
            Object.assign(ventana.position, { x, y, z: 2.14 });
            const bisagra = new Object3D('Bisagra superior');
            ventana.add(bisagra);
            const w = 1.02, h = 1.05;
            const pieza = (parent, material, position, scale, name) => {
                const mesh = new Mesh(geometry, material, name);
                Object.assign(mesh.position, { x: position[0], y: position[1], z: position[2] });
                Object.assign(mesh.scale, { x: scale[0], y: scale[1], z: scale[2] });
                parent.add(mesh);
                return mesh;
            };
            pieza(bisagra, marco, [0, -0.02, 0], [w, 0.04, 0.04], 'Marco superior');
            pieza(bisagra, marco, [0, -h + 0.02, 0], [w, 0.04, 0.04], 'Marco inferior');
            pieza(bisagra, marco, [-w / 2 + 0.02, -h / 2, 0], [0.04, h, 0.04], 'Marco izquierdo');
            pieza(bisagra, marco, [w / 2 - 0.02, -h / 2, 0], [0.04, h, 0.04], 'Marco derecho');
            pieza(bisagra, cristal, [0, -h / 2, 0], [w - 0.06, h - 0.06, 0.012], 'Cristal');
            const brazos = [-1, 1].map(sign => pieza(ventana, metal,
                [sign * (w / 2 - 0.03), 0, 0], [0.015, 0.015, 1], 'Brazo metálico'));
            this.add(ventana);
            this.ventanas.push({ bisagra, brazos, h });
        }
        this.update(0, true);
    }

    update(dt, abiertas) {
        this.apertura += ((abiertas ? 1 : 0) - this.apertura) * (1 - Math.exp(-4 * dt));
        const angle = this.apertura * 0.48;
        for (const { bisagra, brazos, h } of this.ventanas) {
            bisagra.rotation.x = -angle;
            const dz = Math.sin(angle) * h * 0.8;
            const dy = -Math.cos(angle) * h * 0.8;
            for (const brazo of brazos) {
                brazo.visible = angle > 0.03;
                brazo.position.y = dy / 2;
                brazo.position.z = dz / 2;
                brazo.rotation.x = -angle / 2;
                brazo.scale.z = dz * 1.1;
            }
        }
    }
}

return { Ventanas };
})();

// --- js/core/Geometry.js ---
modules["js/core/Geometry.js"] = (() => {
/** Datos de una malla. Cada vértice contiene posición (3), normal (3) y UV (2). */
class Geometry {
    constructor(vertices, indices) {
        this.vertices = vertices;
        this.indices = indices;
        this.indexCount = indices.length;
    }
}

return { Geometry };
})();

// --- js/geometries/BoxGeometry.js ---
modules["js/geometries/BoxGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class BoxGeometry extends Geometry {
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

return { BoxGeometry };
})();

// --- js/geometries/PlaneGeometry.js ---
modules["js/geometries/PlaneGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class PlaneGeometry extends Geometry {
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

return { PlaneGeometry };
})();

// --- js/geometries/CylinderGeometry.js ---
modules["js/geometries/CylinderGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class CylinderGeometry extends Geometry {
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

return { CylinderGeometry };
})();

// --- js/geometries/DiskGeometry.js ---
modules["js/geometries/DiskGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class DiskGeometry extends Geometry {
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

return { DiskGeometry };
})();

// --- js/geometries/TrapezoidGeometry.js ---
modules["js/geometries/TrapezoidGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class TrapezoidGeometry extends Geometry {
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

return { TrapezoidGeometry };
})();

// --- js/geometries/SphereGeometry.js ---
modules["js/geometries/SphereGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/** Geometría paramétrica con posiciones, normales y UV. */
class SphereGeometry extends Geometry {
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

return { SphereGeometry };
})();

// --- js/scenes/Facultad.js ---
modules["js/scenes/Facultad.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Mesh } = modules["js/objects/Mesh.js"];
const { BasicMaterial } = modules["js/materials/BasicMaterial.js"];
const { Matrix4 } = modules["js/math/Matrix4.js"];
const { Puertas } = modules["js/objects/Puertas.js"];
const { Ventanas } = modules["js/objects/Ventanas.js"];
const { BoxGeometry } = modules["js/geometries/BoxGeometry.js"];
const { PlaneGeometry } = modules["js/geometries/PlaneGeometry.js"];
const { CylinderGeometry } = modules["js/geometries/CylinderGeometry.js"];
const { DiskGeometry } = modules["js/geometries/DiskGeometry.js"];
const { TrapezoidGeometry } = modules["js/geometries/TrapezoidGeometry.js"];
const { SphereGeometry } = modules["js/geometries/SphereGeometry.js"];

const { identidad: matrizIdentidad, multiplicar: multiplicarMat4,
    traslacion, escala, rotacionX, rotacionY, rotacionZ } = Matrix4;

/** Ensambla la arquitectura del edificio; no conoce WebGL ni la interfaz. */
class Facultad extends Object3D {
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

return { Facultad };
})();

// --- js/geometries/MountainGeometry.js ---
modules["js/geometries/MountainGeometry.js"] = (() => {
const { Geometry } = modules["js/core/Geometry.js"];

/**
 * Calcula la elevación natural de la montaña en coordenadas de mundo (X, Z).
 * Permite que los árboles, vegetación y rocas se anclen con precisión milimétrica a la superficie.
 */
function calcularAlturaMontana(x, z) {
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
class MountainGeometry extends Geometry {
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

return { calcularAlturaMontana, MountainGeometry };
})();

// --- js/objects/Montana.js ---
modules["js/objects/Montana.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Mesh } = modules["js/objects/Mesh.js"];
const { BasicMaterial } = modules["js/materials/BasicMaterial.js"];
const { MountainGeometry, calcularAlturaMontana } = modules["js/geometries/MountainGeometry.js"];
const { CylinderGeometry } = modules["js/geometries/CylinderGeometry.js"];
const { SphereGeometry } = modules["js/geometries/SphereGeometry.js"];
const { Matrix4 } = modules["js/math/Matrix4.js"];

const { identidad: matrizIdentidad, multiplicar: multiplicarMat4,
    traslacion, escala, rotacionY, rotacionZ } = Matrix4;

/**
 * Montaña 3D con relieve andino ondulado y denso bosque de árboles (pinos y queñuales)
 * ubicado en la parte posterior de la Facultad de Ingeniería de Sistemas (UNA Puno).
 */
class Montana extends Object3D {
    constructor(texturas) {
        super('Montaña y Bosque Posterior');

        // 1. Relieve de la montaña
        const geomMontana = new MountainGeometry(140, -15.5, -88.0, 36, 24);
        const matMontana = new BasicMaterial({
            texture: texturas.cespedMontana,
            color: [0.92, 0.98, 0.92, 1.0],
            shininess: 4.0
        });
        const meshMontana = new Mesh(geomMontana, matMontana, 'Terreno de Montaña');
        this.add(meshMontana);

        // 2. Geometrías compartidas para los árboles del bosque (reutilizan VAO en GPU)
        const geomTronco = new CylinderGeometry(0.22, 0.28, 1.8, 8);
        const geomPino1 = new CylinderGeometry(1.65, 0.12, 2.2, 9);
        const geomPino2 = new CylinderGeometry(1.25, 0.08, 2.0, 9);
        const geomPino3 = new CylinderGeometry(0.85, 0.04, 1.8, 9);
        const geomCopa = new SphereGeometry(1.25, 8, 10);
        const geomArbusto = new SphereGeometry(0.85, 7, 9);
        const geomRoca = new SphereGeometry(0.95, 6, 8);

        // 3. Materiales del bosque
        const matTronco = new BasicMaterial({
            texture: texturas.cortezaArbol,
            color: [0.52, 0.35, 0.22, 1.0],
            shininess: 4.0
        });

        const matPinoOscuro = new BasicMaterial({ color: [0.12, 0.36, 0.16, 1.0], shininess: 8.0 });
        const matPinoMedio = new BasicMaterial({ color: [0.16, 0.44, 0.20, 1.0], shininess: 8.0 });
        const matPinoClaro = new BasicMaterial({ color: [0.22, 0.52, 0.24, 1.0], shininess: 10.0 });
        const matPinoLima = new BasicMaterial({ color: [0.26, 0.56, 0.26, 1.0], shininess: 10.0 });

        const matQuenual1 = new BasicMaterial({ color: [0.20, 0.48, 0.20, 1.0], shininess: 10.0 });
        const matQuenual2 = new BasicMaterial({ color: [0.28, 0.56, 0.26, 1.0], shininess: 12.0 });

        const matArbusto = new BasicMaterial({ color: [0.32, 0.50, 0.22, 1.0], shininess: 6.0 });
        const matRoca = new BasicMaterial({ color: [0.55, 0.56, 0.58, 1.0], shininess: 16.0 });

        // 4. Generación determinista del bosque sobre la ladera de la montaña
        const M_Mundo = matrizIdentidad();
        const numArboles = 96;

        for (let i = 0; i < numArboles; i++) {
            // Distribución orgánica determinista mediante funciones trigonométricas
            const u = (i * 0.6180339887) % 1.0;
            const v = (i * 0.3819660113) % 1.0;

            const x = -60.0 + u * 120.0;
            const z = -18.0 - v * 64.0;
            const yBase = calcularAlturaMontana(x, z);

            const escalaBase = 0.85 + ((i * 17) % 10) * 0.06;
            const esPino = (i % 3 !== 0); // 66% pinos/coníferas, 33% queñuales frondosos
            const rotY = (i * 1.37) % (Math.PI * 2);

            if (esPino) {
                // Tronco
                let mTr = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.9 * escalaBase, z));
                mTr = multiplicarMat4(mTr, rotacionY(rotY));
                mTr = multiplicarMat4(mTr, escala(escalaBase, escalaBase, escalaBase));
                const meshTr = new Mesh(geomTronco, matTronco, 'Tronco Pino').setMatrix(mTr);
                this.add(meshTr);

                // Nivel inferior del pino
                let mC1 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 2.1 * escalaBase, z));
                mC1 = multiplicarMat4(mC1, rotacionY(rotY + 0.2));
                mC1 = multiplicarMat4(mC1, escala(escalaBase, escalaBase, escalaBase));
                const meshC1 = new Mesh(geomPino1, (i % 2 === 0 ? matPinoOscuro : matPinoMedio), 'Copa Pino 1').setMatrix(mC1);
                this.add(meshC1);

                // Nivel medio del pino
                let mC2 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 3.3 * escalaBase, z));
                mC2 = multiplicarMat4(mC2, rotacionY(rotY + 0.5));
                mC2 = multiplicarMat4(mC2, escala(escalaBase, escalaBase, escalaBase));
                const meshC2 = new Mesh(geomPino2, (i % 2 === 0 ? matPinoMedio : matPinoClaro), 'Copa Pino 2').setMatrix(mC2);
                this.add(meshC2);

                // Nivel superior del pino
                let mC3 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 4.3 * escalaBase, z));
                mC3 = multiplicarMat4(mC3, rotacionY(rotY + 0.9));
                mC3 = multiplicarMat4(mC3, escala(escalaBase, escalaBase, escalaBase));
                const meshC3 = new Mesh(geomPino3, (i % 2 === 0 ? matPinoClaro : matPinoLima), 'Copa Pino 3').setMatrix(mC3);
                this.add(meshC3);
            } else {
                // Árbol frondoso / Queñual andino
                let mTr = multiplicarMat4(M_Mundo, traslacion(x, yBase + 1.1 * escalaBase, z));
                mTr = multiplicarMat4(mTr, rotacionZ(((i % 5) - 2) * 0.05));
                mTr = multiplicarMat4(mTr, escala(escalaBase * 1.1, escalaBase * 1.2, escalaBase * 1.1));
                const meshTr = new Mesh(geomTronco, matTronco, 'Tronco Queñual').setMatrix(mTr);
                this.add(meshTr);

                // Follaje esférico principal
                let mCp1 = multiplicarMat4(M_Mundo, traslacion(x, yBase + 2.6 * escalaBase, z));
                mCp1 = multiplicarMat4(mCp1, escala(escalaBase * 1.4, escalaBase * 1.2, escalaBase * 1.3));
                const meshCp1 = new Mesh(geomCopa, matQuenual1, 'Follaje Queñual 1').setMatrix(mCp1);
                this.add(meshCp1);

                // Follaje superior desplazado
                let mCp2 = multiplicarMat4(M_Mundo, traslacion(x + 0.4 * escalaBase, yBase + 3.4 * escalaBase, z - 0.2 * escalaBase));
                mCp2 = multiplicarMat4(mCp2, escala(escalaBase * 1.1, escalaBase * 1.0, escalaBase * 1.1));
                const meshCp2 = new Mesh(geomCopa, matQuenual2, 'Follaje Queñual 2').setMatrix(mCp2);
                this.add(meshCp2);
            }
        }

        // 5. Arbustos y matas de pasto ichu dispersos por la ladera
        for (let j = 0; j < 36; j++) {
            const u = (j * 0.4321) % 1.0;
            const v = (j * 0.8765) % 1.0;
            const x = -55.0 + u * 110.0;
            const z = -17.0 - v * 60.0;
            const yBase = calcularAlturaMontana(x, z);
            const s = 0.8 + (j % 4) * 0.25;

            let mArb = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.4 * s, z));
            mArb = multiplicarMat4(mArb, escala(1.4 * s, 0.7 * s, 1.4 * s));
            const meshArb = new Mesh(geomArbusto, matArbusto, 'Arbusto de Ladera').setMatrix(mArb);
            this.add(meshArb);
        }

        // 6. Rocas y peñascos andinos en la ladera
        for (let k = 0; k < 18; k++) {
            const u = (k * 0.6789) % 1.0;
            const v = (k * 0.2345) % 1.0;
            const x = -50.0 + u * 100.0;
            const z = -22.0 - v * 55.0;
            const yBase = calcularAlturaMontana(x, z);
            const s = 1.0 + (k % 5) * 0.4;

            let mRoc = multiplicarMat4(M_Mundo, traslacion(x, yBase + 0.3 * s, z));
            mRoc = multiplicarMat4(mRoc, rotacionY(k * 0.8));
            mRoc = multiplicarMat4(mRoc, escala(1.6 * s, 0.9 * s, 1.2 * s));
            const meshRoc = new Mesh(geomRoca, matRoca, 'Roca de Montaña').setMatrix(mRoc);
            this.add(meshRoc);
        }
    }
}

return { Montana };
})();

// --- js/scenes/Lighting.js ---
modules["js/scenes/Lighting.js"] = (() => {
/**
 * ============================================================================
 * PROYECTO 3D: RECREACIÓN DE LA ESCENA DE INGENIERÍA DE SISTEMAS - UNA PUNO
 * Computación Gráfica 2026-II
 *
 * ARCHIVO: js/scenes/Lighting.js
 * Sistema unificado de fotometría, dispersión atmosférica e iluminación
 * arquitectónica para el ciclo solar y lunar.
 * ============================================================================
 */

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpVec3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/** Ubicación de las luminarias dicroicas del edificio; el Renderer solo conoce sus datos. */
const focos = [
    { position: [-5.7, 3.92, 2.25], radius: 7.5 },
    { position: [-4.5, 3.92, 2.25], radius: 7.5 },
    { position: [-3.3, 3.92, 2.25], radius: 7.5 },
    { position: [-0.20, 7.70, 0.35], radius: 8.5 },
    { position: [0.85, 7.70, 0.35], radius: 8.5 },
    { position: [1.90, 7.70, 0.35], radius: 8.5 },
    { position: [0.80, 14.10, 0.50], radius: 9.0 }
];

/**
 * Calcula con base física la iluminación solar, lunar, atmosférica y artificial.
 *
 * Fases del ciclo solar según ángulo en radianes:
 * - PI * 0.5 = Mediodía (Sol en el cenit, luz blanca-dorada brillante, sombras cortas)
 * - PI = Atardecer / Ocaso (Hora dorada, dispersión de Rayleigh, tonos ámbar-rojizos)
 * - PI * 1.5 = Medianoche (Luna en el cenit, luz plateada fría, sutiles brillos)
 * - 0 o 2*PI = Amanecer (Luz cálida matinal)
 *
 * @param {number} angulo - Ángulo orbital solar en radianes [0, 2*PI]
 * @param {Object} [centroOrbita={x:0, y:3, z:-18}] - Centro de la trayectoria elíptica
 * @param {number} [radioOrbita=94.0] - Radio orbital de los astros
 * @returns {Object} Iluminación completa: { sunDirection, sunColor, ambientColor, background, pointLights, datosSol, datosLuna }
 */
function calcularIluminacionCeleste(angulo, centroOrbita = { x: 0, y: 3, z: -18 }, radioOrbita = 94.0) {
    // 1. Coordenadas orbitales del Sol
    const solX = centroOrbita.x + Math.cos(angulo) * radioOrbita;
    const solY = centroOrbita.y + Math.sin(angulo) * radioOrbita;
    const solZ = centroOrbita.z + Math.sin(angulo * 0.5) * 16.0;

    // 2. Coordenadas orbitales de la Luna (opuesta diametralmente a 180° / PI)
    const angLuna = angulo + Math.PI;
    const lunaX = centroOrbita.x + Math.cos(angLuna) * radioOrbita;
    const lunaY = centroOrbita.y + Math.sin(angLuna) * radioOrbita;
    const lunaZ = centroOrbita.z + Math.sin(angLuna * 0.5) * 16.0;

    // Altura trigonométrica relativa de los astros (-1 a +1)
    const sinSol = Math.sin(angulo);
    const sinLuna = -sinSol;

    // 3. FACTORES DE TRANSICIÓN ATMOSFÉRICA
    // Factor de día pleno: 1.0 (mediodía), 0.0 (noche)
    const factorDia = clamp((sinSol + 0.10) / 0.60, 0.0, 1.0);

    // Factor de hora dorada / ocaso (pico cuando el sol toca la línea del horizonte)
    const factorOcaso = Math.max(0.0, 1.0 - Math.abs(sinSol) * 3.8);

    // Factor nocturno: 1.0 (luna alta en medianoche), 0.0 (día pleno)
    const factorNoche = clamp((sinLuna + 0.10) / 0.60, 0.0, 1.0);

    // Extinción atmosférica al acercarse al horizonte (impide luz desde el subsuelo)
    const atenuacionHorizonteSol = clamp(solY / 10.0, 0.0, 1.0);
    const atenuacionHorizonteLuna = clamp(lunaY / 10.0, 0.0, 1.0);

    // 4. COLOR DE LA BÓVEDA CELESTE (Background)
    // Cielo diurno: azul límpido de alta montaña (altitud Altiplano Puno ~3820 msnm)
    const cieloDiaCenit = [0.38, 0.60, 0.88, 1.0];
    const cieloDiaMedio = [0.50, 0.70, 0.92, 1.0];
    const cieloDia = lerpVec3(cieloDiaMedio, cieloDiaCenit, clamp(sinSol, 0.0, 1.0));

    // Crepúsculo: dispersión cromática con horizonte ámbar/salmón
    const cieloOcaso = [0.86, 0.46, 0.28, 1.0];
    // Hora azul (blue hour) intermedia entre el ocaso y la noche cerrada
    const cieloHoraAzul = [0.08, 0.12, 0.24, 1.0];
    // Noche estrellada: azul índigo luminoso (no negro cerrado, para visibilidad clara)
    const cieloNoche = [0.06, 0.09, 0.18, 1.0];

    let cieloActual = lerpVec3(cieloNoche, cieloDia, factorDia);
    if (factorOcaso > 0.01) {
        cieloActual = lerpVec3(cieloActual, cieloOcaso, factorOcaso * 0.78);
    } else if (sinSol < 0.05 && sinSol > -0.25) {
        const factorHoraAzul = clamp((0.05 - sinSol) / 0.30, 0.0, 1.0);
        cieloActual = lerpVec3(cieloActual, cieloHoraAzul, factorHoraAzul * 0.55);
    }
    const background = [cieloActual[0], cieloActual[1], cieloActual[2], 1.0];

    // 5. VECTOR DIRECCIONAL Y COLOR DE LA LUZ PRINCIPAL (Sol / Luna)
    let dirLuz;
    let colorLuzActual;

    const lenSol = Math.hypot(solX, solY, solZ) || 1.0;
    const dirHaciaSol = [-solX / lenSol, -solY / lenSol, -solZ / lenSol];

    const lenLuna = Math.hypot(lunaX, lunaY, lunaZ) || 1.0;
    const dirHaciaLuna = [-lunaX / lenLuna, -lunaY / lenLuna, -lunaZ / lenLuna];

    // Curvas cromáticas solares (luz potente con marcado contraste y sombras definidas)
    const luzSolCenit = [1.25, 1.20, 1.12]; // Blanco dorado radiante
    const luzSolDia = [1.12, 1.06, 0.98];   // Luz diurna directa nítida
    const luzSolOcaso = [1.18, 0.60, 0.22]; // Ámbar dorado crepuscular

    // Curvas cromáticas lunares (luz clara azul-plata que no deja la escena a oscuras)
    const luzLunaCenit = [0.42, 0.50, 0.65]; // Luz de luna llena clara y envolvente
    const luzLunaBaja = [0.28, 0.35, 0.48];

    if (sinSol >= -0.05) {
        // Sol como astro director
        dirLuz = dirHaciaSol;
        let colorSol = lerpVec3(luzSolOcaso, luzSolDia, clamp(sinSol / 0.5, 0.0, 1.0));
        colorSol = lerpVec3(colorSol, luzSolCenit, clamp((sinSol - 0.5) / 0.5, 0.0, 1.0));
        if (factorOcaso > 0.01) {
            colorSol = lerpVec3(colorSol, luzSolOcaso, factorOcaso * 0.85);
        }
        const intens = atenuacionHorizonteSol;
        colorLuzActual = [colorSol[0] * intens, colorSol[1] * intens, colorSol[2] * intens];
    } else {
        // Luna como astro director nocturno
        dirLuz = dirHaciaLuna;
        const colorLuna = lerpVec3(luzLunaBaja, luzLunaCenit, clamp(sinLuna, 0.0, 1.0));
        const intens = atenuacionHorizonteLuna;
        colorLuzActual = [colorLuna[0] * intens, colorLuna[1] * intens, colorLuna[2] * intens];
    }

    // 6. LUZ AMBIENTAL HEMISFÉRICA
    // De día: ambiente azulado que contrasta con la luz dorada solar
    const ambientDia = [0.32, 0.36, 0.42];
    const ambientOcaso = [0.28, 0.22, 0.20];
    // De noche: ambiente generoso azulino-plateado para que la escena no se vea oscura
    const ambientNoche = [0.20, 0.24, 0.32];

    let ambientActual = lerpVec3(ambientNoche, ambientDia, factorDia);
    if (factorOcaso > 0.01) {
        ambientActual = lerpVec3(ambientActual, ambientOcaso, factorOcaso * 0.70);
    }

    // Intensidad de sombras: alta de día (sombras solares nítidas), nula/mínima de noche
    const shadowIntensity = factorDia > 0.05 ? clamp((sinSol + 0.05) / 0.35, 0.0, 0.82) : 0.0;

    // 7. LUMINARIAS DICROICAS ARQUITECTÓNICAS
    // Se encienden con tono cálido halógeno de 3000K, destacando sobre el ambiente nocturno
    const intensFocos = lerp(5.0, 0.8, factorDia);

    return {
        sunDirection: dirLuz,
        sunColor: colorLuzActual,
        ambientColor: ambientActual,
        shadowIntensity: shadowIntensity,
        background: background,
        pointLights: focos.map(foco => ({
            ...foco,
            color: [1.0, 0.94, 0.82],
            intensity: intensFocos
        })),
        datosSol: {
            x: solX, y: solY, z: solZ,
            visible: solY > -2.0,
            factorDia,
            factorOcaso,
            atenuacionHorizonte: atenuacionHorizonteSol
        },
        datosLuna: {
            x: lunaX, y: lunaY, z: lunaZ,
            visible: lunaY > -2.0,
            factorNoche,
            atenuacionHorizonte: atenuacionHorizonteLuna
        }
    };
}

/**
 * Actualiza la iluminación de una escena para un modo día o noche discreto.
 * Reutiliza el cálculo fotométrico completo para garantizar consistencia.
 *
 * @param {Object} scene - Objeto Scene de la aplicación
 * @param {boolean} nocturna - True para noche (luna en cenit), false para día (sol en cenit)
 */
function actualizarIluminacion(scene, nocturna) {
    const angulo = nocturna ? Math.PI * 1.5 : Math.PI * 0.5;
    const ilum = calcularIluminacionCeleste(angulo);
    scene.background = ilum.background;
    scene.lighting = {
        sunDirection: ilum.sunDirection,
        sunColor: ilum.sunColor,
        ambientColor: ilum.ambientColor,
        shadowIntensity: ilum.shadowIntensity,
        pointLights: ilum.pointLights
    };
}

return { focos, calcularIluminacionCeleste, actualizarIluminacion };
})();

// --- js/objects/SistemaCeleste.js ---
modules["js/objects/SistemaCeleste.js"] = (() => {
const { Object3D } = modules["js/core/Object3D.js"];
const { Mesh } = modules["js/objects/Mesh.js"];
const { BasicMaterial } = modules["js/materials/BasicMaterial.js"];
const { SphereGeometry } = modules["js/geometries/SphereGeometry.js"];
const { calcularIluminacionCeleste } = modules["js/scenes/Lighting.js"];

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpVec4(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
}

/**
 * Sistema celeste con Sol radiante (textura y corona solar), Luna llena plateada
 * con mares basálticos y campo de estrellas titilantes.
 * Coordina el ciclo diurno-nocturno delegando el cálculo fotométrico a Lighting.js.
 */
class SistemaCeleste extends Object3D {
    constructor(scene, texturas = {}) {
        super('Sistema Celeste');
        this.scene = scene;
        this.radioOrbita = 94.0;
        this.centroOrbita = { x: 0.0, y: 3.0, z: -18.0 };

        // Ángulo solar en radianes:
        // PI * 0.5 = Mediodía (Sol en el cenit)
        // PI = Atardecer / Ocaso (Sol en el horizonte oeste)
        // PI * 1.5 = Medianoche (Luna en el cenit)
        // 0 o 2*PI = Amanecer (Sol en el horizonte este)
        this.angulo = Math.PI * 0.5;
        this.anguloObjetivo = Math.PI * 0.5;
        this.autoCiclo = true;
        this.velocidadCiclo = 0.085; // Un ciclo completo dura aprox. 74 segundos

        // 1. Sol 3D con textura de plasma incandescente y halo radiante
        const geomSol = new SphereGeometry(3.8, 18, 22);
        const matSol = new BasicMaterial({
            texture: texturas?.sol || null,
            color: [1.0, 0.98, 0.88, 1.0],
            emissive: true
        });
        this.meshSol = new Mesh(geomSol, matSol, 'Sol');
        this.add(this.meshSol);

        const geomHaloSol = new SphereGeometry(6.2, 14, 18);
        const matHaloSol = new BasicMaterial({
            color: [1.0, 0.88, 0.38, 0.32],
            emissive: true,
            depthWrite: false
        });
        this.meshHaloSol = new Mesh(geomHaloSol, matHaloSol, 'Halo Solar');
        this.add(this.meshHaloSol);

        // 2. Luna 3D con textura procedimental y halo plateado etéreo
        const geomLuna = new SphereGeometry(2.8, 18, 22);
        const matLuna = new BasicMaterial({
            texture: texturas?.luna || null,
            color: [0.96, 0.98, 1.0, 1.0],
            emissive: true
        });
        this.meshLuna = new Mesh(geomLuna, matLuna, 'Luna');
        this.add(this.meshLuna);

        const geomHaloLuna = new SphereGeometry(4.4, 14, 18);
        const matHaloLuna = new BasicMaterial({
            color: [0.65, 0.80, 1.0, 0.28],
            emissive: true,
            depthWrite: false
        });
        this.meshHaloLuna = new Mesh(geomHaloLuna, matHaloLuna, 'Halo Lunar');
        this.add(this.meshHaloLuna);

        // 3. Campo de estrellas titilantes en el firmamento nocturno
        this.estrellas = [];
        const geomEstrella = new SphereGeometry(0.32, 6, 8);
        const matEstrella = new BasicMaterial({
            color: [0.96, 0.98, 1.0, 1.0],
            emissive: true
        });

        const numEstrellas = 110;
        for (let i = 0; i < numEstrellas; i++) {
            const theta = (i * 0.618033) * Math.PI * 2.0;
            const phi = 0.12 + ((i * 0.381966) % 1.0) * (Math.PI * 0.44); // Hemisferio superior
            const r = 98.0 + (i % 6) * 1.8;

            const xs = this.centroOrbita.x + r * Math.sin(phi) * Math.cos(theta);
            const ys = this.centroOrbita.y + r * Math.cos(phi);
            const zs = this.centroOrbita.z + r * Math.sin(phi) * Math.sin(theta);

            const meshEstrella = new Mesh(geomEstrella, matEstrella, 'Estrella');
            meshEstrella.position = { x: xs, y: ys, z: zs };
            this.add(meshEstrella);
            this.estrellas.push({
                mesh: meshEstrella,
                fase: i * 0.72,
                escalaBase: 0.8 + ((i * 13) % 10) * 0.05
            });
        }

        // Actualizar posiciones e iluminación inicial
        this.actualizarTransformaciones(0);
    }

    /**
     * Alterna suavemente entre Modo Día y Modo Noche (activado por tecla L o botón UI).
     */
    alternarModo(luzNocturna) {
        if (luzNocturna) {
            this.autoCiclo = false;
            this.anguloObjetivo = Math.PI * 1.5; // Noche (Luna en cenit)
        } else {
            this.autoCiclo = false;
            this.anguloObjetivo = Math.PI * 0.5; // Día (Sol en cenit)
        }
    }

    /**
     * Alterna la rotación continua automática del ciclo día/noche.
     */
    alternarAutoCiclo() {
        this.autoCiclo = !this.autoCiclo;
    }

    update(dt) {
        if (this.autoCiclo) {
            this.angulo += this.velocidadCiclo * dt;
            if (this.angulo > Math.PI * 2) this.angulo -= Math.PI * 2;
            this.anguloObjetivo = this.angulo;
        } else {
            // Interpolación suave hacia el objetivo seleccionado
            let diff = this.anguloObjetivo - this.angulo;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            this.angulo += diff * (1.0 - Math.exp(-3.5 * dt));
        }

        // Rotación axial suave de los astros para mayor dinamismo
        this.meshSol.rotation.y += 0.06 * dt;
        this.meshLuna.rotation.y += 0.03 * dt;

        this.actualizarTransformaciones(dt);
    }

    actualizarTransformaciones(dt = 0) {
        // Cálculo fotométrico centralizado en Lighting.js
        const ilum = calcularIluminacionCeleste(this.angulo, this.centroOrbita, this.radioOrbita);

        // 1. Posicionamiento y corona del Sol
        const solPos = { x: ilum.datosSol.x, y: ilum.datosSol.y, z: ilum.datosSol.z };
        this.meshSol.position = solPos;
        this.meshHaloSol.position = solPos;
        this.meshSol.visible = ilum.datosSol.visible;
        this.meshHaloSol.visible = ilum.datosSol.visible;

        // El halo solar se expande y se tiñe de ámbar rojizo en la hora dorada (atardecer/amanecer)
        const factorOcaso = ilum.datosSol.factorOcaso;
        const escalaHaloSol = 1.0 + factorOcaso * 0.45;
        this.meshHaloSol.scale = { x: escalaHaloSol, y: escalaHaloSol, z: escalaHaloSol };
        const colorHaloDia = [1.0, 0.88, 0.38, 0.32];
        const colorHaloOcaso = [1.0, 0.50, 0.18, 0.52];
        this.meshHaloSol.material.color = lerpVec4(colorHaloDia, colorHaloOcaso, factorOcaso);

        // 2. Posicionamiento y corona de la Luna
        const lunaPos = { x: ilum.datosLuna.x, y: ilum.datosLuna.y, z: ilum.datosLuna.z };
        this.meshLuna.position = lunaPos;
        this.meshHaloLuna.position = lunaPos;
        this.meshLuna.visible = ilum.datosLuna.visible;
        this.meshHaloLuna.visible = ilum.datosLuna.visible;

        // El halo lunar despliega su fulgor plateado al elevarse en la noche
        const escalaHaloLuna = 1.0 + ilum.datosLuna.factorNoche * 0.22;
        this.meshHaloLuna.scale = { x: escalaHaloLuna, y: escalaHaloLuna, z: escalaHaloLuna };

        // 3. Estrellas titilantes en el firmamento
        const visibilidadEstrellas = 1.0 - ilum.datosSol.factorDia;
        for (let i = 0; i < this.estrellas.length; i++) {
            const e = this.estrellas[i];
            const titileo = 0.82 + 0.18 * Math.sin(this.angulo * 7.0 + e.fase);
            const s = visibilidadEstrellas * titileo * e.escalaBase;
            e.mesh.scale = { x: s, y: s, z: s };
            e.mesh.visible = s > 0.04;
        }

        // 4. Actualización del fondo y de la iluminación en la escena
        this.scene.background = ilum.background;
        this.scene.lighting = {
            sunDirection: ilum.sunDirection,
            sunColor: ilum.sunColor,
            ambientColor: ilum.ambientColor,
            shadowIntensity: ilum.shadowIntensity,
            pointLights: ilum.pointLights
        };
    }
}

return { SistemaCeleste };
})();

// --- js/utils/TextureLoader.js ---
modules["js/utils/TextureLoader.js"] = (() => {
/** Carga Canvas 2D como textura WebGL, con filtrado y mipmaps. */
class TextureLoader {
    constructor(gl) { this.gl = gl; }
    fromCanvas(canvas) {
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            canvas
        );

        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        return tex;
    }
}

return { TextureLoader };
})();

// --- js/textures/BuildingTextures.js ---
modules["js/textures/BuildingTextures.js"] = (() => {
const { TextureLoader } = modules["js/utils/TextureLoader.js"];

/**
 * ============================================================================
 * PROYECTO 3D: RECREACIÓN DE LA ESCENA DE INGENIERÍA DE SISTEMAS - UNA PUNO
 * Computación Gráfica 2026-II
 * Estudiante: Condori Churata Dino Jhoel (Cód. 236262)
 * 
 * ARCHIVO: js/textures/BuildingTextures.js
 * Generador procedimental de texturas de alta resolución (Canvas 2D)
 * Reproducción fidedigna de FacultadLadoFrontal1.jpeg y FacultadLadoDerecho.jpeg
 * ============================================================================
 */

function crearCanvasAuxiliar(ancho = 512, alto = 512) {
    const c = document.createElement("canvas");
    c.width = ancho;
    c.height = alto;
    return c;
}

function subirCanvasATextura(gl, canvas) {
    return new TextureLoader(gl).fromCanvas(canvas);
}

// ----------------------------------------------------------------------------
// 1. MURO CORTINA DE VIDRIO AZUL (Con reflejos de nubes y ventanas proyectantes)
// ----------------------------------------------------------------------------
function generarTexturaVidrioAzul(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Cielo azul de Puno reflejado con degradado realista
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0.0, "#0f284a");
    grad.addColorStop(0.25, "#1b4a80");
    grad.addColorStop(0.55, "#2d6fb3");
    grad.addColorStop(0.85, "#4e96d8");
    grad.addColorStop(1.0, "#7ab9ed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Reflejo realista de nubes blancas algodonosas (como en FacultadLadoFrontal1.jpeg)
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(550, 420, 380, 160, -0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.ellipse(680, 500, 260, 110, -0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.ellipse(380, 320, 240, 90, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cuadrícula de perfiles de aluminio estructural oscuro
    const filas = 8;
    const cols = 4;
    const dy = 1024 / filas;
    const dx = 1024 / cols;

    // Perfiles estructurales principales
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#161d24";
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, 1024);
        ctx.stroke();
    }
    for (let j = 0; j <= filas; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(1024, j * dy);
        ctx.stroke();
    }

    // Huecos de vano de las ventanas proyectantes (con interior de oficina)
    // Fila 2 (pisos superiores) y Fila 4 (pisos medios)
    function dibujarHuecoVentana(colIdx, filaIdx) {
        const x = colIdx * dx + 16;
        const y = filaIdx * dy + 16;
        const w = dx - 32;
        const h = dy - 32;

        // Interior oscuro de aula / oficina
        ctx.fillStyle = "#0a0f16";
        ctx.fillRect(x, y, w, h);

        // Luz interior tenue de oficina
        ctx.fillStyle = "rgba(254, 240, 138, 0.20)";
        ctx.fillRect(x + 12, y + 12, w - 24, 18);

        // Marco perimetral fijo de aluminio oscuro
        ctx.strokeStyle = "#161d24";
        ctx.lineWidth = 8;
        ctx.strokeRect(x, y, w, h);

        ctx.strokeStyle = "#2e3b48";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    }

    // Preparar los vanos de las 4 ventanas proyectantes que se abren en 3D:
    dibujarHuecoVentana(1, 2); // Fila superior izquierda
    dibujarHuecoVentana(2, 2); // Fila superior derecha
    dibujarHuecoVentana(1, 4); // Fila media izquierda
    dibujarHuecoVentana(2, 4); // Fila media derecha

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 2. PIEDRA LAJA / CANTERÍA GRIS DEL PÓRTICO ARQUITECTÓNICO
// ----------------------------------------------------------------------------
function generarTexturaPiedraLaja(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Fondo gris base
    ctx.fillStyle = "#5c6065";
    ctx.fillRect(0, 0, 1024, 1024);

    // Bloques de piedra laja rectangulares en aparejo trabado con variaciones
    const tonosPiedra = [
        "#6b7076", "#55595e", "#787d83", "#62676d",
        "#4b4f53", "#71767c", "#585c62", "#80858b",
        "#43474b", "#686c72", "#5e6369", "#757a80"
    ];

    const filas = 24;
    const altoFila = 1024 / filas;

    for (let f = 0; f < filas; f++) {
        let x = (f % 2 === 0) ? 0 : -60;
        const y = f * altoFila;

        while (x < 1024) {
            const seed = Math.sin(f * 37.1 + x * 0.13);
            const anchoBloque = 60 + Math.floor(Math.abs(seed) * 90);

            const colorIdx = Math.floor(Math.abs(Math.sin(f * 17.5 + x * 0.23)) * tonosPiedra.length);
            ctx.fillStyle = tonosPiedra[colorIdx];
            ctx.fillRect(x + 2, y + 2, anchoBloque - 4, altoFila - 4);

            // Relieve sutil y textura porosa de la piedra
            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
            for (let k = 0; k < 12; k++) {
                const rx = x + 4 + ((k * 31) % (anchoBloque - 8));
                const ry = y + 4 + ((k * 19) % (altoFila - 8));
                ctx.fillRect(rx, ry, 6, 3);
            }

            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(x + 2, y + 2, anchoBloque - 4, 3);

            x += anchoBloque;
        }
    }

    // Juntas de mortero oscuro
    ctx.strokeStyle = "#2b2e31";
    ctx.lineWidth = 3;
    for (let f = 0; f <= filas; f++) {
        ctx.beginPath();
        ctx.moveTo(0, f * altoFila);
        ctx.lineTo(1024, f * altoFila);
        ctx.stroke();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 3. ATRIO VIDRIADO CON LETRAS 3D ILUMINADAS (Entrada Principal)
// ----------------------------------------------------------------------------
function generarTexturaLetreroEntrada(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Vidrio oscuro reflectante del atrio
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, 1024, 512);

    // Reflejo sutil de cielo nublado
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, "rgba(50, 75, 110, 0.25)");
    grad.addColorStop(0.5, "rgba(20, 30, 45, 0.15)");
    grad.addColorStop(1.0, "rgba(10, 15, 25, 0.35)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 1. Escudo/Logotipo de Sistemas iluminado (engranaje y computador)
    ctx.save();
    ctx.translate(512, 130);
    // Resplandor exterior (glow)
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;

    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 7;
    ctx.strokeRect(-45, -45, 90, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IS", 0, 0);
    ctx.restore();

    // 2. Texto iluminado: ESCUELA PROFESIONAL (idéntico a FacultadLadoFrontal1.jpeg)
    ctx.save();
    ctx.shadowColor = "#e0f2fe";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#f0f9ff";
    ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("ESCUELA PROFESIONAL", 512, 255);

    // 3. Texto iluminado gigante: INGENIERIA DE SISTEMAS
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 46px 'Segoe UI', Arial, sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("INGENIERIA DE SISTEMAS", 512, 320);
    ctx.restore();

    // Perfiles metálicos de las puertas vidriadas inferiores
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 6;
    ctx.strokeRect(320, 380, 192, 132);
    ctx.strokeRect(512, 380, 192, 132);

    // Tiradores/manijas verticales cromadas
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(495, 410, 8, 80);
    ctx.fillRect(521, 410, 8, 80);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 4. CIELO / SOFFIT CON 3 DICROICOS ENCENDIDOS (LUCES CIRCULARES EMPOTRADAS)
// ----------------------------------------------------------------------------
function generarTexturaSoffitLuces(gl) {
    const c = crearCanvasAuxiliar(512, 128);
    const ctx = c.getContext("2d");

    // Fondo gris oscuro del alero/techo
    ctx.fillStyle = "#1e242b";
    ctx.fillRect(0, 0, 512, 128);

    // 3 focos dicroicos empotrados circulares con halo cálido
    const posicionesX = [100, 256, 412];
    for (let x of posicionesX) {
        // Resplandor cálido exterior
        const haloGrad = ctx.createRadialGradient(x, 64, 4, x, 64, 48);
        haloGrad.addColorStop(0.0, "rgba(255, 250, 220, 1.0)");
        haloGrad.addColorStop(0.3, "rgba(254, 240, 138, 0.85)");
        haloGrad.addColorStop(0.7, "rgba(250, 204, 21, 0.35)");
        haloGrad.addColorStop(1.0, "rgba(250, 204, 21, 0.0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(x, 64, 48, 0, Math.PI * 2);
        ctx.fill();

        // Anillo biselado metálico
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, 64, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Centro brillante del foco emisor
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, 64, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 5. BANNER SUPERIOR: INTELIGENCIA ARTIFICIAL Y CIENCIA DE DATOS
// ----------------------------------------------------------------------------
function generarTexturaBannerIA(gl) {
    const c = crearCanvasAuxiliar(1024, 256);
    const ctx = c.getContext("2d");

    // Fondo blanco nítido
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 256);

    // Marco azul institucional
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 1012, 244);

    // Logotipo AI estilizado a la izquierda
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "900 68px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI", 110, 150);

    // Texto superior
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS", 580, 80);

    // Texto central gigante
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 40px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("INTELIGENCIA ARTIFICIAL Y CIENCIA DE DATOS", 580, 145);

    // Subtexto inferior
    ctx.fillStyle = "#475569";
    ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("FACULTAD DE INGENIERÍA ESTADÍSTICA E INFORMÁTICA - UNA PUNO", 580, 200);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 6. LETRERO TÓTEM VERDE INSTITUCIONAL (Jardín / Acceso)
// ----------------------------------------------------------------------------
function generarTexturaLetreroFrontal(gl) {
    const c = crearCanvasAuxiliar(512, 256);
    const ctx = c.getContext("2d");

    // Fondo verde institucional
    ctx.fillStyle = "#1b4d2e";
    ctx.fillRect(0, 0, 512, 256);

    // Doble marco dorado
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#d4af37";
    ctx.strokeRect(8, 8, 496, 240);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fef08a";
    ctx.strokeRect(16, 16, 480, 224);

    // Escudo/Logo UNA PUNO & SISTEMAS
    ctx.save();
    ctx.translate(256, 75);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1b4d2e";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#facc15";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IS", 0, 0);
    ctx.restore();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ESCUELA PROFESIONAL DE", 256, 140);

    ctx.fillStyle = "#facc15";
    ctx.font = "900 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("INGENIERÍA DE SISTEMAS", 256, 175);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("UNA - PUNO", 256, 210);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 7. CELOSÍA Y PARASOLES HORIZONTALES (Fachada de FacultadLadoDerecho.jpeg)
// ----------------------------------------------------------------------------
function generarTexturaParasoles(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Vidrio azul oscuro de fondo
    const gradVidrio = ctx.createLinearGradient(0, 0, 512, 512);
    gradVidrio.addColorStop(0, "#122a42");
    gradVidrio.addColorStop(1, "#1c3c5a");
    ctx.fillStyle = gradVidrio;
    ctx.fillRect(0, 0, 512, 512);

    // Lamas o celosías horizontales de aluminio plateado (brise-soleil)
    const lamas = 18;
    const h = 512 / lamas;

    for (let i = 0; i < lamas; i++) {
        const y = i * h + 3;
        // Cuerpo metálico
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(0, y, 512, h * 0.4);

        // Borde superior cromado brillante
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, y, 512, 2);

        // Sombra inferior
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, y + h * 0.4 - 2, 512, 2);
    }

    // Perfiles estructurales verticales
    ctx.fillStyle = "#475569";
    ctx.fillRect(160, 0, 8, 512);
    ctx.fillRect(340, 0, 8, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 8. ALUCOBOND GRIS OSCURO (Estructura y marcos de fachada moderna)
// ----------------------------------------------------------------------------
function generarTexturaAlucobond(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#33383f";
    ctx.fillRect(0, 0, 512, 512);

    // Modulación de paneles con juntas ranuradas
    ctx.strokeStyle = "#1d2125";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);
    ctx.strokeRect(256, 0, 256, 256);
    ctx.strokeRect(0, 256, 256, 256);
    ctx.strokeRect(256, 256, 256, 256);

    // Brillo metálico sutil
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.0)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.03)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 9. HORMIGÓN BLANCO / FACHADA POSTERIOR
// ----------------------------------------------------------------------------
function generarTexturaHormigonBlanco(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, 512, 512);

    // Textura de enlucido fino
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 10. PUERTA ENROLLABLE METÁLICA (Garaje / Almacén)
// ----------------------------------------------------------------------------
function generarTexturaPuertaMetal(gl) {
    const c = crearCanvasAuxiliar(256, 256);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 0, 256, 256);

    const ranuras = 32;
    const step = 256 / ranuras;
    for (let i = 0; i < ranuras; i++) {
        ctx.fillStyle = "#64748b";
        ctx.fillRect(0, i * step, 256, step * 0.45);

        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(0, i * step + step * 0.45, 256, step * 0.55);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 11. ASFALTO CON REJILLA DE DRENAJE Y SARDINEL AMARILLO
// ----------------------------------------------------------------------------
function generarTexturaAsfalto(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Asfalto gris oscuro
    ctx.fillStyle = "#272a2e";
    ctx.fillRect(0, 0, 1024, 1024);

    // Textura rugosa de calzada
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < 5000; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    // Rejilla de drenaje pluvial longitudinal (visible en FacultadLadoDerecho.jpeg)
    ctx.fillStyle = "#1e2124";
    ctx.fillRect(0, 920, 1024, 40);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    for (let x = 0; x < 1024; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 920);
        ctx.lineTo(x, 960);
        ctx.stroke();
    }

    // Sardinel amarillo de seguridad al borde de la acera
    ctx.fillStyle = "#eab308";
    ctx.fillRect(0, 960, 1024, 64);

    ctx.strokeStyle = "#a16207";
    ctx.lineWidth = 3;
    for (let x = 0; x < 1024; x += 96) {
        ctx.beginPath();
        ctx.moveTo(x, 960);
        ctx.lineTo(x, 1024);
        ctx.stroke();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 12. VENTANA DE OFICINA CON ILUMINACIÓN INTERIOR (Planta Baja Derecha)
// ----------------------------------------------------------------------------
function generarTexturaVentanaOficina(gl) {
    const c = crearCanvasAuxiliar(512, 256);
    const ctx = c.getContext("2d");

    // Interior iluminado con luz cálida fluorescente (como en FacultadLadoDerecho.jpeg)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    // Luces interiores de oficina encendidas
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(80, 40, 80, 12);
    ctx.fillRect(240, 40, 80, 12);
    ctx.fillRect(380, 40, 80, 12);

    // Malla de seguridad y perfiles oscuros
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 512, 256);
    ctx.strokeRect(170, 0, 172, 256);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 13. VENTANAS CELESTES / VIDRIO REFLECTANTE SUPERIOR (Piso 4 - Centro)
// Visible entre el letrero superior y la pared gris de piedra laja
// ----------------------------------------------------------------------------
function generarTexturaVentanasCelestes(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Cielo celeste andino reflejado con degradado brillante y vívido
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, "#0369a1");
    grad.addColorStop(0.3, "#0284c7");
    grad.addColorStop(0.65, "#38bdf8");
    grad.addColorStop(1.0, "#7dd3fc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Reflejo suave de nubes blancas en el vidrio superior
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.40)";
    ctx.beginPath();
    ctx.ellipse(320, 180, 260, 90, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.30)";
    ctx.beginPath();
    ctx.ellipse(750, 220, 220, 80, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cuadrícula de perfiles estructurales de aluminio negro/antracita
    const cols = 6;
    const filas = 3;
    const dx = 1024 / cols;
    const dy = 512 / filas;

    ctx.strokeStyle = "#161d24";
    ctx.lineWidth = 10;
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, 512);
        ctx.stroke();
    }
    for (let j = 0; j <= filas; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(1024, j * dy);
        ctx.stroke();
    }

    // Perfiles perimetrales exteriores gruesos
    ctx.lineWidth = 16;
    ctx.strokeRect(0, 0, 1024, 512);

    // Brillo diagonal especular sobre los cristales
    const shine = ctx.createLinearGradient(0, 0, 1024, 512);
    shine.addColorStop(0.0, "rgba(255, 255, 255, 0.15)");
    shine.addColorStop(0.4, "rgba(255, 255, 255, 0.0)");
    shine.addColorStop(0.7, "rgba(255, 255, 255, 0.20)");
    shine.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, 1024, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 14. LOSAS DE AZOTEA Y PISO TÉCNICO
// ----------------------------------------------------------------------------
function generarTexturaAzotea(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Base de baldosas de hormigón impermeable
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 0, 512, 512);

    // Cuadrícula de juntas de dilatación de brea negra
    const n = 8;
    const s = 512 / n;
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    for (let i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s, 0);
        ctx.lineTo(i * s, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * s);
        ctx.lineTo(512, i * s);
        ctx.stroke();
    }

    // Variaciones sutiles de tono en cada baldosa
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const seed = Math.sin(i * 12.3 + j * 45.6);
            if (seed > 0.2) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
                ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
            } else if (seed < -0.2) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
                ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
            }
        }
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 15. FACHADA POSTERIOR CON VENTANAS DE AULAS MODULARES
// ----------------------------------------------------------------------------
function generarTexturaFachadaPosterior(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Hormigón blanco / gris claro de fondo
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 1024, 512);

    // Ventanas de aulas en 3 niveles
    const niveles = 3;
    const ventanasPorNivel = 6;
    const dy = 512 / niveles;
    const dx = 1024 / ventanasPorNivel;

    for (let n = 0; n < niveles; n++) {
        const yTop = n * dy + 32;
        const hVentana = dy - 64;

        for (let v = 0; v < ventanasPorNivel; v++) {
            const xLeft = v * dx + 24;
            const wVentana = dx - 48;

            // Cristal oscuro azulado reflectante
            const gradV = ctx.createLinearGradient(xLeft, yTop, xLeft, yTop + hVentana);
            gradV.addColorStop(0, "#0f2338");
            gradV.addColorStop(1, "#1e3a5f");
            ctx.fillStyle = gradV;
            ctx.fillRect(xLeft, yTop, wVentana, hVentana);

            // Marcos de aluminio oscuro
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 5;
            ctx.strokeRect(xLeft, yTop, wVentana, hVentana);

            // División central de la ventana corrediza
            ctx.beginPath();
            ctx.moveTo(xLeft + wVentana / 2, yTop);
            ctx.lineTo(xLeft + wVentana / 2, yTop + hVentana);
            ctx.stroke();

            // Reflejo blanco en el vidrio
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fillRect(xLeft + 4, yTop + 4, wVentana * 0.45, hVentana - 8);
        }

        // Viga dintel entre pisos
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(0, n * dy + dy - 12, 1024, 12);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 16. LETRERO INSTITUCIONAL: SÓTANO Y COCHERA (Acceso Derecho)
// ----------------------------------------------------------------------------
function generarTexturaLetreroCochera(gl) {
    const c = crearCanvasAuxiliar(512, 128);
    const ctx = c.getContext("2d");

    // Fondo azul marino institucional
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 128);

    // Borde cian luminoso
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);

    // Texto superior
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("FACULTAD DE INGENIERÍA", 256, 36);

    // Texto principal
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("SÓTANO • COCHERA", 256, 75);

    // Subtexto inferior
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("ACCESO VEHICULAR Y LABORATORIOS", 256, 106);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 17. CÉSPED Y RELIEVE NATURAL DE LA MONTAÑA ANDINA (Pasto altiplánico y rocas)
// ----------------------------------------------------------------------------
function generarTexturaCespedMontana(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Fondo base verde montaña andina
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0.0, "#23471b");
    grad.addColorStop(0.5, "#315d26");
    grad.addColorStop(1.0, "#2a5220");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Manchas orgánicas de vegetación y tierra fértil
    const colores = ["#1a3813", "#3d7330", "#4d873d", "#5b9948", "#423b28", "#594d36"];
    for (let i = 0; i < 90; i++) {
        const x = (Math.sin(i * 12.3) * 0.5 + 0.5) * 512;
        const y = (Math.cos(i * 17.7) * 0.5 + 0.5) * 512;
        const r = 25 + (i % 7) * 9;
        ctx.fillStyle = colores[i % colores.length];
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.4, r * 0.8, (i * 0.4), 0, Math.PI * 2);
        ctx.fill();
    }

    // Pinceladas de pasto / briznas de hierba silvestre
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 1800; i++) {
        const px = (i * 73) % 512;
        const py = (i * 137) % 512;
        ctx.fillStyle = (i % 2 === 0) ? "#65aa4e" : "#1e4016";
        ctx.fillRect(px, py, 2, 4 + (i % 5));
    }
    ctx.globalAlpha = 1.0;

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 18. CORTEZA DE ÁRBOL (Troncos de pino y queñuales del bosque)
// ----------------------------------------------------------------------------
function generarTexturaCorteza(gl) {
    const c = crearCanvasAuxiliar(256, 256);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#3a2213";
    ctx.fillRect(0, 0, 256, 256);

    const tonos = ["#26150b", "#4a2c19", "#5b3720", "#1f1008"];
    for (let i = 0; i < 60; i++) {
        const x = (i * 4.3) % 256;
        ctx.fillStyle = tonos[i % tonos.length];
        ctx.globalAlpha = 0.4 + (i % 4) * 0.15;
        ctx.fillRect(x, 0, 3 + (i % 5), 256);
    }
    ctx.globalAlpha = 1.0;

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 19. SUPERFICIE LUNAR (Mares basálticos y cráteres plateados)
// ----------------------------------------------------------------------------
function generarTexturaLuna(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Base plateada / perla lunar
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 512, 512);

    // Mares lunares (zonas basálticas oscuras)
    const mares = [
        { x: 180, y: 190, rx: 90, ry: 70, rot: 0.2 },
        { x: 310, y: 220, rx: 110, ry: 85, rot: -0.3 },
        { x: 230, y: 330, rx: 80, ry: 60, rot: 0.5 },
        { x: 370, y: 340, rx: 70, ry: 50, rot: -0.1 }
    ];
    mares.forEach(m => {
        const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx);
        grad.addColorStop(0.0, "rgba(100, 116, 139, 0.75)");
        grad.addColorStop(0.7, "rgba(148, 163, 184, 0.45)");
        grad.addColorStop(1.0, "rgba(226, 232, 240, 0.0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(m.x, m.y, m.rx, m.ry, m.rot, 0, Math.PI * 2);
        ctx.fill();
    });

    // Cráteres de impacto con reborde blanco brillante
    const crateres = [
        { x: 120, y: 130, r: 18 }, { x: 390, y: 150, r: 24 },
        { x: 270, y: 260, r: 14 }, { x: 160, y: 390, r: 20 },
        { x: 320, y: 410, r: 16 }, { x: 240, y: 120, r: 12 }
    ];
    crateres.forEach(cr => {
        // Sombra interna del cráter
        ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
        ctx.beginPath();
        ctx.arc(cr.x, cr.y, cr.r, 0, Math.PI * 2);
        ctx.fill();
        // Borde iluminado
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cr.x - 1, cr.y - 1, cr.r, Math.PI * 0.75, Math.PI * 1.75);
        ctx.stroke();
    });

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 20. SUPERFICIE SOLAR (Cromosfera incandescente, gránulos y limbo solar)
// ----------------------------------------------------------------------------
function generarTexturaSol(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Base de plasma incandescente con gradiente de latitud
    const gradBase = ctx.createLinearGradient(0, 0, 0, 512);
    gradBase.addColorStop(0.0, "#ea580c"); // Limbo polar naranja rojizo
    gradBase.addColorStop(0.25, "#f59e0b"); // Ámbar dorado
    gradBase.addColorStop(0.50, "#ffffff"); // Núcleo ecuatorial blanco incandescente
    gradBase.addColorStop(0.75, "#f59e0b"); // Ámbar dorado
    gradBase.addColorStop(1.0, "#ea580c"); // Limbo polar naranja rojizo
    ctx.fillStyle = gradBase;
    ctx.fillRect(0, 0, 1024, 512);

    // Gránulos de convección fotosférica (micro-células térmicas)
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (let i = 0; i < 180; i++) {
        const x = (i * 73) % 1024;
        const y = 30 + ((i * 47) % 452);
        const rx = 16 + ((i * 13) % 26);
        const ry = 9 + ((i * 7) % 16);
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, i * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }

    // Filamentos de fulgor y llamaradas cromosféricas
    ctx.fillStyle = "rgba(251, 146, 60, 0.35)";
    for (let i = 0; i < 90; i++) {
        const x = (i * 109) % 1024;
        const y = 20 + ((i * 61) % 472);
        const r = 8 + ((i * 5) % 16);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cinturón ecuatorial de radiación intensa (efecto de súper-brillo central)
    const gradCentro = ctx.createLinearGradient(0, 150, 0, 362);
    gradCentro.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    gradCentro.addColorStop(0.5, "rgba(255, 255, 255, 0.70)");
    gradCentro.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = gradCentro;
    ctx.fillRect(0, 150, 1024, 212);

    return subirCanvasATextura(gl, c);
}

function crearTexturasEdificio(gl) {
    return {
        vidrioAzul: generarTexturaVidrioAzul(gl),
        piedra: generarTexturaPiedraLaja(gl),
        letreroEntrada: generarTexturaLetreroEntrada(gl),
        soffitLuces: generarTexturaSoffitLuces(gl),
        bannerIA: generarTexturaBannerIA(gl),
        letreroFrontal: generarTexturaLetreroFrontal(gl),
        parasoles: generarTexturaParasoles(gl),
        alucobond: generarTexturaAlucobond(gl),
        hormigonBlanco: generarTexturaHormigonBlanco(gl),
        puertaMetal: generarTexturaPuertaMetal(gl),
        asfalto: generarTexturaAsfalto(gl),
        ventanaOficina: generarTexturaVentanaOficina(gl),
        ventanasCelestes: generarTexturaVentanasCelestes(gl),
        azotea: generarTexturaAzotea(gl),
        fachadaPosterior: generarTexturaFachadaPosterior(gl),
        letreroCochera: generarTexturaLetreroCochera(gl),
        cespedMontana: generarTexturaCespedMontana(gl),
        cortezaArbol: generarTexturaCorteza(gl),
        luna: generarTexturaLuna(gl),
        sol: generarTexturaSol(gl)
    };
}

return { crearTexturasEdificio };
})();

// --- js/ui/Interfaz.js ---
modules["js/ui/Interfaz.js"] = (() => {
/** Conecta el DOM con acciones de la aplicación; no dibuja objetos 3D. */
class Interfaz {
    constructor(controls, estado, onLightingChange, onAutoCiclo = () => {}) {
        this.controls = controls;
        this.estado = estado;
        this.onLightingChange = onLightingChange;
        this.onAutoCiclo = onAutoCiclo;
        this.frames = 0;
        this.elapsed = 0;
        this.events = new AbortController();
        const signal = this.events.signal;
        document.addEventListener('click', e => {
            const button = e.target.closest('[data-action]');
            if (button) this.execute(button.dataset.action);
            if (e.target.id === 'modalGuia') this.toggleModalGuia();
        }, { signal });
        document.addEventListener('pointerdown', e => {
            const wrapper = document.getElementById('controlsWrapper');
            if (wrapper.classList.contains('abierto') && !wrapper.contains(e.target)) this.toggleMenuControles();
        }, { signal });
        window.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            document.getElementById('modalGuia').classList.remove('visible');
            if (document.getElementById('controlsWrapper').classList.contains('abierto')) this.toggleMenuControles();
        }, { signal });
        this.actualizarBotones();
    }

    execute(action) {
        const vistas = {
            vistaFrontal: [0.03, 0.12, 19, [0.6, 6.2, 0]],
            restablecerCamara: [0.03, 0.12, 19, [0.6, 6.2, 0]],
            vistaLateralDerecha: [-0.58, 0.22, 21, [4, 5.5, -0.5]],
            vistaPerspectivaAerea: [0.68, 0.48, 28, [1, 5.5, 0]],
            vistaEntradaEscalinata: [-0.06, 0.09, 11.5, [0.8, 3.8, 0]],
            vistaAzotea: [0.35, 0.52, 24, [1.5, 13.5, -3]],
            vistaPosterior: [Math.PI - 0.05, 0.18, 25, [2.5, 6, -5]],
            vistaBosque: [0.08, 0.22, 36, [1.2, 10.0, -26]]
        };
        if (vistas[action]) this.controls.setView(...vistas[action]);
        else if (action === 'alternarPuertas') this.estado.puertasAbiertas = !this.estado.puertasAbiertas;
        else if (action === 'alternarVentanas') this.estado.ventanasAbiertas = !this.estado.ventanasAbiertas;
        else if (action === 'alternarAutoOrbit') this.controls.autoOrbit = !this.controls.autoOrbit;
        else if (action === 'alternarLuzNocturna') {
            this.estado.luzNocturna = !this.estado.luzNocturna;
            this.onLightingChange(this.estado.luzNocturna);
        } else if (action === 'alternarAutoCiclo') {
            this.onAutoCiclo();
        } else if (action === 'toggleMenuControles') this.toggleMenuControles();
        else if (action === 'toggleModalGuia') this.toggleModalGuia();
        this.actualizarBotones();
    }

    actualizarBotones() {
        const update = (id, active, on, off) => {
            const button = document.getElementById(id);
            button.textContent = active ? on : off;
            button.classList.toggle('activo', active);
        };
        update('btnPuertas', this.estado.puertasAbiertas, '🚪 Cerrar Puertas (E)', '🚪 Abrir Puertas (E)');
        update('btnVentanas', this.estado.ventanasAbiertas, '🪟 Cerrar Ventanas (V)', '🪟 Abrir Ventanas (V)');
        update('btnLuz', this.estado.luzNocturna, '☀️ Modo Día (L)', '🌙 Modo Noche (L)');
        update('btnAutoOrbit', this.controls.autoOrbit, '⏸ Detener Giro (C)', '🔄 Giro Cinemático (C)');
    }

    toggleMenuControles() {
        const open = document.getElementById('controlsWrapper').classList.toggle('abierto');
        document.getElementById('triggerText').textContent = open ? 'Ocultar Controles' : 'Controles y Vistas';
        document.getElementById('triggerArrow').textContent = open ? '▼' : '▲';
        document.getElementById('triggerIcon').textContent = open ? '✕' : '🎛️';
        document.getElementById('btnMenuTrigger').setAttribute('aria-expanded', String(open));
    }

    toggleModalGuia() {
        document.getElementById('modalGuia').classList.toggle('visible');
    }

    update(dt) {
        this.frames++;
        this.elapsed += dt;
        if (this.elapsed < 0.5) return;
        document.getElementById('hudFps').textContent = Math.round(this.frames / this.elapsed) + ' FPS';
        document.getElementById('hudDist').textContent = this.controls.distancia.toFixed(1) + ' m';
        document.getElementById('hudAzi').textContent = (this.controls.azimut * 180 / Math.PI).toFixed(0) + '°';
        document.getElementById('hudEle').textContent = (this.controls.elevacion * 180 / Math.PI).toFixed(0) + '°';
        this.frames = 0;
        this.elapsed = 0;
    }

    dispose() { this.events.abort(); }
}

return { Interfaz };
})();

// --- js/main.js ---
modules["js/main.js"] = (() => {
const { Renderer } = modules["js/core/Renderer.js"];
const { Scene } = modules["js/core/Scene.js"];
const { PerspectiveCamera } = modules["js/cameras/PerspectiveCamera.js"];
const { OrbitControls } = modules["js/controls/OrbitControls.js"];
const { Facultad } = modules["js/scenes/Facultad.js"];
const { Montana } = modules["js/objects/Montana.js"];
const { SistemaCeleste } = modules["js/objects/SistemaCeleste.js"];
const { crearTexturasEdificio } = modules["js/textures/BuildingTextures.js"];
const { Interfaz } = modules["js/ui/Interfaz.js"];

// main compone la escena; Renderer concentra los detalles de WebGL.
const canvas = document.getElementById('glCanvas');
const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(52, renderer.resize(), 0.2, 260);
const textures = crearTexturasEdificio(renderer.gl);

// Montaña ondulada andina con bosque de árboles detrás de la universidad
const montana = new Montana(textures);
scene.add(montana);

// Recreación arquitectónica de la facultad
const facultad = new Facultad(textures);
scene.add(facultad);

// Sol, Luna, estrellas y ciclo dinámico diurno-nocturno
const sistemaCeleste = new SistemaCeleste(scene, textures);
scene.add(sistemaCeleste);

const estado = { puertasAbiertas: false, ventanasAbiertas: true, luzNocturna: false };
const controls = new OrbitControls(camera, canvas, action => interfaz.execute(action));
const interfaz = new Interfaz(
    controls,
    estado,
    nocturna => sistemaCeleste.alternarModo(nocturna),
    () => sistemaCeleste.alternarAutoCiclo()
);

let previousTime = performance.now();
let frameId;
function animate(time) {
    const dt = Math.min((time - previousTime) * 0.001, 0.1);
    previousTime = time;
    controls.update(dt);
    facultad.update(dt, estado);
    sistemaCeleste.update(dt);
    renderer.render(scene, camera);
    interfaz.update(dt);
    frameId = requestAnimationFrame(animate);
}
frameId = requestAnimationFrame(animate);

// Liberar recursos al abandonar la pagina (sin interferir con la cache de navegacion).
window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    cancelAnimationFrame(frameId);
    controls.dispose();
    interfaz.dispose();
    renderer.dispose();
    for (const texture of Object.values(textures)) renderer.gl.deleteTexture(texture);
});

return {  };
})();

} catch (error) {
    console.error('No se pudo iniciar la escena:', error);
    const panel = document.createElement('section');
    panel.className = 'startup-message';
    panel.setAttribute('role', 'alert');
    panel.textContent = 'No se pudo cargar la escena 3D: ' + error.message;
    document.body.append(panel);
}
})();
