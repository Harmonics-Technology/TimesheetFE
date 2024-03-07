/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserView } from './UserView';

export type NotificationView = {
    id?: string;
    title?: string | null;
    message?: string | null;
    type?: string | null;
    icon?: string | null;
    url?: string | null;
    userId?: string;
    user?: UserView;
    isRead?: boolean;
    dateCreated?: string;
};
