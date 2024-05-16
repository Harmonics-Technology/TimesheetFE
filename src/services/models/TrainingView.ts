/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrainingAssigneeView } from './TrainingAssigneeView';
import type { TrainingFileView } from './TrainingFileView';

export type TrainingView = {
    id?: string;
    superAdminId?: string;
    name?: string | null;
    isAllParticipant?: boolean;
    note?: string | null;
    dateCreated?: string;
    dateModified?: string;
    progress?: number | null;
    assignees?: Array<TrainingAssigneeView> | null;
    files?: Array<TrainingFileView> | null;
};
