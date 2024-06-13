import { InputGroup, Input, InputRightElement, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useDebouncedCallback } from 'use-debounce';

export const SubSearchComponent = () => {
    const router = useRouter();
    const debounced = useDebouncedCallback(
        // function
        (search) => {
            router.push({
                query: {
                    ...router.query,
                    search: search,
                },
            });
        },
        // delay in ms
        800,
    );
    return (
        <InputGroup w="320px">
            <Input
                type="search"
                placeholder="Search"
                onChange={(e) => debounced(e.target.value)}
                borderRadius="3px"
                // bgColor="#F5F5F5"
                border="1px solid #e5e9ff"
                bgColor="white"
            />
            <InputRightElement>
                <Icon as={BsSearch} />
            </InputRightElement>
        </InputGroup>
    );
};
