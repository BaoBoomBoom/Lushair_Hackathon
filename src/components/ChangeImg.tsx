import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AvatarUploader = () => {
  const customRequest = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'your-user-id');  // 添加你的 userId

    try {
      const response = await axios.post('/api/changeImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        onSuccess();
        message.success('头像上传成功！');
      }
    } catch (error) {
      onError(error);
      message.error('头像上传失败！');
    }
  };

  return (
    <Upload customRequest={customRequest} showUploadList={false}>
      <Button icon={<UploadOutlined />}>上传头像</Button>
    </Upload>
  );
};

export default AvatarUploader;
