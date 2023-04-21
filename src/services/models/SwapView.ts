/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ShiftView } from './ShiftView';
import type { UserView } from './UserView';

export type SwapView = {
    id?: string;
    swapperId?: string;
    swapper?: UserView;
    swapeeId?: string;
    swapee?: UserView;
    shiftId?: string;
    shift?: ShiftView;
    shiftToSwapId?: string;
    shiftToSwap?: ShiftView;
    status?: string | null;
    isApproved?: boolean;
};
