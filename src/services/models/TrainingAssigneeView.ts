/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrainingAssigneeUserView } from './TrainingAssigneeUserView';
import type { TrainingFileView } from './TrainingFileView';
import type { TrainingView } from './TrainingView';

export type TrainingAssigneeView = {
    id?: string;
    userId?: string;
    user?: TrainingAssigneeUserView;
    trainingId?: string;
    training?: TrainingView;
    trainingFileId?: string | null;
    trainingFile?: TrainingFileView;
    isStarted?: boolean;
    isCompleted?: boolean;
    dateCompleted?: string;
    status?: string | null;
    lastRecordedProgress?: string | null;
};
