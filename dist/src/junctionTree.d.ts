export declare const buildTriangulatedGraph: (moralGraph: IMoralGraph) => IMoralGraph;
export interface IMoralGraph {
    addNode: (node: string) => void;
    removeNode: (node: string) => void;
    getNodes: () => string[];
    containsNode: (node: string) => boolean;
    addEdge: (nodeA: string, nodeB: string) => void;
    removeEdge: (nodeA: string, nodeB: string) => void;
    getEdges: () => [string, string][];
    areConnected: (nodeA: string, nodeB: string) => boolean;
    getNeighborsOf: (node: string) => string[];
    clone: () => IMoralGraph;
    print: () => void;
}
export declare const buildMoralGraph: (network: {
    [id: string]: {
        id: string;
        parents: string[];
    };
}) => IMoralGraph;
