/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskView } from './ProjectTaskView';
import type { StrippedUserView } from './StrippedUserView';

export type AttachmentView = {
    id?: string;
    projectTaskId?: string | null;
    projectTask?: ProjectTaskView;
    fileUrl?: string | null;
    createdByUserId?: string;
    createdByUser?: StrippedUserView;
    title?: string | null;
    extension?: string | null;
    dateCreated?: string;
};
