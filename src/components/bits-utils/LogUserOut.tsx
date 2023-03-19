import Cookies from 'js-cookie';
import router from 'next/router';

export function Logout(redirect: any) {
    Cookies.remove('user');
    Cookies.remove('token');
    router.push(`${redirect}`);
}
