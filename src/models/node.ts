import { INode, INodeCtp } from "../interfaces/node";

export class Node implements INode {
    id: string;
    states: string[];
    parents: string[];
    cpt: INodeCtp[];

    static get(n: INode): Node {
        if (n instanceof Node) return n;
        return new Node(n.id, n.states, n.parents, n.cpt);
    }

    static getId(n: INode) {
        return n.id;
    }

    constructor(id: string, states: string[] = [], parents: string[] = [], cpt: INodeCtp[] = []) {
        this.id = id;
        this.states = states;
        this.parents = parents;
        this.cpt = cpt;
    }
}