import React, { useState } from 'react';
import { CheckCircleOutlined, BankOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import Avatar from "@/components/RightContent/AvatarDropdown";
import { Link } from 'react-router-dom';
import {SelectLang} from "@@/plugin-locale/SelectLang";

// 假设currentUser为你当前登录的用户信息
const currentUser = {
  name: '',
  avatar: '头像链接'
};

const menuHeaderDropdown = (
  <Menu>
    {/*<Menu.Item key="logout">*/}
    {/*  退出登录*/}
    {/*</Menu.Item>*/}
    {/*<SelectLang />*/}
  </Menu>
);

const items = [

  {
    label: <Link to="/welcome">首页</Link>,
    key: 'welcome',
    icon: <EditOutlined />,
  },

  {
    label: '结果',
    key: 'SubMenu',
    icon: <CheckCircleOutlined />,
    children: [
      {
        type: 'group',
        children: [
          {
            label: <Link to="/emptypage">分析结果</Link>,
            key: 'res',
            disabled: true,
          },
          {
            label: <Link to="/history">历史结果</Link>,
            key: 'his',
          },
          {
            label: <Link to="/admin/sub-page">商家管理</Link>,
            key: 'customer',
          },
          {
            label: <Link to="/friend">好友列表</Link>,
            key: 'friend',
          },
        ],
      },
    ],
  },
  {
    // label: (<a href="https://lushair.cn" target="_blank" rel="noopener noreferrer">主页</a>),
    label: (<a href="https://lushair.net" target="_blank" rel="noopener noreferrer">主页</a>),
    key: 'alipay',
    icon: <BankOutlined />,
  },
  {
    label: (
      <Dropdown overlay={menuHeaderDropdown}>
        <span>
          <Avatar size="small" src={currentUser.avatar} alt="avatar" />
          <span>{currentUser.name}</span>
        </span>
      </Dropdown>
    ),
    key: 'userDropdown',
    icon: <TeamOutlined />,
  },
];

const Navbar: React.FC = () => {
  const [current, setCurrent] = useState('mail');

  const onClick = (e: { key: React.SetStateAction<string>; }) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{
          marginTop: '-24px',
          marginLeft: '-24px',
          marginRight: '-24px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      />

    </div>
  )
};

export default Navbar;
