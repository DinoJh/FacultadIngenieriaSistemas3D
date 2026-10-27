/** Apariencia de un Mesh; no contiene posiciones ni llamadas a WebGL. */
export class BasicMaterial {
    constructor({ texture = null, color = [1, 1, 1, 1], emissive = false, shininess = 16, depthWrite = true } = {}) {
        this.texture = texture;
        this.color = color;
        this.emissive = emissive;
        this.shininess = shininess;
        this.depthWrite = depthWrite;
    }
}
