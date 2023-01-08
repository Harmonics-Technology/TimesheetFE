/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type NotificationView = {
    title?: string | null;
    message?: string | null;
    type?: string | null;
    icon?: string | null;
    url?: string | null;
    userId?: string;
    user?: User;
    isRead?: boolean;
};
