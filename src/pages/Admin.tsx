import React, { useState, useEffect } from 'react';
import {currentUser, getCustomer} from '@/services/ant-design-pro/api';
import Navbar from "@/pages/Navbar";
import {Card} from "antd";
import {BarChartOutlined} from "@ant-design/icons";
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import {FormattedMessage} from "umi"; // 如果使用 React Router


const Admin: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [customers, setCustomers] = useState<any[]>([]);
  const history = useHistory();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser1 = await currentUser();
        if (currentUser1?.userId) {
          setUserId(currentUser1.userId);
          const customerResponse = await getCustomer({ userId: currentUser1.userId }); // 使用userId来获取客户数据
          if (customerResponse.success && customerResponse.data.list) {
            setCustomers(customerResponse.data.list);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  return (

    <div>
      {/*<Navbar />*/}
      {/*<br />*/}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3em', zIndex: 1 }}><BarChartOutlined /><FormattedMessage id="t11" /></h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            // 如果使用 React Router
            history.push('/admin/sub-page/formbasicform');
            // 如果不使用 React Router
            // window.location.href = '/admin/sub-page/formbasicform';
          }}
        >
          <FormattedMessage id="add_product" />
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            // 如果使用 React Router
            history.push('/admin/sub-page/listtablelist');
            // 如果不使用 React Router
            // window.location.href = '/admin/sub-page/formbasicform';
          }}
        >
          <FormattedMessage id="View product" />
        </Button>
      </div>

      {customers.map(customer => (
        <Card key={customer.name} style={{ margin: '15px 0', borderRadius: '8px', }}>
          <Card.Meta
            avatar={<img src={customer.avatar} alt={customer.name} style={{ width: 50, height: 50 }} />}
            title={customer.name}
            description={`Time: ${customer.time ? customer.time : 'N/A'}`}
          />
        </Card>
      ))}
    </div>

  );
};

export default Admin;
