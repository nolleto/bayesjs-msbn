export interface INode {
    id: string;
    states?: string[];
    parents: string[];
    cpt?: INodeCtp[];
}
export interface INodeCtp {
    when: INodeCtpWhen;
    then: INodeCtpThen;
}
export interface INodeCtpWhen {
    [id: string]: string;
}
export interface INodeCtpThen {
    [id: string]: number;
}
export interface ICombinations {
    [key: string]: string;
}
export interface INetwork {
    name: string;
    id: string;
    nodes: {
        [id: string]: INode;
    };
}
export interface IIdentifier {
    [id: string]: {
        networkId: string;
        nodeId: string;
    }[];
}
export interface INodeNet {
    netId: string;
    nodeId: string;
}
export interface INodeSimle {
    id: string;
    parents: string[];
}
export interface INodeParent extends INodeNet {
    parents: INodeNet[];
}
export interface ISuperNode {
    netId: string;
    nodeId: string;
    links: INodeNet[];
}
export interface INodeInfo {
    netId: string;
    nodeId: string;
    node: INodeParent;
}
export interface INodeIdentifier {
    nodeId: string;
    nodes: {
        netId: string;
        nodeId: string;
    }[];
}
export interface ILinkage {
    networkId: string;
    nodeId: string;
}
export declare function infer(nets: INetwork[], linkages: [ILinkage, ILinkage][], nodes: ICombinations, giving?: ICombinations): number;
export declare const msbn: (nets: INetwork[], linkages: [ILinkage, ILinkage][]) => void;
/**
 *
 * @param nets Filter nodes from multiple networs in two types: connecteds and not connected
 * @param linkages Linkages between networks
 */
export declare const separateNodes: (nets: INetwork[], linkages: [ILinkage, ILinkage][]) => {
    notConnectedNodes: INodeInfo[];
    connectedNodes: INodeInfo[];
};
/**
 * Group linked nodes
 * @param linkages Links
 */
export declare const createLinksNodes: (linkages: [ILinkage, ILinkage][]) => ISuperNode[];
/**
 * Find all parents from nodo
 * @param n Target node
 * @param nodes All nodes
 */
export declare const findParents: (n: INodeNet, nodes: INodeInfo[]) => INodeNet[];
/**
 * Merge networks according with the linkages
 * @param nets Networks that will be merged.
 * @param linkages Links between the networks.
 */
export declare const mergeNetworks: (nets: INetwork[], linkages: [ILinkage, ILinkage][]) => {
    network: INetwork;
    identifiers: IIdentifier;
};
/**
 * Do the topological sort in a graph/network
 * @param nodes All nodes from the graph/network
 */
export declare const topologicalSort: (nodes: INode[]) => {
    cyclic: boolean;
    sort: string[];
};
/**
 * Check if a graph/network has cycles.
 * @param nodes Array of nodes from graph/network.
 */
export declare const hasCycles: (nodes: INode[]) => boolean;
