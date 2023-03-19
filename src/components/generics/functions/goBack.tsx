import { useRouter } from "next/router";

export const goBack = () => {
    const router = useRouter();
    return router.back();
};
