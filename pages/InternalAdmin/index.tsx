import { GetServerSideProps } from "next";
import React from "react";

function index() {
    return <div>index</div>;
}

export default index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        redirect: {
            permanent: false,
            destination: "/Admin/dashboard",
        },
        props: {},
    };
};
