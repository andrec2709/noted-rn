
export interface ISorter {
    /**
     * Reorders the items such that targetId will be positioned after afterId.
     * @param targetId the item being moved
     * @param afterId the item targetId comes after
     */
    moveAfter(targetId: string, afterId: string): Promise<void>;

    /**
     * Reorders the items such that targetId will be positioned before beforeId.
     * @param targetId the item being moved
     * @param beforeId the item targetId comes before
     */
    moveBefore(targetId: string, beforeId: string): Promise<void>;

    /**
     * Decides the sort order value of a new item on creation.
     * @returns a Promise of the calculated sort order
     */
    create(): Promise<number>;

    /**
     * Recalculates the sort order of all items in order to normalize the values.
     */
    normalize(): Promise<void>;
}
