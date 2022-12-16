import { filterPagingSearchOptions } from "@components/generics/filterPagingSearchOptions";
import { withPageAuth } from "@components/generics/withPageAuth";
import ExpenseType from "@components/subpages/ExpenseType";
import PayPartnerExpense from "@components/subpages/PayPartnerExpense";
import { GetServerSideProps } from "next";
import React from "react";
import { ExpenseTypeView, SettingsService, UserService } from "src/services";

interface expenseProps {
    expenses: ExpenseTypeView[];
    listExpenses: any;
    team: any;
}
function expensetype({ expenses, team, listExpenses }: expenseProps) {
    return (
        <PayPartnerExpense
            expenses={expenses}
            team={team}
            listExpenses={listExpenses}
        />
    );
}

export default expensetype;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const expense = await SettingsService.listExpenseTypes();
            const team = await UserService.listUsers("Team Member");
            const listExpenses = await SettingsService.listExpenseTypes();
            return {
                props: {
                    expenses: expense.data,
                    team: team.data,
                    listExpenses: listExpenses.data,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
