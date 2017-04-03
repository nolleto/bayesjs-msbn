import { Edge } from './edge';
import { INetwork } from '../interfaces/network';
import { ConfigReader } from 'jspm-config/dist/es5/ConfigReader';
import { INode } from "../interfaces/node";
import { IEdge } from "../interfaces/edge";
import { IGraph } from "../interfaces/graph";

export class Graph implements IGraph {
    nodes: INode[];
    edges: IEdge[];

    static get(g: IGraph): Graph {
        if (g instanceof Graph) return g;
        return new Graph(g.nodes, g.edges);
    }

    static convertNetwork(net: INetwork) : Graph {
        let graph = new Graph([ ...net.nodes ]);
        let nodesDict: { [id: string]: INode } = {};

        for (let i in net.nodes) {
            let node = net.nodes[i];

            nodesDict[node.id] = node;
        }
        
        for (let i in graph.nodes) {
            let node = graph.nodes[i];

            for (let j in node.parents) {
                let p = node.parents[j];
                let edge = new Edge(node, nodesDict[p]);

                graph.edges.push(edge);
            }
        }

        return graph;
    }

    constructor(nodes: INode[] = [], edges: IEdge[] = []) {
        this.nodes = nodes;
        this.edges = edges;
    }

    hasEdge(n1: INode, n2: INode) {
        return this.edges.some(e => {
            return (e.node1.id == n1.id && e.node2.id == n2.id) ||
                (e.node1.id == n2.id && e.node2.id == n1.id);
        });
    }

    /**
     * Returns neighbors (adjacents nodes) from the target node.
     * @param node Target node
     */
    getEdgesList(node: INode): INode[] {
        const nodeId = node.id;

        return this.edges.reduce((p, edge) => {
            if (edge.node1.id == nodeId) p.push(edge.node2);
            else if (edge.node2.id == nodeId) p.push(edge.node1);
            return p;
        }, []);
    }
}