import { Box, Tr, useDisclosure } from '@chakra-ui/react';
import { TableData, TableDraftActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import {
    LeaveConfigurationView,
    UserDraftView,
    UserDraftViewPagedCollectionStandardResponse,
    UserView,
} from 'src/services';
import DraftOnboardingModal from './DraftOnboardingModal';
import { useState } from 'react';

interface adminProps {
    drafts: UserDraftViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
}

function TeamDraft({
    drafts,
    clients,
    paymentPartner,
    leaveSettings,
}: adminProps) {
    const thead = ['First Name', 'Last Name', 'Email', 'Action'];
    const [data, setData] = useState<UserDraftView>();
    // const { isOpen, onOpen, onClose } = useDisclosure();
    const [openModal, setOpenModal] = useState<any>(false);
    const setDraftData = (item: UserDraftView) => {
        setData(item);
        setOpenModal(true);
        // onOpen();
    };
    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Box mb="1rem">
                    <LeaveTab
                        tabValue={[
                            {
                                text: 'Team Members',
                                url: '/profile-management/team-members',
                            },
                            {
                                text: 'Drafts',
                                url: `/profile-management/team-members/drafts`,
                            },
                        ]}
                    />
                </Box>

                <FilterSearch searchOptions="Search by: Full Name, Job Title, Role, Payroll Type or Status" />
                <Tables tableHead={thead}>
                    <>
                        {drafts?.data?.value?.map((x: UserDraftView) => (
                            <Tr key={x.id}>
                                <TableData name={x?.firstName} />
                                <TableData name={x?.lastName} />

                                <TableData name={x?.email} full />
                                <TableDraftActions
                                    data={x}
                                    setDraftData={setDraftData}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={drafts} />

                {openModal && (
                    <DraftOnboardingModal
                        isOpen={openModal}
                        onClose={setOpenModal}
                        data={data}
                        clients={clients}
                        paymentPartner={paymentPartner}
                        leaveSettings={leaveSettings}
                    />
                )}
            </Box>
        </>
    );
}

export default TeamDraft;
