import { Network } from '../src/models/network';
import { createNode } from "../src/helpers";

// http://www.inf.ed.ac.uk/teaching/courses/pmr/slides/jta-2x2.pdf (Page 2)
const nodeA = createNode('A');
const nodeB = createNode('B', ['A']);
const nodeC = createNode('C', ['A']);
const nodeD = createNode('D', ['B']);
const nodeE = createNode('E', ['C']);
const nodeF = createNode('F', ['B', 'E']);
const nodes = [nodeA, nodeB, nodeC, nodeD, nodeE, nodeF];

export const network = new Network(nodes);