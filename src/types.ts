import type { PackName, Mode, DeltaColors } from './packs/index.js';
/** JSON-compatible ECharts options; unknown extension fields are retained. */
export type Option = Record<string, any>;
export interface ChartFacts {
    id?: string;
    option: Option;
}
export interface TextFact {
    selector: string;
    text: string;
    color: string;
    background: string;
    fontSize: number;
    fontWeight: number;
}
export interface DeltaFact {
    selector: string;
    text: string;
    color: string;
    direction?: 'up' | 'down' | 'flat';
}
export interface PageFacts {
    charts: ChartFacts[];
    texts?: TextFact[];
    gradients?: {
        selector: string;
        background: string;
    }[];
    shadows?: {
        selector: string;
        boxShadow: string;
        textShadow: string;
    }[];
    kpis?: {
        selector: string;
        text: string;
        color: string;
        background?: string;
    }[];
    deltas?: DeltaFact[];
    emojis?: {
        selector: string;
        text: string;
    }[];
    page?: {
        background?: string;
        deltaColors?: DeltaColors;
    };
}
export interface CheckOptions {
    pack?: PackName;
    mode?: Mode;
    background?: string;
    disable?: string[];
    only?: string[];
}
export type Severity = 'error' | 'warn' | 'info';
export interface Finding {
    ruleId: string;
    severity: Severity;
    message: string;
    path: string;
    fix: string;
}
export interface Rule {
    id: string;
    name: string;
    severity: Severity;
    packs: PackName[];
    description: string;
    fix: string;
    check: (facts: PageFacts, options: Required<Pick<CheckOptions, 'pack' | 'mode'>> & CheckOptions) => Finding[];
}
