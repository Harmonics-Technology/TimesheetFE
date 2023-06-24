/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnSubscription } from './AddOnSubscription';

export type AddOn = {
    addOnSubscriptionId?: string | null;
    addOnSubscription?: AddOnSubscription;
    clientSubscriptionId?: string | null;
    addOnTotalAmount?: number;
};
