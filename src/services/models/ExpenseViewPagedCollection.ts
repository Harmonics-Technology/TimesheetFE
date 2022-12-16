/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExpenseView } from './ExpenseView';
import type { Link } from './Link';

export type ExpenseViewPagedCollection = {
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
    value?: Array<ExpenseView> | null;
};
