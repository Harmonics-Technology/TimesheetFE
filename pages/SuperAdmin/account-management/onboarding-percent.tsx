import { OnboardingPercent } from '@components/bits-utils/OnboardingPercent';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { OnboardingFeeView, OnboardingFeeService } from 'src/services';

function onboardingfee({ data }: { data: OnboardingFeeView[] }) {
    return <OnboardingPercent data={data} />;
}

export default onboardingfee;

export const getServerSideProps: GetServerSideProps = withPageAuth(async (ctx) => {
    const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
    try {
        const data = await OnboardingFeeService.listPercentageOnboardingFees(superAdminId);
        return {
            props: {
                data: data.data?.value,
            },
        };
    } catch (error: any) {
        console.log(error);
        return {
            props: {
                data: [],
            },
        };
    }
});
