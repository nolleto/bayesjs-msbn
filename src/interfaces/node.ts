export interface INode {
    id: string,
    states: string[],
    parents: string[],
    cpt: INodeCtp[]
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

// id: 'GRASS_WET',
//   states: [ 'T', 'F' ],
//   parents: [ 'RAIN', 'SPRINKLER' ],
//   cpt: [
//     { when: { 'RAIN': 'T', 'SPRINKLER': 'T' }, then: { 'T': 0.99, 'F': 0.01 } },
//     { when: { 'RAIN': 'T', 'SPRINKLER': 'F' }, then: { 'T': 0.8, 'F': 0.2 } },
//     { when: { 'RAIN': 'F', 'SPRINKLER': 'T' }, then: { 'T': 0.9, 'F': 0.1 } },
//     { when: { 'RAIN': 'F', 'SPRINKLER': 'F' }, then: { 'T': 0, 'F': 1 } }
//   ]