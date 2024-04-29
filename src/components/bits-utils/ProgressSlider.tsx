import {
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Box,
    FormLabel,
    HStack,
    Text,
} from '@chakra-ui/react';
import React from 'react';

export const ProgressSlider = ({
    label,
    sliderValue,
    setSliderValue,
    readonly,
    leftText,
    rightText,
    showProgress,
    barColor,
}: {
    label?: string;
    sliderValue: any;
    setSliderValue: any;
    readonly?: boolean;
    rightText?: any;
    leftText?: any;
    showProgress?: any;
    barColor?: any;
}) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    return (
        <Box w="full">
            {showProgress ? (
                <HStack w="full" justify="space-between" mb="0">
                    <Text
                        fontSize=".65rem"
                        color="#8c8c8c"
                        fontWeight={500}
                        mb="0"
                    >
                        {leftText}
                    </Text>
                    <Text
                        fontSize=".65rem"
                        color="#8c8c8c"
                        fontWeight={500}
                        mb="0"
                    >
                        {rightText}
                    </Text>
                </HStack>
            ) : (
                <FormLabel
                    htmlFor={label}
                    textTransform="capitalize"
                    fontSize={'.8rem'}
                >
                    {label}
                </FormLabel>
            )}

            <Box w="98%" ml="auto" mb="2rem">
                <Slider
                    id="slider"
                    defaultValue={sliderValue}
                    value={sliderValue}
                    min={0}
                    max={100}
                    colorScheme={barColor || 'teal'}
                    onChange={(v) => setSliderValue(v)}
                    // onChangeEnd={(val) => setSliderValue(val)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    isReadOnly={readonly}
                >
                    {!showProgress && (
                        <>
                            <SliderMark
                                value={0}
                                mt="-5"
                                fontSize=".6rem"
                                color="#c4c4c4"
                            >
                                0%
                            </SliderMark>
                            <SliderMark
                                value={50}
                                mt="-5"
                                fontSize=".6rem"
                                color="#c4c4c4"
                            >
                                50%
                            </SliderMark>
                            <SliderMark
                                value={100}
                                mt="-5"
                                right={0}
                                left={'unset !important'}
                                fontSize=".6rem"
                                color="#c4c4c4"
                            >
                                100%
                            </SliderMark>
                        </>
                    )}
                    <SliderTrack mt={showProgress ? '0' : '.5rem'}>
                        <SliderFilledTrack bg={barColor || 'brand.400'} />
                    </SliderTrack>
                    <Tooltip
                        hasArrow
                        bg={barColor || 'teal.500'}
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`${sliderValue}%`}
                    >
                        <SliderThumb
                            boxSize={6}
                            bgColor={barColor || 'brand.400'}
                            mt={showProgress ? '0' : '.5rem'}
                        />
                    </Tooltip>
                </Slider>
            </Box>
        </Box>
    );
};
