import { BulbOutlined  } from '@ant-design/icons';
import { Space, Switch  } from 'antd';
import React, {useEffect, useState} from 'react';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import 'antd/dist/antd.variable.min.css';
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from 'darkreader';


const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [isDarkTheme, setIsDarkTheme] = useState(true); // 初始状态可以根据需要设置

  // 通过 useEffect 钩子默认开启暗黑模式
  useEffect(() => {
    setTimeout(() => {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10
      });
    }, 200); // 1秒后启用
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    // 使用 darkreader 切换主题
    if (newTheme) {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      disableDarkMode();
    }
  };


  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      {/*<span*/}
      {/*  className={styles.action}*/}
      {/*  onClick={() => {*/}
      {/*    window.open('https://mp.weixin.qq.com/s/rnt0R5yTWn-pIimcf5-wiA');*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <QuestionCircleOutlined />*/}
      {/*</span>*/}
      <Switch
        checked={isDarkTheme}
        onChange={toggleTheme}
        checkedChildren={<BulbOutlined />}
        unCheckedChildren={<BulbOutlined />}
      />
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
