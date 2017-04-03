import { INode } from "../interfaces/node";
import { INetwork } from "../interfaces/network";

export class Network implements INetwork {
    nodes: INode[];

    static get(n: INetwork): Network {
        if (n instanceof Network) return n;
        return new Network(n.nodes);
    }

    constructor(nodes: INode[] = []) {
        this.nodes = nodes;
    }
}