import {Button, Card, Table} from 'antd';
import type { FC } from 'react';
import React, {useState, useEffect} from "react";
import {currentUser, listProducts} from "@/services/ant-design-pro/api";
import {PlusOutlined} from "@ant-design/icons";
import { useHistory } from 'react-router-dom';
import {FormattedMessage, useIntl} from "umi"; // 如果使用 React Router

const ProductList: FC<Record<string, any>> = () => {
  const [userId, setUserId] = useState<string>('');
  const [data, setData] = useState<API.ListProductResponse>();
  const history = useHistory();
  const intl = useIntl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser1 = await currentUser();
        if (currentUser1?.userId) {
          setUserId(currentUser1.userId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // 注意这里的依赖数组为空

  useEffect(() => {
    if (userId) { // 只有当 userId 被设置之后才执行
      const getList = async () => {
        try {
          const data1 = await listProducts({userId});
          setData(data1.data);
          console.log(data1.data)
        } catch (error) {
          console.error(error)
        }
      };
      getList();
    }
  }, [userId]); // 这里的依赖数组只有 userId

  const columns = [
    {
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'image' }),
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <img src={image} alt="product" style={{ width: '50px', height: '50px' }} />
    },
    {
      title: intl.formatMessage({ id: 'price' }),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: intl.formatMessage({ id: 'recommendIndex' }),
      dataIndex: 'recommend_index',
      key: 'recommend_index',
      render: (recommend_index: number) => {
        switch (recommend_index) {
          case 0:
            return intl.formatMessage({ id: 'low' });
          case 1:
            return intl.formatMessage({ id: 'medium' });
          case 2:
            return intl.formatMessage({ id: 'high' });
          default:
            return intl.formatMessage({ id: 'unknown' });
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'introduction' }),
      dataIndex: 'introduction',
      key: 'introduction',
    },
    {
      title: intl.formatMessage({ id: 'description' }),
      dataIndex: 'descriptions',
      key: 'descriptions',
    },
    {
      title: intl.formatMessage({ id: 'type' }),
      dataIndex: 'type',
      key: 'type',
      render: (recommend_index: string) => {
        switch (recommend_index) {
          case "hairPath":
            return intl.formatMessage({ id: 'hairPath'})
          case "hairTexture":
            return intl.formatMessage({ id: 'hairTexture'})
          case "keratinocytes":
            return intl.formatMessage({ id: 'keratinocytes'})
          case "oil":
            return intl.formatMessage({ id: 'oil'})
          case "redness":
            return intl.formatMessage({ id: 'redness'})
          case "white":
            return intl.formatMessage({ id: 'white'})
          case "scurf":
            return intl.formatMessage({ id: 'scurf'})
          default:
            return intl.formatMessage({ id: 'unknown' });
        }
      }
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return status === 1 ? intl.formatMessage({ id: 'active' }) : intl.formatMessage({ id: 'inactive' });
      }
    }
  ];

  return (

    <div>

      <Card
        style={{
          borderRadius: '8px'
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            // 如果使用 React Router
            history.push('/admin/sub-page/formbasicform');
            // 如果不使用 React Router
            // window.location.href = '/admin/sub-page/formbasicform';
          }}
          style={{marginBottom: '25px'}}
        >
          <FormattedMessage id="add_product" />
        </Button>

        <Table dataSource={data} columns={columns} rowKey="id"/>
      </Card>

    </div>
  );
};

export default ProductList;
