// import type { DeepPartial, Theme, defineStyle } from '@chakra-ui/react';

// const timba = defineStyle({
//     border: '2px dashed', // change the appearance of the border
//     borderRadius: 0, // remove the border radius
//     fontWeight: 'semibold', // change the font weight
// });
// export const Button: DeepPartial<Theme['components']['Button']> = {
//     //@ts-ignore
//     baseStyle: {
//         // borderRadius: "full",
//         borderRadius: '0',
//     },
//     defaultProps: {
//         variant: { timba },
//     },
// };

import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import BeatLoader from 'react-spinners/BeatLoader';

const timba = defineStyle({
    border: '2px dashed', // change the appearance of the border// remove the border radius
    fontWeight: 'semibold', // change the font weight
    loadingText: 'please wait...',
    // spinner: <BeatLoader size={8} color="white" />,
});

export const Button = defineStyleConfig({
    variants: { timba },
    baseStyle: { borderRadius: '0' },
});
