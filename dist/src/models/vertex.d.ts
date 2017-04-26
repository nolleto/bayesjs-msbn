import { IVertex } from "../interfaces/index";
export declare class Vertex implements IVertex {
    id: string;
    edges: string[];
    constructor(id: string, edges?: string[]);
}
