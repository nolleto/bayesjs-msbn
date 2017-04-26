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
export interface INetwork {
    name: string;
    id: string;
    nodes: {
        [id: string]: INode;
    };
}
export interface ILinkageItem {
    networkId: string;
    nodeId: string;
}
export interface INodeWithNetwork extends INode {
    networkId: string;
}
export interface ISepareteNodesResult {
    connectedNodes: INodeWithNetwork[];
    notConnectedNodes: INodeWithNetwork[];
}
export declare const separeteNodes: (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]) => ISepareteNodesResult;
export interface ICreateSuperNodesResult extends INodeWithNetwork {
    original: INodeWithNetwork[];
}
export interface ISuperNode extends INodeWithNetwork {
    original: INodeWithNetwork[];
}
export declare const createSuperNodes: (nodes: INodeWithNetwork[], linkages: [ILinkageItem, ILinkageItem][]) => ICreateSuperNodesResult;
export declare const mergeNetworks: (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]) => INetwork;
