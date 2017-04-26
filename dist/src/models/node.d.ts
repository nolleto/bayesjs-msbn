import { INode, INodeCtp } from "../interfaces/node";
export declare class Node implements INode {
    id: string;
    states: string[];
    parents: string[];
    cpt: INodeCtp[];
    static get(n: INode): Node;
    static getId(n: INode): string;
    constructor(id: string, states?: string[], parents?: string[], cpt?: INodeCtp[]);
}
