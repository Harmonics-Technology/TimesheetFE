/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Text,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Icon,
    HStack,
    useRadioGroup,
    FormLabel,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    isSuperAdmin?: boolean;
    subs: ClientSubscriptionDetailView[];
    currencies: any;
    department: any;
}

import {
    LeaveConfigurationView,
    TeamMemberModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
    ControlSettingView,
    DraftService,
    UserDraftModel,
    ClientSubscriptionDetailView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { DateObject } from 'react-multi-date-picker';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Loading from '@components/bits-utils/Loading';
import BeatLoader from 'react-spinners/BeatLoader';
import UploadCareWidget from '@components/bits-utils/UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { UserContext } from '@components/context/UserContext';
import RadioBtn from '@components/bits-utils/RadioBtn';
import { TriggerBox } from '@components/bits-utils/TriggerBox';
import Cookies from 'js-cookie';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { ShowPrompt } from '@components/bits-utils/ProjectManagement/Modals/ShowPrompt';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import { LicenseSelection } from './ManageSub/LicenseSelection';
import { NewTeamMemerOnboardingForm } from '@components/bits-utils/NewUpdates/NewTeamMemerOnboardingForm';

function TeamManagement({
    adminList,
    clients,
    paymentPartner,
    leaveSettings,
    isSuperAdmin,
    subs,
    currencies,
    department,
}: adminProps) {
    const client = clients?.filter((x) => x.isActive);
    //

    const {
        isOpen: openDraft,
        onOpen: onOpenDraft,
        onClose: closeDraft,
    } = useDisclosure();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, opens, subType, accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;
    const router = useRouter();
    const toast = useToast();

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Name',
        'Job Title',
        'Client Name',
        'Employement Type',
        'Role',
        'Status',
        '',
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
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
                <Flex justify="space-between" my="1rem">
                    {(userAccess?.adminOBoarding || isSuperAdmin) && (
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            +Team Member
                        </Button>
                    )}
                    <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpens}
                        borderRadius="25px"
                    >
                        Download <Icon as={BsDownload} ml=".5rem" />
                    </Button>
                </Flex>
                <FilterSearch searchOptions="Search by: Full Name, Job Title, Role, Payroll Type or Status" />
                <Tables tableHead={thead}>
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData
                                    name={x.employeeInformation?.jobTitle}
                                />

                                <TableData name={x.clientName} />

                                {/* <TableData name={x.phoneNumber} /> */}
                                <TableData
                                    name={
                                        x.employeeInformation
                                            ?.employmentContractType
                                    }
                                />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="team-members"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} loadMore />
            </Box>
            {isOpen && (
                <NewTeamMemerOnboardingForm
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
                />
            )}
            {open && (
                <ExportReportModal
                    isOpen={open}
                    onClose={close}
                    data={thead}
                    record={2}
                    fileName={'Team members'}
                    model="users"
                />
            )}
        </>
    );
}

export default TeamManagement;
