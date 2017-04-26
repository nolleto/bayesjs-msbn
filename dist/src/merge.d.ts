export interface INode {
    id: string;
    states?: string[];
    parents: string[];
    cpt?: INodeCtp[] | INodeCtpObject;
}
export interface INodeCtpObject {
    [id: string]: number;
}
export interface INodeCtp {
    when: INodeCtpWhen;
    then: INodeCtpThen;
}
export interface INodeCtpWithNetwork extends INodeCtp {
    networkId: string;
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
export interface ICptObjectWithNetwork {
    [id: string]: {
        networkId: string;
        value: number;
    };
}
export interface ISuperNode {
    id: string;
    states?: string[];
    parents: ILinkageItem[];
    cpt?: INodeCtpWithNetwork[] | ICptObjectWithNetwork;
    originals: INodeWithNetwork[];
}
export declare const createSuperNodes: (nodes: INodeWithNetwork[], linkages: [ILinkageItem, ILinkageItem][]) => ISuperNode[];
export declare const createSuperNode: (node: INodeWithNetwork) => ISuperNode;
export interface ISuperNetwork {
    nodes?: {
        [id: string]: INode;
    };
}
export interface IIdentifiers {
    originalToNew: IIdentifierOriginalToNew;
    newToOriginal: IIdentifierNewToOriginal;
}
export interface IMergeNetworks {
    network: ISuperNetwork;
    identifiers: IIdentifiers;
}
export interface IIdentifierOriginalToNew {
    [id: string]: string;
}
export interface IIdentifierNewToOriginal {
    [id: string]: ILinkageItem[];
}
export declare const createKey: (networkId: string, nodeId: string) => string;
export declare const keyToNetworkAndNode: (key: string) => {
    networkId: string;
    nodeId: string;
};
export declare const createIdentifier: (nodes: ISuperNode[]) => IIdentifiers;
export declare const mergeCpts: (cpts: ICptObjectWithNetwork | INodeCtpWithNetwork[], identifiers: {
    [id: string]: string;
}) => INodeCtpObject | INodeCtp[];
export declare const mergeNetworks: (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]) => IMergeNetworks;
