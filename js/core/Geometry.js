/** Datos de una malla. Cada vértice contiene posición (3), normal (3) y UV (2). */
export class Geometry {
    constructor(vertices, indices) {
        this.vertices = vertices;
        this.indices = indices;
        this.indexCount = indices.length;
    }
}
