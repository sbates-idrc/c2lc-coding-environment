// @flow

export default class ProgramBlockCache {
    containingLoopLabel: string;
    containingLoopPosition: number;

    constructor(containingLoopLabel: string, containingLoopPosition: number) {
        this.containingLoopLabel = containingLoopLabel;
        this.containingLoopPosition = containingLoopPosition;
    }

    getContainingLoopLabel(): string {
        return this.containingLoopLabel;
    }

    getContainingLoopPosition(): number {
        return this.containingLoopPosition;
    }
};
