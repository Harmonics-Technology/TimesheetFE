/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaskType } from './TaskType';

export type MarkAsCompletedModel = {
    type?: TaskType;
    taskId?: string;
    isCompleted?: boolean;
};
