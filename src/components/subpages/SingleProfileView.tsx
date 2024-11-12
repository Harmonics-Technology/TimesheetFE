import {
    Box,
    Flex,
    HStack,
    Circle,
    Image,
    Text,
    Grid,
    Button,
} from '@chakra-ui/react';
import InputBlank from '@components/bits-utils/InputBlank';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { TbArrowBackUp } from 'react-icons/tb';
import { UserView } from 'src/services';

export const SingleProfileView = ({ user }: { user: UserView }) => {
    const router = useRouter();
    return (
        <Box>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex
                    justify="space-between"
                    align={['unset', 'center']}
                    flexDirection={['column', 'row']}
                >
                    <HStack gap="1rem" align="center" mb={['1rem', '0']}>
                        <Circle
                            size="4rem"
                            fontSize="2rem"
                            color="white"
                            // overflow="hidden"
                            pos="relative"
                            bgColor="brand.600"
                            role="group"
                            _hover={{
                                bgColor: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            {user?.profilePicture ? (
                                <Image
                                    src={user?.profilePicture}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    borderRadius="50%"
                                    _groupHover={{
                                        opacity: '0.3',
                                    }}
                                />
                            ) : (
                                <FaUser />
                            )}
                        </Circle>
                        <Box>
                            <Text
                                fontSize="1.2rem"
                                color="brand.300"
                                mb="0"
                                fontWeight="bold"
                            >
                                {user?.fullName}
                            </Text>
                            <Text
                                fontSize=".8rem"
                                color="brand.300"
                                textTransform="capitalize"
                            >
                                {user?.role}
                            </Text>
                        </Box>
                    </HStack>
                </Flex>
            </Box>
            <Grid
                templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                gap="1rem 1rem"
                my="1.5rem"
            >
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Text
                        fontWeight="600"
                        fontSize="1.1rem"
                        mb="2rem"
                        textTransform="capitalize"
                        color="brand.200"
                    >
                        Personal Information
                    </Text>
                    <Grid gap=".5rem">
                        <InputBlank
                            label="First Name"
                            placeholder=""
                            defaultValue={user?.firstName as string}
                            readonly={true}
                        />
                        <InputBlank
                            label="Last Name"
                            placeholder=""
                            defaultValue={user?.lastName as string}
                            readonly={true}
                        />
                        <InputBlank
                            label="Date of Birth"
                            placeholder=""
                            defaultValue={
                                moment(user?.dateOfBirth).format(
                                    'MMMM DD',
                                ) as string
                            }
                            readonly={true}
                        />
                    </Grid>
                </Box>
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Text
                        fontWeight="600"
                        fontSize="1.1rem"
                        mb="2rem"
                        textTransform="capitalize"
                        color="brand.200"
                    >
                        Contact Information
                    </Text>
                    <Grid gap=".5rem">
                        <InputBlank
                            label="Email"
                            placeholder=""
                            defaultValue={user?.email as string}
                            readonly={true}
                        />
                        <InputBlank
                            label="Address"
                            placeholder=""
                            defaultValue={user?.address as string}
                            readonly={true}
                        />
                        <InputBlank
                            label="Phone number"
                            placeholder=""
                            defaultValue={user?.phoneNumber as string}
                            readonly={true}
                        />
                    </Grid>
                </Box>
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Text
                        fontWeight="600"
                        fontSize="1.1rem"
                        mb="2rem"
                        textTransform="capitalize"
                        color="brand.200"
                    >
                        Job Information
                    </Text>
                    <Grid gap=".5rem">
                        <InputBlank
                            label="Company Name"
                            placeholder=""
                            defaultValue={
                                user?.clientName ||
                                (user?.organizationName as any)
                            }
                            readonly={true}
                        />
                        <InputBlank
                            label="Job Title"
                            placeholder=""
                            defaultValue={
                                user?.employeeInformation?.jobTitle as string
                            }
                            readonly={true}
                        />
                        <InputBlank
                            label="Supervisor"
                            placeholder=""
                            defaultValue={
                                user?.employeeInformation?.supervisor
                                    ?.fullName as string
                            }
                            readonly={true}
                        />
                    </Grid>
                </Box>
            </Grid>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.2rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                display="flex"
                justifyContent="center"
            >
                <Button
                    bgColor="brand.400"
                    color="white"
                    height="3.5rem"
                    fontSize="15px"
                    onClick={() => router.back()}
                    w="98%"
                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                >
                    <Box pr=".5rem">
                        <TbArrowBackUp />
                    </Box>
                    <Box>Go Back</Box>
                </Button>
            </Box>
        </Box>
    );
};
