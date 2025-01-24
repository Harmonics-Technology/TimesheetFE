/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StrippedProjectAttachmentView } from './StrippedProjectAttachmentView';
import type { StrippedTaskAttachmentView } from './StrippedTaskAttachmentView';
import type { StrippedUserAttachmentView } from './StrippedUserAttachmentView';

export type AttachmentView = {
    id?: string;
    projectId?: string | null;
    project?: StrippedProjectAttachmentView;
    projectTaskId?: string | null;
    projectTask?: StrippedTaskAttachmentView;
    fileUrl?: string | null;
    createdByUserId?: string;
    createdByUser?: StrippedUserAttachmentView;
    title?: string | null;
    extension?: string | null;
    fileSize?: string | null;
    dateCreated?: string;
};
