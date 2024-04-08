import { OnboardingFee } from '@components/bits-utils/OnboardingFee';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { OnboardingFeeView, OnboardingFeeService } from 'src/services';

function onboardingfee({ data }: { data: OnboardingFeeView[] }) {
    return <>{/* <OnboardingFee data={data} /> */}</>;
}

export default onboardingfee;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await OnboardingFeeService.listFixedAmountFee(
                superAdminId,
            );
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
