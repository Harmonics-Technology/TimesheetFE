/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectSubTaskView } from './ProjectSubTaskView';

export type ProjectSubTaskViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectSubTaskView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
