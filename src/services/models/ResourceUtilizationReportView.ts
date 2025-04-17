/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ResourceAllocationView } from './ResourceAllocationView';
import type { ResourceUtilizationChart } from './ResourceUtilizationChart';
import type { TopResourceReport } from './TopResourceReport';
import type { UtilizationRateVsPeriod } from './UtilizationRateVsPeriod';

export type ResourceUtilizationReportView = {
    resourceUtilizationChartData?: ResourceUtilizationChart;
    resourceAllocationData?: Array<ResourceAllocationView> | null;
    topResourceData?: Array<TopResourceReport> | null;
    utilizationRateVsPeriod?: Array<UtilizationRateVsPeriod> | null;
};
