import { GetServerSideProps } from 'next';
import React from 'react';

const material = () => {
    return <div>material</div>;
};

export default material;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const role = JSON.parse(ctx.req.cookies.user).role.replaceAll(' ', '');
    //
    return {
        redirect: {
            permanent: false,
            destination: `/${role}/training/`,
        },
        props: {},
    };
};
