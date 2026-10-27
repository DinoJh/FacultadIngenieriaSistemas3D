import { Camera } from './Camera.js';
import { Matrix4 } from '../math/Matrix4.js';

export class PerspectiveCamera extends Camera {
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
