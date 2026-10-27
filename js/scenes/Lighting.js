/**
 * ============================================================================
 * PROYECTO 3D: RECREACIÓN DE LA ESCENA DE INGENIERÍA DE SISTEMAS - UNA PUNO
 * Computación Gráfica 2026-II
 *
 * ARCHIVO: js/scenes/Lighting.js
 * Sistema unificado de fotometría, dispersión atmosférica e iluminación
 * arquitectónica para el ciclo solar y lunar.
 * ============================================================================
 */

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpVec3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/** Ubicación de las luminarias dicroicas del edificio; el Renderer solo conoce sus datos. */
export const focos = [
    { position: [-5.7, 3.92, 2.25], radius: 7.5 },
    { position: [-4.5, 3.92, 2.25], radius: 7.5 },
    { position: [-3.3, 3.92, 2.25], radius: 7.5 },
    { position: [-0.20, 7.70, 0.35], radius: 8.5 },
    { position: [0.85, 7.70, 0.35], radius: 8.5 },
    { position: [1.90, 7.70, 0.35], radius: 8.5 },
    { position: [0.80, 14.10, 0.50], radius: 9.0 }
];

/**
 * Calcula con base física la iluminación solar, lunar, atmosférica y artificial.
 *
 * Fases del ciclo solar según ángulo en radianes:
 * - PI * 0.5 = Mediodía (Sol en el cenit, luz blanca-dorada brillante, sombras cortas)
 * - PI = Atardecer / Ocaso (Hora dorada, dispersión de Rayleigh, tonos ámbar-rojizos)
 * - PI * 1.5 = Medianoche (Luna en el cenit, luz plateada fría, sutiles brillos)
 * - 0 o 2*PI = Amanecer (Luz cálida matinal)
 *
 * @param {number} angulo - Ángulo orbital solar en radianes [0, 2*PI]
 * @param {Object} [centroOrbita={x:0, y:3, z:-18}] - Centro de la trayectoria elíptica
 * @param {number} [radioOrbita=94.0] - Radio orbital de los astros
 * @returns {Object} Iluminación completa: { sunDirection, sunColor, ambientColor, background, pointLights, datosSol, datosLuna }
 */
