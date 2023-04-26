/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LeaveTypeView } from './LeaveTypeView';
import type { Link } from './Link';

export type LeaveTypeViewPagedCollection = {
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
    value?: Array<LeaveTypeView> | null;
};
