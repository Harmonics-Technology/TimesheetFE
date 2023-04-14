/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LeaveView } from './LeaveView';
import type { Link } from './Link';

export type LeaveViewPagedCollection = {
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
    value?: Array<LeaveView> | null;
};
