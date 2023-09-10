import {
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Box,
    FormLabel,
} from '@chakra-ui/react';
import React from 'react';

export const ProgressSlider = ({ label, sliderValue, setSliderValue }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    return (
        <Box w="full">
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={'.8rem'}
            >
                {label}
            </FormLabel>
            <Box w="98%" ml="auto" mb="2rem">
                <Slider
                    id="slider"
                    defaultValue={0}
                    min={0}
                    max={100}
                    colorScheme="teal"
                    onChange={(v) => setSliderValue(v)}
                    // onChangeEnd={(val) => setSliderValue(val)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
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
                    <SliderTrack mt=".5rem">
                        <SliderFilledTrack bg="brand.400" />
                    </SliderTrack>

                    <Tooltip
                        hasArrow
                        bg="teal.500"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={`${sliderValue}%`}
                    >
                        <SliderThumb
                            boxSize={6}
                            bgColor="brand.400"
                            mt=".5rem"
                        />
                    </Tooltip>
                </Slider>
            </Box>
        </Box>
    );
};
