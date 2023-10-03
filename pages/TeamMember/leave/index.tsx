import { GetServerSideProps } from 'next';
import React from 'react';

const index = () => {
    return <div>index</div>;
};

export default index;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const role = JSON.parse(ctx.req.cookies.user).role.replaceAll(' ', '');
    //
    return {
        redirect: {
            permanent: false,
            destination: `/${role}/leave/management`,
        },
        props: {},
    };
};
