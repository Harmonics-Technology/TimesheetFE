/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TrainingView } from './TrainingView';

export type TrainingFileView = {
    title?: string | null;
    id?: string;
    category?: string | null;
    fileUrl?: string | null;
    trainingId?: string;
    training?: TrainingView;
    dateCreated?: string;
};
