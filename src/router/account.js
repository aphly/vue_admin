export let adminAccountRouter = [
    {
      key:'account_center',
      name:'account_center',
      label:"账号中心",
      path:'',
      menuType:1,
      children:[
        {
          key:'account_index',
          path: '/admin/account/index',
          name: 'account_index',
          label:"个人资料",
          menuType:2,
        },
      ]
    },
    {
      key:'account_notice_index',
      path: '/admin/account/notice/index',
      name: 'account_notice_index',
      label:"消息中心",
      menuType:2,
    }
]