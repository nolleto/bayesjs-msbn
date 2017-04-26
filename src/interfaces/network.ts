import { INode } from "./node";

export interface INetwork {
    name: string,
    id: string,
    nodes: { [id: string]: INode }
}