export function calcularIluminacionCeleste(angulo, centroOrbita = { x: 0, y: 3, z: -18 }, radioOrbita = 94.0) {
    // 1. Coordenadas orbitales del Sol
    const solX = centroOrbita.x + Math.cos(angulo) * radioOrbita;
    const solY = centroOrbita.y + Math.sin(angulo) * radioOrbita;
    const solZ = centroOrbita.z + Math.sin(angulo * 0.5) * 16.0;

    // 2. Coordenadas orbitales de la Luna (opuesta diametralmente a 180° / PI)
    const angLuna = angulo + Math.PI;
    const lunaX = centroOrbita.x + Math.cos(angLuna) * radioOrbita;
    const lunaY = centroOrbita.y + Math.sin(angLuna) * radioOrbita;
    const lunaZ = centroOrbita.z + Math.sin(angLuna * 0.5) * 16.0;

    // Altura trigonométrica relativa de los astros (-1 a +1)
    const sinSol = Math.sin(angulo);
    const sinLuna = -sinSol;

    // 3. FACTORES DE TRANSICIÓN ATMOSFÉRICA
    // Factor de día pleno: 1.0 (mediodía), 0.0 (noche)
    const factorDia = clamp((sinSol + 0.10) / 0.60, 0.0, 1.0);

    // Factor de hora dorada / ocaso (pico cuando el sol toca la línea del horizonte)
    const factorOcaso = Math.max(0.0, 1.0 - Math.abs(sinSol) * 3.8);

    // Factor nocturno: 1.0 (luna alta en medianoche), 0.0 (día pleno)
    const factorNoche = clamp((sinLuna + 0.10) / 0.60, 0.0, 1.0);

    // Extinción atmosférica al acercarse al horizonte (impide luz desde el subsuelo)
    const atenuacionHorizonteSol = clamp(solY / 10.0, 0.0, 1.0);
    const atenuacionHorizonteLuna = clamp(lunaY / 10.0, 0.0, 1.0);

    // 4. COLOR DE LA BÓVEDA CELESTE (Background)
    // Cielo diurno: azul límpido de alta montaña (altitud Altiplano Puno ~3820 msnm)
    const cieloDiaCenit = [0.38, 0.60, 0.88, 1.0];
    const cieloDiaMedio = [0.50, 0.70, 0.92, 1.0];
    const cieloDia = lerpVec3(cieloDiaMedio, cieloDiaCenit, clamp(sinSol, 0.0, 1.0));

    // Crepúsculo: dispersión cromática con horizonte ámbar/salmón
    const cieloOcaso = [0.86, 0.46, 0.28, 1.0];
    // Hora azul (blue hour) intermedia entre el ocaso y la noche cerrada
    const cieloHoraAzul = [0.08, 0.12, 0.24, 1.0];
    // Noche estrellada: azul índigo luminoso (no negro cerrado, para visibilidad clara)
    const cieloNoche = [0.06, 0.09, 0.18, 1.0];

    let cieloActual = lerpVec3(cieloNoche, cieloDia, factorDia);
    if (factorOcaso > 0.01) {
        cieloActual = lerpVec3(cieloActual, cieloOcaso, factorOcaso * 0.78);
    } else if (sinSol < 0.05 && sinSol > -0.25) {
        const factorHoraAzul = clamp((0.05 - sinSol) / 0.30, 0.0, 1.0);
        cieloActual = lerpVec3(cieloActual, cieloHoraAzul, factorHoraAzul * 0.55);
    }
    const background = [cieloActual[0], cieloActual[1], cieloActual[2], 1.0];

    // 5. VECTOR DIRECCIONAL Y COLOR DE LA LUZ PRINCIPAL (Sol / Luna)
    let dirLuz;
    let colorLuzActual;

    const lenSol = Math.hypot(solX, solY, solZ) || 1.0;
    const dirHaciaSol = [-solX / lenSol, -solY / lenSol, -solZ / lenSol];

    const lenLuna = Math.hypot(lunaX, lunaY, lunaZ) || 1.0;
    const dirHaciaLuna = [-lunaX / lenLuna, -lunaY / lenLuna, -lunaZ / lenLuna];

    // Curvas cromáticas solares (luz potente con marcado contraste y sombras definidas)
    const luzSolCenit = [1.25, 1.20, 1.12]; // Blanco dorado radiante
    const luzSolDia = [1.12, 1.06, 0.98];   // Luz diurna directa nítida
    const luzSolOcaso = [1.18, 0.60, 0.22]; // Ámbar dorado crepuscular

    // Curvas cromáticas lunares (luz clara azul-plata que no deja la escena a oscuras)
    const luzLunaCenit = [0.42, 0.50, 0.65]; // Luz de luna llena clara y envolvente
    const luzLunaBaja = [0.28, 0.35, 0.48];

    if (sinSol >= -0.05) {
        // Sol como astro director
        dirLuz = dirHaciaSol;
        let colorSol = lerpVec3(luzSolOcaso, luzSolDia, clamp(sinSol / 0.5, 0.0, 1.0));
        colorSol = lerpVec3(colorSol, luzSolCenit, clamp((sinSol - 0.5) / 0.5, 0.0, 1.0));
        if (factorOcaso > 0.01) {
            colorSol = lerpVec3(colorSol, luzSolOcaso, factorOcaso * 0.85);
        }
        const intens = atenuacionHorizonteSol;
        colorLuzActual = [colorSol[0] * intens, colorSol[1] * intens, colorSol[2] * intens];
    } else {
        // Luna como astro director nocturno
        dirLuz = dirHaciaLuna;
        const colorLuna = lerpVec3(luzLunaBaja, luzLunaCenit, clamp(sinLuna, 0.0, 1.0));
        const intens = atenuacionHorizonteLuna;
        colorLuzActual = [colorLuna[0] * intens, colorLuna[1] * intens, colorLuna[2] * intens];
    }

    // 6. LUZ AMBIENTAL HEMISFÉRICA
    // De día: ambiente azulado que contrasta con la luz dorada solar
    const ambientDia = [0.32, 0.36, 0.42];
    const ambientOcaso = [0.28, 0.22, 0.20];
    // De noche: ambiente generoso azulino-plateado para que la escena no se vea oscura
    const ambientNoche = [0.20, 0.24, 0.32];

    let ambientActual = lerpVec3(ambientNoche, ambientDia, factorDia);
    if (factorOcaso > 0.01) {
        ambientActual = lerpVec3(ambientActual, ambientOcaso, factorOcaso * 0.70);
    }

    // Intensidad de sombras: alta de día (sombras solares nítidas), nula/mínima de noche
    const shadowIntensity = factorDia > 0.05 ? clamp((sinSol + 0.05) / 0.35, 0.0, 0.82) : 0.0;

    // 7. LUMINARIAS DICROICAS ARQUITECTÓNICAS
    // Se encienden con tono cálido halógeno de 3000K, destacando sobre el ambiente nocturno
    const intensFocos = lerp(5.0, 0.8, factorDia);

    return {
        sunDirection: dirLuz,
        sunColor: colorLuzActual,
        ambientColor: ambientActual,
        shadowIntensity: shadowIntensity,
        background: background,
        pointLights: focos.map(foco => ({
            ...foco,
            color: [1.0, 0.94, 0.82],
            intensity: intensFocos
        })),
        datosSol: {
            x: solX, y: solY, z: solZ,
            visible: solY > -2.0,
            factorDia,
            factorOcaso,
            atenuacionHorizonte: atenuacionHorizonteSol
        },
        datosLuna: {
            x: lunaX, y: lunaY, z: lunaZ,
            visible: lunaY > -2.0,
            factorNoche,
            atenuacionHorizonte: atenuacionHorizonteLuna
        }
    };
}

/**
 * Actualiza la iluminación de una escena para un modo día o noche discreto.
 * Reutiliza el cálculo fotométrico completo para garantizar consistencia.
 *
 * @param {Object} scene - Objeto Scene de la aplicación
 * @param {boolean} nocturna - True para noche (luna en cenit), false para día (sol en cenit)
 */
export function actualizarIluminacion(scene, nocturna) {
    const angulo = nocturna ? Math.PI * 1.5 : Math.PI * 0.5;
    const ilum = calcularIluminacionCeleste(angulo);
    scene.background = ilum.background;
    scene.lighting = {
        sunDirection: ilum.sunDirection,
        sunColor: ilum.sunColor,
        ambientColor: ilum.ambientColor,
        shadowIntensity: ilum.shadowIntensity,
        pointLights: ilum.pointLights
    };
}
