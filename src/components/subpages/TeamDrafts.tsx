import { Box, Tr, useDisclosure } from '@chakra-ui/react';
import { TableData, TableDraftActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import {
    ClientSubscriptionDetailView,
    LeaveConfigurationView,
    OnboardingFeeService,
    UserDraftView,
    UserDraftViewPagedCollectionStandardResponse,
    UserService,
    UserView,
} from 'src/services';
import { DraftOnboardingModal } from './DraftOnboardingModal';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';

interface adminProps {
    drafts: UserDraftViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    subs: ClientSubscriptionDetailView[];
    currencies: any;
    department: any;
}

function TeamDraft({
    drafts,
    clients,
    paymentPartner,
    leaveSettings,
    subs,
    currencies,
    department,
}: adminProps) {
    const client = clients?.filter((x) => x.isActive);

    const thead = ['First Name', 'Last Name', 'Email', 'Action'];
    const { user, opens, subType, accessControls } = useContext(UserContext);
    const [data, setData] = useState<UserDraftView>();
    const router = useRouter();
    const {
        isOpen: openDraft,
        onOpen: onOpenDraft,
        onClose: closeDraft,
    } = useDisclosure();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [supervisor, setSupervisor] = useState<any>();
    const [fees, setFees] = useState<any>();
    const [loading, setLoading] = useState({ id: '' });

    const getSupervisor = async (id, payId, loadId) => {
        if (id === undefined) {
            return;
        }
        setLoading({ id: loadId });
        try {
            const data = await UserService.getSupervisors(id);
            const payFees = await OnboardingFeeService.listOnboardingFee(
                0,
                10,
                payId,
            );
            setLoading({ id: '' });
            if (data.status) {
                setSupervisor(data.data?.filter((x) => x.isActive));
                setFees(payFees?.data?.value);
                onOpen();
                return;
            }
        } catch (err: any) {
            setLoading({ id: '' });
            console.log({ err });
        }
    };
    const setDraftData = (item: UserDraftView) => {
        setData(item);
        getSupervisor(item?.clientId, item?.paymentPartnerId, item?.id);
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
                                    loading={loading.id == x?.id}
                                    setLoading={setLoading}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={drafts} />

                {isOpen && (
                    <DraftOnboardingModal
                        userProfile={data}
                        client={client}
                        closeDraft={closeDraft}
                        onClose={onClose}
                        currencies={currencies}
                        department={department}
                        isOpen={isOpen}
                        leaveSettings={leaveSettings}
                        paymentPartner={paymentPartner}
                        subs={subs}
                        user={user}
                        router={router}
                        openDraft={openDraft}
                        onOpenDraft={onOpenDraft}
                        fees={fees}
                        supervisor={supervisor}
                    />
                )}
            </Box>
        </>
    );
}

export default TeamDraft;
