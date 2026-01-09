// Type definitions for Roll20 built-in functions and variables
// Project: Dark City, Shining Babel Roll20 Sheet
// Based on definitions by: Karl Erik Hofseth https://github.com/Karlinator

// Browser console for debugging
declare const console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
};

declare type EventInfo = {
    sourceAttribute: string,
    sourceType: string,
    previousValue: string,
    newValue: string,
    removedInfo: string
}

declare type AttributeContent = string | number | boolean

declare function getAttrs(attributes: string[], callback?: (values: {[key: string]: string}) => void): void

declare function setAttrs(values: {[key: string]: AttributeContent}, options?: {silent?: boolean}, callback?: (values: {[key: string]: string}) => void): void

declare function getSectionIDs(section_name: string, callback: (values: string[]) => void): void

declare function generateRowID(): string

declare function removeRepeatingRow(RowID: string): void

declare function getTranslationByKey(key: string): string | false

declare function getTranslationLanguage(): string

declare function setDefaultToken(values: {[key: string]: string}): void

declare function on(event: string, callback: (eventInfo: EventInfo) => void): void

// Roll20 Custom Roll Parsing API
// Per wiki: dice is "An ordered array of the results of all dice in the roll (e.g., [9,9,20,4,4,1])"
declare interface RollResults {
    rollId: string;
    results: {
        [key: string]: {
            result: number;
            dice: number[];  // Plain array of die values
            expression: string;
        }
    }
}

declare function startRoll(rollString: string, callback: (results: RollResults) => void): void

declare function finishRoll(rollId: string, computedValues?: {[key: string]: string | number}): void
