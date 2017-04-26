import { INode } from "../interfaces/node";
import { IEdge } from "../interfaces/edge";
export declare class Edge implements IEdge {
    node1: INode;
    node2: INode;
    static get(e: IEdge): Edge;
    constructor(node1: INode, node2: INode);
    getIds(): string[];
}
