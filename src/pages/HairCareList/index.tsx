import React, { useState, useEffect } from 'react';
import {Avatar, Card, Col, Row, Typography} from 'antd';
import {currentUser, getDetectionRecordList, getTotal} from '@/services/ant-design-pro/api';
const { Title, Text } = Typography;
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import Navbar from "@/pages/Navbar";
import {FormattedMessage} from "umi";
import {useLocation} from "react-router";

interface ResponseItem {
  hair: number;
  level: string;
  scalp: number;
  follicle: number;
  name: string;
  avatar: string;
  scalpScore: number;
  age: number;
  recordId: number
}

export default () => {
  const [records, setRecords] = useState<ResponseItem[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [total, setTotal] = useState<any>();

  const history = useHistory(); // 获取跳转方法
  const location = useLocation();


  const handleViewDetails = async (userId, recordId) => {
    const msg = await getTotal({ userId, recordId });
    if (msg.success) {
      // 对成功获取到的数据进行处理，比如显示在一个模态窗口或其他 UI 组件中
      history.push({
        pathname: "/res",
        state: {
          data: msg.data,
        },
      });
      console.log("成功获取到的数据：", msg.data);
    } else {
      // 处理失败的情况，例如显示一个错误消息
      console.error("Failed to get record:", msg.error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    let userId = location.state?.data;
    // if (!data) return; // 如果data为null或undefined，则退出
    if (userId == null) {
      history.push('/friend')
      return;
    }

    const fetchData = async () => {
      // 替换为实际请求代码
      // @ts-ignore
      const msg = await getDetectionRecordList({ userId });
      if (msg.success) {
        setRecords(Object.values(msg.data.list));
      }
    };
    fetchData()

  }, [userId]);

  const cardColors = ['#f7f2e8', '#e8f4f2', '#e8e4f2', '#f2e8e9'];
  return (
    <div style={{ background: '#f0f2f5', width: 'auto' }}>
      {records.slice().reverse().map((record, index) => (
        <Card
          key={index}
          style={{
            borderRadius: '8px',
            marginBottom: '20px',
            background: cardColors[index % cardColors.length],
            border: '1px solid #e8e8e8',
            // padding: '15px',
            width: '100%',
          }}
          extra={<Button onClick={() => handleViewDetails(record.userId, record.recordId)}><FormattedMessage id="View full data" /></Button>}
        >
          <Row gutter={16} align="middle">
            <Col xs={8} sm={4}>
              <Avatar src={record.avatar} size={64} />
            </Col>
            <Col xs={16} sm={12}>
              <Title level={5} style={{ margin: 0, fontSize: '14px' }}>{record.name}</Title>
              <Text><FormattedMessage id="age"/> {record.age}</Text>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={3} style={{ color: '#007bff', fontSize: '16px' , marginTop: '10px'}}>{record.level}</Title>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" style={{ marginTop: '15px' }}>
            <Col style={{ textAlign: 'center' }}><strong>{Math.floor(record.scalp)}<FormattedMessage id="fen" /></strong><br /><FormattedMessage id="score_scalp" /></Col>
            <Col style={{ textAlign: 'center' }}><strong>{Math.floor(record.follicle)}<FormattedMessage id="fen" /></strong><br /><FormattedMessage id="score_follicle" /></Col>
            <Col style={{ textAlign: 'center' }}><strong>{Math.floor(record.hair)}<FormattedMessage id="fen" /></strong><br /><FormattedMessage id="score_hair" /></Col>
            <Col style={{ textAlign: 'center' }}><strong>{Math.floor(record.scalpScore)}<FormattedMessage id="fen" /></strong><br /><FormattedMessage id="score_scalpScore" /></Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};
