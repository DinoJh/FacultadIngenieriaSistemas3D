import { Object3D } from '../core/Object3D.js';
import { Matrix4 } from '../math/Matrix4.js';

export class Camera extends Object3D {
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
