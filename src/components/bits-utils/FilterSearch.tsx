import { Box, Flex, HStack, Input, Select, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function FilterSearch() {
    const [search, setSearch] = useState('');
    const router = useRouter();
    function setFilter(filter: string) {
        router.push({
            query: {
                limit: filter,
            },
        });
    }
    const debounced = useDebouncedCallback(
        // function
        (search) => {
            setSearch(search);
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
        <Flex
            justify="space-between"
            align={['unset', 'center']}
            my="2.5rem"
            flexDirection={['column', 'row']}
        >
            <HStack fontSize=".8rem" w="fit-content" mb={['1rem', '0']}>
                <Select
                    w="fit-content"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </Select>

                <Text noOfLines={1}>entries per page</Text>
            </HStack>
            <Box>
                <Input
                    type="search"
                    placeholder="search"
                    onChange={(e) => debounced(e.target.value)}
                />
            </Box>
        </Flex>
    );
}

export default FilterSearch;
