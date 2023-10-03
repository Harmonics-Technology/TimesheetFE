import { createContext, useEffect, useState } from 'react';
import { OnboardingFeeService } from 'src/services';

export const OnboardingFeeContext = createContext<any | null>(null);
export const OnboardingFeeProvider = ({ children }: { children: any }) => {
    const [fixedAmount, setFixedAmount] = useState<any>();
    const [percentageAmount, setPercentageAmount] = useState<any>();
    const [hstAmount, setHstAmount] = useState<any>();
    useEffect(() => {
        const getFixedAmount = async () => {
            try {
                const data = await OnboardingFeeService.getFixedAmount();
                if (data.status) {
                    setFixedAmount(data.data?.fee);
                }
            } catch (error: any) {
                //
            }
        };
        const getPercentageAmount = async () => {
            try {
                const data =
                    await OnboardingFeeService.listPercentageOnboardingFees();
                if (data.status) {
                    setPercentageAmount(data.data?.value);
                }
            } catch (error: any) {
                //
            }
        };
        const getHstAmount = async () => {
            try {
                const data = await OnboardingFeeService.getHst();
                if (data.status) {
                    setHstAmount(data.data);
                }
            } catch (error: any) {
                //
            }
        };

        const fetchData = async () => {
            await getFixedAmount();
            await getPercentageAmount();
            await getHstAmount();
        };
        fetchData();
    }, []);

    const contextValues = { fixedAmount, percentageAmount, hstAmount };
    return (
        <OnboardingFeeContext.Provider value={contextValues}>
            {children}
        </OnboardingFeeContext.Provider>
    );
};
