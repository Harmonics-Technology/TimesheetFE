/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectTaskView } from './ProjectTaskView';

export type ProjectTaskViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectTaskView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
