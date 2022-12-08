import CompleteReset from "@components/subpages/CompleteReset";
import { GetServerSidePropsContext } from "next";

function index({ code }: { code: string }) {
    return <CompleteReset code={code} />;
}

export default index;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
    const { id } = ctx.query;
    return {
        props: {
            code: id,
        },
    };
};
