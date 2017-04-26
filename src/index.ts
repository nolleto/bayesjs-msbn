import { buildMoralGraph, buildTriangulatedGraph } from "./junctionTree";
import { v4 } from "uuid";
import { sortFunc, sort } from "./helpers";
import { inspect } from "util";

const log = (obj: object) => {
  console.log(inspect(obj, {showHidden: false, depth: null}))
};

const SUPER_NETWORK = 'SUPER_NETWORK';

export interface INode {
    id: string,
    states?: string[],
    parents: string[],
    cpt?: INodeCtp[]
}

export interface INodeCtp {
    when: INodeCtpWhen,
    then: INodeCtpThen
}

export interface INodeCtpWhen {
    [id: string] : string
}

export interface INodeCtpThen {
    [id: string]: number
}

export interface ICombinations {
  [key: string]: string
}

export interface INetwork {
    name: string,
    id: string,
    nodes: { [id: string]: INode }
}

export interface IIdentifier {
  [id: string]: {
    networkId: string,
    nodeId: string,
  }[]
}

export interface INodeNet {
  netId: string, 
  nodeId: string
};

export interface INodeSimle {
  id: string,
  parents: string[]
};

export interface INodeParent extends INodeNet {
  parents: INodeNet[]
};

export interface ISuperNode { 
  netId: string,
  nodeId: string,
  links: INodeNet[]
};

export interface INodeInfo { 
  netId: string,
  nodeId: string, 
  node: INodeParent 
};

export interface INodeIdentifier { 
  nodeId: string, 
  nodes: { 
    netId: string, 
    nodeId: string 
  }[]
};

export interface ILinkage {
  networkId: string,
  nodeId: string
}

export function infer(nets: INetwork[], linkages: [ILinkage, ILinkage][], nodes: ICombinations, giving?: ICombinations): number {
  
  return -1;
};

export const msbn = (nets: INetwork[], linkages: [ILinkage, ILinkage][]) => {
  let superNet = mergeNetworks(nets, linkages);
  let moral = buildMoralGraph(superNet.network.nodes);
  let triag = buildTriangulatedGraph(moral);

  //Separar nets com a moralização e a tringulação
}

/**
 * 
 * @param nets Filter nodes from multiple networs in two types: connecteds and not connected
 * @param linkages Linkages between networks
 */
export const separateNodes = (nets: INetwork[], linkages: [ILinkage, ILinkage][]): { notConnectedNodes: INodeInfo[], connectedNodes: INodeInfo[] } => {
  let notConnectedNodes: INodeInfo[] = [];
  let connectedNodes: INodeInfo[] = [];
  let links = linkages.reduce((p, [l1, l2]) => {
    p.push({
      networkId: l1.networkId,
      nodeId: l1.nodeId
    });
    p.push({
      networkId: l2.networkId,
      nodeId: l2.nodeId
    });
    return p;
  }, [] as { nodeId: string, networkId: string }[]);

  for (let net of nets) {
    let netId = net.id;
    const nodeIds = Object.keys(net.nodes)
    for (let nodeId of nodeIds) {
      const node = net.nodes[nodeId];
      let isLink = links.some(l => l.networkId == net.id && l.nodeId == nodeId);

      if (isLink) {
        connectedNodes.push({
          netId: net.id,
          nodeId: nodeId,
          node: {
            nodeId: node.id,
            parents: node.parents.map(id => ({ netId, nodeId: id } as INodeNet)),
            netId: netId
          }
        });

      } else {
        let newNodeId = nodeId;
        notConnectedNodes.push({
          netId: net.id,
          nodeId: newNodeId,
          node: {
            nodeId: node.id,
            parents: node.parents.map(id => ({ netId, nodeId: id } as INodeNet)),
            netId: netId
          }
        });
      }
    }
  }

  return {
    connectedNodes,
    notConnectedNodes
  };
};

/**
 * Group linked nodes
 * @param linkages Links
 */
