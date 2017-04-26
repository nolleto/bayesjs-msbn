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
