/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserView } from './UserView';

export type ShiftView = {
    id?: string;
    userId?: string;
    user?: UserView;
    start?: string;
    end?: string;
    hours?: number | null;
    title?: string | null;
    color?: string | null;
    repeatQuery?: string | null;
    note?: string | null;
    isPublished?: boolean;
    shiftToSwapId?: string | null;
    shiftToSwap?: ShiftView;
    isSwapped?: boolean;
    swapStatusId?: number | null;
    swapStatus?: string | null;
};
