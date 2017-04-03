import { Network } from '../src/models/network';
import { createNode } from "../src/helpers";

// http://aritter.github.io/courses/slides/jtbp.pdf (Page 5)
const node12 = createNode('12', ['6', '8']);
const node6 = createNode('6', ['3', '4']);
const node8 = createNode('8', ['7', '9']);
const node3 = createNode('3', ['1', '2']);
const node4 = createNode('4', ['2', '5']);
const node7 = createNode('7', ['5', '10']);
const node9 = createNode('9', ['10', '11']);
const node1 = createNode('1', []);
const node2 = createNode('2', []);
const node5 = createNode('5', []);
const node10 = createNode('10', []);
const node11 = createNode('11', []);
const nodes = [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12];

export const network = new Network(nodes);