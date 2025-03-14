import CompleteReset from '@components/subpages/CompleteReset';
import { CompleteResetExtra } from '@components/subpages/CompleteResetExtra';
import { GetServerSidePropsContext } from 'next';

function index({
    code,
    superAdminId,
    onboard,
}: {
    code: string;
    superAdminId?: any;
    onboard: any;
}) {
    return (
        <>
            {superAdminId ? (
                <CompleteResetExtra
                    code={code}
                    superAdminId={superAdminId}
                    onboard={onboard}
                />
            ) : (
                <CompleteReset code={code} />
            )}
        </>
    );
}

export default index;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    const { id, superAdmin, onboard } = ctx.query;
    return {
        props: {
            code: id,
            superAdminId: superAdmin || '',
            onboard: onboard || '',
        },
    };
};
