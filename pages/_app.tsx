import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@definitions/chakra/theme';
import { StyledThemeProvider } from '@definitions/styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { RootStoreProvider } from '@mobx';
import '../src/styles/global.css';
import Layout from 'src/layout';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { OpenAPI } from 'src/services';
import NextNProgress from 'nextjs-progressbar';
import { UserProvider } from '@components/context/UserContext';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@components/authentication/msalConfig';
import Script from 'next/script';
import { Online, Offline } from 'react-detect-offline';
import { NoNetwork } from '@components/bits-utils/NoNetwork';
import { Analytics } from '@vercel/analytics/react';
import GTM from './gtm';

const msalInstance = new PublicClientApplication(msalConfig);

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    OpenAPI.BASE =
        (process.env.NEXT_PUBLIC_API_BASEURL as string) ||
        'https://timesheetapiprod.azurewebsites.net';
    OpenAPI.TOKEN = Cookies.get('token') as string;

    // useEffect(() => {
    if (typeof window !== 'undefined') {
        const loader = document.getElementById('globalLoader');
        if (loader)
            setTimeout(() => {
                loader.remove();
            }, 500);
    }
    // }, []);
    return (
        <ChakraProvider theme={theme}>
            <Analytics />
            {/* <GTM /> */}
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                />
                <title>Timesheet</title>
                <link
                    rel="icon"
                    href="/assets/newfav.jpg"
                    type="image/x-icon"
                />
            </Head>

            {/* <StyledThemeProvider> */}
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Online polling={false}>
                        <RootStoreProvider>
                            <MsalProvider instance={msalInstance}>
                                <UserProvider>
                                    <NextNProgress color="#2EAFA3" />
                                    <Layout>
                                        <Component {...pageProps} />
                                    </Layout>
                                </UserProvider>
                            </MsalProvider>
                        </RootStoreProvider>
                    </Online>
                    <Offline polling={false}>
                        <NoNetwork />
                    </Offline>
                </Hydrate>
            </QueryClientProvider>
            {/* </StyledThemeProvider> */}
            <Script src="/asseccibility.js" strategy="beforeInteractive" />
        </ChakraProvider>
    );
}

export default MyApp;
