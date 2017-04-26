"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Network {
    static get(n) {
        if (n instanceof Network)
            return n;
        return new Network(n.nodes);
    }
    constructor(nodes = []) {
        this.nodes = nodes;
    }
}
exports.Network = Network;
//# sourceMappingURL=network.js.map