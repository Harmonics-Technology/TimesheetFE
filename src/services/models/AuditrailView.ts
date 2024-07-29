/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskView } from './ProjectTaskView';
import type { StrippedUserView } from './StrippedUserView';

export type AuditrailView = {
    id?: string;
    projectTaskId?: string;
    projectTask?: ProjectTaskView;
    isComment?: boolean;
    comment?: string | null;
    assigneeId?: string | null;
    assignee?: StrippedUserView;
    createdByUserId?: string;
    createdByUser?: StrippedUserView;
    isAttachment?: boolean;
    fileUrl?: string | null;
    dateCreated?: string;
    dateModified?: string;
};
