import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartner from '@components/subpages/PaymentPartner';
import { GetServerSideProps } from 'next';
import {
    OnboardingFeeService,
    UserService,
    UtilityService,
} from 'src/services';

interface pageOptions {
    userProfile: any;
    subs: any;
    currencies: any;
    userFees: any;
}

function PaymentPartnerDetails({
    userProfile,
    subs,
    currencies,
    userFees,
}: pageOptions) {
    return (
        <PaymentPartner
            userProfile={userProfile}
            subs={subs}
            currencies={currencies}
            userFees={userFees}
        />
    );
}

export default PaymentPartnerDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        //
        try {
            const data = await UserService.getUserById(id);
            const userFees = await OnboardingFeeService.listOnboardingFee(
                0,
                10,
                id,
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const currencies = await UtilityService.listCountries();
            //
            return {
                props: {
                    userProfile: data.data,
                    subs: subs.data,
                    currencies: currencies.data,
                    userFees: userFees.data,
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
