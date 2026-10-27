import { Matrix4 } from '../math/Matrix4.js';

/** Nodo espacial. Sus hijos heredan su transformación. */
export class Object3D {
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
