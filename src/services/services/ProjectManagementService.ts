/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { ProjectModel } from '../models/ProjectModel';
import type { ProjectProgressCountViewListStandardResponse } from '../models/ProjectProgressCountViewListStandardResponse';
import type { ProjectProgressCountViewStandardResponse } from '../models/ProjectProgressCountViewStandardResponse';
import type { ProjectStatus } from '../models/ProjectStatus';
import type { ProjectSubTaskModel } from '../models/ProjectSubTaskModel';
import type { ProjectSubTaskViewPagedCollectionStandardResponse } from '../models/ProjectSubTaskViewPagedCollectionStandardResponse';
import type { ProjectSubTaskViewStandardResponse } from '../models/ProjectSubTaskViewStandardResponse';
import type { ProjectTaskAsigneeViewPagedCollectionStandardResponse } from '../models/ProjectTaskAsigneeViewPagedCollectionStandardResponse';
import type { ProjectTaskModel } from '../models/ProjectTaskModel';
import type { ProjectTaskViewPagedCollectionStandardResponse } from '../models/ProjectTaskViewPagedCollectionStandardResponse';
import type { ProjectTaskViewStandardResponse } from '../models/ProjectTaskViewStandardResponse';
import type { ProjectTimesheetModel } from '../models/ProjectTimesheetModel';
import type { ProjectViewPagedCollectionStandardResponse } from '../models/ProjectViewPagedCollectionStandardResponse';
import type { ProjectViewStandardResponse } from '../models/ProjectViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProjectManagementService {

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createProject(
requestBody?: ProjectModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/create-project',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createTask(
requestBody?: ProjectTaskModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/create-task',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createSubTask(
requestBody?: ProjectSubTaskModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/create-subtask',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static fillTimesheetForProject(
requestBody?: ProjectTimesheetModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/fill-timesheet',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param status 
     * @param userId 
     * @param search 
     * @returns ProjectViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listProject(
offset?: number,
limit?: number,
superAdminId?: string,
status?: ProjectStatus,
userId?: string,
search?: string,
): CancelablePromise<ProjectViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/projects',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'status': status,
                'userId': userId,
                'search': search,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param projectId 
     * @param status 
     * @param userId 
     * @param search 
     * @returns ProjectTaskViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTasks(
offset?: number,
limit?: number,
superAdminId?: string,
projectId?: string,
status?: ProjectStatus,
userId?: string,
search?: string,
): CancelablePromise<ProjectTaskViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/tasks',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'projectId': projectId,
                'status': status,
                'userId': userId,
                'search': search,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param status 
     * @param userId 
     * @param search 
     * @returns ProjectTaskViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listOperationalTasks(
offset?: number,
limit?: number,
superAdminId?: string,
status?: ProjectStatus,
userId?: string,
search?: string,
): CancelablePromise<ProjectTaskViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/operational-tasks',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'status': status,
                'userId': userId,
                'search': search,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param taskId 
     * @param status 
     * @param search 
     * @returns ProjectSubTaskViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listSubTasks(
offset?: number,
limit?: number,
taskId?: string,
status?: ProjectStatus,
search?: string,
): CancelablePromise<ProjectSubTaskViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/subtasks',
            query: {
                'Offset': offset,
                'Limit': limit,
                'taskId': taskId,
                'status': status,
                'search': search,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param userId 
     * @param projectId 
     * @returns ProjectTaskAsigneeViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getUserTasks(
offset?: number,
limit?: number,
userId?: string,
projectId?: string,
): CancelablePromise<ProjectTaskAsigneeViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/user-tasks',
            query: {
                'Offset': offset,
                'Limit': limit,
                'userId': userId,
                'projectId': projectId,
            },
        });
    }

    /**
     * @param projectId 
     * @returns ProjectViewStandardResponse Success
     * @throws ApiError
     */
    public static getProject(
projectId?: string,
): CancelablePromise<ProjectViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/project',
            query: {
                'projectId': projectId,
            },
        });
    }

    /**
     * @param taskId 
     * @returns ProjectTaskViewStandardResponse Success
     * @throws ApiError
     */
    public static getTask(
taskId?: string,
): CancelablePromise<ProjectTaskViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/task',
            query: {
                'taskId': taskId,
            },
        });
    }

    /**
     * @param subtaskId 
     * @returns ProjectSubTaskViewStandardResponse Success
     * @throws ApiError
     */
    public static getSubTask(
subtaskId?: string,
): CancelablePromise<ProjectSubTaskViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/subtask',
            query: {
                'subtaskId': subtaskId,
            },
        });
    }

    /**
     * @param superAdminId 
     * @returns ProjectProgressCountViewStandardResponse Success
     * @throws ApiError
     */
    public static getStatusCountForProject(
superAdminId?: string,
): CancelablePromise<ProjectProgressCountViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/project/status-count',
            query: {
                'superAdminId': superAdminId,
            },
        });
    }

    /**
     * @param userId 
     * @param startDate 
     * @param endDate 
     * @returns ProjectProgressCountViewListStandardResponse Success
     * @throws ApiError
     */
    public static listUserProjectTimesheet(
userId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ProjectProgressCountViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/user-timesheets',
            query: {
                'userId': userId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param projectId 
     * @param search 
     * @returns ProjectTaskAsigneeViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listProjectAssigneeTasks(
offset?: number,
limit?: number,
superAdminId?: string,
projectId?: string,
search?: string,
): CancelablePromise<ProjectTaskAsigneeViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/project-assignee-tasks',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'projectId': projectId,
                'search': search,
            },
        });
    }

}
