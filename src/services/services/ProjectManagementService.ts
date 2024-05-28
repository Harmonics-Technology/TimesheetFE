/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { BudgetSummaryReportViewStandardResponse } from '../models/BudgetSummaryReportViewStandardResponse';
import type { MarkAsCompletedModel } from '../models/MarkAsCompletedModel';
import type { ProjectModel } from '../models/ProjectModel';
import type { ProjectProgressCountViewStandardResponse } from '../models/ProjectProgressCountViewStandardResponse';
import type { ProjectStatus } from '../models/ProjectStatus';
import type { ProjectSubTaskModel } from '../models/ProjectSubTaskModel';
import type { ProjectSubTaskViewPagedCollectionStandardResponse } from '../models/ProjectSubTaskViewPagedCollectionStandardResponse';
import type { ProjectSubTaskViewStandardResponse } from '../models/ProjectSubTaskViewStandardResponse';
import type { ProjectTaskAsigneeViewPagedCollectionStandardResponse } from '../models/ProjectTaskAsigneeViewPagedCollectionStandardResponse';
import type { ProjectTaskModel } from '../models/ProjectTaskModel';
import type { ProjectTaskViewPagedCollectionStandardResponse } from '../models/ProjectTaskViewPagedCollectionStandardResponse';
import type { ProjectTaskViewStandardResponse } from '../models/ProjectTaskViewStandardResponse';
import type { ProjectTimesheetApprovalModel } from '../models/ProjectTimesheetApprovalModel';
import type { ProjectTimesheetListViewStandardResponse } from '../models/ProjectTimesheetListViewStandardResponse';
import type { ProjectTimesheetModel } from '../models/ProjectTimesheetModel';
import type { ProjectViewPagedCollectionStandardResponse } from '../models/ProjectViewPagedCollectionStandardResponse';
import type { ProjectViewStandardResponse } from '../models/ProjectViewStandardResponse';
import type { ResourceCapacityDetailViewStandardResponse } from '../models/ResourceCapacityDetailViewStandardResponse';
import type { ResourceCapacityViewStandardResponse } from '../models/ResourceCapacityViewStandardResponse';
import type { UpdateProjectTimesheet } from '../models/UpdateProjectTimesheet';

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
    public static updateProject(
requestBody?: ProjectModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-project',
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
    public static updateTask(
requestBody?: ProjectTaskModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-task',
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
    public static updateSubTask(
requestBody?: ProjectSubTaskModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-subtask',
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
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateFilledTimesheet(
requestBody?: UpdateProjectTimesheet,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-timesheet',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static treatTimesheet(
requestBody?: ProjectTimesheetApprovalModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/treat-timesheet',
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
     * @param projectId 
     * @returns ProjectViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listProjectAssigneeDetail(
offset?: number,
limit?: number,
projectId?: string,
): CancelablePromise<ProjectViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/projects-assignees',
            query: {
                'Offset': offset,
                'Limit': limit,
                'projectId': projectId,
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
status?: string,
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
     * @param userId 
     * @returns ProjectProgressCountViewStandardResponse Success
     * @throws ApiError
     */
    public static getStatusCountForProject(
superAdminId?: string,
userId?: string,
): CancelablePromise<ProjectProgressCountViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/project/status-count',
            query: {
                'superAdminId': superAdminId,
                'userId': userId,
            },
        });
    }

    /**
     * @param superAdminId 
     * @param userId 
     * @returns ProjectProgressCountViewStandardResponse Success
     * @throws ApiError
     */
    public static getStatusCountForOperationalTask(
superAdminId?: string,
userId?: string,
): CancelablePromise<ProjectProgressCountViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/operational-task/status-count',
            query: {
                'superAdminId': superAdminId,
                'userId': userId,
            },
        });
    }

    /**
     * @param employeeId 
     * @param startDate 
     * @param endDate 
     * @param projectId 
     * @returns ProjectTimesheetListViewStandardResponse Success
     * @throws ApiError
     */
    public static listUserProjectTimesheet(
employeeId?: string,
startDate?: string,
endDate?: string,
projectId?: string,
): CancelablePromise<ProjectTimesheetListViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/user-timesheets',
            query: {
                'employeeId': employeeId,
                'startDate': startDate,
                'endDate': endDate,
                'projectId': projectId,
            },
        });
    }

    /**
     * @param supervisorId 
     * @param startDate 
     * @param endDate 
     * @returns ProjectTimesheetListViewStandardResponse Success
     * @throws ApiError
     */
    public static listSupervisorProjectTimesheet(
supervisorId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ProjectTimesheetListViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/supervisor-timesheets',
            query: {
                'supervisorId': supervisorId,
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

    /**
     * @param superAdminId 
     * @param startDate 
     * @param endDate 
     * @returns BudgetSummaryReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getSummaryReport(
superAdminId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<BudgetSummaryReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/summary-report',
            query: {
                'superAdminId': superAdminId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static markProjectOrTaskAsCompleted(
requestBody?: MarkAsCompletedModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/completed',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param startDate 
     * @param endDate 
     * @returns ResourceCapacityViewStandardResponse Success
     * @throws ApiError
     */
    public static getResourcesCapacityOverview(
offset?: number,
limit?: number,
superAdminId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ResourceCapacityViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/resources-overview',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param userId 
     * @param projectId 
     * @param status 
     * @param search 
     * @returns ResourceCapacityDetailViewStandardResponse Success
     * @throws ApiError
     */
    public static getResourceDetails(
offset?: number,
limit?: number,
userId?: string,
projectId?: string,
status?: ProjectStatus,
search?: string,
): CancelablePromise<ResourceCapacityDetailViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ProjectManagement/resource-detail',
            query: {
                'Offset': offset,
                'Limit': limit,
                'userId': userId,
                'projectId': projectId,
                'status': status,
                'search': search,
            },
        });
    }

    /**
     * @param taskId 
     * @param percentageOfCompletion 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateTaskProgress(
taskId?: string,
percentageOfCompletion?: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-task-progress',
            query: {
                'taskId': taskId,
                'percentageOfCompletion': percentageOfCompletion,
            },
        });
    }

    /**
     * @param subTaskId 
     * @param percentageOfCompletion 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateSubtaskProgress(
subTaskId?: string,
percentageOfCompletion?: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ProjectManagement/update-subtask-progress',
            query: {
                'subTaskId': subTaskId,
                'percentageOfCompletion': percentageOfCompletion,
            },
        });
    }

}
