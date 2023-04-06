import { OnboardingFee } from '@components/bits-utils/OnboardingFee';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { OnboardingFeeView, OnboardingFeeService } from 'src/services';

function onboardingfee({ data }: { data: OnboardingFeeView }) {
    return <OnboardingFee data={data} />;
}

export default onboardingfee;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await OnboardingFeeService.getFixedAmount();
        return {
            props: {
                data: data.data,
            },
        };
    } catch (error: any) {
        (error);
        return {
            props: {
                data: [],
            },
        };
    }
});
