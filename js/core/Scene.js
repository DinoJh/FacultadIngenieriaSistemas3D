import { Object3D } from './Object3D.js';

/** Raíz del árbol de objetos y configuración de ambiente de la escena. */
export class Scene extends Object3D {
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
