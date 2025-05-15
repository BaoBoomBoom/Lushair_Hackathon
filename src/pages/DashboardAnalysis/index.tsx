import type { FC } from 'react';
import { useRequest } from 'umi';
import { Suspense, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import OfflineData from './components/OfflineData';
import { fakeChartData } from './service';
import type { AnalysisData } from './data.d';

type DashboardAnalysisProps = {
  dashboardAnalysis: AnalysisData;
  loading: boolean;
};

type SalesType = 'all' | 'online' | 'stores';

const DashboardAnalysis: FC<DashboardAnalysisProps> = () => {
  const [salesType] = useState<SalesType>('all');
  const [currentTabKey, setCurrentTabKey] = useState<string>('');
  const { loading, data } = useRequest(fakeChartData);
  if (salesType === 'all') {
  } else {
  }
  const handleTabChange = (key: string) => {
    setCurrentTabKey(key);
  };

  const activeKey = currentTabKey || (data?.offlineData[0] && data?.offlineData[0].name) || '';

  return (
    <div>
      <GridContent>
        <>
          <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={data?.offlineData || []}
              offlineChartData={data?.offlineChartData || []}
              handleTabChange={handleTabChange}
            />
          </Suspense>
        </>
      </GridContent>
    </div>
  );
};

export default DashboardAnalysis;
