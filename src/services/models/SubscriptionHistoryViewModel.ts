/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionData } from './SubscriptionData';

export type SubscriptionHistoryViewModel = {
    href?: any;
    status?: boolean;
    message?: string | null;
    data?: SubscriptionData;
    statusCode?: number;
    errors?: any;
    self?: any;
};
