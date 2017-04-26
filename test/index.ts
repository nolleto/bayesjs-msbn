import { ParsedPath } from 'path';
import { expect } from 'chai';
import { INetwork, INode, ILinkage } from "../src/interfaces/index";
import { netD1, netD2, netD3 } from "../models/nets";
import { mergeNetworks, separateNodes, createLinksNodes, findParents, hasCycles, topologicalSort, msbn } from "../src/index";
import * as Merge from "../src/merge";

const createLink = (nodeId: string) => (net1: string, net2: string) => ([
  { networkId: net1, nodeId: nodeId }, 
  { networkId: net2, nodeId: nodeId }
] as [ILinkage, ILinkage]);

const getLinkages = () => {
  let linkages: [ILinkage, ILinkage][] = [];

  linkages.push(
    createLink('H1')(netD1.id, netD2.id)
  );
  linkages.push(
    createLink('H2')(netD1.id, netD2.id)
  );
  linkages.push(
    createLink('H2')(netD1.id, netD3.id)
  );
  linkages.push(
    createLink('H2')(netD2.id, netD3.id)
  );
  linkages.push(
    createLink('H3')(netD1.id, netD3.id)
  );
  linkages.push(
    createLink('H4')(netD1.id, netD3.id)
  );

  return linkages;
}

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
    let nets = [netD1, netD2, netD3];
    let linkages = getLinkages();
    let merge = mergeNetworks(nets, linkages);

    
  });

  it('New', () => {
    
    let nets = [netD1, netD2, netD3];
    let linkages = getLinkages();
    let merge = Merge.mergeNetworks(nets, linkages);
    
  })
});