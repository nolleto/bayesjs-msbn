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

export interface ISuperNode extends INodeWithNetwork {
  original: INodeWithNetwork[]
};

export const createSuperNodes = (nodes: INodeWithNetwork[], linkages: [ILinkageItem, ILinkageItem][]): ISuperNode[] => {
  let linkagesClone = linkages.slice();
  let superNodes: ISuperNode[] = [];

  const findNode = ({ networkId, nodeId }: ILinkageItem) => {
    return nodes.find(n => n.id == nodeId && n.networkId == networkId);
  }; 

  const find = (l: ILinkageItem) => {
    return superNodes
      .find(({ original }) => {
        return original.some(({ networkId, id }) => l.networkId == networkId && l.nodeId == id)
      });
  };
  
  const mergeParents = (superArray: string[][]): string[] => {
    return superArray.reduce((p, array) => {
      for (const item of array) {
        if (p.indexOf(item) === -1) p.push(item);
      }
      return p;
    }, []);
  };

  const mergeCpts = (superCpts: INodeCtp[][]): INodeCtp[] => {
    return superCpts.reduce((p, cpts) => {
      if (!Array.isArray(cpts)) return p;
      for (const cpt of cpts) {
        if (cpt.when && cpt.then) {
          p.push(cpt);
        }
      }
      return p;
    }, []);
  };

  for (let linkage of linkagesClone) {
    const [l1, l2] = linkage;
    let sNode = find(l1);
    
    if (sNode === undefined) {
      sNode = find(l2);

      if (sNode === undefined) {
        //Criar supernode com os dois links
        superNodes.push({
          id: v4(),
          original: [findNode(l1), findNode(l2)],
          parents: [],
          networkId: ''
        });
      } else {
        //Add l1 no supernoda
        sNode.original.push(findNode(l1));
      }
    } else if (find(l2) === undefined) {
      //Add l2 no supernoda
      sNode.original.push(findNode(l2));
    }
  }

  for (let node of superNodes) {
    const allParents: string[][] = [];
    const allCpt: INodeCtp[][] = [];

    for (const original of node.original) {
      allParents.push(original.parents || []);
      allCpt.push(original.cpt || []);
    }

    node.parents = mergeParents(allParents);
    node.cpt = mergeCpts(allCpt);
  }

  return superNodes;
};


export interface ISuperNetwork {
    nodes?: { [id: string]: INode }
}

export interface IIdentifiers extends ILinkageItem {
  nodes: ILinkageItem[];
}

export interface IMergeNetworks {
  network: ISuperNetwork,
  identifiers: IIdentifiers[]
}

export const createReplacer = (identifiers: IIdentifiers[]) => {
  const createKey = (networkId: string, nodeId: string) => `${networkId}-${nodeId}`;
  let dict = {};

  for (let { networkId, nodeId, nodes } of identifiers) {
    const key = createKey(networkId, nodeId);

    for (let a of nodes) {
      
    }
  }

  return (networkId: string, nodeId: string) => {
  };
};

export const mergeNetworks = (subnetworks: INetwork[], linkages: [ILinkageItem, ILinkageItem][]): IMergeNetworks => {
  let network: ISuperNetwork = {};
  let identifiers: IIdentifiers[] = [];
  let nodes: INode[] = [];
  const { notConnectedNodes, connectedNodes } = separeteNodes(subnetworks, linkages);
  const superNodes = createSuperNodes(connectedNodes, linkages);
  const formatNode = ({ networkId, id }: INodeWithNetwork): ILinkageItem => ({
    networkId,
    nodeId: id
  });

  for (let node of notConnectedNodes) {
    const newNode = {
      id: v4(),
      cpt: node.cpt,
      // parents
    } as INode;
    identifiers.push({
      nodeId: node.id,
      networkId: node.networkId,
      nodes: [formatNode(node)]
    });
  }

  for (let node of superNodes) {
    identifiers.push({
      nodeId: node.id,
      networkId: node.networkId,
      nodes: node.original.map(formatNode)
    });
  }

  const replacer = createReplacer(identifiers);

  for (let node of notConnectedNodes) {
    node.parents = replacer()
  }

  return {
    network,
    identifiers
  };
};

