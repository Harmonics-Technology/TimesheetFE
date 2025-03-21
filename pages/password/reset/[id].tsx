import { convertYesNo } from '@components/generics/functions/ConvertStringToBool';
import CompleteReset from '@components/subpages/CompleteReset';
import { CompleteResetExtra } from '@components/subpages/CompleteResetExtra';
import { GetServerSidePropsContext } from 'next';

function index({
    code,
    superAdminId,
    onboard,
    exist,
}: {
    code: string;
    superAdminId?: any;
    onboard: any;
    exist: boolean;
}) {
    return (
        <>
            {/* {superAdminId ? ( */}
            <CompleteResetExtra
                code={code}
                superAdminId={superAdminId}
                onboard={onboard}
                exist={exist}
            />
            {/* ) : (
                <CompleteReset code={code} />
            )} */}
        </>
    );
}

export default index;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    const { id, superAdmin, onboard, e } = ctx.query;
    return {
        props: {
            code: id,
            superAdminId: superAdmin || '',
            onboard: onboard || '',
            exist: convertYesNo(e) || false,
        },
    };
};
