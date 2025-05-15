import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "primaryColor": "#9f9f9f",
  "layout": "top",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "pwa": false,
  "logo": "https://lushair-1309996521.cos.ap-shanghai.myqcloud.com/icons/icon.png",
  "headerHeight": 48,
  "splitMenus": false,
  "title" : "lushair",
};

export default Settings;
