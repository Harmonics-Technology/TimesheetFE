import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@definitions/chakra/theme';
import { StyledThemeProvider } from '@definitions/styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { RootStoreProvider } from '@mobx';
import '../src/styles/global.css';
import Layout from 'src/layout';
import { UserProvider } from '@components/context/UserContext';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { OpenAPI } from 'src/services';
import NextNProgress from 'nextjs-progressbar';
import { NotificationProvider } from '@components/context/NotificationContext';
import { OnboardingFeeProvider } from '@components/context/OnboardingFeeContext';
import Router, { useRouter } from 'next/router';

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASEURL as string;
    OpenAPI.TOKEN = Cookies.get('token') as string;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loader = document.getElementById('globalLoader');
            if (loader)
                setTimeout(() => {
                    loader.remove();
                }, 1000);
        }
    }, []);
    // Router.events.on('routeChangeStart', (url) => {
    //     setLoading(true);
    // });

    // Router.events.on('routeChangeComplete', (url) => {
    //     setLoading(false);
    // });
    return (
        <ChakraProvider theme={theme}>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                />
                <title>Timesheet</title>
                <link rel="icon" href="/assets/logo.png" type="image/x-icon" />
            </Head>
            <StyledThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <RootStoreProvider>
                            <>
                                {loading ? (
                                    <div id="globalLoader">
                                        <img src="/assets/splash.gif" alt="" />
                                    </div>
                                ) : (
                                    <OnboardingFeeProvider>
                                        <NotificationProvider>
                                            <UserProvider>
                                                <NextNProgress color="#2EAFA3" />
                                                <Layout>
                                                    <Component {...pageProps} />
                                                </Layout>
                                            </UserProvider>
                                        </NotificationProvider>
                                    </OnboardingFeeProvider>
                                )}
                            </>
                        </RootStoreProvider>
                    </Hydrate>
                </QueryClientProvider>
            </StyledThemeProvider>
        </ChakraProvider>
    );
}

export default MyApp;
