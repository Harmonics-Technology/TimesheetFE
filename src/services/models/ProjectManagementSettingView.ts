/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectManagementSettingView = {
    id?: string;
    superAdminId?: string;
    adminProjectCreation?: boolean;
    pmProjectCreation?: boolean;
    allProjectCreation?: boolean;
    adminTaskCreation?: boolean;
    assignedPMTaskCreation?: boolean;
    projectMembersTaskCreation?: boolean;
    adminTaskViewing?: boolean;
    assignedPMTaskViewing?: boolean;
    projectMembersTaskViewing?: boolean;
    pmTaskEditing?: boolean;
    taskMembersTaskEditing?: boolean;
    projectMembersTaskEditing?: boolean;
    projectMembersTimesheetVisibility?: boolean;
    taskMembersTimesheetVisibility?: boolean;
};
