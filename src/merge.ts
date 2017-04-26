import { inspect } from "util";
import { v4 } from "uuid";

const log = (obj: object) => {
  console.log(inspect(obj, {showHidden: false, depth: null}))
};

/* DEFAULT */
export interface INode {
    id: string,
    states?: string[],
    parents: string[],
    cpt?: INodeCtp[] | INodeCtpObject
}

export interface INodeCtpObject {
    [id: string]: number
}

export interface INodeCtp {
    when: INodeCtpWhen,
    then: INodeCtpThen
}

export interface INodeCtpWithNetwork extends INodeCtp {
    networkId: string,
}

export interface INodeCtpWhen {
    [id: string] : string
}

export interface INodeCtpThen {
    [id: string]: number
}

export interface INetwork {
    name: string,
    id: string,
    nodes: { [id: string]: INode }
}
/* DEFAULT */


export interface ILinkageItem {
  networkId: string,
  nodeId: string
}

export interface INodeWithNetwork extends INode {
  networkId: string
}

export interface ISepareteNodesResult {
  connectedNodes: INodeWithNetwork[],
  notConnectedNodes: INodeWithNetwork[],
}

export const createNodeId = (nodeId: string) => `${v4()}--${nodeId}`;

export const separeteNodes = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]): ISepareteNodesResult => {
  let connectedNodes: INodeWithNetwork[] = [];
  let notConnectedNodes: INodeWithNetwork[] = [];
  const links = linkages.reduce((p, [l1, l2]) => {
    p.push({
      networkId: l1.networkId,
      nodeId: l1.nodeId
    });
    p.push({
      networkId: l2.networkId,
      nodeId: l2.nodeId
    });
    return p;
  }, []);

  for (let net of subnetworks) {
    const netId = net.id;
    const nodeIds = Object.keys(net.nodes)

    for (let nodeId of nodeIds) {
      const node = net.nodes[nodeId];
      const isLink = links.some(l => l.networkId == net.id && l.nodeId == nodeId);

      if (isLink) {
        connectedNodes.push({
          ...node,
          networkId: netId
        });
      } else {
        notConnectedNodes.push({
          ...node,
          networkId: netId
        });
      }
    }
  }

  return {
    connectedNodes,
    notConnectedNodes
  };
};

export interface ICptObjectWithNetwork {
  [id: string]: { networkId: string, value: number }
}

export interface ISuperNode  {
  id: string,
  states?: string[],
  parents: ILinkageItem[],
  cpt?: INodeCtpWithNetwork[] | ICptObjectWithNetwork,
  originals: INodeWithNetwork[]
};

export const createSuperNodes = (nodes: INodeWithNetwork[], linkages: [ILinkageItem, ILinkageItem][]): ISuperNode[] => {
  let linkagesClone = linkages.slice();
  let superNodes: ISuperNode[] = [];

  const findNode = ({ networkId, nodeId }: ILinkageItem) => {
    return nodes.find(n => n.id == nodeId && n.networkId == networkId);
  }; 

  const find = (l: ILinkageItem) => {
    return superNodes
      .find(({ originals }) => {
        return originals.some(({ networkId, id }) => l.networkId == networkId && l.nodeId == id)
      });
  };
  
  const mergeParents = (superArray: ILinkageItem[][]): ILinkageItem[] => {
    return superArray.reduce((p, array) => {
      for (const item of array) {
          const { networkId, nodeId } = item;
        //Validar a renomeação
        const alreadyAdd = p.some((node) => {
            return node.networkId == networkId && node.nodeId == nodeId;
        });
        if (!alreadyAdd) p.push(item);
      }
      return p;
    }, []);
  };

  const mergeCpts = (superCpts: INodeCtpWithNetwork[][]): INodeCtpWithNetwork[] => {
    return superCpts.reduce((p, cpts) => {
      for (const cpt of cpts) {
        if (cpt.when && cpt.then) {
          p.push(cpt);
        }
      }
      return p;
    }, [] as INodeCtpWithNetwork[]);
  };

  for (let linkage of linkagesClone) {
    const [l1, l2] = linkage;
    let sNode = find(l1);
    
    if (sNode === undefined) {
      sNode = find(l2);

      if (sNode === undefined) {
        const temp = findNode(l1);
        //Criar supernode com os dois links
        superNodes.push({
          id: createNodeId(l1.nodeId),
          originals: [temp, findNode(l2)],
          parents: [],
          states: temp.states
        });
      } else {
        //Add l1 no supernoda
        sNode.originals.push(findNode(l1));
      }
    } else if (find(l2) === undefined) {
      //Add l2 no supernoda
      sNode.originals.push(findNode(l2));
    }
  }

  for (let node of superNodes) {
    const allParents: ILinkageItem[][] = [];
    const allCpt: INodeCtpWithNetwork[][] = [];

    for (const original of node.originals) {
      const { networkId } = original;

      if (original.parents) {
        allParents.push(
          original.parents.map((nodeId) => ({ nodeId, networkId }))
        );
      }

      if (original.cpt) {
        if (Array.isArray(original.cpt)) {
          allCpt.push(
            original.cpt.map(({ then, when })=> ({ when, then, networkId }))
          );
        }
      }
    }

    node.parents = mergeParents(allParents);
    node.cpt = mergeCpts(allCpt);
  }

  return superNodes;
};

