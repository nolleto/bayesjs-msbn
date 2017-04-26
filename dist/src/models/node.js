"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    static get(n) {
        if (n instanceof Node)
            return n;
        return new Node(n.id, n.states, n.parents, n.cpt);
    }
    static getId(n) {
        return n.id;
    }
    constructor(id, states = [], parents = [], cpt = []) {
        this.id = id;
        this.states = states;
        this.parents = parents;
        this.cpt = cpt;
    }
}
exports.Node = Node;
//# sourceMappingURL=node.js.map