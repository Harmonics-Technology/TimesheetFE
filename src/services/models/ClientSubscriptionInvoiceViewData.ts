/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientSubscriptionInvoiceViewFirst } from './ClientSubscriptionInvoiceViewFirst';
import type { ClientSubscriptionInvoiceViewSelf } from './ClientSubscriptionInvoiceViewSelf';
import type { ClientSubscriptionInvoiceViewValue } from './ClientSubscriptionInvoiceViewValue';

export type ClientSubscriptionInvoiceViewData = {
    offset?: number;
    limit?: number;
    size?: number;
    first?: ClientSubscriptionInvoiceViewFirst;
    self?: ClientSubscriptionInvoiceViewSelf;
    value?: Array<ClientSubscriptionInvoiceViewValue> | null;
};
