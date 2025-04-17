import { Box, Divider, Select, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const ReportNav = ({ role }) => {
    const options = [
        {
            id: 1,
            label: 'Project Management Report',
            url: `/${role}/report/project-management-report`,
        },
        {
            id: 2,
            label: 'Resource Utilization',
            url: `/${role}/report/resource-utilization`,
        },
        {
            id: 3,
            label: 'Leave Management',
            url: `/${role}/report/leave-management`,
        },
        {
            id: 4,
            label: 'Operational Task',
            url: `/${role}/report/operational-task`,
        },
        {
            id: 5,
            label: 'Timesheet',
            url: `/${role}/report/timesheet`,
        },
        {
            id: 6,
            label: 'Financials',
            url: `/${role}/report/financials`,
        },
    ];
    const router = useRouter();
    const activeUrl = router?.asPath;

    const triggerRoute = (route: string) => {
        router.push(route);
    };
    return (
        <Box>
            <Text fontSize="#2F363A" fontWeight={500} color="#2f363a" mb="6px">
                Select Report
            </Text>
            <Select
                borderRadius="10px"
                border="1px solid #787486"
                h="40px"
                w="30%"
                fontSize="14px"
                defaultValue={activeUrl}
                onChange={(e) => triggerRoute(e.target.value)}
            >
                {options?.map((x) => (
                    <option value={x?.url}>{x?.label}</option>
                ))}
            </Select>
            <Divider mt="24px" borderColor="#d9d9d9" />
        </Box>
    );
};
