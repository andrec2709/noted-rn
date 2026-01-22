
export interface ISorter {
    moveAfter(targetId: string, afterId: string): Promise<void>;
    moveBefore(targetId: string, beforeId: string): Promise<void>;
    create(): Promise<number>;
    normalize(): Promise<void>;
}
