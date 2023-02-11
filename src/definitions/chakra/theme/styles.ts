import { ThemeOverride } from '@chakra-ui/react';

type GlobalStyles = Pick<ThemeOverride, 'styles'>;

export default {
    styles: {
        global: {
            h1: {
                fontWeight: 500,
                marginBottom: '0.5em',
                fontFamily: "'Rubik', sans-serif",
            },
            p: {
                marginBottom: '1em',
            },
            body: {
                fontFamily: "'Rubik', sans-serif",
            },
        },
    },
} as GlobalStyles;
