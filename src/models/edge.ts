import { INode } from "../interfaces/node";
import { IEdge } from "../interfaces/edge";

export class Edge implements IEdge {
    node1: INode;
    node2: INode;

    static get(e: IEdge): Edge {
        if (e instanceof Edge) return e;
        return new Edge(e.node1, e.node2);
    }

    constructor(node1: INode, node2: INode) {
        this.node1 = node1;
        this.node2 = node2;
    }

    getIds(): string[] {
        return [ this.node1.id, this.node2.id ];
    }
}