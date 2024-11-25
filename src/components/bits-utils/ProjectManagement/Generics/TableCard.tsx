import {
    Flex,
    Icon,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    Text,
} from '@chakra-ui/react';
import TableNoContentWrapper from '@components/bits-utils/TableNoContentWrapper';
import React from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';

export const TableCard = ({
    tableHead,
    children,
    bg,
    color,
    overflow,
}: {
    tableHead: any[];
    children: any;
    bg?: string;
    color?: string;
    overflow?: any;
}) => {
    return (
        <TableContainer h="auto" overflowX={overflow} overflowY={overflow}>
            <Table
                fontSize="11px"
                style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}
            >
                <Thead>
                    <Tr
                        w="full"
                        h="2rem"
                        border="1px solid #EFEFEF"
                        bgColor={bg || 'white'}
                    >
                        {tableHead.map((x, i) => (
                            <Th
                                pl="1rem"
                                fontSize=".8rem"
                                color={color || '#b6b6b6'}
                                fontWeight="400"
                                textTransform="capitalize"
                                key={i}
                            >
                                {x}
                            </Th>
                        ))}
                    </Tr>
                </Thead>

                {
                    //@ts-ignore
                    children?.props?.children?.length > 0 ||
                    //@ts-ignore
                    children?.at(0)?.props?.children?.length > 0 ? (
                        <Tbody>{children}</Tbody>
                    ) : (
                        <TableNoContentWrapper
                            elements={
                                <Flex
                                    align="center"
                                    fontSize=".9rem"
                                    gap=".5rem"
                                >
                                    <Icon as={BsFillInfoCircleFill} />
                                    <Text mb="0">
                                        There's currently no data available.
                                        Check back later
                                    </Text>
                                </Flex>
                            }
                        />
                    )
                }
            </Table>
        </TableContainer>
    );
};
