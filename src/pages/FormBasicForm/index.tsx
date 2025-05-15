import {Button, Card, message, Upload} from 'antd';
import ProForm, {
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-form';
import {FormattedMessage, useRequest} from 'umi';
import type { FC } from 'react';
import { fakeSubmitForm } from './service';
import {PlusOutlined} from "@ant-design/icons";
import Navbar from "@/pages/Navbar";
import { useHistory } from 'react-router-dom';
import {useEffect, useState} from "react";
import {currentUser} from "@/services/ant-design-pro/api"; // 如果使用 React Router
import { UploadOutlined } from '@ant-design/icons';
import {useIntl} from "@@/plugin-locale/localeExports";


const AddProductForm: FC<Record<string, any>> = () => {
  const history = useHistory();
  const [userId, setUserId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>("");
  const intl = useIntl();

  const uploadProps = {
    name: 'file',
    action: '/api/file/uploadImg',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        // 保存返回的图片URL
        setImageUrl(info.file.response.data); // 请根据您的API返回值进行相应的修改
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
  }, [userId]);

  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      window.location.reload();
    },
  });

  const onFinish = async (values: Record<string, any>) => {
    values.image = imageUrl;  // 这里添加图片URL
    values.merchantId = userId;
    run(values);
  };

  return (
    <div>

      <Card style={{borderRadius: '8px'}}>
        <Button
          type="primary"
          onClick={() => {
            // 如果使用 React Router
            history.push('/admin/sub-page/listtablelist');
            // 如果不使用 React Router
            // window.location.href = '/admin/sub-page/formbasicform';
          }}
        >
          <FormattedMessage id="View product" />
        </Button>

        <Card bordered={false}>
          <ProForm
            hideRequiredMark
            style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
            name="add_product"
            layout="vertical"
            onFinish={onFinish}
          >
            <ProFormText
              label={intl.formatMessage({ id: 'product_title' })}
              name="title"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_enter_product_title' }) }]}
            />

            <ProForm.Item
              name="image"
              label={intl.formatMessage({ id: 'image_upload' })}
              valuePropName="fileList"
              getValueFromEvent={e => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_upload_image' }) }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>{intl.formatMessage({ id: 'click_to_upload' })}</Button>
              </Upload>
            </ProForm.Item>

            <ProFormDigit
              label={intl.formatMessage({ id: 'price' })}
              name="price"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_enter_price' }) }]}
            />

            <ProFormSelect
              label={intl.formatMessage({ id: 'price_level' })}
              name="recommend_index"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_select_price_level' }) }]}
              options={[
                { value: 2, label: intl.formatMessage({ id: 'high' }) },
                { value: 1, label: intl.formatMessage({ id: 'medium' }) },
                { value: 0, label: intl.formatMessage({ id: 'low' }) },
              ]}
            />

            <ProFormTextArea
              label={intl.formatMessage({ id: 'short_description' })}
              name="introduction"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_enter_short_description' }) }]}
            />

            <ProFormTextArea
              label={intl.formatMessage({ id: 'detailed_description' })}
              name="descriptions"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_enter_detailed_description' }) }]}
            />

            <ProFormSelect
              label={intl.formatMessage({ id: 'product_type' })}
              name="type"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_select_product_type' }) }]}
              options={[
                { value: 'hairPath', label: intl.formatMessage({ id: 'hairPath' }) },
                { value: 'hairTexture', label: intl.formatMessage({ id: 'hairTexture' }) },
                { value: 'keratinocytes', label: intl.formatMessage({ id: 'keratinocytes' }) },
                { value: 'oil', label: intl.formatMessage({ id: 'oil' }) },
                { value: 'redness', label: intl.formatMessage({ id: 'redness' }) },
                { value: 'scurf', label: intl.formatMessage({ id: 'scurf' }) },
                { value: 'white', label: intl.formatMessage({ id: 'white' }) },
              ]}
            />

            <ProFormSelect
              label={intl.formatMessage({ id: 'product_status' })}
              name="status"
              rules={[{ required: true, message: intl.formatMessage({ id: 'please_select_product_status' }) }]}
              options={[
                { value: 1, label: intl.formatMessage({ id: 'onShelf' }) },
                { value: 0, label: intl.formatMessage({ id: 'offShelf' }) }
              ]}
            />

            <ProFormText
              label={intl.formatMessage({ id: 'merchant_id' })}
              name="merchantId"
              initialValue={userId}
              rules={[{ message: intl.formatMessage({ id: 'please_enter_merchant_id' }) }]}
              disabled
            />

          </ProForm>
        </Card>
      </Card>

    </div>
  );
};

export default AddProductForm;
