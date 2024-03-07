/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { DepartmentViewIEnumerableStandardResponse } from '../models/DepartmentViewIEnumerableStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DepartmentService {

    /**
     * @param superAdminId 
     * @param name 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createDepartment(
superAdminId?: string,
name?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Department/add-department',
            query: {
                'superAdminId': superAdminId,
                'name': name,
            },
        });
    }

    /**
     * @param superAdminId 
     * @returns DepartmentViewIEnumerableStandardResponse Success
     * @throws ApiError
     */
    public static listDepartments(
superAdminId?: string,
): CancelablePromise<DepartmentViewIEnumerableStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Department/departments',
            query: {
                'superAdminId': superAdminId,
            },
        });
    }

    /**
     * @param departmentId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteDepartment(
departmentId: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Department/delete/{departmentId}',
            path: {
                'departmentId': departmentId,
            },
        });
    }

}
