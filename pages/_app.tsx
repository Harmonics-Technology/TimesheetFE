import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import { StyledThemeProvider } from "@definitions/styled-components";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { RootStoreProvider } from "@mobx";
import "../src/styles/global.css";
import Layout from "src/layout";

function MyApp({
    Component,
    pageProps,
}: AppProps<{ dehydratedState: unknown }>): JSX.Element {
    const queryClient = new QueryClient();
    return (
        <ChakraProvider theme={theme}>
            <StyledThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <RootStoreProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </RootStoreProvider>
                    </Hydrate>
                </QueryClientProvider>
            </StyledThemeProvider>
        </ChakraProvider>
    );
}

export default MyApp;
