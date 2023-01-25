import { withPageAuth } from "@components/generics/withPageAuth";
import ClientProfile from "@components/subpages/ClientProfile";
import { GetServerSideProps } from "next";
import { UserService } from "src/services";

interface pageOptions {
    userProfile: any;
}

function ClientDetails({ userProfile }: pageOptions) {
    return <ClientProfile userProfile={userProfile} />;
}

export default ClientDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        // console.log({ id });
        try {
            const data = await UserService.getUserById(id);
            // console.log({ data });
            return {
                props: {
                    userProfile: data.data,
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
