import { Flex, Tbody, Td, Tr } from '@chakra-ui/react';

function TableNoContentWrapper({ elements }: any) {
    return (
        <Tbody>
            <tr />
            <Tr w="full" pos="relative" h="20vh">
                <Td pos="absolute" w="100%" h="100%">
                    <Flex h="full" justify="center" align="center">
                        {elements}
                    </Flex>
                </Td>
            </Tr>
        </Tbody>
    );
}

export default TableNoContentWrapper;