export const createSuperNode = (node: INodeWithNetwork): ISuperNode => {
  let cpt: (INodeCtpWithNetwork[] | ICptObjectWithNetwork);

  if (Array.isArray(node.cpt)) {
    cpt = (<INodeCtp[]>node.cpt).map(({ when, then }) => ({ when, then, networkId: node.networkId }))
  } else {
    const temp = (<INodeCtpObject>node.cpt)
    const keys = Object.keys(temp);
    cpt = {};

    for (let key of keys) {
      const value = temp[key];

      cpt[key] = { value, networkId: node.networkId };
    } 
  }

  const newNode: ISuperNode = {
    id: createNodeId(node.id),
    cpt,
    states: node.states,
    parents: node.parents.map((p) => ({ networkId: node.networkId, nodeId: p })),
    originals: [node]
  };

  return newNode;
}

export interface ISuperNetwork {
    nodes?: { [id: string]: INode }
}

export interface IIdentifiers  {
  originalToNew: IIdentifierOriginalToNew,
  newToOriginal: IIdentifierNewToOriginal,
}

export interface IMergeNetworks {
  network: ISuperNetwork,
  identifiers: IIdentifiers
}

export interface IIdentifierOriginalToNew {
  [id: string]: string
}

export interface IIdentifierNewToOriginal {
  [id: string]: ILinkageItem[]
}

export const createKey = (networkId: string, nodeId: string) => `${networkId}(${nodeId})`;
export const keyToNetworkAndNode = (key: string) => {
  const [ networkId, nodeId ] = key.split('(');

  return {
    networkId,
    nodeId: nodeId.replace(')', ''),
  }
};

export const createIdentifier = (nodes: ISuperNode[]): IIdentifiers => {
  const superNodes = nodes.slice();
  let originalToNew: IIdentifierOriginalToNew = {};
  let newToOriginal: IIdentifierNewToOriginal = {};
  let newSuperNodes: ISuperNode[] = [];
  
  const findParentName = (parent: ILinkageItem): string => {
    for (let superNode of superNodes) {
      const node = superNode.originals.find((original) => {
        return original.id == parent.nodeId && original.networkId == parent.networkId;
      });

      if (node) {
        return node.id;
      }
    }
  };

  for (let superNode of superNodes) {
    const { cpt, id, states } = superNode;
    let newToOriginalList: ILinkageItem[] = [];

    for (let originalNode of superNode.originals) {
      const key = createKey(originalNode.networkId, originalNode.id);
 
      originalToNew[key] = id;
      newToOriginalList.push({
        networkId: originalNode.networkId,
        nodeId: originalNode.id,
      });
    }

    newToOriginal[id] = newToOriginalList;
  }

  return {
    originalToNew,
    newToOriginal,
  };
};

export const mergeCpts = (cpts: INodeCtpWithNetwork[] | ICptObjectWithNetwork, identifiers:  { [id: string]: string }): (INodeCtp[] | INodeCtpObject) => {
  if (Array.isArray(cpts)) {
    
    let newCpts: INodeCtp[] = [];

    for (let cpt of cpts) {
      if (cpt.when && cpt.then) {
        const whenKeys = Object.keys(cpt.when);
        let newWhen: INodeCtpWhen = {};
        
        for (let whenKey of whenKeys) {
          const key = createKey(cpt.networkId, whenKey)
          
          newWhen[identifiers[key]] = cpt.when[whenKey];
        }

        newCpts.push({
          when: newWhen,
          then: cpt.then,
        });
      }
    }

    return newCpts;

  } else {
    const keys = Object.keys(cpts);
    let result: INodeCtpObject = {};
    
    for (let key of keys) {
      const value = cpts[key];

      result[key] = value.value;
    }

    return result;
  }
};

export const mergeNetworks = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]): IMergeNetworks => {
  let network: ISuperNetwork = {};
  let nodes: ISuperNode[] = [];
  const { notConnectedNodes, connectedNodes } = separeteNodes(subnetworks, linkages);
  const superNodes = createSuperNodes(connectedNodes, linkages);
  const formatNode = ({ networkId, id }: INodeWithNetwork): ILinkageItem => ({
    networkId,
    nodeId: id
  });

  for (let node of notConnectedNodes) {
    const newNode = createSuperNode(node);
    const { id, parents } = newNode;
    log({ id, parents });
    nodes.push(newNode);
  }

  for (let node of superNodes) {
    nodes.push(node);
  }

  // log(nodes);
  const identifiers = createIdentifier(nodes);
  const identifierOriginalToNew = identifiers.originalToNew;
  let finalNodes: INode[] = [];

  // log(identifierOriginalToNew);
  // console.log('---------------');
  for (let node of nodes) {
    let newParents: string[] = [];
    let newCpts: INodeCtp[] = [];//INodeCtp[] | INodeCtpObject
    let newCpt: INodeCtpObject = {};

    for (let parent of node.parents) {
      const key = createKey(parent.networkId, parent.nodeId);
      const parentName = identifierOriginalToNew[key];

      // log({ 
      //   id: node.id,
      //   key,
      //   parentName,
      //   'parent.networkId': parent.networkId, 
      //   'parent.nodeId': parent.nodeId
      // });
      
      newParents.push(parentName);
    }
    
    finalNodes.push({
      id: node.id,
      cpt: mergeCpts(node.cpt, identifierOriginalToNew),
      parents: newParents,
      states: node.states
    });
  }

  network = finalNodes.reduce((p, node) => {
    p[node.id] = {
      id: node.id,
      states: node.states,
      cpt: node.cpt,
      parents: node.parents,
    };
    return p;
  }, {} as { [id: string]: INode })

  // log(finalNodes.map(({ id, parents }) => ({ id, parents })));
  // console.log('-----------');
  // log(identifierOriginalToNew);
  // console.log('-----------');
  // log(identifiers.newToOriginal);
  // console.log(JSON.stringify(finalNodes));

  // for (let node of notConnectedNodes) {
  //   node.parents = replacer()
  // }

  return {
    network,
    identifiers
  };
};