import { INode } from "../src/merge";
export declare const rain: INode;
export declare const sprinkler: {
    id: string;
    states: string[];
    parents: string[];
    cpt: {
        when: {
            'RAIN': string;
        };
        then: {
            'T': number;
            'F': number;
        };
    }[];
};
export declare const grassWet: {
    id: string;
    states: string[];
    parents: string[];
    cpt: {
        when: {
            'RAIN': string;
            'SPRINKLER': string;
        };
        then: {
            'T': number;
            'F': number;
        };
    }[];
};
export declare const grassWet2: INode;
export declare const test: {
    id: string;
    states: string[];
    parents: string[];
    cpt: {
        when: {
            'GRASS_WET': string;
        };
        then: {
            'T': number;
            'F': number;
        };
    }[];
};
