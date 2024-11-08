/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskView } from './ProjectTaskView';
import type { ProjectView } from './ProjectView';
import type { StrippedUserView } from './StrippedUserView';

export type AttachmentView = {
    id?: string;
    projectId?: string | null;
    project?: ProjectView;
    projectTaskId?: string | null;
    projectTask?: ProjectTaskView;
    fileUrl?: string | null;
    createdByUserId?: string;
    createdByUser?: StrippedUserView;
    title?: string | null;
    extension?: string | null;
    dateCreated?: string;
};
