/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Link } from './Link';
import type { ShiftView } from './ShiftView';

export type ShiftViewPagedCollection = {
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
    value?: Array<ShiftView> | null;
};
