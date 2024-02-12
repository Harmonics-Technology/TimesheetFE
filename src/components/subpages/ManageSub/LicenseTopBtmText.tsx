import { VStack, Text, HStack, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export const LicenseTopBtmText = ({
    fontSizea,
    fontSizeb,
    fontSizec,
    top,
    title,
    sub,
    icon,
    url,
    iconColor = 'brand.400',
}: {
    fontSizea?: any;
    fontSizeb?: any;
    fontSizec?: any;
    top?: any;
    title?: any;
    sub?: any;
    icon?: any;
    url?: any;
    iconColor?: any;
}) => {
    return (
        <VStack align="flex-start" spacing=".2rem">
            <Text
                fontSize={fontSizea || '13px'}
                fontWeight={400}
                mb="0"
                color="#696969"
                textTransform="capitalize"
            >
                {top}
            </Text>
            <HStack>
                {icon && <Icon as={icon} color={iconColor} />}
                <Text
                    fontSize={fontSizeb || '13px'}
                    fontWeight={500}
                    mb="0"
                    color="#2d3748"
                    textTransform="capitalize"
                >
                    {title}
                </Text>
            </HStack>
            {sub && (
                <Link href={url} passHref>
                    <Text
                        fontSize={fontSizec || '12px'}
                        fontWeight={400}
                        mb="0"
                        color="#23e3bd"
                        textTransform="capitalize"
                        cursor="pointer"
                    >
                        {sub}
                    </Text>
                </Link>
            )}
        </VStack>
    );
};
