import { INode } from "../interfaces/node";
import { INetwork } from "../interfaces/network";
export declare class Network implements INetwork {
    nodes: INode[];
    static get(n: INetwork): Network;
    constructor(nodes?: INode[]);
}
