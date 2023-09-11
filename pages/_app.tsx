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

const msalInstance = new PublicClientApplication(msalConfig);

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASEURL as string;
    OpenAPI.TOKEN = Cookies.get('token') as string;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loader = document.getElementById('globalLoader');
            if (loader)
                setTimeout(() => {
                    loader.remove();
                }, 1000);
        }
    }, []);
    return (
        <ChakraProvider theme={theme}>
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
            <StyledThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
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
                    </Hydrate>
                </QueryClientProvider>
            </StyledThemeProvider>
        </ChakraProvider>
    );
}

export default MyApp;
