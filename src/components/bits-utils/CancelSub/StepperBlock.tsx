import React from 'react';
import {
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    Box,
    HStack,
} from '@chakra-ui/react';

export const StepperBlock = ({ steps, activeStep, w }) => {
    return (
        <Stepper index={activeStep} colorScheme="brand" w={w}>
            {steps.map((step, index) => (
                <Step key={index} style={{ display: 'block' }}>
                    <HStack>
                        <StepIndicator
                            bgColor={
                                activeStep !== step.id ? '#c4c4c4' : 'brand.400'
                            }
                            color="white"
                        >
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>
                        <StepSeparator />
                    </HStack>
                    <Box mt="1rem">
                        <StepTitle
                            //@ts-ignore
                            color={
                                activeStep >= step.id ? '#192a3e' : '#c4c4c4'
                            }
                        >
                            {step.title}
                        </StepTitle>
                        {/* <StepDescription>{step.description}</StepDescription> */}
                    </Box>
                </Step>
            ))}
        </Stepper>
    );
};
