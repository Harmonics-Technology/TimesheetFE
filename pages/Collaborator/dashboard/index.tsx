import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';

function index() {
    return <></>;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        return {
            redirect: {
                permanent: false,
                destination: `/Collaborator/project-management`,
            },
        };
    },
);
