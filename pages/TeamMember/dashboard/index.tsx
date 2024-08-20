import { withPageAuth } from '@components/generics/withPageAuth';
import TeamDashboard from '@components/subpages/TeamDashboard';
import { GetServerSideProps } from 'next';

function index() {
    return <TeamDashboard />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        return {
            props: {},
        };
    },
);
