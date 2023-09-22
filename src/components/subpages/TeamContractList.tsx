/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Tr } from '@chakra-ui/react';
import {
    TableContract,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import moment from 'moment';
import { ContractView, UserViewStandardResponse } from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { formatDate } from '@components/generics/functions/formatDate';

interface adminProps {
    adminList: UserViewStandardResponse;
}

function TeamContractList({ adminList }: adminProps) {
    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                {/* <FilterSearch /> */}
                <Tables
                    tableHead={[
                        'Name',
                        'Job Title',
                        'Start Date',
                        'End Date',
                        'Duration',
                        'Contract',
                        'Status',
                        // 'Action',
                    ]}
                >
                    <>
                        {adminList?.data?.employeeInformation?.contracts?.map(
                            (x: ContractView) => (
                                <Tr key={x.id}>
                                    <TableData name={x.name} />
                                    <TableData name={x.title} />
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableData
                                        name={x.tenor as unknown as string}
                                    />
                                    <TableContract url={x.document} />
                                    <TableState name={x.status as string} />
                                    {/* <TableContractAction id={x.userId} /> */}
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
                {/* <Pagination data={adminList} /> */}
            </Box>
        </>
    );
}

export default TeamContractList;
