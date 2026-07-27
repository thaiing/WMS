/* eslint-disable */
export const fieldComponents = [
  //  {
  //    type: 'input',
  //    label: '商品ID',
  //    icon: 'el-icon-yrt-danhangshurukuang',
  //    options: {
  //      prop: 'Product_Id',
  //      width: '100%',
  //      showTitle: true,
  //      defaultValue: '',
  //      required: false,
  //      dataType: 'string',
  //      pattern: '',
  //      placeholder: ''
  //    }
  //  },
];

export const basicComponents = [
  {
    title: "TMS模块",
    items: [
      {
        type: "WaybillStat",
        label: "运单数统计",
        img: "/static/layout/tms/tms-01.png"
      },
      {
        type: "WaybillreceiveStat",
        label: "揽收统计",
        img: "/static/layout/tms/tms-02.png"
      },
      {
        type: "WaybillMonthStat",
        label: "运单每月统计分析",
        img: "/static/layout/tms/tms-03.png"
      },
      {
        type: "WaybillEverydayStat",
        label: "每日运单统计图",
        img: "/static/layout/tms/tms-04.png"
      }
    ]
  },
  {
    title: "WMS模块",
    items: [
      {
        type: "WmsStat",
        label: "订单出入库数量统计",
        img: "/static/layout/tms/tms-01.png"
      },
      {
        type: "WmsRingStat",
        label: "剩余货位实时图",
        img: "/static/layout/tms/tms-02.png"
      },
      {
        type: "WmsMonthStat",
        label: "商品出库排名",
        img: "/static/layout/tms/tms-03.png"
      },
      {
        type: "WmsEverydayStat",
        label: "订单每日统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsStorageArea",
        label: "库容实时使用情况",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsStatWeight",
        label: "订单出入重量统计",
        img: "/static/layout/tms/tms-01.png"
      },
      {
        type: "WmsDailyInventoryBroken",
        label: "每日库存分类统计折线图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyInventoryBarchart",
        label: "每日库存分类统计柱状图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyInventoryTable",
        label: "每日库存分类统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyOutStorageBarchart",
        label: "每日出库分类柱状统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyOutStorageBroken",
        label: "每日出库分类统计折线图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyOutStorageTable",
        label: "每日出库分类统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyStorageBarchart",
        label: "每日入库分类柱状统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyStorageBroken",
        label: "每日入库分类统计折线图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsDailyStorageTable",
        label: "每日入库分类统计图",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsStatStorage",
        label: "货主实时库存排名",
        img: "/static/layout/tms/tms-04.png"
      },
      {
        type: "WmsInStorageSort",
        label: "入库分类统计查询",
        img: "/static/layout/tms/tms-03.png"
      },
      {
        type: "WmsOutStorageSort",
        label: "出库分类统计查询",
        img: "/static/layout/tms/tms-03.png"
      },
      {
        type: "WmsInventoryStatistics",
        label: "库存分类统计查询",
        img: "/static/layout/tms/tms-03.png"
      }
    ]
  },
  {
    title: "待办任务模块",
    items: [
      {
        type: "taskSchedule",
        label: "待办事项",
        img: "/static/layout/tms/tms-05.png"
      },
      {
        type: "taskUrge",
        label: "催办事项",
        img: "/static/layout/tms/tms-06.png"
      },
      {
        type: "taskContent",
        label: "最新动态",
        img: "/static/layout/tms/tms-07.png"
      }
    ]
  }
];

export const advanceComponents = [
  {
    type: "imgupload",
    label: "图片",
    icon: "el-icon-yrt-tupian3",
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100
      },
      width: "",
      tokenFunc: "funcGetToken",
      token: "",
      domain: "http://pfp81ptt6.bkt.clouddn.com/",
      disabled: false,
      length: 8,
      multiple: true,
      noLabel: false // 无标题
    }
  }
];

export const layoutComponents = [
  {
    type: "grid",
    label: "栅格布局",
    icon: "el-icon-yrt-saomiaoerweima",
    columns: [
      {
        span: 12,
        fields: []
      },
      {
        span: 12,
        fields: []
      }
    ],
    options: {
      gutter: 0,
      justify: "start",
      align: "top"
    }
  },
  {
    type: "splitter-group",
    label: "分割标题",
    icon: "el-icon-yrt-biaoti",
    options: {}
  }
];
