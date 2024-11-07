import { GetServerSideProps } from 'next';

const projectDashboard = () => {
    return <></>;
};

export default projectDashboard;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const role = JSON.parse(ctx.req.cookies.user).role.replaceAll(' ', '');
    const { id } = ctx.query;
    //
    return {
        redirect: {
            permanent: false,
            destination: `/${role}/project-management/projects/${id}/dashboard`,
        },
        props: {},
    };
};
