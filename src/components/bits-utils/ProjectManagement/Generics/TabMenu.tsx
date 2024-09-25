export const TabMenu = (subType) => {
    const tabMenu =
        subType == 'basic'
            ? [
                  { show: false, name: 'dashboard' },
                  { show: true, name: 'projects' },
                  { show: true, name: 'resource-capacity' },
              ]
            : [
                  { show: true, name: 'dashboard' },
                  { show: true, name: 'projects' },
                  { show: true, name: 'resource-capacity' },
              ];
    return tabMenu;
};
export const SubTabMenu = (subType) => {
    const tabMenu =
        subType == 'basic'
            ? [
                  { show: true, name: 'dashboard' },
                  { show: true, name: 'project-task' },
                  { show: false, name: 'gantt-chart' },
                  { show: true, name: 'team-members' },
                  { show: true, name: 'budget' },
              ]
            : [
                  { show: true, name: 'dashboard' },
                  { show: true, name: 'project-task' },
                  { show: true, name: 'gantt-chart' },
                  { show: true, name: 'team-members' },
                  { show: true, name: 'budget' },
              ];
    return tabMenu;
};
