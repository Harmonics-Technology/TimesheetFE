/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionFirst } from './SubscriptionFirst';
import type { SubscriptionSelf } from './SubscriptionSelf';
import type { SubscriptionValue } from './SubscriptionValue';

export type SubscriptionData = {
    offset?: number;
    limit?: number;
    size?: number;
    first?: SubscriptionFirst;
    self?: SubscriptionSelf;
    value?: Array<SubscriptionValue> | null;
};
