# Facultad de Ingeniería de Sistemas en WebGL2

Recreación interactiva de la facultad de la UNA Puno. El código sigue la arquitectura del **Paso 16: de código monolítico a mini motor gráfico**, conservando la cámara orbital del Paso 15, las texturas, las luces y las interacciones.

## Ejecutar

**Haz doble clic en `index.html`.** La facultad se abre directamente en el navegador, sin iniciar un servidor ni instalar paquetes. También funciona con Live Server o cualquier servidor HTTP local.

Los archivos fuente conservan las clases y módulos ES del Paso 16. Para permitir el doble clic, `index.html` carga `js/app.bundle.js`, una copia empaquetada de esos módulos. Este es un ajuste de ejecución respecto a la guía, que propone cargar los módulos directamente por HTTP; la separación de responsabilidades del motor se conserva.

Después de modificar archivos fuente en `js/`, actualiza la copia empaquetada:

```powershell
python tools/build_bundle.py
```

El empaquetador solo necesita Python y su biblioteca estándar. No edites `app.bundle.js` a mano: los cambios se hacen en los archivos de cada carpeta y luego se regenera.

## Organización del proyecto

```text
index.html                     Página y controles declarados con data-action
css/style.css                  Presentación de la interfaz
js/
  app.bundle.js                Copia generada para abrir el HTML directamente
  main.js                      Crea y conecta la aplicación
  math/Matrix4.js               Matrices, perspectiva, vista y matriz normal
  core/
    Object3D.js                 Transformaciones y relaciones padre-hijo
    Scene.js                    Raíz del árbol, fondo y datos de iluminación
    Geometry.js                 Datos de vértices e índices
    Renderer.js                 WebGL2, buffers, uniforms y dibujo
  geometries/                  Cubo, plano, cilindro, disco, esfera,
                               escalinata y pared trapezoidal
  materials/BasicMaterial.js    Color, textura, emisión y brillo
  objects/
    Mesh.js                    Geometry + Material + Object3D
    Puertas.js                 Hojas y bisagras animadas
    Ventanas.js                Marcos, cristal, bisagras y brazos animados
  cameras/
    Camera.js                  Posición, objetivo y matriz de vista
    PerspectiveCamera.js       FOV, aspecto y planos de recorte
  controls/OrbitControls.js    Mouse, teclado, tacto y coordenadas orbitales
  scenes/
    Facultad.js                Construcción arquitectónica y entorno
    Lighting.js                Posiciones de focos y ambiente día/noche
  shaders/buildingShaders.js   Programas GLSL de vértices y fragmentos
  textures/BuildingTextures.js Recetas de texturas dibujadas con Canvas 2D
  utils/TextureLoader.js       Convierte un Canvas en una textura WebGL
  ui/Interfaz.js               Botones, vistas, menú, guía e indicadores
tests/architecture.test.mjs    Pruebas de jerarquías y recursos compartidos
tools/build_bundle.py          Genera la versión compatible con doble clic
```

## Cómo se conectan

`main.js` crea un `Renderer`, una `Scene`, una `PerspectiveCamera` y la `Facultad`. La facultad se agrega a la escena. En cada cuadro:

1. `OrbitControls.update(dt)` actualiza la posición de la cámara.
2. `Facultad.update(dt, estado)` anima puertas y ventanas.
3. `Renderer.render(scene, camera)` actualiza las matrices mundiales, recorre el árbol y dibuja cada `Mesh`.
4. `Interfaz.update(dt)` actualiza los indicadores.

El `Renderer` puede dibujar cualquier `Mesh`: no necesita saber si representa una puerta, una pared o una flor. Las geometrías se comparten entre varias piezas y se suben a la GPU una sola vez por renderer.

## Jerarquía del edificio

```text
Scene
└── Facultad
    ├── Piezas arquitectónicas y entorno
    ├── Puertas
    │   ├── Bisagra izquierda → hoja
    │   └── Bisagra derecha → hoja
    └── Ventanas
        └── Cada ventana
            ├── Bisagra superior → marcos y cristal
            └── Brazos metálicos
```

`matrix` es la transformación respecto del padre. `matrixWorld` incluye también las transformaciones de los antecesores. Al mover `facultad.position`, se desplazan todas sus piezas, incluidas puertas y ventanas.

Las piezas estáticas conservan sus matrices originales mediante `setMatrix()`, que desactiva `matrixAutoUpdate`. Para modificarlas se puede asignar otra matriz con `setMatrix()`. Las bisagras y hojas usan `position`, `rotation` y `scale`, y el motor calcula automáticamente sus matrices. Las posiciones de los focos están en coordenadas mundiales en `Lighting.js`; si se traslada todo el edificio, se deben ajustar también esas posiciones.

## Qué archivo modificar

| Cambio | Archivo |
| --- | --- |
| Dimensiones o ubicación de una pared | `js/scenes/Facultad.js` |
| Forma base de una figura | Su clase en `js/geometries/` |
| Velocidad o ángulo de las puertas | `js/objects/Puertas.js` |
| Apertura de ventanas | `js/objects/Ventanas.js` |
| Posición o intensidad de focos | `js/scenes/Lighting.js` |
| Fórmula de iluminación | `js/shaders/buildingShaders.js` |
| Dibujo de piedra, vidrio o letreros | `js/textures/BuildingTextures.js` |
| Sensibilidad del mouse o límites de zoom | `js/controls/OrbitControls.js` |
| Vistas predefinidas y acciones de botones | `js/ui/Interfaz.js` |

`BasicMaterial` conserva el nombre de la guía, ampliado con color y brillo para mantener la iluminación Blinn-Phong del proyecto. Las fotografías JPEG sirven de referencia; las texturas se generan con Canvas 2D.

## Controles

- Arrastrar el mouse o un dedo: orbitar.
- Rueda, gesto de dos dedos, `+` / `-`: acercar o alejar. `Q` también acerca.
- `WASD` o flechas: ajustar los ángulos.
- `E`: abrir/cerrar puertas; `V`: abrir/cerrar ventanas.
- `L`: día/noche; `C`: giro automático; `R`: vista inicial.
- `Escape`: cerrar la guía y el panel de controles.

## Verificación de la arquitectura

Con Node.js, sin instalar paquetes:

```powershell
node --test tests/architecture.test.mjs
```

Las pruebas comprueban la herencia de transformaciones, el cambio de padre, las geometrías compartidas, la validez de las mallas, el cierre gradual de las puertas y la cámara en perspectiva. El motor mantiene un único shader de iluminación y no implementa sombras proyectadas ni ordenamiento de transparencias.
