/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Link } from './Link';
import type { TimeSheetApprovedView } from './TimeSheetApprovedView';

export type TimeSheetApprovedViewPagedCollection = {
    offset?: number | null;
    limit?: number | null;
    nextOffset?: number | null;
    previousOffset?: number | null;
    size?: number;
    first?: Link;
    previous?: Link;
    next?: Link;
    last?: Link;
    self?: Link;
    value?: Array<TimeSheetApprovedView> | null;
};
