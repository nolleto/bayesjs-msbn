"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addNode = (nodes) => (id, parents = []) => {
    nodes[id] = {
        id: id,
        parents
    };
};
let nodesD1 = {};
let nodeCreatorD1 = addNode(nodesD1);
let nodesD2 = {};
let nodeCreatorD2 = addNode(nodesD2);
let nodesD3 = {};
let nodeCreatorD3 = addNode(nodesD3);
nodeCreatorD1('H1');
nodeCreatorD1('H2', ['A1', 'A2']);
nodeCreatorD1('H3');
nodeCreatorD1('H4', ['A3']);
nodeCreatorD1('A1', ['H1']);
nodeCreatorD1('A2', ['H3']);
nodeCreatorD1('A3', ['H3']);
nodeCreatorD2('H1');
nodeCreatorD2('H2');
nodeCreatorD2('F1', ['H1', 'H2']);
nodeCreatorD2('F2', ['F1']);
nodeCreatorD3('H2');
nodeCreatorD3('H3');
nodeCreatorD3('H4');
nodeCreatorD3('E1', ['H4']);
nodeCreatorD3('E2', ['E1', 'E3']);
nodeCreatorD3('E3', ['H2', 'H3']);
exports.netD1 = {
    id: 'D1',
    name: 'D1',
    nodes: nodesD1
};
exports.netD2 = {
    id: 'D2',
    name: 'D2',
    nodes: nodesD2
};
exports.netD3 = {
    id: 'D3',
    name: 'D3',
    nodes: nodesD3
};
//# sourceMappingURL=nets.js.map