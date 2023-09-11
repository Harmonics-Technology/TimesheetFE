export const msalConfig = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_MSAL_CLIENTID as string,
        authority: process.env.NEXT_PUBLIC_MSAL_AUTH as string,
    },
};
