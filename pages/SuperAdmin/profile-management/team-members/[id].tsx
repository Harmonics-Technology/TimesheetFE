import { withPageAuth } from "@components/generics/withPageAuth";
import TeamProfile from "@components/subpages/TeamProfile";
import { GetServerSideProps } from "next";
import { ContractService, UserService, UserView } from "src/services";

interface pageOptions {
    userProfile: any;
    contractList: any;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
}

function TeamDetails({
    userProfile,
    contractList,
    clients,
    supervisor,
    paymentPartner,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            contractList={contractList}
            clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
        />
    );
}

export default TeamDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        // console.log({ id });
        try {
            const data = await UserService.getUserById(id);
            // const contractList = await ContractService.getContract(
            //     data.data?.employeeInformation?.contractId,
            // );
            const clients = await UserService.listUsers("client");
            const supervisor = await UserService.listUsers("supervisor");
            const paymentPartner = await UserService.listUsers(
                "payment partner",
            );
            console.log({ data });
            return {
                props: {
                    userProfile: data.data,
                    // contractList: contractList,
                    clients: clients?.data?.value,
                    supervisor: supervisor?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
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
    },
);
