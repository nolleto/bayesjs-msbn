"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTriangulatedGraph = (moralGraph) => {
    const triangulatedGraph = moralGraph.clone();
    const clonedGraph = triangulatedGraph.clone();
    const nodesToRemove = clonedGraph.getNodes()
        .map(node => {
        return {
            node,
            neighbors: clonedGraph.getNeighborsOf(node)
        };
    })
        .sort((a, b) => {
        return a.neighbors.length - b.neighbors.length;
    });
    while (nodesToRemove.length > 0) {
        const nodeToRemove = nodesToRemove.shift();
        for (let i = 0; i < nodeToRemove.neighbors.length; i++) {
            for (let j = i + 1; j < nodeToRemove.neighbors.length; j++) {
                const neighborA = nodeToRemove.neighbors[i];
                const neighborB = nodeToRemove.neighbors[j];
                if (!clonedGraph.containsNode(neighborA) || !clonedGraph.containsNode(neighborB)) {
                    continue;
                }
                if (!clonedGraph.areConnected(neighborA, neighborB)) {
                    clonedGraph.addEdge(neighborA, neighborB);
                    triangulatedGraph.addEdge(neighborA, neighborB);
                }
            }
        }
        clonedGraph.removeNode(nodeToRemove.node);
    }
    return triangulatedGraph;
};
exports.buildMoralGraph = (network) => {
    const nodes = Object.keys(network).map(id => network[id]);
    const moralGraph = createGraph();
    for (const node of nodes) {
        moralGraph.addNode(node.id);
        for (const parentId of node.parents) {
            moralGraph.addEdge(parentId, node.id);
        }
    }
    for (const node of nodes) {
        for (let i = 0; i < node.parents.length; i++) {
            for (let j = i + 1; j < node.parents.length; j++) {
                if (!moralGraph.areConnected(node.parents[i], node.parents[j])) {
                    moralGraph.addEdge(node.parents[i], node.parents[j]);
                }
            }
        }
    }
    return moralGraph;
};
const createGraph = () => {
    const nodes = [];
    const edges = [];
    const addNode = (nodeId) => {
        nodes.push(nodeId);
    };
    const removeNode = (node) => {
        for (let i = edges.length - 1; i >= 0; i--) {
            if (edges[i][0] === node || edges[i][1] === node) {
                edges.splice(i, 1);
            }
        }
        for (let i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i] === node) {
                nodes.splice(i, 1);
                break;
            }
        }
    };
    const getNodes = () => {
        return nodes;
    };
    const containsNode = (node) => {
        return nodes.some(x => x === node);
    };
    const addEdge = (nodeA, nodeB) => {
        edges.push([nodeA, nodeB]);
    };
    const removeEdge = (nodeA, nodeB) => {
        for (let i = edges.length - 1; i >= 0; i--) {
            const shouldRemove = (edges[i][0] === nodeA && edges[i][1] === nodeB) ||
                (edges[i][0] === nodeB && edges[i][1] === nodeA);
            if (shouldRemove) {
                edges.splice(i, 1);
            }
        }
    };
    const getEdges = () => {
        return edges;
    };
    const areConnected = (nodeA, nodeB) => {
        return edges.some(edge => {
            return (edge[0] === nodeA && edge[1] === nodeB) ||
                (edge[0] === nodeB && edge[1] === nodeA);
        });
    };
    const getNeighborsOf = (node) => {
        const neighbors = [];
        for (const edge of edges) {
            if (edge[0] === node) {
                neighbors.push(edge[1]);
            }
            else if (edge[1] === node) {
                neighbors.push(edge[0]);
            }
        }
        return neighbors;
    };
    const clone = () => {
        const clonedGraph = createGraph();
        for (const node of nodes) {
            clonedGraph.addNode(node);
        }
        for (const edge of edges) {
            clonedGraph.addEdge(edge[0], edge[1]);
        }
        return clonedGraph;
    };
    return {
        addNode,
        removeNode,
        getNodes,
        containsNode,
        addEdge,
        removeEdge,
        getEdges,
        areConnected,
        getNeighborsOf,
        clone,
        print: () => {
            console.log('nodes');
            console.dir(nodes);
            console.log('edges');
            console.dir(edges);
        }
    };
};
//# sourceMappingURL=junctionTree.js.map