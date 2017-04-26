"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Edge {
    static get(e) {
        if (e instanceof Edge)
            return e;
        return new Edge(e.node1, e.node2);
    }
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
    }
    getIds() {
        return [this.node1.id, this.node2.id];
    }
}
exports.Edge = Edge;
//# sourceMappingURL=edge.js.map