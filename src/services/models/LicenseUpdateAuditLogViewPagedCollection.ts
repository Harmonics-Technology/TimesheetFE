/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LicenseUpdateAuditLogView } from './LicenseUpdateAuditLogView';
import type { Link } from './Link';

export type LicenseUpdateAuditLogViewPagedCollection = {
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
    value?: Array<LicenseUpdateAuditLogView> | null;
};
