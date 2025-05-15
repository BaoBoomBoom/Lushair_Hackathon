import { useState, useEffect } from 'react';
import { Spin, Typography, Card, Divider } from 'antd';
import styles from './index.less';

const { Title, Paragraph } = Typography;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div>a</div>

    // <iframe src="./index.html" width="100%" height="800px" frameBorder="0" title="My HTML Page" />

  );
};
