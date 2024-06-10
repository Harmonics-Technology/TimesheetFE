/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { NewTrainingFileModel } from '../models/NewTrainingFileModel';
import type { TrainingAssigneeViewListStandardResponse } from '../models/TrainingAssigneeViewListStandardResponse';
import type { TrainingAssigneeViewPagedCollectionStandardResponse } from '../models/TrainingAssigneeViewPagedCollectionStandardResponse';
import type { TrainingMaterialViewPagedCollectionStandardResponse } from '../models/TrainingMaterialViewPagedCollectionStandardResponse';
import type { TrainingModel } from '../models/TrainingModel';
import type { TrainingVideoProgressLogModel } from '../models/TrainingVideoProgressLogModel';
import type { TrainingViewPagedCollectionStandardResponse } from '../models/TrainingViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TrainingService {

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static addTraining(
requestBody?: TrainingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/add-new',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param trainingId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns TrainingViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTraining(
offset?: number,
limit?: number,
superAdminId?: string,
trainingId?: string,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<TrainingViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Training/trainings',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'trainingId': trainingId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param trainingId 
     * @returns TrainingAssigneeViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTrainingStatus(
offset?: number,
limit?: number,
trainingId?: string,
): CancelablePromise<TrainingAssigneeViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Training/user-training-status',
            query: {
                'Offset': offset,
                'Limit': limit,
                'trainingId': trainingId,
            },
        });
    }

    /**
     * @param trainingId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteTraining(
trainingId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/delete-training',
            query: {
                'trainingId': trainingId,
            },
        });
    }

    /**
     * @param fileId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteTrainingFile(
fileId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/delete-file',
            query: {
                'fileId': fileId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static addNewFile(
requestBody?: NewTrainingFileModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/add-file',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param userId 
     * @param trainingId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteAssignedUser(
userId?: string,
trainingId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/unassign-user',
            query: {
                'userId': userId,
                'trainingId': trainingId,
            },
        });
    }

    /**
     * @param userId 
     * @param trainingId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static assignNewUser(
userId?: string,
trainingId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/assign-user',
            query: {
                'userId': userId,
                'trainingId': trainingId,
            },
        });
    }

    /**
     * @param userId 
     * @param trainingId 
     * @param fileId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static startTraining(
userId?: string,
trainingId?: string,
fileId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/start-training',
            query: {
                'userId': userId,
                'trainingId': trainingId,
                'fileId': fileId,
            },
        });
    }

    /**
     * @param userId 
     * @param trainingId 
     * @param fileId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static completeTraining(
userId?: string,
trainingId?: string,
fileId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/complete-training',
            query: {
                'userId': userId,
                'trainingId': trainingId,
                'fileId': fileId,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param userId 
     * @returns TrainingMaterialViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listUserTrainings(
offset?: number,
limit?: number,
userId?: string,
): CancelablePromise<TrainingMaterialViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Training/user-training',
            query: {
                'Offset': offset,
                'Limit': limit,
                'userId': userId,
            },
        });
    }

    /**
     * @param userId 
     * @param trainingId 
     * @returns TrainingAssigneeViewListStandardResponse Success
     * @throws ApiError
     */
    public static listUserTrainingMaterials(
userId?: string,
trainingId?: string,
): CancelablePromise<TrainingAssigneeViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Training/user-training-material',
            query: {
                'userId': userId,
                'trainingId': trainingId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createOrUpdateVideoRecordProgress(
requestBody?: TrainingVideoProgressLogModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Training/update-video-progress',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

}