export const createLinksNodes = (linkages: [ILinkage, ILinkage][]): ISuperNode[] => {
  let linkagesClone = linkages.slice();
  let superNodes: ISuperNode[] = [];
  let addLink = (list: INodeNet[]) => (item: INodeNet) => {
    if (!list.some(l => l.netId == item.netId && l.nodeId == item.nodeId)) {
      list.push(item);
    }
  };

  while (linkagesClone.length > 0) {
    let i = 0;
    let [l1, l2] = linkagesClone[i];
    let removes: number[] = [i];
    let links: INodeNet[] = [{
      netId: l2.networkId,
      nodeId: l2.nodeId
    }];
    let add = addLink(links);
    let sNode: ISuperNode = {
      netId: l1.networkId,
      nodeId: l1.nodeId,
      links: links
    };

    for (let j = i + 1; j < linkagesClone.length; j++) {
      let [j1, j2] = linkagesClone[j];

      if (l1.networkId == j1.networkId && l1.nodeId == j1.nodeId) {
        add({
          netId: j2.networkId,
          nodeId: j2.nodeId
        });
        removes.push(j);
      } else if (l1.networkId == j2.networkId && l1.nodeId == j2.nodeId) {
        add({
          netId: j1.networkId,
          nodeId: j1.nodeId
        });
        removes.push(j);
      } else {
        let tempLink: ILinkage;
        for (let l of links) {
          if (l.netId == j1.networkId && l.nodeId == j1.nodeId) {
            tempLink = j2;
            break;
          } else if (l.netId == j2.networkId && l.nodeId == j2.nodeId) {
            tempLink = j1;
            break;
          }
        }

        if (tempLink) {
          add({
            netId: tempLink.networkId,
            nodeId: tempLink.nodeId
          });
          removes.push(j);
        }
      }
    }
    
    linkagesClone = linkagesClone.filter((_, i) => removes.indexOf(i) === -1)

    superNodes.push(sNode);
  };

  return superNodes;
};

/**
 * Find all parents from nodo
 * @param n Target node
 * @param nodes All nodes
 */
export const findParents = (n: INodeNet, nodes: INodeInfo[]): INodeNet[] => {
  let node =  nodes.find(({ netId, nodeId }) => {
    return n.netId == netId && n.nodeId == nodeId;
  });

  if (node) {
    // console.log(`${JSON.stringify(n)} -> ${(node ? JSON.stringify(node.node.parents) : node)}`);
    return node.node.parents;
  }
  
  return [];
};

/**
 * Merge networks according with the linkages
 * @param nets Networks that will be merged.
 * @param linkages Links between the networks.
 */
export const mergeNetworks = (nets: INetwork[], linkages: [ILinkage, ILinkage][]): { network: INetwork, identifiers: IIdentifier } => {
  let finalNet: INetwork = {
    id: v4(),
    name: '',
    nodes: {}
  };
  
  let nodesIndetifier: INodeIdentifier[] = [];
  let { connectedNodes, notConnectedNodes } = separateNodes(nets, linkages);
  let superNodes = createLinksNodes(linkages);
  let nodes = [...notConnectedNodes];
  let tempNodes: INodeInfo[] = [];
  let allNodes = [...connectedNodes, ...notConnectedNodes];
  
  for (let info of superNodes) {
    let parents = [ ...info.links, { netId:info.netId, nodeId: info.nodeId } ];
    let nodeId = `${v4()}--${info.nodeId}`;
    let node: INodeParent = {
      nodeId,
      netId: SUPER_NETWORK,
      parents
    };
    
    tempNodes.push({
      netId: SUPER_NETWORK,
      nodeId,
      node: {
        nodeId: node.nodeId,
        netId: node.nodeId,
        parents: parents.reduce((prev, p) => {
          let newParents = findParents(p, allNodes);
          if (newParents) {
            prev = prev.concat(newParents);
          }
          return prev;
        }, [])
      }
    });
    nodesIndetifier.push({
      nodeId,
      nodes: node.parents
    });
  }

  // Renomear node.parents de acordo com nodesIndetifier
  nodes.forEach(n => {
    let parents = n.node.parents;

    parents.forEach((parent) => {
      // Procura se esse 'parent' tem uma ganhou um novo nome/identificador através do nodeIndetifier
      let n = nodesIndetifier.find(ni => {
        return ni.nodes.some(t => 
          t.netId == parent.netId &&
          t.nodeId == parent.nodeId
        );
      });

      // Se encontrou, esse node tem um novo nome
      if (n) {
        parent.netId = SUPER_NETWORK;
        parent.nodeId = n.nodeId;
      }
    });
  });

  // Renomear node.parents de acordo com nodesIndetifier
  tempNodes.forEach(n => {
    let parents = n.node.parents;

    parents.forEach((parent) => {
      // Procura se esse 'parent' tem uma ganhou um novo nome/identificador através do nodeIndetifier
      let n = nodesIndetifier.find(ni => {
        return ni.nodes.some(t => 
          t.netId == parent.netId &&
          t.nodeId == parent.nodeId
        );
      });

      // Se encontrou, esse node tem um novo nome
      if (n) {
        parent.netId = SUPER_NETWORK;
        parent.nodeId = n.nodeId;
      }
    });
  });

  finalNet.nodes = [...nodes, ...tempNodes].reduce((p, { nodeId, node }) => {
    p[nodeId] = {
      id: nodeId,
      parents: node.parents.map(p => p.nodeId)
    };
    return p;
  }, {} as { [id: string]: INode });

  const identifiers = nodesIndetifier.reduce((p, { nodeId, nodes }) => {
    p[nodeId] = nodes.map(({ netId, nodeId }) => ({
      nodeId,
      networkId: netId
    }));
    return p;
  }, {} as { [id: string]: any[] })

  
  return {
    network: finalNet,
    identifiers
  };
};

