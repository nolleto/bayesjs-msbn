import { Network } from '../src/models/network';
import { createNode } from "../src/helpers";

const node1 = createNode('1', ['2', '3']);
const node2 = createNode('2');
const node3 = createNode('3');
const nodes = [node1, node2, node3];

export const network = new Network(nodes);