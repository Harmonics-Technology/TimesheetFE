import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@definitions/chakra/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import '../src/styles/global.css';
import Layout from 'src/layout';
import Head from 'next/head';
import Cookies from 'js-cookie';
import NextNProgress from 'nextjs-progressbar';

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    // OpenAPI.BASE =
    //     (process.env.NEXT_PUBLIC_API_BASEURL as string) ||
    //     'https://timesheetapiprod.azurewebsites.net';
    // OpenAPI.TOKEN = Cookies.get('token') as string;

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const loader = document.getElementById('globalLoader');
    //         if (loader)
    //             setTimeout(() => {
    //                 loader.remove();
    //             }, 1000);
    //     }
    // }, []);
    return (
        <ChakraProvider theme={theme}>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                />
                <title>Harmonics Technology</title>
                <link rel="icon" href="/assets/logo.png" type="image/x-icon" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <NextNProgress color="#2EAFA3" />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Hydrate>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default MyApp;
