import { withPageAuth } from "@components/generics/withPageAuth";
import AdminProfile from "@components/subpages/AdminProfile";
import { GetServerSideProps } from "next";
interface pageOptions {
    data: any;
}

function AdminDetails({ data }: pageOptions) {
    return <AdminProfile />;
}

export default AdminDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        console.log({ id });
        try {
            const data = await UserService.listUsers(id);
            return {
                props: {
                    adminList: data,
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
