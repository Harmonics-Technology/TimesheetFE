import { withPageAuth } from "@components/generics/withPageAuth";
import TeamProfile from "@components/subpages/TeamProfile";
import { GetServerSideProps } from "next";
import { UserService, UserView } from "src/services";

interface pageOptions {
    userProfile: any;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
}

function TeamDetails({
    userProfile,
    clients,
    supervisor,
    paymentPartner,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            // clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
        />
    );
}

export default TeamDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        // ({ id });
        try {
            const data = await UserService.getUserById(id);
            const clients = await UserService.listUsers("client");
            const supervisor = await UserService.listUsers("supervisor");
            const paymentPartner = await UserService.listUsers(
                "payment partner",
            );
            ({ data });
            return {
                props: {
                    userProfile: data.data,
                    clients: clients?.data?.value,
                    supervisor: supervisor?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
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
    },
);
