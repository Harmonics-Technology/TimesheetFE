import { HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import Checkbox from './Checkbox';

const PayscheduleBottomNote = () => {
    const PayScheduleBox = ({ name, item, checked }) => {
        return (
            <HStack gap="0" align="flex-start">
                <Checkbox checked={checked} dir="rtl" />
                <Text fontSize="12px" color="#696969">
                    <strong>{name}</strong> {item}
                </Text>
            </HStack>
        );
    };
    return (
        <VStack gap="24px">
            <PayScheduleBox
                name="Fixed Pay Day"
                item={`allows you to set a fixed, unchanging payment day of the week. For example, if you choose "Wednesday," your payment will occur every Wednesday, providing a consistent and reliable schedule.`}
                checked={true}
            />
            <PayScheduleBox
                name="Flexible"
                item={`means your payment day varies based on your ending period and selected days offset. For example, with an ending period of the 30th and a 4-day offset, your payment day can range from the 2nd to the 4th, providing versatile monthly adjustments.`}
                checked={false}
            />
        </VStack>
    );
};

export default PayscheduleBottomNote;
