/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrainingFileModel } from './TrainingFileModel';

export type TrainingModel = {
    id?: string | null;
    superAdminId?: string;
    name?: string | null;
    isAllParticipant?: boolean;
    note?: string | null;
    createdByUserId?: string;
    trainingManagerId?: string | null;
    assignedUsers?: Array<string> | null;
    trainingFiles?: Array<TrainingFileModel> | null;
};
