import { Edge } from '../src/models/edge';
import { Node } from '../src/models/node';
import { IEdge } from '../src/interfaces/edge';
import { INode } from '../src/interfaces/node';
import { IGraph } from '../src/interfaces/graph';
import { INetwork } from '../src/interfaces/network';

export const sortFunc = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const edgeCreator = (nodes: INode[]) => (nId1: string, nId2: string) => {
  return [nId1, nId2].sort(sortFunc);
};

export const createNode = (id: string, p: string[] = []) => new Node(id, [], p);

export const simpleNodes = (nodes: INode[]) => {
  return nodes.reduce((p, { id }) => {
    p.push(id);
    return p;
  }, []).sort(sortFunc);
};

export const simpleEdges = (edges: IEdge[]) => {
  return edges.reduce((p, e) => {
    const edge = Edge.get(e);

    p.push(edge.getIds().sort(sortFunc));
    return p;
  }, []).sort(sortFunc);
};

export const simpleNetwork = ({ nodes }: INetwork) => {
  return {
    nodes: simpleNodes(nodes)
  };
};

export const simpleGraph = ({ nodes, edges }: IGraph) => {
  return {
    nodes: simpleNodes(nodes),
    edges: simpleEdges(edges)
  };
};

export const getterNode = (nodes: INode[]) => (id: string) => {
  return nodes.find(n => n.id == id);
};