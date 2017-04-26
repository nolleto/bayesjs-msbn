"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class Graph {
    static get(g) {
        if (g instanceof Graph)
            return g;
        return new Graph(g.vertices);
    }
    static convertNetwork(net) {
        let vertices = [];
        // let dicst: { [id: string]:  } = {};
        for (let i in net.nodes) {
            let node = net.nodes[i];
            let vertices = [];
            for (let j in node.parents) {
                let pId = node.parents[j];
                vertices.push(pId);
            }
            let vertex = new index_1.Vertex(node.id, vertices);
        }
        return new Graph();
        // let graph = new Graph();
        // let nodesDict: { [id: string]: INode } = {};
        // for (let i in net.nodes) {
        //     let node = net.nodes[i];
        //     nodesDict[node.id] = node;
        // }
        // for (let i in graph.nodes) {
        //     let node = graph.nodes[i];
        //     for (let j in node.parents) {
        //         let p = node.parents[j];
        //         let edge = new Edge(node, nodesDict[p]);
        //         graph.edges.push(edge);
        //     }
        // }
        // return graph;
    }
    constructor(vertices = []) {
        this.vertices = vertices;
    }
    hasEdge(n1, n2) {
        return this.edges.some(e => {
            return (e.node1.id == n1.id && e.node2.id == n2.id) ||
                (e.node1.id == n2.id && e.node2.id == n1.id);
        });
    }
    /**
     * Returns neighbors (adjacents nodes) from the target node.
     * @param node Target node
     */
    getEdgesList(node) {
        const nodeId = node.id;
        return this.edges.reduce((p, edge) => {
            if (edge.node1.id == nodeId)
                p.push(edge.node2);
            else if (edge.node2.id == nodeId)
                p.push(edge.node1);
            return p;
        }, []);
    }
}
exports.Graph = Graph;
//# sourceMappingURL=graph.js.map