/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Flex, Select, Text, HStack, Input, Tr } from "@chakra-ui/react";
import {
    TableContract,
    TableContractAction,
    TableData,
    TableState,
} from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import Pagination from "@components/bits-utils/Pagination";
import { useRouter } from "next/router";
import moment from "moment";
import {
    ContractView,
    ContractViewPagedCollectionStandardResponse,
} from "src/services";

interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
}

function ContractList({ adminList }: adminProps) {
    console.log({ adminList });
    const router = useRouter();

    function setFilter(filter: string) {
        router.push({
            query: {
                limit: filter,
            },
        });
    }

    function search(term: string) {
        router.push({
            query: {
                search: term,
            },
        });
    }

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" align="center" my="2.5rem">
                    <HStack fontSize=".8rem" w="fit-content">
                        <Select
                            w="fit-content"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="5">5</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </Select>

                        <Text noOfLines={1}>entries per page</Text>
                    </HStack>
                    <Box>
                        <Input
                            type="search"
                            placeholder="search"
                            onChange={(e) => search(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Tables
                    tableHead={[
                        "Name",
                        "Job Title",
                        "Client",
                        "Phone No",
                        "Role",
                        "Status",
                        "",
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: ContractView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData name={x.title} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        "DD/MM/YYYY",
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format(
                                        "DD/MM/YYYY",
                                    )}
                                />
                                <TableData
                                    name={x.tenor as unknown as string}
                                />
                                <TableContract url={x.document} />
                                <TableState name={"ACTIVE"} />
                                <TableContractAction id={x.userId} />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
        </>
    );
}

export default ContractList;