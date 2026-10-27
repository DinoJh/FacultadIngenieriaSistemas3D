import { TextureLoader } from '../utils/TextureLoader.js';

/**
 * ============================================================================
 * PROYECTO 3D: RECREACIÓN DE LA ESCENA DE INGENIERÍA DE SISTEMAS - UNA PUNO
 * Computación Gráfica 2026-II
 * Estudiante: Condori Churata Dino Jhoel (Cód. 236262)
 * 
 * ARCHIVO: js/textures/BuildingTextures.js
 * Generador procedimental de texturas de alta resolución (Canvas 2D)
 * Reproducción fidedigna de FacultadLadoFrontal1.jpeg y FacultadLadoDerecho.jpeg
 * ============================================================================
 */

function crearCanvasAuxiliar(ancho = 512, alto = 512) {
    const c = document.createElement("canvas");
    c.width = ancho;
    c.height = alto;
    return c;
}

function subirCanvasATextura(gl, canvas) {
    return new TextureLoader(gl).fromCanvas(canvas);
}

// ----------------------------------------------------------------------------
// 1. MURO CORTINA DE VIDRIO AZUL (Con reflejos de nubes y ventanas proyectantes)
// ----------------------------------------------------------------------------
function generarTexturaVidrioAzul(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Cielo azul de Puno reflejado con degradado realista
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0.0, "#0f284a");
    grad.addColorStop(0.25, "#1b4a80");
    grad.addColorStop(0.55, "#2d6fb3");
    grad.addColorStop(0.85, "#4e96d8");
    grad.addColorStop(1.0, "#7ab9ed");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Reflejo realista de nubes blancas algodonosas (como en FacultadLadoFrontal1.jpeg)
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(550, 420, 380, 160, -0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.ellipse(680, 500, 260, 110, -0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.ellipse(380, 320, 240, 90, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cuadrícula de perfiles de aluminio estructural oscuro
    const filas = 8;
    const cols = 4;
    const dy = 1024 / filas;
    const dx = 1024 / cols;

    // Perfiles estructurales principales
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#161d24";
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, 1024);
        ctx.stroke();
    }
    for (let j = 0; j <= filas; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(1024, j * dy);
        ctx.stroke();
    }

    // Huecos de vano de las ventanas proyectantes (con interior de oficina)
    // Fila 2 (pisos superiores) y Fila 4 (pisos medios)
    function dibujarHuecoVentana(colIdx, filaIdx) {
        const x = colIdx * dx + 16;
        const y = filaIdx * dy + 16;
        const w = dx - 32;
        const h = dy - 32;

        // Interior oscuro de aula / oficina
        ctx.fillStyle = "#0a0f16";
        ctx.fillRect(x, y, w, h);

        // Luz interior tenue de oficina
        ctx.fillStyle = "rgba(254, 240, 138, 0.20)";
        ctx.fillRect(x + 12, y + 12, w - 24, 18);

        // Marco perimetral fijo de aluminio oscuro
        ctx.strokeStyle = "#161d24";
        ctx.lineWidth = 8;
        ctx.strokeRect(x, y, w, h);

        ctx.strokeStyle = "#2e3b48";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    }

    // Preparar los vanos de las 4 ventanas proyectantes que se abren en 3D:
    dibujarHuecoVentana(1, 2); // Fila superior izquierda
    dibujarHuecoVentana(2, 2); // Fila superior derecha
    dibujarHuecoVentana(1, 4); // Fila media izquierda
    dibujarHuecoVentana(2, 4); // Fila media derecha

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 2. PIEDRA LAJA / CANTERÍA GRIS DEL PÓRTICO ARQUITECTÓNICO
// ----------------------------------------------------------------------------
function generarTexturaPiedraLaja(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Fondo gris base
    ctx.fillStyle = "#5c6065";
    ctx.fillRect(0, 0, 1024, 1024);

    // Bloques de piedra laja rectangulares en aparejo trabado con variaciones
    const tonosPiedra = [
        "#6b7076", "#55595e", "#787d83", "#62676d",
        "#4b4f53", "#71767c", "#585c62", "#80858b",
        "#43474b", "#686c72", "#5e6369", "#757a80"
    ];

    const filas = 24;
    const altoFila = 1024 / filas;

    for (let f = 0; f < filas; f++) {
        let x = (f % 2 === 0) ? 0 : -60;
        const y = f * altoFila;

        while (x < 1024) {
            const seed = Math.sin(f * 37.1 + x * 0.13);
            const anchoBloque = 60 + Math.floor(Math.abs(seed) * 90);

            const colorIdx = Math.floor(Math.abs(Math.sin(f * 17.5 + x * 0.23)) * tonosPiedra.length);
            ctx.fillStyle = tonosPiedra[colorIdx];
            ctx.fillRect(x + 2, y + 2, anchoBloque - 4, altoFila - 4);

            // Relieve sutil y textura porosa de la piedra
            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
            for (let k = 0; k < 12; k++) {
                const rx = x + 4 + ((k * 31) % (anchoBloque - 8));
                const ry = y + 4 + ((k * 19) % (altoFila - 8));
                ctx.fillRect(rx, ry, 6, 3);
            }

            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(x + 2, y + 2, anchoBloque - 4, 3);

            x += anchoBloque;
        }
    }

    // Juntas de mortero oscuro
    ctx.strokeStyle = "#2b2e31";
    ctx.lineWidth = 3;
    for (let f = 0; f <= filas; f++) {
        ctx.beginPath();
        ctx.moveTo(0, f * altoFila);
        ctx.lineTo(1024, f * altoFila);
        ctx.stroke();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 3. ATRIO VIDRIADO CON LETRAS 3D ILUMINADAS (Entrada Principal)
// ----------------------------------------------------------------------------
function generarTexturaLetreroEntrada(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Vidrio oscuro reflectante del atrio
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, 1024, 512);

    // Reflejo sutil de cielo nublado
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, "rgba(50, 75, 110, 0.25)");
    grad.addColorStop(0.5, "rgba(20, 30, 45, 0.15)");
    grad.addColorStop(1.0, "rgba(10, 15, 25, 0.35)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // 1. Escudo/Logotipo de Sistemas iluminado (engranaje y computador)
    ctx.save();
    ctx.translate(512, 130);
    // Resplandor exterior (glow)
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;

    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 7;
    ctx.strokeRect(-45, -45, 90, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 44px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IS", 0, 0);
    ctx.restore();

    // 2. Texto iluminado: ESCUELA PROFESIONAL (idéntico a FacultadLadoFrontal1.jpeg)
    ctx.save();
    ctx.shadowColor = "#e0f2fe";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#f0f9ff";
    ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("ESCUELA PROFESIONAL", 512, 255);

    // 3. Texto iluminado gigante: INGENIERIA DE SISTEMAS
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 46px 'Segoe UI', Arial, sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("INGENIERIA DE SISTEMAS", 512, 320);
    ctx.restore();

    // Perfiles metálicos de las puertas vidriadas inferiores
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 6;
    ctx.strokeRect(320, 380, 192, 132);
    ctx.strokeRect(512, 380, 192, 132);

    // Tiradores/manijas verticales cromadas
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(495, 410, 8, 80);
    ctx.fillRect(521, 410, 8, 80);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 4. CIELO / SOFFIT CON 3 DICROICOS ENCENDIDOS (LUCES CIRCULARES EMPOTRADAS)
// ----------------------------------------------------------------------------
function generarTexturaSoffitLuces(gl) {
    const c = crearCanvasAuxiliar(512, 128);
    const ctx = c.getContext("2d");

    // Fondo gris oscuro del alero/techo
    ctx.fillStyle = "#1e242b";
    ctx.fillRect(0, 0, 512, 128);

    // 3 focos dicroicos empotrados circulares con halo cálido
    const posicionesX = [100, 256, 412];
    for (let x of posicionesX) {
        // Resplandor cálido exterior
        const haloGrad = ctx.createRadialGradient(x, 64, 4, x, 64, 48);
        haloGrad.addColorStop(0.0, "rgba(255, 250, 220, 1.0)");
        haloGrad.addColorStop(0.3, "rgba(254, 240, 138, 0.85)");
        haloGrad.addColorStop(0.7, "rgba(250, 204, 21, 0.35)");
        haloGrad.addColorStop(1.0, "rgba(250, 204, 21, 0.0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(x, 64, 48, 0, Math.PI * 2);
        ctx.fill();

        // Anillo biselado metálico
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, 64, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Centro brillante del foco emisor
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, 64, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 5. BANNER SUPERIOR: INTELIGENCIA ARTIFICIAL Y CIENCIA DE DATOS
// ----------------------------------------------------------------------------
function generarTexturaBannerIA(gl) {
    const c = crearCanvasAuxiliar(1024, 256);
    const ctx = c.getContext("2d");

    // Fondo blanco nítido
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 256);

    // Marco azul institucional
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 1012, 244);

    // Logotipo AI estilizado a la izquierda
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "900 68px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI", 110, 150);

    // Texto superior
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 26px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS", 580, 80);

    // Texto central gigante
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 40px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("INTELIGENCIA ARTIFICIAL Y CIENCIA DE DATOS", 580, 145);

    // Subtexto inferior
    ctx.fillStyle = "#475569";
    ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("FACULTAD DE INGENIERÍA ESTADÍSTICA E INFORMÁTICA - UNA PUNO", 580, 200);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 6. LETRERO TÓTEM VERDE INSTITUCIONAL (Jardín / Acceso)
// ----------------------------------------------------------------------------
function generarTexturaLetreroFrontal(gl) {
    const c = crearCanvasAuxiliar(512, 256);
    const ctx = c.getContext("2d");

    // Fondo verde institucional
    ctx.fillStyle = "#1b4d2e";
    ctx.fillRect(0, 0, 512, 256);

    // Doble marco dorado
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#d4af37";
    ctx.strokeRect(8, 8, 496, 240);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fef08a";
    ctx.strokeRect(16, 16, 480, 224);

    // Escudo/Logo UNA PUNO & SISTEMAS
    ctx.save();
    ctx.translate(256, 75);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1b4d2e";
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#facc15";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("IS", 0, 0);
    ctx.restore();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ESCUELA PROFESIONAL DE", 256, 140);

    ctx.fillStyle = "#facc15";
    ctx.font = "900 24px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("INGENIERÍA DE SISTEMAS", 256, 175);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("UNA - PUNO", 256, 210);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 7. CELOSÍA Y PARASOLES HORIZONTALES (Fachada de FacultadLadoDerecho.jpeg)
// ----------------------------------------------------------------------------
function generarTexturaParasoles(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Vidrio azul oscuro de fondo
    const gradVidrio = ctx.createLinearGradient(0, 0, 512, 512);
    gradVidrio.addColorStop(0, "#122a42");
    gradVidrio.addColorStop(1, "#1c3c5a");
    ctx.fillStyle = gradVidrio;
    ctx.fillRect(0, 0, 512, 512);

    // Lamas o celosías horizontales de aluminio plateado (brise-soleil)
    const lamas = 18;
    const h = 512 / lamas;

    for (let i = 0; i < lamas; i++) {
        const y = i * h + 3;
        // Cuerpo metálico
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(0, y, 512, h * 0.4);

        // Borde superior cromado brillante
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, y, 512, 2);

        // Sombra inferior
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, y + h * 0.4 - 2, 512, 2);
    }

    // Perfiles estructurales verticales
    ctx.fillStyle = "#475569";
    ctx.fillRect(160, 0, 8, 512);
    ctx.fillRect(340, 0, 8, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 8. ALUCOBOND GRIS OSCURO (Estructura y marcos de fachada moderna)
// ----------------------------------------------------------------------------
function generarTexturaAlucobond(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#33383f";
    ctx.fillRect(0, 0, 512, 512);

    // Modulación de paneles con juntas ranuradas
    ctx.strokeStyle = "#1d2125";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);
    ctx.strokeRect(256, 0, 256, 256);
    ctx.strokeRect(0, 256, 256, 256);
    ctx.strokeRect(256, 256, 256, 256);

    // Brillo metálico sutil
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.0)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.03)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 9. HORMIGÓN BLANCO / FACHADA POSTERIOR
// ----------------------------------------------------------------------------
function generarTexturaHormigonBlanco(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, 512, 512);

    // Textura de enlucido fino
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 10. PUERTA ENROLLABLE METÁLICA (Garaje / Almacén)
// ----------------------------------------------------------------------------
function generarTexturaPuertaMetal(gl) {
    const c = crearCanvasAuxiliar(256, 256);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 0, 256, 256);

    const ranuras = 32;
    const step = 256 / ranuras;
    for (let i = 0; i < ranuras; i++) {
        ctx.fillStyle = "#64748b";
        ctx.fillRect(0, i * step, 256, step * 0.45);

        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(0, i * step + step * 0.45, 256, step * 0.55);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 11. ASFALTO CON REJILLA DE DRENAJE Y SARDINEL AMARILLO
// ----------------------------------------------------------------------------
function generarTexturaAsfalto(gl) {
    const c = crearCanvasAuxiliar(1024, 1024);
    const ctx = c.getContext("2d");

    // Asfalto gris oscuro
    ctx.fillStyle = "#272a2e";
    ctx.fillRect(0, 0, 1024, 1024);

    // Textura rugosa de calzada
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < 5000; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    // Rejilla de drenaje pluvial longitudinal (visible en FacultadLadoDerecho.jpeg)
    ctx.fillStyle = "#1e2124";
    ctx.fillRect(0, 920, 1024, 40);

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    for (let x = 0; x < 1024; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 920);
        ctx.lineTo(x, 960);
        ctx.stroke();
    }

    // Sardinel amarillo de seguridad al borde de la acera
    ctx.fillStyle = "#eab308";
    ctx.fillRect(0, 960, 1024, 64);

    ctx.strokeStyle = "#a16207";
    ctx.lineWidth = 3;
    for (let x = 0; x < 1024; x += 96) {
        ctx.beginPath();
        ctx.moveTo(x, 960);
        ctx.lineTo(x, 1024);
        ctx.stroke();
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 12. VENTANA DE OFICINA CON ILUMINACIÓN INTERIOR (Planta Baja Derecha)
// ----------------------------------------------------------------------------
function generarTexturaVentanaOficina(gl) {
    const c = crearCanvasAuxiliar(512, 256);
    const ctx = c.getContext("2d");

    // Interior iluminado con luz cálida fluorescente (como en FacultadLadoDerecho.jpeg)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 512, 256);

    // Luces interiores de oficina encendidas
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(80, 40, 80, 12);
    ctx.fillRect(240, 40, 80, 12);
    ctx.fillRect(380, 40, 80, 12);

    // Malla de seguridad y perfiles oscuros
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 512, 256);
    ctx.strokeRect(170, 0, 172, 256);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 13. VENTANAS CELESTES / VIDRIO REFLECTANTE SUPERIOR (Piso 4 - Centro)
// Visible entre el letrero superior y la pared gris de piedra laja
// ----------------------------------------------------------------------------
function generarTexturaVentanasCelestes(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Cielo celeste andino reflejado con degradado brillante y vívido
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, "#0369a1");
    grad.addColorStop(0.3, "#0284c7");
    grad.addColorStop(0.65, "#38bdf8");
    grad.addColorStop(1.0, "#7dd3fc");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Reflejo suave de nubes blancas en el vidrio superior
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.40)";
    ctx.beginPath();
    ctx.ellipse(320, 180, 260, 90, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.30)";
    ctx.beginPath();
    ctx.ellipse(750, 220, 220, 80, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cuadrícula de perfiles estructurales de aluminio negro/antracita
    const cols = 6;
    const filas = 3;
    const dx = 1024 / cols;
    const dy = 512 / filas;

    ctx.strokeStyle = "#161d24";
    ctx.lineWidth = 10;
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * dx, 0);
        ctx.lineTo(i * dx, 512);
        ctx.stroke();
    }
    for (let j = 0; j <= filas; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * dy);
        ctx.lineTo(1024, j * dy);
        ctx.stroke();
    }

    // Perfiles perimetrales exteriores gruesos
    ctx.lineWidth = 16;
    ctx.strokeRect(0, 0, 1024, 512);

    // Brillo diagonal especular sobre los cristales
    const shine = ctx.createLinearGradient(0, 0, 1024, 512);
    shine.addColorStop(0.0, "rgba(255, 255, 255, 0.15)");
    shine.addColorStop(0.4, "rgba(255, 255, 255, 0.0)");
    shine.addColorStop(0.7, "rgba(255, 255, 255, 0.20)");
    shine.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, 1024, 512);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 14. LOSAS DE AZOTEA Y PISO TÉCNICO
// ----------------------------------------------------------------------------
function generarTexturaAzotea(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Base de baldosas de hormigón impermeable
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 0, 512, 512);

    // Cuadrícula de juntas de dilatación de brea negra
    const n = 8;
    const s = 512 / n;
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    for (let i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s, 0);
        ctx.lineTo(i * s, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * s);
        ctx.lineTo(512, i * s);
        ctx.stroke();
    }

    // Variaciones sutiles de tono en cada baldosa
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const seed = Math.sin(i * 12.3 + j * 45.6);
            if (seed > 0.2) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
                ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
            } else if (seed < -0.2) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
                ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
            }
        }
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 15. FACHADA POSTERIOR CON VENTANAS DE AULAS MODULARES
// ----------------------------------------------------------------------------
function generarTexturaFachadaPosterior(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Hormigón blanco / gris claro de fondo
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 1024, 512);

    // Ventanas de aulas en 3 niveles
    const niveles = 3;
    const ventanasPorNivel = 6;
    const dy = 512 / niveles;
    const dx = 1024 / ventanasPorNivel;

    for (let n = 0; n < niveles; n++) {
        const yTop = n * dy + 32;
        const hVentana = dy - 64;

        for (let v = 0; v < ventanasPorNivel; v++) {
            const xLeft = v * dx + 24;
            const wVentana = dx - 48;

            // Cristal oscuro azulado reflectante
            const gradV = ctx.createLinearGradient(xLeft, yTop, xLeft, yTop + hVentana);
            gradV.addColorStop(0, "#0f2338");
            gradV.addColorStop(1, "#1e3a5f");
            ctx.fillStyle = gradV;
            ctx.fillRect(xLeft, yTop, wVentana, hVentana);

            // Marcos de aluminio oscuro
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 5;
            ctx.strokeRect(xLeft, yTop, wVentana, hVentana);

            // División central de la ventana corrediza
            ctx.beginPath();
            ctx.moveTo(xLeft + wVentana / 2, yTop);
            ctx.lineTo(xLeft + wVentana / 2, yTop + hVentana);
            ctx.stroke();

            // Reflejo blanco en el vidrio
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fillRect(xLeft + 4, yTop + 4, wVentana * 0.45, hVentana - 8);
        }

        // Viga dintel entre pisos
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(0, n * dy + dy - 12, 1024, 12);
    }

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 16. LETRERO INSTITUCIONAL: SÓTANO Y COCHERA (Acceso Derecho)
// ----------------------------------------------------------------------------
function generarTexturaLetreroCochera(gl) {
    const c = crearCanvasAuxiliar(512, 128);
    const ctx = c.getContext("2d");

    // Fondo azul marino institucional
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 128);

    // Borde cian luminoso
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);

    // Texto superior
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("FACULTAD DE INGENIERÍA", 256, 36);

    // Texto principal
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("SÓTANO • COCHERA", 256, 75);

    // Subtexto inferior
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("ACCESO VEHICULAR Y LABORATORIOS", 256, 106);

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 17. CÉSPED Y RELIEVE NATURAL DE LA MONTAÑA ANDINA (Pasto altiplánico y rocas)
// ----------------------------------------------------------------------------
function generarTexturaCespedMontana(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Fondo base verde montaña andina
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0.0, "#23471b");
    grad.addColorStop(0.5, "#315d26");
    grad.addColorStop(1.0, "#2a5220");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Manchas orgánicas de vegetación y tierra fértil
    const colores = ["#1a3813", "#3d7330", "#4d873d", "#5b9948", "#423b28", "#594d36"];
    for (let i = 0; i < 90; i++) {
        const x = (Math.sin(i * 12.3) * 0.5 + 0.5) * 512;
        const y = (Math.cos(i * 17.7) * 0.5 + 0.5) * 512;
        const r = 25 + (i % 7) * 9;
        ctx.fillStyle = colores[i % colores.length];
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.4, r * 0.8, (i * 0.4), 0, Math.PI * 2);
        ctx.fill();
    }

    // Pinceladas de pasto / briznas de hierba silvestre
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 1800; i++) {
        const px = (i * 73) % 512;
        const py = (i * 137) % 512;
        ctx.fillStyle = (i % 2 === 0) ? "#65aa4e" : "#1e4016";
        ctx.fillRect(px, py, 2, 4 + (i % 5));
    }
    ctx.globalAlpha = 1.0;

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 18. CORTEZA DE ÁRBOL (Troncos de pino y queñuales del bosque)
// ----------------------------------------------------------------------------
function generarTexturaCorteza(gl) {
    const c = crearCanvasAuxiliar(256, 256);
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#3a2213";
    ctx.fillRect(0, 0, 256, 256);

    const tonos = ["#26150b", "#4a2c19", "#5b3720", "#1f1008"];
    for (let i = 0; i < 60; i++) {
        const x = (i * 4.3) % 256;
        ctx.fillStyle = tonos[i % tonos.length];
        ctx.globalAlpha = 0.4 + (i % 4) * 0.15;
        ctx.fillRect(x, 0, 3 + (i % 5), 256);
    }
    ctx.globalAlpha = 1.0;

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 19. SUPERFICIE LUNAR (Mares basálticos y cráteres plateados)
// ----------------------------------------------------------------------------
function generarTexturaLuna(gl) {
    const c = crearCanvasAuxiliar(512, 512);
    const ctx = c.getContext("2d");

    // Base plateada / perla lunar
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 512, 512);

    // Mares lunares (zonas basálticas oscuras)
    const mares = [
        { x: 180, y: 190, rx: 90, ry: 70, rot: 0.2 },
        { x: 310, y: 220, rx: 110, ry: 85, rot: -0.3 },
        { x: 230, y: 330, rx: 80, ry: 60, rot: 0.5 },
        { x: 370, y: 340, rx: 70, ry: 50, rot: -0.1 }
    ];
    mares.forEach(m => {
        const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx);
        grad.addColorStop(0.0, "rgba(100, 116, 139, 0.75)");
        grad.addColorStop(0.7, "rgba(148, 163, 184, 0.45)");
        grad.addColorStop(1.0, "rgba(226, 232, 240, 0.0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(m.x, m.y, m.rx, m.ry, m.rot, 0, Math.PI * 2);
        ctx.fill();
    });

    // Cráteres de impacto con reborde blanco brillante
    const crateres = [
        { x: 120, y: 130, r: 18 }, { x: 390, y: 150, r: 24 },
        { x: 270, y: 260, r: 14 }, { x: 160, y: 390, r: 20 },
        { x: 320, y: 410, r: 16 }, { x: 240, y: 120, r: 12 }
    ];
    crateres.forEach(cr => {
        // Sombra interna del cráter
        ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
        ctx.beginPath();
        ctx.arc(cr.x, cr.y, cr.r, 0, Math.PI * 2);
        ctx.fill();
        // Borde iluminado
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cr.x - 1, cr.y - 1, cr.r, Math.PI * 0.75, Math.PI * 1.75);
        ctx.stroke();
    });

    return subirCanvasATextura(gl, c);
}

