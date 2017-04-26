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
;
exports.createSuperNodes = (nodes, linkages) => {
    let linkagesClone = linkages.slice();
    let superNodes = [];
    const findNode = ({ networkId, nodeId }) => {
        return nodes.find(n => n.id == nodeId && n.networkId == networkId);
    };
    const find = (l) => {
        return superNodes
            .find(({ original }) => {
            return original.some(({ networkId, id }) => l.networkId == networkId && l.nodeId == id);
        });
    };
    const mergeParents = (superArray) => {
        return superArray.reduce((p, array) => {
            for (const item of array) {
                if (p.indexOf(item) === -1)
                    p.push(item);
            }
            return p;
        }, []);
    };
    const mergeCpts = (superCpts) => {
        return superCpts.reduce((p, cpt) => {
            for (const item of cpt) {
                console.log(cpt);
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
                    id: uuid_1.v4(),
                    original: [findNode(l1), findNode(l2)],
                    parents: [],
                    networkId: ''
                });
            }
            else {
                //Add l1 no supernoda
                sNode.original.push(findNode(l1));
            }
        }
        else if (find(l2) === undefined) {
            //Add l2 no supernoda
            sNode.original.push(findNode(l2));
        }
    }
    for (let node of superNodes) {
        const allParents = [];
        const allCpt = [];
        for (const original of node.original) {
            allParents.push(original.parents || []);
            allCpt.push(original.cpt || []);
        }
        node.parents = mergeParents(allParents);
        node.cpt = mergeCpts(allCpt);
    }
    // log(superNodes);
    return null;
};
const getNodes = () => {
};
exports.mergeNetworks = (subnetworks, linkages) => {
    const { notConnectedNodes, connectedNodes } = exports.separeteNodes(subnetworks, linkages);
    const superNodes = exports.createSuperNodes(connectedNodes, linkages);
    return null;
};
//# sourceMappingURL=merge.js.map