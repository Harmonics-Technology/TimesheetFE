import ProfileManagementAdmin from "@components/subpages/ProfileManagementAdmin";
import { GetServerSideProps } from "next";
import React from "react";
import { UserService } from "src/services";

function admin() {
    return <ProfileManagementAdmin />;
}

export default admin;

// export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
//     try {
//         const data = await UserService.listUsers();
//         return {
//             props: {
//                 data: data,
//             },
//         };
//     } catch (error: any) {
//         console.log(error);
//         return {
//             props: {
//                 data: [],
//             },
//         };
//     }
// };
