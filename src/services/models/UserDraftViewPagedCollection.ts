/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Link } from './Link';
import type { UserDraftView } from './UserDraftView';

export type UserDraftViewPagedCollection = {
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
    value?: Array<UserDraftView> | null;
};
