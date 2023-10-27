import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { AddShiftPreference } from '@components/bits-utils/AddShiftPrefrence';
import { EditShifts } from '@components/bits-utils/EditShifts';
import TitleText from '@components/bits-utils/TitleText';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import { UserContext } from '@components/context/UserContext';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import router from 'next/router';
import React, { useContext, useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import {
    ControlSettingModel,
    ControlSettingView,
    ShiftService,
    ShiftTypeView,
    UserService,
} from 'src/services';

export const ShiftManagementSettings = ({
    shifts,
    controls,
}: {
    shifts: any;
    controls: ControlSettingView;
}) => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState({ status: false, id: '' });
    const { user } = useContext(UserContext);
    const [shiftTypes, setShiftTypes] = useState(shifts);
    const toast = useToast();
    const [access, setAccess] = useState<ControlSettingModel>({
        allowShiftSwapApproval: controls?.allowShiftSwapApproval,
        allowShiftSwapRequest: controls?.allowShiftSwapRequest,
        superAdminId: user?.superAdminId,
    });
    const [showEdit, setShowEdit] = useState({
        id: '',
        value: false,
        data: {},
    });

    const getTime = (time) => {
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }

        return time.join(''); // return adjusted time or original stri
    };

    const deleteShiftType = async (id: string) => {
        setLoading({ status: true, id });
        try {
            const result = await ShiftService.deleteShiftType(id);
            if (result.status) {
                setLoading({ status: false, id: '' });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setShiftTypes(shiftTypes?.data?.filter((x) => x.id !== id));
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ status: false, id: '' });
        } catch (error: any) {
            setLoading({ status: false, id: '' });

            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const updateControl = async (data: ControlSettingModel) => {
        setLoading({ status: true, id: 'access' });
        data.superAdminId = user?.superAdminId;
        try {
            const result = await UserService.updateControlSettings(data);
            if (result.status) {
                setLoading({ status: true, id: '' });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ status: true, id: '' });
        } catch (error: any) {
            setLoading({ status: true, id: '' });

            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useNonInitialEffect(() => {
        updateControl(access);
    }, [access]);

    return (
        <Box>
            <Flex
                justify="space-between"
                pb="1rem"
                borderBottom="1px solid #C2CFE0"
                align="center"
            >
                <Text fontSize=".875rem" color="#2d3748" mb="0">
                    Shift Management Preference (Default)
                </Text>
                <Button
                    h="2rem"
                    w="7.5rem"
                    borderRadius="5px"
                    color="white"
                    fontSize="0.8rem"
                    fontWeight="500"
                    bgColor="brand.400"
                    onClick={onOpen}
                >
                    Add new shift
                </Button>
            </Flex>
            {shifts?.data?.map((x: ShiftTypeView) => (
                <Box
                    w="full"
                    py="1.5rem"
                    borderBottom="1px solid #C2CFE0"
                    key={x.id}
                >
                    {showEdit.id == x.id && showEdit.value ? (
                        <VStack spacing="2rem" align="flex-start">
                            <EditShifts
                                setShowEdit={setShowEdit}
                                showEdit={showEdit}
                            />
                        </VStack>
                    ) : (
                        <Flex justify="space-between" w="95%">
                            <VStack spacing="2rem" align="flex-start">
                                <HStack spacing="7rem">
                                    <TitleText
                                        title="Shift Name"
                                        text={x.name}
                                    />
                                    <TitleText
                                        title="Duration"
                                        text={`${x.duration} hours`}
                                    />
                                </HStack>
                                <HStack spacing="7rem">
                                    <TitleText
                                        title="Color code"
                                        text={x.color}
                                        color
                                    />
                                    <HStack spacing="3rem">
                                        <TitleText
                                            title="Start Time"
                                            text={getTime(`${x.start}`)}
                                        />
                                        <TitleText
                                            title="End Time"
                                            text={getTime(`${x.end}`)}
                                        />
                                    </HStack>
                                </HStack>
                            </VStack>
                            <VStack align="flex-start" spacing="2.2rem">
                                <Button
                                    variant="outline"
                                    color="brand.400"
                                    borderColor="brand.400"
                                    borderRadius="10px"
                                    h="2rem"
                                    px="1.5rem"
                                    onClick={() =>
                                        setShowEdit({
                                            id: x.id as string,
                                            value: true,
                                            data: x,
                                        })
                                    }
                                >
                                    <Icon as={BsFillPencilFill} mr=".5rem" />{' '}
                                    Edit
                                </Button>
                                <ToggleSwitch
                                    label="shift"
                                    onChange={() =>
                                        deleteShiftType(x.id as string)
                                    }
                                    checked={true}
                                    loading={
                                        loading.status && loading.id == x.id
                                    }
                                />
                            </VStack>
                        </Flex>
                    )}
                </Box>
            ))}
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Shift Swap Request"
                        text="Give staff members of  the same company ability to request for shift swap"
                    />
                    <ToggleSwitch
                        label="swap"
                        onChange={() =>
                            setAccess({
                                ...access,
                                allowShiftSwapRequest:
                                    !access.allowShiftSwapRequest,
                            })
                        }
                        checked={access?.allowShiftSwapRequest}
                        loading={loading.status && loading.id == 'access'}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Shift Swap Approval"
                        text="Give admin and supervisor ability to approve or decline shift swap request"
                    />
                    <ToggleSwitch
                        label="swapapproval"
                        onChange={() =>
                            setAccess({
                                ...access,
                                allowShiftSwapApproval:
                                    !access.allowShiftSwapApproval,
                            })
                        }
                        checked={access?.allowShiftSwapApproval}
                        loading={loading.status && loading.id == 'access'}
                    />
                </Flex>
            </Box>

            {isOpen && <AddShiftPreference isOpen={isOpen} onClose={onClose} />}
        </Box>
    );
};
