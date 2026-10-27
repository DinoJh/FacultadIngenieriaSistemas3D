/** Conecta el DOM con acciones de la aplicación; no dibuja objetos 3D. */
export class Interfaz {
    constructor(controls, estado, onLightingChange, onAutoCiclo = () => {}) {
        this.controls = controls;
        this.estado = estado;
        this.onLightingChange = onLightingChange;
        this.onAutoCiclo = onAutoCiclo;
        this.frames = 0;
        this.elapsed = 0;
        this.events = new AbortController();
        const signal = this.events.signal;
        document.addEventListener('click', e => {
            const button = e.target.closest('[data-action]');
            if (button) this.execute(button.dataset.action);
            if (e.target.id === 'modalGuia') this.toggleModalGuia();
        }, { signal });
        document.addEventListener('pointerdown', e => {
            const wrapper = document.getElementById('controlsWrapper');
            if (wrapper.classList.contains('abierto') && !wrapper.contains(e.target)) this.toggleMenuControles();
        }, { signal });
        window.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;
            document.getElementById('modalGuia').classList.remove('visible');
            if (document.getElementById('controlsWrapper').classList.contains('abierto')) this.toggleMenuControles();
        }, { signal });
        this.actualizarBotones();
    }

    execute(action) {
        const vistas = {
            vistaFrontal: [0.03, 0.12, 19, [0.6, 6.2, 0]],
            restablecerCamara: [0.03, 0.12, 19, [0.6, 6.2, 0]],
            vistaLateralDerecha: [-0.58, 0.22, 21, [4, 5.5, -0.5]],
            vistaPerspectivaAerea: [0.68, 0.48, 28, [1, 5.5, 0]],
            vistaEntradaEscalinata: [-0.06, 0.09, 11.5, [0.8, 3.8, 0]],
            vistaAzotea: [0.35, 0.52, 24, [1.5, 13.5, -3]],
            vistaPosterior: [Math.PI - 0.05, 0.18, 25, [2.5, 6, -5]],
            vistaBosque: [0.08, 0.22, 36, [1.2, 10.0, -26]]
        };
        if (vistas[action]) this.controls.setView(...vistas[action]);
        else if (action === 'alternarPuertas') this.estado.puertasAbiertas = !this.estado.puertasAbiertas;
        else if (action === 'alternarVentanas') this.estado.ventanasAbiertas = !this.estado.ventanasAbiertas;
        else if (action === 'alternarAutoOrbit') this.controls.autoOrbit = !this.controls.autoOrbit;
        else if (action === 'alternarLuzNocturna') {
            this.estado.luzNocturna = !this.estado.luzNocturna;
            this.onLightingChange(this.estado.luzNocturna);
        } else if (action === 'alternarAutoCiclo') {
            this.onAutoCiclo();
        } else if (action === 'toggleMenuControles') this.toggleMenuControles();
        else if (action === 'toggleModalGuia') this.toggleModalGuia();
        this.actualizarBotones();
    }

    actualizarBotones() {
        const update = (id, active, on, off) => {
            const button = document.getElementById(id);
            button.textContent = active ? on : off;
            button.classList.toggle('activo', active);
        };
        update('btnPuertas', this.estado.puertasAbiertas, '🚪 Cerrar Puertas (E)', '🚪 Abrir Puertas (E)');
        update('btnVentanas', this.estado.ventanasAbiertas, '🪟 Cerrar Ventanas (V)', '🪟 Abrir Ventanas (V)');
        update('btnLuz', this.estado.luzNocturna, '☀️ Modo Día (L)', '🌙 Modo Noche (L)');
        update('btnAutoOrbit', this.controls.autoOrbit, '⏸ Detener Giro (C)', '🔄 Giro Cinemático (C)');
    }

    toggleMenuControles() {
        const open = document.getElementById('controlsWrapper').classList.toggle('abierto');
        document.getElementById('triggerText').textContent = open ? 'Ocultar Controles' : 'Controles y Vistas';
        document.getElementById('triggerArrow').textContent = open ? '▼' : '▲';
        document.getElementById('triggerIcon').textContent = open ? '✕' : '🎛️';
        document.getElementById('btnMenuTrigger').setAttribute('aria-expanded', String(open));
    }

    toggleModalGuia() {
        document.getElementById('modalGuia').classList.toggle('visible');
    }

    update(dt) {
        this.frames++;
        this.elapsed += dt;
        if (this.elapsed < 0.5) return;
        document.getElementById('hudFps').textContent = Math.round(this.frames / this.elapsed) + ' FPS';
        document.getElementById('hudDist').textContent = this.controls.distancia.toFixed(1) + ' m';
        document.getElementById('hudAzi').textContent = (this.controls.azimut * 180 / Math.PI).toFixed(0) + '°';
        document.getElementById('hudEle').textContent = (this.controls.elevacion * 180 / Math.PI).toFixed(0) + '°';
        this.frames = 0;
        this.elapsed = 0;
    }

    dispose() { this.events.abort(); }
}
