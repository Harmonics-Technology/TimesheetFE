import dynamic from 'next/dynamic';

const Login = dynamic(() => import('@components/subpages/Login'), {
    ssr: false,
});

function index() {
    return <Login />;
}

export default index;
