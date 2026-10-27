import { Object3D } from '../core/Object3D.js';
import { Mesh } from './Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';

/** Cada hoja hereda la rotación del pivote colocado en su bisagra. */
export class Puertas extends Object3D {
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
