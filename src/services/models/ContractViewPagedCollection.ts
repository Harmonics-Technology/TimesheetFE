/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContractView } from './ContractView';
import type { Link } from './Link';

export type ContractViewPagedCollection = {
    offset?: number | null;
    limit?: number | null;
    size?: number;
    first?: Link;
    previous?: Link;
    next?: Link;
    last?: Link;
    self?: Link;
    value?: Array<ContractView> | null;
};
