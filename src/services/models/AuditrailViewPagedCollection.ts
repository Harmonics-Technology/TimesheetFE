/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuditrailView } from './AuditrailView';
import type { Link } from './Link';

export type AuditrailViewPagedCollection = {
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
    value?: Array<AuditrailView> | null;
};
