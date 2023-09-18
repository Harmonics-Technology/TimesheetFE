import { Hst } from '@components/bits-utils/Hst';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { OnboardingFeeView, OnboardingFeeService } from 'src/services';

function hst({ data }: { data: OnboardingFeeView }) {
    return <Hst data={data} />;
}

export default hst;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await OnboardingFeeService.getHst(superAdminId);
            return {
                props: {
                    data: data.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
