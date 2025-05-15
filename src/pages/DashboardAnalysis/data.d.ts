import { DataItem } from '@antv/g2plot/esm/interface/config';

export { DataItem };

export type OfflineDataType = {
  name: string;
  cvr: number;
};

export interface AnalysisData {
  offlineData: OfflineDataType[];
  offlineChartData: DataItem[];
}
