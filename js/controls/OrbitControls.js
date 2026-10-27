/** Navegación del Paso 15, independiente del motor y de los botones de la página. */
export class OrbitControls {
    constructor(camera, canvas, onAction = () => {}) {
        this.camera = camera;
        this.distancia = this.distanciaObjetivo = 19;
        this.azimut = this.azimutObjetivo = 0.03;
        this.elevacion = this.elevacionObjetivo = 0.12;
        this.distanciaMin = 4;
        this.distanciaMax = 65;
        this.elevacionMin = -0.15;
        this.elevacionMax = Math.PI * 0.46;
        this.autoOrbit = false;
        this.velocidadAutoOrbit = 0.20;
        Object.assign(camera.target, { x: 0.6, y: 6.2, z: 0 });
        this.events = new AbortController();
        const signal = this.events.signal;
        let dragging = false, lastX = 0, lastY = 0, touchDistance = 0;
        const start = (x, y) => { dragging = true; lastX = x; lastY = y; };
        const move = (x, y) => {
            if (!dragging) return;
            this.orbit(-(x - lastX) * 0.005, (y - lastY) * 0.005);
            lastX = x; lastY = y;
        };
        canvas.addEventListener('mousedown', e => start(e.clientX, e.clientY), { signal });
        window.addEventListener('mousemove', e => move(e.clientX, e.clientY), { signal });
        window.addEventListener('mouseup', () => { dragging = false; }, { signal });
        canvas.addEventListener('wheel', e => {
            e.preventDefault();
            this.zoom(e.deltaY > 0 ? 1.08 : 0.92);
        }, { passive: false, signal });
        const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY);
        canvas.addEventListener('touchstart', e => {
            if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY);
            else if (e.touches.length === 2) { dragging = false; touchDistance = distance(e.touches); }
        }, { signal });
        canvas.addEventListener('touchmove', e => {
            e.preventDefault();
            if (e.touches.length === 1) move(e.touches[0].clientX, e.touches[0].clientY);
            else if (e.touches.length === 2) {
                const next = distance(e.touches);
                if (next > 0 && touchDistance > 0) this.zoom(touchDistance / next);
                touchDistance = next;
            }
        }, { passive: false, signal });
        canvas.addEventListener('touchend', e => {
            dragging = false;
            if (e.touches.length === 1) start(e.touches[0].clientX, e.touches[0].clientY);
        }, { signal });
        canvas.addEventListener('touchcancel', () => { dragging = false; }, { signal });
        window.addEventListener('keydown', e => {
            if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
            const key = e.key.toLowerCase();
            const directions = { arrowleft: [0.05, 0], a: [0.05, 0], arrowright: [-0.05, 0], d: [-0.05, 0],
                arrowup: [0, 0.04], w: [0, 0.04], arrowdown: [0, -0.04], s: [0, -0.04] };
            if (directions[key]) { e.preventDefault(); this.orbit(...directions[key]); }
            else if (['q', '+', '='].includes(key)) this.zoom(0.93);
            else if (['-', '_'].includes(key)) this.zoom(1.07);
            else if (!e.repeat) {
                const action = { e: 'alternarPuertas', v: 'alternarVentanas', r: 'restablecerCamara',
                    c: 'alternarAutoOrbit', l: 'alternarLuzNocturna', k: 'alternarAutoCiclo' }[key];
                if (action) onAction(action);
            }
        }, { signal });
        this.update(0);
    }

    orbit(horizontal, vertical) {
        this.azimutObjetivo += horizontal;
        this.elevacionObjetivo = Math.max(this.elevacionMin,
            Math.min(this.elevacionMax, this.elevacionObjetivo + vertical));
    }

    zoom(factor) {
        this.distanciaObjetivo = Math.max(this.distanciaMin,
            Math.min(this.distanciaMax, this.distanciaObjetivo * factor));
    }

    setView(azimut, elevacion, distancia, target) {
        this.azimutObjetivo = azimut;
        this.elevacionObjetivo = elevacion;
        this.distanciaObjetivo = distancia;
        Object.assign(this.camera.target, { x: target[0], y: target[1], z: target[2] });
        this.autoOrbit = false;
    }

    update(dt) {
        if (this.autoOrbit) this.azimutObjetivo += this.velocidadAutoOrbit * dt;
        const smoothing = 1 - Math.exp(-8 * dt);
        this.azimut += (this.azimutObjetivo - this.azimut) * smoothing;
        this.elevacion += (this.elevacionObjetivo - this.elevacion) * smoothing;
        this.distancia += (this.distanciaObjetivo - this.distancia) * smoothing;
        const target = this.camera.target;
        this.camera.position.x = target.x + this.distancia * Math.cos(this.elevacion) * Math.sin(this.azimut);
        this.camera.position.y = target.y + this.distancia * Math.sin(this.elevacion);
        this.camera.position.z = target.z + this.distancia * Math.cos(this.elevacion) * Math.cos(this.azimut);
    }

    dispose() { this.events.abort(); }
}
