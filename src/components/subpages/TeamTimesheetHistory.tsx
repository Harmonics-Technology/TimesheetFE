/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Flex, Select, Text, HStack, Input, Tr } from "@chakra-ui/react";
import {
    TableContract,
    TableContractAction,
    TableData,
} from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import Pagination from "@components/bits-utils/Pagination";
import { useRouter } from "next/router";
import {
    TimeSheetHistoryView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
} from "src/services";

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}

function TeamTimesheetHistory({ timeSheets }: adminProps) {
    console.log({ timeSheets });
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
                <Flex justify="space-between" align="center" my="1rem">
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
                        "Email",
                        "Total Hours",
                        "No. of Days",
                        "",
                    ]}
                >
                    <>
                        {timeSheets?.data?.value?.map(
                            (x: TimeSheetHistoryView) => (
                                <Tr key={x.employeeInformationId}>
                                    <TableData name={x.name} />
                                    <TableData name={x.email} />
                                    <TableData
                                        name={x.totalHours as unknown as string}
                                    />
                                    <TableData
                                        name={
                                            x.numberOfDays as unknown as string
                                        }
                                    />

                                    <TableContractAction
                                        id={x.employeeInformationId}
                                        timeSheets={true}
                                    />
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
                <Pagination data={timeSheets} />
            </Box>
        </>
    );
}

export default TeamTimesheetHistory;
