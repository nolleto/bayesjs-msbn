"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const uuid_1 = require("uuid");
const log = (obj) => {
    console.log(util_1.inspect(obj, { showHidden: false, depth: null }));
};
exports.separeteNodes = (subnetworks, linkages) => {
    let connectedNodes = [];
    let notConnectedNodes = [];
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
        const nodeIds = Object.keys(net.nodes);
        for (let nodeId of nodeIds) {
            const node = net.nodes[nodeId];
            const isLink = links.some(l => l.networkId == net.id && l.nodeId == nodeId);
            if (isLink) {
                connectedNodes.push(Object.assign({}, node, { networkId: netId }));
            }
            else {
                notConnectedNodes.push(Object.assign({}, node, { networkId: netId }));
            }
        }
    }
    return {
        connectedNodes,
        notConnectedNodes
    };
};
;
exports.createSuperNodes = (nodes, linkages) => {
    let linkagesClone = linkages.slice();
    let superNodes = [];
    const findNode = ({ networkId, nodeId }) => {
        return nodes.find(n => n.id == nodeId && n.networkId == networkId);
    };
    const find = (l) => {
        return superNodes
            .find(({ originals }) => {
            return originals.some(({ networkId, id }) => l.networkId == networkId && l.nodeId == id);
        });
    };
    const mergeParents = (superArray) => {
        return superArray.reduce((p, array) => {
            for (const item of array) {
                const { networkId, nodeId } = item;
                //Validar a renomeação
                const alreadyAdd = p.some((node) => {
                    return node.networkId == networkId && node.nodeId == nodeId;
                });
                if (!alreadyAdd)
                    p.push(item);
            }
            return p;
        }, []);
    };
    const mergeCpts = (superCpts) => {
        return superCpts.reduce((p, cpts) => {
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
                const temp = findNode(l1);
                //Criar supernode com os dois links
                superNodes.push({
                    id: `${uuid_1.v4()}--${l1.nodeId}`,
                    originals: [temp, findNode(l2)],
                    parents: [],
                    states: temp.states
                });
            }
            else {
                //Add l1 no supernoda
                sNode.originals.push(findNode(l1));
            }
        }
        else if (find(l2) === undefined) {
            //Add l2 no supernoda
            sNode.originals.push(findNode(l2));
        }
    }
    for (let node of superNodes) {
        const allParents = [];
        const allCpt = [];
        for (const original of node.originals) {
            const { networkId } = original;
            if (original.parents) {
                allParents.push(original.parents.map((nodeId) => ({ nodeId, networkId })));
            }
            if (original.cpt) {
                if (Array.isArray(original.cpt)) {
                    allCpt.push(original.cpt.map(({ then, when }) => ({ when, then, networkId })));
                }
            }
        }
        node.parents = mergeParents(allParents);
        node.cpt = mergeCpts(allCpt);
    }
    return superNodes;
};
exports.createSuperNode = (node) => {
    let cpt;
    if (Array.isArray(node.cpt)) {
        cpt = node.cpt.map(({ when, then }) => ({ when, then, networkId: node.networkId }));
    }
    else {
        const temp = node.cpt;
        const keys = Object.keys(temp);
        cpt = {};
        for (let key of keys) {
            const value = temp[key];
            cpt[key] = { value, networkId: node.networkId };
        }
    }
    const newNode = {
        id: `${uuid_1.v4()}--${node.id}`,
        cpt,
        states: node.states,
        parents: node.parents.map((p) => ({ networkId: node.networkId, nodeId: p })),
        originals: [node]
    };
    return newNode;
};
exports.createKey = (networkId, nodeId) => `${networkId}(${nodeId})`;
exports.keyToNetworkAndNode = (key) => {
    const [networkId, nodeId] = key.split('(');
    return {
        networkId,
        nodeId: nodeId.replace(')', ''),
    };
};
exports.createIdentifier = (nodes) => {
    const superNodes = nodes.slice();
    let originalToNew = {};
    let newToOriginal = {};
    let newSuperNodes = [];
    const findParentName = (parent) => {
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
        let newToOriginalList = [];
        for (let originalNode of superNode.originals) {
            const key = exports.createKey(originalNode.networkId, originalNode.id);
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
exports.mergeCpts = (cpts, identifiers) => {
    if (Array.isArray(cpts)) {
        let newCpts = [];
        for (let cpt of cpts) {
            if (cpt.when && cpt.then) {
                const whenKeys = Object.keys(cpt.when);
                let newWhen = {};
                for (let whenKey of whenKeys) {
                    const key = exports.createKey(cpt.networkId, whenKey);
                    newWhen[identifiers[key]] = cpt.when[whenKey];
                }
                newCpts.push({
                    when: newWhen,
                    then: cpt.then,
                });
            }
        }
        return newCpts;
    }
    else {
        const keys = Object.keys(cpts);
        let result = {};
        for (let key of keys) {
            const value = cpts[key];
            result[key] = value.value;
        }
        return result;
    }
};
exports.mergeNetworks = (subnetworks, linkages) => {
    let network = {};
    let nodes = [];
    const { notConnectedNodes, connectedNodes } = exports.separeteNodes(subnetworks, linkages);
    const superNodes = exports.createSuperNodes(connectedNodes, linkages);
    const formatNode = ({ networkId, id }) => ({
        networkId,
        nodeId: id
    });
    for (let node of notConnectedNodes) {
        const newNode = exports.createSuperNode(node);
        const { id, parents } = newNode;
        log({ id, parents });
        nodes.push(newNode);
    }
    for (let node of superNodes) {
        nodes.push(node);
    }
    // log(nodes);
    const identifiers = exports.createIdentifier(nodes);
    const identifierOriginalToNew = identifiers.originalToNew;
    let finalNodes = [];
    // log(identifierOriginalToNew);
    // console.log('---------------');
    for (let node of nodes) {
        let newParents = [];
        let newCpts = []; //INodeCtp[] | INodeCtpObject
        let newCpt = {};
        for (let parent of node.parents) {
            const key = exports.createKey(parent.networkId, parent.nodeId);
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
            cpt: exports.mergeCpts(node.cpt, identifierOriginalToNew),
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
    }, {});
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
//# sourceMappingURL=merge.js.map