/**
 * Do the topological sort in a graph/network
 * @param nodes All nodes from the graph/network
 */
export const topologicalSort = (nodes: INode[]): { cyclic: boolean, sort: string[] } => {
  let nodeIds: string[] = nodes.map(n => n.id);
  let dict: { [id: string]: { parents: string[], childs: string[] } } = {};
  
  for (let id of nodeIds) {
    dict[id] = {
      childs: [],
      parents: []
    };
  }
  
  for (let node of nodes) {
    dict[node.id].parents = node.parents;

    for (let parentId of node.parents) {
      let t = dict[parentId].childs;
      dict[parentId].childs = [...t, node.id];
    }
  }

  let S: string[] = [];
  for (let id of nodeIds) {
    
    if (dict[id].parents.length == 0) {
      S.push(id);
    }
  }

  const removeEdge = (id1: string, id2: string) => {
    dict[id2].childs = dict[id2].childs.filter(x => x != id1);
    dict[id2].parents = dict[id2].parents.filter(x => x != id1);

    dict[id1].childs = dict[id1].childs.filter(x => x != id2);
    dict[id1].parents = dict[id1].parents.filter(x => x != id2);
  };

  let L = [];
  while (S.length > 0) {
    let n = S.shift();
    L.push(n);

    for (let m of dict[n].childs) {
      removeEdge(n, m);

      if (dict[m].parents.length == 0) {
        S.push(m);
      }
    }
  }

  let cyclic = false;
  const keys = Object.keys(dict);
  for (let key of keys) {
    const value = dict[key];
    if (value.childs.length > 0 || value.parents.length > 0) {
      cyclic = true;
      break;
    }
  }  

  return {
    cyclic,
    sort: L
  };
}

/**
 * Check if a graph/network has cycles.
 * @param nodes Array of nodes from graph/network.
 */
export const hasCycles = (nodes: INode[]): boolean => {
  return topologicalSort(nodes).cyclic;
}

// inferMSBN(
//   //sub-redes []
//   //linkage. link entre as sub-redes
//   //inferencias
//   //o que eu sei 
// )

// infer({//Rede
//   A: {
//     id: 'A'
//   },
//   B: {
//     id: 'B'
//   },
//   C: {
//     id: 'C'
//   },
//   D: {
//     id: 'D'
//   }
// }, {//Inferencia
//   A: 'F',
//   D: 'T'
// }, {//O que eu sei que é verdade (opicional)
//   C: 'T',
//   B: 'F'
// }); 
