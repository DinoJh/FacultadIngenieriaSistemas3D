import { Matrix4 } from '../math/Matrix4.js';
import { vertexShaderSource, fragmentShaderSource } from '../shaders/buildingShaders.js';

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
export class Renderer {
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
