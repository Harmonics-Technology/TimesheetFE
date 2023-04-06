import { Hst } from '@components/bits-utils/Hst';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { OnboardingFeeView, OnboardingFeeService } from 'src/services';

function hst({ data }: { data: OnboardingFeeView }) {
    return <Hst data={data} />;
}

export default hst;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await OnboardingFeeService.getHst();
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
