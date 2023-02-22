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
import Head from 'next/head';
import Cookies from 'js-cookie';
import { OpenAPI } from 'src/services';
import NextNProgress from 'nextjs-progressbar';
import { UserProvider } from '@components/context/UserContext';
import axios from 'axios';

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASEURL as string;
    OpenAPI.TOKEN = Cookies.get('token') as string;
    // const header = (axios.defaults.headers.common['Accept-Language'] = 'fr');
    // OpenAPI.HEADERS = { header };

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
                <link rel="icon" href="/assets/logo.png" type="image/x-icon" />
            </Head>
            <StyledThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <RootStoreProvider>
                            <UserProvider>
                                <NextNProgress color="#2EAFA3" />
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            </UserProvider>
                            =
                        </RootStoreProvider>
                    </Hydrate>
                </QueryClientProvider>
            </StyledThemeProvider>
        </ChakraProvider>
    );
}

export default MyApp;
