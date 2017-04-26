"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nets_1 = require("../models/nets");
const index_1 = require("../src/index");
const Merge = require("../src/merge");
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
    it('Old', () => {
        let nets = [nets_1.netD1, nets_1.netD2, nets_1.netD3];
        let linkages = getLinkages();
        let merge = index_1.mergeNetworks(nets, linkages);
    });
    it('New', () => {
        let nets = [nets_1.netD1, nets_1.netD2, nets_1.netD3];
        let linkages = getLinkages();
        let merge = Merge.mergeNetworks(nets, linkages);
    });
});
//# sourceMappingURL=index.js.map