// ----------------------------------------------------------------------------
// 20. SUPERFICIE SOLAR (Cromosfera incandescente, gránulos y limbo solar)
// ----------------------------------------------------------------------------
function generarTexturaSol(gl) {
    const c = crearCanvasAuxiliar(1024, 512);
    const ctx = c.getContext("2d");

    // Base de plasma incandescente con gradiente de latitud
    const gradBase = ctx.createLinearGradient(0, 0, 0, 512);
    gradBase.addColorStop(0.0, "#ea580c"); // Limbo polar naranja rojizo
    gradBase.addColorStop(0.25, "#f59e0b"); // Ámbar dorado
    gradBase.addColorStop(0.50, "#ffffff"); // Núcleo ecuatorial blanco incandescente
    gradBase.addColorStop(0.75, "#f59e0b"); // Ámbar dorado
    gradBase.addColorStop(1.0, "#ea580c"); // Limbo polar naranja rojizo
    ctx.fillStyle = gradBase;
    ctx.fillRect(0, 0, 1024, 512);

    // Gránulos de convección fotosférica (micro-células térmicas)
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (let i = 0; i < 180; i++) {
        const x = (i * 73) % 1024;
        const y = 30 + ((i * 47) % 452);
        const rx = 16 + ((i * 13) % 26);
        const ry = 9 + ((i * 7) % 16);
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, i * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }

    // Filamentos de fulgor y llamaradas cromosféricas
    ctx.fillStyle = "rgba(251, 146, 60, 0.35)";
    for (let i = 0; i < 90; i++) {
        const x = (i * 109) % 1024;
        const y = 20 + ((i * 61) % 472);
        const r = 8 + ((i * 5) % 16);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cinturón ecuatorial de radiación intensa (efecto de súper-brillo central)
    const gradCentro = ctx.createLinearGradient(0, 150, 0, 362);
    gradCentro.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    gradCentro.addColorStop(0.5, "rgba(255, 255, 255, 0.70)");
    gradCentro.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = gradCentro;
    ctx.fillRect(0, 150, 1024, 212);

    return subirCanvasATextura(gl, c);
}

export function crearTexturasEdificio(gl) {
    return {
        vidrioAzul: generarTexturaVidrioAzul(gl),
        piedra: generarTexturaPiedraLaja(gl),
        letreroEntrada: generarTexturaLetreroEntrada(gl),
        soffitLuces: generarTexturaSoffitLuces(gl),
        bannerIA: generarTexturaBannerIA(gl),
        letreroFrontal: generarTexturaLetreroFrontal(gl),
        parasoles: generarTexturaParasoles(gl),
        alucobond: generarTexturaAlucobond(gl),
        hormigonBlanco: generarTexturaHormigonBlanco(gl),
        puertaMetal: generarTexturaPuertaMetal(gl),
        asfalto: generarTexturaAsfalto(gl),
        ventanaOficina: generarTexturaVentanaOficina(gl),
        ventanasCelestes: generarTexturaVentanasCelestes(gl),
        azotea: generarTexturaAzotea(gl),
        fachadaPosterior: generarTexturaFachadaPosterior(gl),
        letreroCochera: generarTexturaLetreroCochera(gl),
        cespedMontana: generarTexturaCespedMontana(gl),
        cortezaArbol: generarTexturaCorteza(gl),
        luna: generarTexturaLuna(gl),
        sol: generarTexturaSol(gl)
    };
}
