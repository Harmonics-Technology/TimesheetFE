import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartner from '@components/subpages/PaymentPartner';
import { GetServerSideProps } from 'next';
import { UserService } from 'src/services';

interface pageOptions {
    userProfile: any;
}

function PaymentPartnerDetails({ userProfile }: pageOptions) {
    return <PaymentPartner userProfile={userProfile} />;
}

export default PaymentPartnerDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        //
        try {
            const data = await UserService.getUserById(id);
            //
            return {
                props: {
                    userProfile: data.data,
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
