/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitiateResetModel } from '../models/InitiateResetModel';
import type { LoginModel } from '../models/LoginModel';
import type { PasswordReset } from '../models/PasswordReset';
import type { RegisterModel } from '../models/RegisterModel';
import type { TeamMemberModel } from '../models/TeamMemberModel';
import type { UpdateUserModel } from '../models/UpdateUserModel';
import type { UserProfileViewStandardResponse } from '../models/UserProfileViewStandardResponse';
import type { UserViewListStandardResponse } from '../models/UserViewListStandardResponse';
import type { UserViewPagedCollectionStandardResponse } from '../models/UserViewPagedCollectionStandardResponse';
import type { UserViewStandardResponse } from '../models/UserViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static create(
requestBody?: RegisterModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/register',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static loginUser(
requestBody?: LoginModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/login',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param token 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static verify(
token: string,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/verifyUser/{token}',
            path: {
                'token': token,
            },
        });
    }

    /**
     * @param redirectUrl 
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static initiateReset(
redirectUrl?: string,
requestBody?: InitiateResetModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/reset/initiate',
            query: {
                'redirectUrl': redirectUrl,
            },
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static completeReset(
requestBody?: PasswordReset,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/reset/complete',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static updateUser(
requestBody?: UpdateUserModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/update',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param password 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static updatePassword(
password?: string,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/change_password',
            query: {
                'password': password,
            },
        });
    }

    /**
     * @param userId 
     * @returns UserProfileViewStandardResponse Success
     * @throws ApiError
     */
    public static userProfile(
userId: string,
): CancelablePromise<UserProfileViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/user-profile/{userId}',
            path: {
                'userId': userId,
            },
        });
    }

    /**
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static validateToken(): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/validate-token',
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param role 
     * @param offset 
     * @param limit 
     * @param search 
     * @returns UserViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listUsers(
role: string,
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<UserViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/list/{role}',
            path: {
                'role': role,
            },
            query: {
                'Offset': offset,
                'Limit': limit,
                'Search': search,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static resendInvite(
requestBody?: InitiateResetModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/invite/resend',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param id 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static getUserById(
id: string,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/get/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param id 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static toggleUserActive(
id: string,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/toggle-active/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static adminUpdateUser(
requestBody?: UpdateUserModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/admin-update-user',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static addTeamMember(
requestBody?: TeamMemberModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/add-team-member',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static updateTeamMember(
requestBody?: TeamMemberModel,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/User/update-team-member',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param clientId 
     * @returns UserViewListStandardResponse Success
     * @throws ApiError
     */
    public static getSupervisors(
clientId: string,
): CancelablePromise<UserViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/supervisors/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @returns UserViewStandardResponse Success
     * @throws ApiError
     */
    public static getSupervisees(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<UserViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/supervisees',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
        });
    }

    /**
     * @returns UserViewListStandardResponse Success
     * @throws ApiError
     */
    public static getClientSupervisors(): CancelablePromise<UserViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/client/supervisors',
        });
    }

    /**
     * @returns UserViewListStandardResponse Success
     * @throws ApiError
     */
    public static getClientTeamMembers(): CancelablePromise<UserViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/User/client/team-members',
        });
    }

}
