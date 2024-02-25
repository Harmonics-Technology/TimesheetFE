/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectManagementSettingModel = {
    id?: string;
    superAdminId?: string;
    adminProjectCreation?: boolean | null;
    pmProjectCreation?: boolean | null;
    allProjectCreation?: boolean | null;
    adminTaskCreation?: boolean | null;
    assignedPMTaskCreation?: boolean | null;
    projectMembersTaskCreation?: boolean | null;
    adminTaskViewing?: boolean | null;
    assignedPMTaskViewing?: boolean | null;
    projectMembersTaskViewing?: boolean | null;
    pmTaskEditing?: boolean | null;
    taskMembersTaskEditing?: boolean | null;
    projectMembersTaskEditing?: boolean | null;
    projectMembersTimesheetVisibility?: boolean | null;
    taskMembersTimesheetVisibility?: boolean | null;
};
