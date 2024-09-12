import { withPageAuth } from '@components/generics/withPageAuth';
import SuperAdminDashboard from '@components/subpages/SuperAdminDashboard';
import { GetServerSideProps } from 'next';

function index() {
    return (
        <SuperAdminDashboard
            isSuperAdmin
            // error={error}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    return {
        props: {},
    };
});
