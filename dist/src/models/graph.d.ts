import { INetwork, INode, IVertex, IGraph } from "../interfaces/index";
export declare class Graph implements IGraph {
    vertices: IVertex[];
    static get(g: IGraph): Graph;
    static convertNetwork(net: INetwork): Graph;
    constructor(vertices?: IVertex[]);
    hasEdge(n1: INode, n2: INode): any;
    /**
     * Returns neighbors (adjacents nodes) from the target node.
     * @param node Target node
     */
    getEdgesList(node: INode): INode[];
}
