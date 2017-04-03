import { Node } from './models/node';
import { INetwork } from "./interfaces/network";
import { IGraph } from "./interfaces/graph";
import { INode } from "./interfaces/node";

import { Graph } from "./models/graph";
import { Edge } from "./models/edge";

/*
1. consistency; 
2. Moralization; Check
3. Triangulation; 
*/
export class JunctionTree {
    /**
     * Morilize a network. Basicaly get a node by node and add a edge between all parents node;
     * @param net Target network
     */
    static moralize(net: INetwork): IGraph {
        let graph = new Graph();
        let nodesDict: { [id: string]: INode } = {};

        for (let i in net.nodes) {
            let node = net.nodes[i];

            nodesDict[node.id] = node;
        }

        for (let i in net.nodes) {
            let node = net.nodes[i];
            let parents: INode[] = [];

            graph.nodes.push(node);

            for (let j in node.parents) {
                let parentId = node.parents[j];
                let parent = nodesDict[parentId];

                if (!graph.hasEdge(node, parent)) {
                    let edge = new Edge(node, parent);

                    graph.edges.push(edge);
                }
                parents.push(parent);
            }
            this.ligarNodos(graph, parents);
        }

        return graph;
    }

    /**
     * Triangulation graph by elimination. Basicaly get a node, take off by
     * the graph, connect the edges/neighbors noc connecteds, add the node 
     * on de blacklist, get the next node.
     * Blacklist nodes not considering.
     * @param graph Target graph
     */
    static triangulation(graph: IGraph): IGraph {
        let nGraph = Graph.get({ ...graph });
        let bestNode = this.triangulateBestNode(nGraph);
        let checkeds: string[] = [];

        this.triangulate(nGraph, bestNode, checkeds);

        // Repeat while there exists a cycle of length > 3 with no chord:
        // Add a chord (edge between two non-adjacent
        // vertices in such a cycle).

        return nGraph;
    }

    /**
     * Triangulate node. Add edge between neighbors not conecteds
     * @param graph Target graph
     * @param node Target node
     * @param checkeds Nodes triangulateds. Blacklist
     */
    static triangulate(graph: Graph, node: INode, checkeds: string[] = []) {
        let neighbors = graph.getEdgesList(node)
            .filter(n => !checkeds.includes(n.id));

        this.ligarNodos(graph, neighbors);
        checkeds.push(node.id);

        // console.log(node.id, neighbors.map(Node.getId));

        if (checkeds.length < graph.nodes.length) {
            let next = this.triangulateBestNode(graph, checkeds);

            this.triangulate(graph, next, checkeds);
        }
    }

    /**
     * Search for the node with minimum of edges. 
     * @param graph Target graph
     * @param checkeds Nodes triangulateds. Blacklist
     */
    static triangulateBestNode(graph: Graph, checkeds: string[] = []): INode {
        const nodes = graph.nodes.filter(n => {
            return !checkeds.includes(n.id);
        });

        let getEdges = (node: INode) => {
            return graph.getEdgesList(node)
                .map(n => n.id)
                .filter(id => !checkeds.includes(id));
        };

        let best = nodes[0];
        let bestEdges = getEdges(best);

        for (let i = 1; i < nodes.length; i++) {
            let n = nodes[i];
            let edges = getEdges(n);

            if (edges.length < bestEdges.length) {
                best = n;
                bestEdges = getEdges(best);
            }
        }

        return best;
    }

    /**
     * connect all nodes.
     * @param graph Target graph.
     * @param nodes Nodes that you wannt to connect.
     */
    static ligarNodos(graph: Graph, nodes: INode[]) {
        if (nodes.length <= 1) return;
        for (let i = 0; i < nodes.length; i++) {
            let node1 = nodes[i];

            for (var j = i + 1; j < nodes.length; j++) {
                var node2 = nodes[j];

                if (!graph.hasEdge(node1, node2)) {
                    let edge = new Edge(node1, node2);

                    graph.edges.push(edge);
                }
            }
        }
    }
}

// Methodos de teste
// export namespace Teste {
//     export interface Point {
//         x: number;
//         y: number;
//     }

//     export class Teste {
//         min(x: number, y: number) {
//             return (x <= y) ? x : y
//         }

//         dist(p1: Point, p2: Point) {
//             return Math.sqrt(
//                 (p1.x - p2.x) + (p1.x - p2.x) * 
//                 (p1.y - p2.y) * (p1.y - p2.y));
//         }

//         cost(points: Point[], i: number, j: number, k: number) {
//             const p1 = points[i];
//             const p2 = points[j];
//             const p3 = points[k];

//             return this.dist(p1, p2) + this.dist(p2, p3) + this.dist(p3, p1);
//         }

//         mTC(points: Point[], i: number, j: number): number {
//             // There must be at least three points between i and j
//             // (including i and j)
//             if (j < i + 2) return 0;

//             // Initialize result as infinite
//             let res = Infinity;

//             // Find minimum triangulation by considering all
//             for (let k = i + 1; k < j; k++)
//                 res = this.min(
//                     res,
//                     (
//                         this.mTC(points, i, k) +
//                         this.mTC(points, k, j) +
//                         this.cost(points, i, k, j)
//                     )
//                 );
//             return res;
//         }

//         mTC2(points: Point[], i: number, j: number): number {
//             // There must be at least three points between i and j
//             // (including i and j)
//             if (j < i + 2) return 0;

//             // Initialize result as infinite
//             let res = Infinity;

//             // Find minimum triangulation by considering all
//             for (let k = i + 1; k < j; k++)
//                 res = this.min(
//                     res,
//                     (
//                         this.mTC(points, i, k) +
//                         this.mTC(points, k, j) +
//                         this.cost(points, i, k, j)
//                     )
//                 );
//             return res;
//         }

//         mwt(graph: IGraph) {

//         }

//         /**
//          * Pego do UnBBayes
//          * @param graph 
//          * @param node 
//          */
//         isNeedingMoreArc(graph: Graph, node: INode): boolean {
//             var edges = graph.getEdgesList(node);
//             if (edges.length < 2) return false;

//             for (let i = edges.length-1; i > 0; i--) {
//                 let auxNo1 = edges[i];
        
//                 for (let j = i - 1; j >=0; j--) {
//                     let auxNo2 = edges[j];
//                     let auxNo2Edges = graph.getEdgesList(auxNo2)
                    
//                     if (!auxNo2Edges.map(Node.getId).includes(auxNo1.id)) {
//                         return true;
//                     }
//                 }
//             }
//             return false;
//         }

//     }
// }



