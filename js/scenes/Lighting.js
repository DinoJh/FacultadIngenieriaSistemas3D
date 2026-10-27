/** Ubicación de las luminarias del edificio; el Renderer solo conoce sus datos. */
export const focos = [
    { position: [-5.7, 3.92, 2.25], radius: 7.5 },
    { position: [-4.5, 3.92, 2.25], radius: 7.5 },
    { position: [-3.3, 3.92, 2.25], radius: 7.5 },
    { position: [-0.20, 7.70, 0.35], radius: 8.5 },
    { position: [0.85, 7.70, 0.35], radius: 8.5 },
    { position: [1.90, 7.70, 0.35], radius: 8.5 },
    { position: [0.80, 14.10, 0.50], radius: 9.0 }
];

export function actualizarIluminacion(scene, nocturna) {
    scene.background = nocturna ? [0.03, 0.04, 0.08, 1] : [0.50, 0.68, 0.88, 1];
    scene.lighting = {
        sunDirection: nocturna ? [-0.3, -0.85, -0.3] : [-0.6, -0.8, -0.4],
        sunColor: nocturna ? [0.10, 0.13, 0.22] : [0.98, 0.96, 0.92],
        ambientColor: nocturna ? [0.07, 0.08, 0.12] : [0.38, 0.40, 0.44],
        pointLights: focos.map(foco => ({ ...foco, color: [1, 0.95, 0.82], intensity: nocturna ? 4.5 : 2.2 }))
    };
}
