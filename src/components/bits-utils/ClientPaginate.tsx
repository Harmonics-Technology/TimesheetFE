import {
    Button,
    Circle,
    Flex,
    HStack,
    Icon,
    Square,
    Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ClientPaginateProps {
    data: any;
    display?: string | undefined;
    justify?: string | undefined;
    setTxn?: any;
    id?: any;
    api?: any;
    setLoading?: any;
}

function ClientPaginate({
    data,
    display,
    justify = 'flex-end',
    setTxn,
    id,
    api,
    setLoading,
}: ClientPaginateProps) {
    const totalPages = Math.ceil(
        (data?.size as number) / (data?.limit as unknown as number),
    );

    const currentPage = (((data?.limit as unknown as number) +
        (data?.offset as unknown as number)) /
        (data?.limit as unknown as number)) as number;
    const total = data?.size;
    // const pageSize = data?.value?.length;
    const current = data?.offset + 1;
    const pageSize = data?.nextOffset;
    const router = useRouter();
    const next = data?.next?.href;
    const previous = data?.previous?.href;
    const last = data?.last?.href;

    const paginate = async (direction: 'next' | 'previous') => {
        let link = '';
        if (direction == 'previous' && previous != null) {
            const url = new URL(previous!);
            const limit = url.searchParams.get('limit');
            const offset = url.searchParams.get('offset');
            const search = url.searchParams.get('search');
            setLoading(true);
            const getPrev = await api(
                offset as unknown as number,
                limit as unknown as number,
                search,
                id,
            );
            if (getPrev.status) {
                setLoading(false);
                setTxn(getPrev.data);
            }
        }
        if (direction == 'next' && next != null) {
            link = next!.split('?')[1];
            const url = new URL(next!);
            const limit = url.searchParams.get('limit');
            const offset = url.searchParams.get('offset');
            const search = url.searchParams.get('search');
            setLoading(true);
            const getNext = await api(
                offset as unknown as number,
                limit as unknown as number,
                search,
                id,
            );
            if (getNext.status) {
                setLoading(false);
                setTxn(getNext.data);
            }
        }
    };
    return (
        <Flex
            justify={'space-between'}
            align="center"
            p="1.5rem 0 .5rem"
            gap="1rem"
            flexDirection={['column', 'row']}
        >
            <Text
                fontSize=".9rem"
                color="brand.300"
                mb="0"
                // display={dashboard ? 'none' : 'block'}
            >
                Showing {current} to {pageSize} of {total} entries
            </Text>
            {totalPages > 1 && (
                <HStack cursor="pointer">
                    <Button
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        width="2rem"
                        height="2rem"
                        minW="unset"
                        padding="0"
                        borderRadius="50%"
                        disabled={!previous}
                        onClick={() => paginate('previous')}
                    >
                        <FaAngleLeft fontSize=".6rem" />
                    </Button>
                    <Circle bgColor="brand.400" color="white" size="2rem">
                        {currentPage}
                    </Circle>
                    <Text mx=".5rem">of</Text>
                    <Button
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        width="2rem"
                        height="2rem"
                        minW="unset"
                        padding="0"
                        borderRadius="50%"
                        disabled={!previous}
                        // onClick={() => paginate('last')}
                    >
                        {Math.floor(totalPages) < 2
                            ? '2'
                            : Math.floor(totalPages)}
                    </Button>

                    <Button
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        width="2rem"
                        height="2rem"
                        minW="unset"
                        padding="0"
                        borderRadius="50%"
                        disabled={!next}
                        onClick={() => paginate('next')}
                    >
                        <FaAngleRight fontSize=".6rem" />
                    </Button>
                </HStack>
            )}
        </Flex>
    );
}

export default ClientPaginate;
