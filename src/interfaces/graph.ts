import { INode } from "./node";
import { IEdge } from "./edge";

export interface IGraph {
    nodes: INode[],
    edges: IEdge[]
}