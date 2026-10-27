import { Matrix4 } from '../math/Matrix4.js';
import { vertexShaderSource, fragmentShaderSource } from '../shaders/buildingShaders.js';

/** Traduce Scene + Camera a WebGL2. No conoce paredes, puertas ni controles. */
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
        this.program = this.createProgram();
        const location = name => gl.getUniformLocation(this.program, name);
        this.uniforms = {
            modelLoc: location('uModelMatrix'), viewLoc: location('uViewMatrix'),
            projectionLoc: location('uProjectionMatrix'), normalMatrixLoc: location('uNormalMatrix'),
            textureLoc: location('uTexture'), useTextureLoc: location('uUseTexture'),
            colorLoc: location('uColor'), emissiveLoc: location('uEmissive'),
            specularPowerLoc: location('uSpecularPower'), cameraPosLoc: location('uCameraPos'),
            sunDirLoc: location('uSunDirection'), sunColorLoc: location('uSunColor'),
            ambientColorLoc: location('uAmbientColor'), numLucesLoc: location('uNumLuces'),
            lights: Array.from({ length: 7 }, (_, i) => ({
                position: location(`uLuzPos[${i}]`), color: location(`uLuzColor[${i}]`),
                intensity: location(`uLuzIntensidad[${i}]`), radius: location(`uLuzRadio[${i}]`)
            }))
        };
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

    createProgram() {
        const gl = this.gl;
        const vs = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fs = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
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
        const aspect = this.resize();
        if (camera.aspect !== aspect) {
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
        }
        scene.updateMatrixWorld();
        camera.updateViewMatrix();
        gl.clearColor(...scene.background);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(u.viewLoc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(u.projectionLoc, false, camera.projectionMatrix);
        gl.uniform3f(u.cameraPosLoc, camera.matrixWorld[12], camera.matrixWorld[13], camera.matrixWorld[14]);
        const light = scene.lighting;
        gl.uniform3fv(u.sunDirLoc, light.sunDirection);
        gl.uniform3fv(u.sunColorLoc, light.sunColor);
        gl.uniform3fv(u.ambientColorLoc, light.ambientColor);
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
        this.info.drawCalls++;
    }

    dispose() {
        for (const { vao, vbo, ebo } of this.geometries.values()) {
            this.gl.deleteVertexArray(vao);
            this.gl.deleteBuffer(vbo);
            this.gl.deleteBuffer(ebo);
        }
        this.geometries.clear();
        this.gl.deleteProgram(this.program);
    }
}
