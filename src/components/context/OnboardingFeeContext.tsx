import { createContext, useContext, useEffect, useState } from 'react';
import { OnboardingFeeService, UserService } from 'src/services';
import { UserContext } from './UserContext';

export const OnboardingFeeContext = createContext<any | null>(null);
export const OnboardingFeeProvider = ({ children }: { children: any }) => {
    const [fixedAmount, setFixedAmount] = useState<any>();
    const [percentageAmount, setPercentageAmount] = useState<any>();
    const [hstAmount, setHstAmount] = useState<any>();
    const [controls, setControls] = useState<unknown>({});
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;

    const getControls = async () => {
        try {
            const data = await UserService.getControlSettingById(superAdminId);
            if (data.status) {
                //
                setControls(data.data);
                // toast({
                //     position: 'top-right',
                //     status: 'success',
                //     title: 'Notification up to date',
                // });
            }
        } catch (error: any) {
            console.log({ error });
        }
    };
    useEffect(() => {
        // const getFixedAmount = async () => {
        //     try {
        //         const data = await OnboardingFeeService.listFixedAmountFee(
        //             superAdminId,
        //         );
        //         if (data.status) {
        //             setFixedAmount(data.data);
        //         }
        //     } catch (error: any) {
        //         //
        //     }
        // };
        // const getPercentageAmount = async () => {
        //     try {
        //         const data =
        //             await OnboardingFeeService.listPercentageOnboardingFees(
        //                 0,
        //                 17,
        //                 superAdminId,
        //             );
        //         if (data.status) {
        //             setPercentageAmount(data.data?.value);
        //         }
        //     } catch (error: any) {
        //         //
        //     }
        // };
        const getHstAmount = async () => {
            try {
                const data = await OnboardingFeeService.getHst(superAdminId);
                if (data.status) {
                    setHstAmount(data.data);
                }
            } catch (error: any) {
                //
            }
        };

        const fetchData = async () => {
            // await getFixedAmount();
            // await getPercentageAmount();
            await getHstAmount();
            await getControls();
        };
        fetchData();
    }, []);

    const contextValues = {
        // fixedAmount,
        // percentageAmount,
        hstAmount,
        controls,
    };
    return (
        <OnboardingFeeContext.Provider value={contextValues}>
            {children}
        </OnboardingFeeContext.Provider>
    );
};
