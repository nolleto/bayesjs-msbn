"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nets_1 = require("../models/nets");
// import { mergeNetworks, separateNodes, createLinksNodes, findParents, hasCycles, topologicalSort, msbn } from "../src/index";
const merge_1 = require("../src/merge");
const createLink = (nodeId) => (net1, net2) => [
    { networkId: net1, nodeId: nodeId },
    { networkId: net2, nodeId: nodeId }
];
const getLinkages = () => {
    let linkages = [];
    linkages.push(createLink('H1')(nets_1.netD1.id, nets_1.netD2.id));
    linkages.push(createLink('H2')(nets_1.netD1.id, nets_1.netD2.id));
    linkages.push(createLink('H2')(nets_1.netD1.id, nets_1.netD3.id));
    linkages.push(createLink('H2')(nets_1.netD2.id, nets_1.netD3.id));
    linkages.push(createLink('H3')(nets_1.netD1.id, nets_1.netD3.id));
    linkages.push(createLink('H4')(nets_1.netD1.id, nets_1.netD3.id));
    return linkages;
};
// describe('MSBN', () => {
//   it('separateNodes', () => {
//   });
//   it('createLinksNodes', () => {
//   });
//   it('findParents', () => {
//   });
//   describe('Check cyclic graph', () => {
//     it('acyclic graph 1', () => {
//       let nodes = netD1.nodes;
//       let entries = Object.entries(nodes);
//       let nodesList: INode[] = [];
//       for (let [nodeId, node] of entries){
//         nodesList.push(node);
//       }
//       expect(hasCycles(nodesList)).to.be.false;
//     });
//     it('acyclic graph 2', () => {
//       let nodes: INode[] = [{
//         id: 'A',
//         parents: ['C']
//       }, {
//         id: 'B',
//         parents: ['A', 'C']
//       }, {
//         id: 'C',
//         parents: []
//       }];
//       expect(hasCycles(nodes)).to.be.false;
//     });
//     it('acyclic graph 3', () => {
//       let nodes: INode[] = [{
//         id: '5',
//         parents: []
//       }, {
//         id: '7',
//         parents: []
//       }, {
//         id: '3',
//         parents: []
//       }, {
//         id: '11',
//         parents: ['5', '7']
//       }, {
//         id: '8',
//         parents: ['7', '3']
//       }, {
//         id: '2',
//         parents: ['11']
//       }, {
//         id: '9',
//         parents: ['11', '8']
//       }, {
//         id: '10',
//         parents: ['3', '11']
//       }];
//       expect(hasCycles(nodes)).to.be.false;
//     });
//     it('cyclic graph', () => {
//       let nodes: INode[] = [{
//         id: 'A',
//         parents: ['C']
//       }, {
//         id: 'B',
//         parents: ['A']
//       }, {
//         id: 'C',
//         parents: ['B']
//       }];
//       expect(hasCycles(nodes)).to.be.true;
//     });
//   });
//   it('Join Networs (mergeNetworks)', () => {
//     let nets = [netD1, netD2, netD3];
//     let linkages = getLinkages();
//     let merge = mergeNetworks(nets, linkages);
//   });
//   it('Teste', () => {
//     let nets = [netD1, netD2, netD3];
//     let linkages = getLinkages();
//     msbn(nets, linkages);
//   });
// });
describe('MSBN', () => {
    // it('Old', () => {
    //   let nets = [netD1, netD2, netD3];
    //   let linkages = getLinkages();
    //   let merge = mergeNetworks(nets, linkages);
    // });
    it('New', () => {
        let nets = [{ "id": "86d4f2c2-a36a-490c-afc4-41a374f69c70", "name": "Resfriado", "nodes": { "Tosse": { "id": "Tosse", "states": ["Sim", "Não"], "parents": [], "cpt": { "Sim": 0.5, "Não": 0.5 } }, "Espiro": { "id": "Espiro", "states": ["Sim", "Não"], "parents": [], "cpt": { "Sim": 0.5, "Não": 0.5 } }, "Resfriado": { "id": "Resfriado", "states": ["Sim", "Não"], "parents": ["Espiro", "Tosse"], "cpt": [{ "when": { "Espiro": "Sim", "Tosse": "Sim" }, "then": { "Sim": 0.5, "Não": 0.5 } }, { "when": { "Espiro": "Não", "Tosse": "Sim" }, "then": { "Sim": 0.5, "Não": 0.5 } }, { "when": { "Espiro": "Sim", "Tosse": "Não" }, "then": { "Sim": 0.5, "Não": 0.5 } }, { "when": { "Espiro": "Não", "Tosse": "Não" }, "then": { "Sim": 0.5, "Não": 0.5 } }] } } }, { "id": "86d4f2c2-a36a-490c-afc4-41a374f69c71", "name": "Resfriado Consequencia", "nodes": { "Resfriado": { "id": "Resfriado", "states": ["Sim", "Não"], "parents": [], "cpt": { "Sim": 0.5, "Não": 0.5 } }, "Gripe": { "id": "Gripe", "states": ["Sim", "Não"], "parents": ["Resfriado"], "cpt": [{ "when": { "Resfriado": "Sim" }, "then": { "Sim": 0.5, "Não": 0.5 } }, { "when": { "Resfriado": "Não" }, "then": { "Sim": 0.5, "Não": 0.5 } }] }, "Pneumonia": { "id": "Pneumonia", "states": ["Sim", "Não"], "parents": ["Resfriado"], "cpt": [{ "when": { "Resfriado": "Sim" }, "then": { "Sim": 0.5, "Não": 0.5 } }, { "when": { "Resfriado": "Não" }, "then": { "Sim": 0.5, "Não": 0.5 } }] } } }];
        let linkages = [[{ "networkId": "86d4f2c2-a36a-490c-afc4-41a374f69c70", "nodeId": "Resfriado" }, { "networkId": "86d4f2c2-a36a-490c-afc4-41a374f69c71", "nodeId": "Resfriado" }]];
        let merge = merge_1.mergeNetworks(nets, linkages);
    });
});
exports.rain = {
    id: 'RAIN',
    states: ['T', 'F'],
    parents: [],
    cpt: { 'T': 0.2, 'F': 0.8 }
};
exports.sprinkler = {
    id: 'SPRINKLER',
    states: ['T', 'F'],
    parents: ['RAIN'],
    cpt: [
        { when: { 'RAIN': 'T' }, then: { 'T': 0.01, 'F': 0.99 } },
        { when: { 'RAIN': 'F' }, then: { 'T': 0.4, 'F': 0.6 } }
    ]
};
exports.grassWet = {
    id: 'GRASS_WET',
    states: ['T', 'F'],
    parents: ['RAIN', 'SPRINKLER'],
    cpt: [
        { when: { 'RAIN': 'T', 'SPRINKLER': 'T' }, then: { 'T': 0.99, 'F': 0.01 } },
        { when: { 'RAIN': 'T', 'SPRINKLER': 'F' }, then: { 'T': 0.8, 'F': 0.2 } },
        { when: { 'RAIN': 'F', 'SPRINKLER': 'T' }, then: { 'T': 0.9, 'F': 0.1 } },
        { when: { 'RAIN': 'F', 'SPRINKLER': 'F' }, then: { 'T': 0, 'F': 1 } }
    ]
};
exports.grassWet2 = {
    id: 'GRASS_WET',
    states: ['T', 'F'],
    parents: [],
    cpt: { 'T': 0.5, 'F': 0.5 }
};
exports.test = {
    id: 'TEST',
    states: ['T', 'F'],
    parents: ['GRASS_WET'],
    cpt: [
        { when: { 'GRASS_WET': 'T' }, then: { 'T': 0.01, 'F': 0.99 } },
        { when: { 'GRASS_WET': 'F' }, then: { 'T': 0.4, 'F': 0.6 } }
    ]
};
//# sourceMappingURL=index.js.map