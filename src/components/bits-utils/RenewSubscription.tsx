// import {
//     Modal,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     Flex,
//     ModalBody,
//     Box,
//     Text,
//     HStack,
//     Grid,
//     Button,
//     useDisclosure,
// } from '@chakra-ui/react';
// import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
// import { IRenewSubProps, ISinglePackage } from '@components/generics/Schema';
// import React, { useState } from 'react';
// import { DateObject } from 'react-multi-date-picker';
// import { useForm } from 'react-hook-form';
// import BeatLoader from 'react-spinners/BeatLoader';
// import { AddOnsView, RenewSubscriptionModel } from 'src/services';
// import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
// import { SubscriptionInfo } from '@components/bits-utils/SubscriptionInfo';
// import { PaymentDetails } from './PaymentDetails';
// import { CAD } from '@components/generics/functions/Naira';

// export const RenewSubscription = ({
//     isOpen,
//     onClose,
//     data,
// }: IRenewSubProps) => {
//     const { isOpen: open, onOpen: opens, onClose: close } = useDisclosure();
//     const [payData, setPayData] = useState<any>();
//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: { errors },
//     } = useForm<RenewSubscriptionModel>({
//         mode: 'all',
//     });

//     const openPaymentInfo = (x, date, duration) => {
//         setPayData({ sub: x, startDate: date, duration: duration });
//         opens();
//         onClose();
//     };

//     const onSubmit = async (value: RenewSubscriptionModel) => {
//         openPaymentInfo(data, value.startDate, value.duration);
//         //
//     };
//     return (
//         <>
//             <Modal
//                 isOpen={isOpen}
//                 onClose={onClose}
//                 motionPreset="slideInBottom"
//                 isCentered
//                 trapFocus={false}
//             >
//                 <ModalOverlay
//                     bg="blackAlpha.300"
//                     backdropFilter="blur(10px) "
//                 />

//                 <ModalContent
//                     py={5}
//                     borderRadius="0px"
//                     w={['88%', '60%']}
//                     // overflow="hidden"
//                     maxH="100vh"
//                     pos="fixed"
//                     mt="1rem"
//                     mb="1rem"
//                     maxW="100%"
//                 >
//                     <ModalHeader textAlign="center">
//                         <Flex justify="center">
//                             <Text
//                                 color="black"
//                                 fontSize="20px"
//                                 textAlign="center"
//                                 fontWeight="bold"
//                             >
//                                 Renew Subscription
//                             </Text>
//                             {/* <Icon as={GrClose} onClick={onClose} cursor="pointer" /> */}
//                         </Flex>
//                     </ModalHeader>

//                     <ModalBody>
//                         <Box minH="65vh" overflowY="auto" w="80%" mx="auto">
//                             <SubscriptionInfo
//                                 label="Subscription"
//                                 packages={[
//                                     {
//                                         type: data?.subscription?.name,
//                                         price: CAD(
//                                             data?.annualBilling
//                                                 ? data?.subscription
//                                                       ?.yearlyAmount
//                                                 : data?.subscription
//                                                       ?.monthlyAmount,
//                                         ),
//                                     },
//                                 ]}
//                             />
//                             <SubscriptionInfo
//                                 label="Addons"
//                                 packages={
//                                     data?.addOns?.map((x: AddOnsView) => ({
//                                         type: x.addOnSubscription?.name,
//                                         price: x.addOnTotalAmount,
//                                     })) as ISinglePackage[]
//                                 }
//                             />
//                             <form>
//                                 <Grid
//                                     templateColumns={['repeat(2, 1fr)']}
//                                     w="70%"
//                                     gap="3rem 1rem"
//                                     mt="3rem"
//                                 >
//                                     <PrimaryDate<RenewSubscriptionModel>
//                                         control={control}
//                                         name="startDate"
//                                         label={'Start Date'}
//                                         error={errors.startDate}
//                                         min={new DateObject().add(3, 'days')}
//                                         disableWeekend
//                                     />
//                                     <PrimaryInput<RenewSubscriptionModel>
//                                         label="Duration"
//                                         name="duration"
//                                         error={errors.duration}
//                                         placeholder=""
//                                         defaultValue=""
//                                         register={register}
//                                     />
//                                     <Button
//                                         w="full"
//                                         bgColor="#DA586F"
//                                         color="white"
//                                         border="5px"
//                                         fontSize="14px"
//                                         borderRadius="5px"
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button
//                                         w="full"
//                                         bgColor="brand.400"
//                                         color="white"
//                                         border="5px"
//                                         fontSize="14px"
//                                         // type='submit'
//                                         borderRadius="5px"
//                                         // isDisabled={!isValid}
//                                         onClick={handleSubmit(onSubmit)}
//                                     >
//                                         Subscribe
//                                     </Button>
//                                 </Grid>
//                             </form>
//                         </Box>
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//             <PaymentDetails isOpen={open} onClose={close} data={payData} />
//         </>
//     );
// };

import React from 'react';

export const RenewSubscription = () => {
    return <div>RenewSubscription</div>;
};
