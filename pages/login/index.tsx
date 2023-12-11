// import dynamic from 'next/dynamic';

import Login from "@components/subpages/Login";

// const Login = dynamic(() => import('@components/subpages/Login'), {
//     ssr: false,
// });

function index() {
    return <Login />;
}

export default index;
