import { Object3D } from '../core/Object3D.js';
import { Mesh } from './Mesh.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';

/** Torre -> ventana -> bisagra -> marcos y cristal. Los brazos siguen la apertura. */
export class Ventanas extends Object3D {
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
