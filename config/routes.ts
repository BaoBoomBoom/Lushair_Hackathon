export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        name: 'addProduct',
        icon: 'smile',
        path: '/admin/sub-page/formbasicform',
        component: './FormBasicForm',
      },
      {
        name: 'productList',
        icon: 'smile',
        path: '/admin/sub-page/listtablelist',
        component: './ProductList'
      },

      {
        path: '/admin/sub-page',
        name: 'merchantManager',
        icon: 'smile',
        component: './Admin',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: 'his',
    icon: 'history',
    path: '/history',
    component: './EmptyPageTwo',
  },
  {
    name: 'res',
    icon: 'check-circle',
    path: '/res',
    component: './EmptyPage',
    hideInMenu: true,
  },
  {
    name: 'friend',
    icon: 'team',
    path: '/friend',
    component: './Friend',
  },
  {
    name: 'hairCareList',
    icon: 'check-circle',
    path: '/hairCareList',
    component: './HairCareList',
    hideInMenu: true,
  },
  {
    name: 'about',
    icon: 'home',
    // path: 'https://www.lushair.cn',
    path: 'https://www.lushair.net',
  },
  // {
  //   name: 'WorldID',
  //   icon: 'smile',
  //   path: '/WorldID',
  //   component: './WorldID',
  // },
  {
    component: './404',
  },
];
