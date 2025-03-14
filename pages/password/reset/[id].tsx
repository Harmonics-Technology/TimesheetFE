import CompleteReset from '@components/subpages/CompleteReset';
import { CompleteResetExtra } from '@components/subpages/CompleteResetExtra';
import { GetServerSidePropsContext } from 'next';

function index({ code, superAdminId }: { code: string; superAdminId?: any }) {
    return (
        <>
            {superAdminId ? (
                <CompleteResetExtra code={code} superAdminId={superAdminId} />
            ) : (
                <CompleteReset code={code} />
            )}
        </>
    );
}

export default index;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    const { id, superAdmin } = ctx.query;
    return {
        props: {
            code: id,
            superAdminId: superAdmin || '',
        },
    };
};
