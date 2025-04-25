import {
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    Text,
    Icon,
    Flex,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import TableNoContentWrapper from './TableNoContentWrapper';
import { BsFillInfoCircleFill } from 'react-icons/bs';

interface TablesProps {
    tableHead: any[];
    children: ReactNode;
    bg?: string;
    color?: string;
    variant?: any;
    content?: any;
    overflow?: any;
    breakWord?: any;
}

function Tables({
    tableHead,
    children,
    bg,
    color = 'brand.200',
    variant = 'striped',
    overflow = 'auto',
    content = "There's currently no data available. Check back later",
    breakWord = true,
}: TablesProps) {
    //
    return (
        <TableContainer h="auto" overflowX={overflow} overflowY={overflow}>
            <Table variant={variant} fontSize="11px">
                <Thead>
                    <Tr
                        w="full"
                        h="2rem"
                        borderBottom="1px solid #f2f2f2"
                        bgColor={bg}
                    >
                        {tableHead.map((x, i) => (
                            <Th
                                pl="1rem"
                                fontSize="12px"
                                color={color}
                                fontWeight="700"
                                maxW={breakWord ? '150px' : 'unset'}
                                whiteSpace="normal"
                                textAlign={x?.center ? 'center' : 'left'}
                                // color="gray.500"
                                // textTransform="capitalize"
                                key={i}
                            >
                                {x?.label || x}
                            </Th>
                        ))}
                    </Tr>
                </Thead>

                {
                    //@ts-ignore
                    children?.props?.children?.length > 0 ||
                    //@ts-ignore
                    children[0]?.props?.children?.length > 0 ? (
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
                                    <Text mb="0">{content}</Text>
                                </Flex>
                            }
                        />
                    )
                }
            </Table>
        </TableContainer>
    );
}

export default Tables;
