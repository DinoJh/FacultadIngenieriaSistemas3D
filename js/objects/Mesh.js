import { Object3D } from '../core/Object3D.js';

/** Objeto visible = geometría + material + transformación. */
export class Mesh extends Object3D {
    constructor(geometry, material, name = '') {
        super(name);
        this.geometry = geometry;
        this.material = material;
    }
}
