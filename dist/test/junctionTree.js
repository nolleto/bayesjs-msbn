// import { getDiffieHellman } from 'crypto';
// import { network } from '../models/example3';
// import { simpleGraph, createNode, getterNode } from '../src/helpers';
// import { expect } from 'chai';
// import { Node } from "../src/models/node";
// import { JunctionTree } from "../src/junctionTree";
// import { Graph } from "../src/models/graph";
// import { Edge } from "../src/models/edge";
// import { Network } from "../src/models/network";
// import { IEdge } from "../src/interfaces/edge";
// import { INode } from "../src/interfaces/node";
// import { INetwork } from "../src/interfaces/network";
// import { IGraph } from "../src/interfaces/graph";
// import * as example1 from "../models/example1";
// import * as example2 from "../models/example2";
// import * as example3 from "../models/example3";
// const network1 = example1.network;
// const network2 = example2.network;
// const network3 = example3.network;
// describe('Junction Tree', () => {
//   describe('Network to Graph', () => {
//     it('Example 1', () => {
//       let net = network1; 
//       let gn = getterNode(net.nodes);
//       let graph = Graph.convertNetwork(net);
//       let rGraph = new Graph(net.nodes, [new Edge(gn('1'), gn('2')), new Edge(gn('1'), gn('3'))]);
//       expect(simpleGraph(graph)).to.eql(simpleGraph(rGraph));
//     });
//     it('Example 2', () => {
//       let net = network2; 
//       let gn = getterNode(net.nodes);
//       let graph = Graph.convertNetwork(net);
//       let rGraph = new Graph(net.nodes, [
//         new Edge(gn('B'), gn('A')), 
//         new Edge(gn('C'), gn('A')), 
//         new Edge(gn('D'), gn('B')), 
//         new Edge(gn('E'), gn('C')), 
//         new Edge(gn('F'), gn('B')), 
//         new Edge(gn('F'), gn('E'))
//       ]);
//       expect(simpleGraph(graph)).to.eql(simpleGraph(rGraph));
//     });
//     it('Example 3', () => {
//       let net = network3; 
//       let gn = getterNode(net.nodes);
//       let graph = Graph.convertNetwork(net);
//       let rGraph = new Graph(net.nodes, [
//         new Edge(gn('12'), gn('6')), 
//         new Edge(gn('12'), gn('8')), 
//         new Edge(gn('6'), gn('3')), 
//         new Edge(gn('6'), gn('4')), 
//         new Edge(gn('8'), gn('7')), 
//         new Edge(gn('8'), gn('9')), 
//         new Edge(gn('3'), gn('1')), 
//         new Edge(gn('3'), gn('2')), 
//         new Edge(gn('4'), gn('2')), 
//         new Edge(gn('4'), gn('5')), 
//         new Edge(gn('7'), gn('5')), 
//         new Edge(gn('7'), gn('10')), 
//         new Edge(gn('9'), gn('10')), 
//         new Edge(gn('9'), gn('11'))
//       ]);
//       expect(simpleGraph(graph)).to.eql(simpleGraph(rGraph));
//     });
//   });
//   describe('Moralize', () => {
//     it('Empty', () => {
//       let net = new Network();
//       let graph = new Graph();
//       let newGraph = JunctionTree.moralize(net);
//       expect(graph).to.eql(newGraph);
//       expect(newGraph.nodes.length).to.equal(net.nodes.length);
//       expect(newGraph.edges.length).to.equal(0);
//     });
//     it('Example 1', () => {
//       let net = network1;
//       let gn = getterNode(net.nodes);
//       let rGraph = Graph.convertNetwork(net);
//       rGraph.edges.push(new Edge(gn('2'), gn('3')));
//       let mGraph = JunctionTree.moralize(net);
//       expect(rGraph).to.eql(mGraph);
//       expect(mGraph.nodes.length).to.equal(net.nodes.length);
//       expect(mGraph.edges.length).to.equal(3);
//     });
//     it('Example 2', () => {
//       let net = network2;
//       let rGraph = Graph.convertNetwork(net);
//       let gN = getterNode(net.nodes);
//       rGraph.edges.push(new Edge(gN('B'), gN('E')));
//       let mGraph = JunctionTree.moralize(net);
//       expect(simpleGraph(rGraph)).to.eql(simpleGraph(mGraph));
//       expect(mGraph.nodes.length).to.equal(net.nodes.length);
//       expect(mGraph.edges.length).to.equal(7);
//     });
//     it('Example 3', () => {
//       let net = network3;
//       let rGraph = Graph.convertNetwork(net);
//       let gN = getterNode(net.nodes);
//       rGraph.edges.push(new Edge(gN('1'), gN('2')));
//       rGraph.edges.push(new Edge(gN('2'), gN('5')));
//       rGraph.edges.push(new Edge(gN('5'), gN('10')));
//       rGraph.edges.push(new Edge(gN('10'), gN('11')));
//       rGraph.edges.push(new Edge(gN('3'), gN('4')));
//       rGraph.edges.push(new Edge(gN('7'), gN('9')));
//       rGraph.edges.push(new Edge(gN('6'), gN('8')));
//       let mGraph = JunctionTree.moralize(net);
//       expect(simpleGraph(rGraph)).to.eql(simpleGraph(mGraph));
//       expect(mGraph.nodes.length).to.equal(net.nodes.length);
//       expect(mGraph.edges.length).to.equal(21);
//     });
//   });
//   describe('Triangulation', () => {
//     // http://www.inf.ed.ac.uk/teaching/courses/pmr/slides/jta-2x2.pdf (Page 4)  
//     it('Example from Internet', () => {
//       let nodeA = createNode('A', ['B', 'C']);
//       let nodeB = createNode('B');
//       let nodeC = createNode('C');
//       let nodeD = createNode('D', ['B', 'C']);
//       let nodes = [nodeA, nodeB, nodeC, nodeD];
//       let mGraph = JunctionTree.moralize(new Network(nodes));
//       let tGraph = JunctionTree.triangulation(mGraph);
//       expect(tGraph.edges.length).to.equal(5);
//     });
//     it('Example 1', () => {
//       let net = network1;
//       let mGraph = JunctionTree.moralize(net);
//       let tGraph = JunctionTree.triangulation(mGraph);
//       expect(mGraph.nodes.length).to.equal(net.nodes.length);
//       expect(mGraph.edges.length).to.equal(3);
//     });
//     it('Example 2', () => {
//       let net = network2;
//       let mGraph = JunctionTree.moralize(net);
//       let tGraph = JunctionTree.triangulation(mGraph);
//       expect(mGraph.nodes.length).to.equal(net.nodes.length);
//       expect(mGraph.edges.length).to.equal(8);
//     });
//   });
// });
// // describe('Teste', () => {
// //   it('Teste', () => {
// //     let teste = new Teste.Teste();
// //     let grap = Graph.convertNetwork(network2);
// //     let getNode = (id: string) => grap.nodes.find(x => x.id == id);
// //     grap.edges.push(new Edge(getNode('B'), getNode('E')));
// //     grap.edges.push(new Edge(getNode('B'), getNode('C')));
// //     console.log(JSON.stringify(simpleGraph(grap)))
// //     for (let i in grap.nodes) {
// //       let node = grap.nodes[i];
// //       let b = teste.isNeedingMoreArc(grap, node);
// //       console.log(node.id, b)
// //     }
// //   });
// // }); 
//# sourceMappingURL=junctionTree.js.map