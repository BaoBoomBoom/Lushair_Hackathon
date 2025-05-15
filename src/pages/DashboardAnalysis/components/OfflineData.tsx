import { Card, Col, Row, Tabs } from 'antd';
import { RingProgress, Line } from '@ant-design/charts';
import type { OfflineDataType, DataItem } from '../data.d';
import NumberInfo from './NumberInfo';
import styles from '../style.less';

const data1 = [
  { data: '1991', value: 0.03 },
  { data: '1992', value: 4 },
  { data: '1993', value: 3.5 },
  { data: '1994', value: 5 },
  { data: '1995', value: 4.9 },
  { data: '1996', value: 6 },
  { data: '1997', value: 7 },
  { data: '1998', value: 9 },
  { data: '1999', value: 13 },
];

const data2 = [
  { name: '1991', cvr: 0.03 },
  { name: '1992', cvr: 4 },
  { name: '1993', cvr: 3.5 },
  { name: '1994', cvr: 5 },
  { name: '1995', cvr: 4.9 },
  { name: '1996', cvr: 6 },
  { name: '1997', cvr: 7 },
  { name: '1998', cvr: 9 },
  { name: '1999', cvr: 13 },
];

const CustomTab = ({
  data,
  currentTabKey: currentKey,
}: {
  data: OfflineDataType;
  currentTabKey: string;
}) => (
  <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
    <Col span={12}>
      <NumberInfo
        title={data.name}
        gap={2}
        total={`${data.cvr * 100}%`}
        theme={currentKey !== data.name ? 'light' : undefined}
      />
    </Col>
    <Col span={12} style={{ paddingTop: 36 }}>
      <RingProgress
        autoFit
        height={60}
        innerRadius={0.7}
        width={60}
        percent={data.cvr}
        statistic={{
          title: false,
          content: false,
        }}
      />
    </Col>
  </Row>
);

const { TabPane } = Tabs;

const OfflineData = ({
  activeKey,
  loading,
  offlineData,
  offlineChartData,
  handleTabChange,
}: {
  activeKey: string;
  loading: boolean;
  offlineData: OfflineDataType[];
  offlineChartData: DataItem[];
  handleTabChange: (activeKey: string) => void;
}) => (
  <Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>
    <Tabs activeKey={activeKey} onChange={handleTabChange}>
      {data2.map((shop) => (
        <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey} />} key={shop.name}>
          <div style={{ padding: '0 24px' }}>
            <Line
              autoFit
              height={400}
              data={data1}
              xField="data"
              yField="value"
              seriesField="type"
              slider={{
                start: 0.1,
                end: 0.5,
              }}
              interactions={[
                {
                  type: 'slider',
                  cfg: {},
                },
              ]}
              legend={{
                position: 'top',
              }}
            />
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Card>
);

export default OfflineData;
