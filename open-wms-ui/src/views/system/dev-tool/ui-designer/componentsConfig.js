/* eslint-disable */
export const fieldComponents = [
  //  {
  //    type: 'input',
  //    label: '商品ID',
  //    icon: 'yrt-danhangshurukuang',
  //    options: {
  //      prop: 'productId',
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
    type: 'input',
    label: '单行文本',
    icon: 'yrt-danhangshurukuang',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      readonly: false,
      disabled: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'select',
    label: '下拉选择框',
    icon: 'yrt-biaodanzujian-xialakuang',
    options: {
      width: '100%',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: true,
      noLabel: false, // 无标题
      options: [
        {
          value: '下拉框1',
        },
        {
          value: '下拉框2',
        },
        {
          value: '下拉框3',
        },
      ],
      remote: 'bindDropdown', // true, false, bindDropdown
      remoteOptions: [],
      dropdownId: 0, // 下拉框ID
      props: {
        value: 'value',
        label: 'label',
      },
    },
  },
  {
    type: 'input-select',
    label: '输入选择框',
    icon: 'yrt-biaodanzujian-xialakuang',
    options: {
      width: '100%',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: true,
      noLabel: false, // 无标题
      options: [
        {
          value: '下拉框1',
        },
        {
          value: '下拉框2',
        },
        {
          value: '下拉框3',
        },
      ],
      remote: 'bindDropdown', // true, false, bindDropdown
      remoteOptions: [],
      dropdownId: 0, // 下拉框ID
      props: {
        value: 'value',
        label: 'label',
      },
    },
  },
  {
    type: 'table-select',
    label: '表格选择框',
    icon: 'yrt-biaodanzujian-xialakuang',
    options: {
      width: '100%',
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: true,
      noLabel: false, // 无标题
      columns: [],
      url: null, // 接口地址
      searchFields: null, // 查询字段
    },
  },
  {
    type: 'switch',
    label: '开关',
    icon: 'yrt-kaiguanclose',
    options: {
      defaultValue: false,
      required: false,
      disabled: false,
      noLabel: false, // 无标题
    },
  },
  {
    type: 'static',
    label: '静态文本',
    icon: 'yrt-cf-c65',
    options: {
      styles: {
        fontSize: 14,
        lineHeight: null,
      },
      noLabel: false, // 无标题
      options: [],
      remote: 'bindDropdown', // true, false, bindDropdown
    },
  },
  {
    type: 'radio',
    label: '单选框组',
    icon: 'yrt-danxuan',
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      noLabel: false, // 无标题,
      options: [
        {
          value: '选项1',
          label: '选项1',
        },
        {
          value: '选项2',
          label: '选项2',
        },
      ],
      required: false,
      width: '',
      remote: 'bindDropdown', // true、false、bindDropdown
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
    },
  },
  {
    type: 'checkbox',
    label: '多选框组',
    icon: 'yrt-fuxuan',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      noLabel: false, // 无标题,
      options: [
        {
          value: '选项1',
          label: '选项1',
        },
        {
          value: '选项2',
          label: '选项2',
        },
      ],
      required: false,
      width: '',
      remote: 'bindDropdown',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
    },
  },
  {
    type: 'cascader',
    label: '级联选择器',
    icon: 'yrt-jilianxuanze',
    options: {
      width: '100%',
      defaultValue: [],
      showLabel: false,
      noLabel: false, // 无标题,
      options: [
        {
          value: 0,
          label: '[根级]',
          chlidren: [],
        },
      ],
      required: false,
      remote: 'bindDropdown',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
    },
  },
  {
    type: 'tree',
    label: 'TREE选择器',
    icon: 'yrt-jilianxuanze',
    options: {
      width: '100%',
      defaultValue: null,
      showLabel: false,
      noLabel: false, // 无标题,
      required: false,
      onlySelectLeaf: true, // 仅选择叶节点
      disabled: false,
      props: {
        value: 'value',
        label: 'label',
      },
    },
    ajaxParams: {}, // 默认数据
  },
  {
    type: 'textarea',
    label: '多行文本',
    icon: 'yrt-duohangshurukuang',
    options: {
      width: '100%',
      defaultValue: '',
      required: false,
      readonly: false,
      disabled: false,
      pattern: '',
      placeholder: '',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'number',
    label: '计数器',
    icon: 'yrt-fuhao-shuzishurukuang',
    options: {
      width: '',
      required: false,
      defaultValue: 0,
      min: '',
      max: '',
      step: 1,
      disabled: false,
      controlsPosition: '',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'time',
    label: '时间选择器',
    icon: 'yrt-date-1',
    options: {
      width: '100%',
      defaultValue: '21:19:56',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm',
      required: false,
      start: '00:00',
      end: '23:59',
      step: '00:15',
      fixedTimeSelect: true, // 固定时间选择模式
      noLabel: false, // 无标题
    },
  },
  {
    type: 'date',
    label: '日期选择器',
    icon: 'yrt-rili2',
    options: {
      width: '100%',
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'YYYY-MM-DD',
      timestamp: false,
      required: false,
      noLabel: false, // 无标题
    },
  },
  {
    type: 'datetime',
    label: '日期时间选择器',
    icon: 'yrt-rili2',
    options: {
      width: '100%',
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'datetime',
      format: 'YYYY-MM-DD HH:mm:ss',
      timestamp: false,
      required: false,
      noLabel: false, // 无标题
    },
  },
  {
    type: 'rate',
    label: '评分',
    icon: 'yrt-pingfen',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
      noLabel: false, // 无标题
    },
  },
  {
    type: 'color',
    label: '颜色选择器',
    icon: 'yrt-yanse',
    options: {
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false,
      noLabel: false, // 无标题
    },
  },
  {
    type: 'slider',
    label: '滑块',
    icon: 'yrt-huakuai',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'upload-image',
    label: '图片/文件',
    icon: 'yrt-tupian',
    options: {
      defaultValue: [],
      size: {
        width: 180,
        height: 180,
      },
      serverAction: '/api/common/upload',
      disabled: false,
      max: 5,
      multiple: true,
      listType: 'picture-card',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'blank',
    label: '空白',
    icon: 'yrt-layout-custom',
    options: {
      defaultType: 'String',
      noLabel: false, // 无标题
    },
  },
  {
    type: 'tinymce-editor',
    label: '富文本编辑器',
    icon: 'yrt-rili1',
    options: {
      disabled: false,
      size: {
        width: 800,
        height: 300,
      },
      noLabel: false, // 无标题
    },
  },
];

export const advanceComponents = [
  {
    type: 'imgupload',
    label: '图片',
    icon: 'yrt-tupian3',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100,
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      domain: 'http://pfp81ptt6.bkt.clouddn.com/',
      disabled: false,
      length: 8,
      multiple: true,
      noLabel: false, // 无标题
    },
  },
];

export const layoutComponents = [
  {
    type: 'grid',
    label: '栅格布局',
    icon: 'yrt-saomiaoerweima',
    columns: [
      {
        span: 8,
        fields: [],
      },
      {
        span: 8,
        fields: [],
      },
      {
        span: 8,
        fields: [],
      },
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
    },
  },
  {
    type: 'inline-group',
    label: '行内布局',
    icon: 'yrt-ai-list',
    fields: [],
    options: {},
  },
  {
    type: 'splitter-group',
    label: '分割标题',
    icon: 'yrt-biaoti',
    options: {},
  },
  {
    type: 'detail-grid',
    label: '明细布局',
    icon: 'yrt-liebiao2',
    fields: [],
    options: {
      border: true,
      size: 'small',
      total: 0,
      pageIndex: 1,
      pageSize: 50,
      detailSelections: [],
      idField: null,
    },
    buttons: [],
  },
];

export const buttonComponents = [
  {
    type: 'button-group',
    label: '按钮组',
    buttons: [],
    options: {
      icon: 'yrt-anniuzu',
    },
  },
  {
    type: 'button',
    label: '按钮',
    options: {
      authNode: null, // 权限点名称
      icon: 'yrt-anniu',
      type: 'primary',
    },
  },
  {
    type: 'button-dropdown',
    label: '下拉框按钮组',
    options: {
      authNode: null, // 权限点名称
      icon: 'yrt-anniu1',
      type: 'primary',
      options: [
        {
          label: '选项1',
          authNode: 'action1',
        },
      ],
    },
  },
];

// 默认列表页面按钮
export const defaultDataListButtons = [
  {
    type: 'button-group',
    label: '按钮组',
    buttons: [
      {
        type: 'button',
        label: '新建',
        options: {
          icon: 'yrt-addplus',
          type: 'primary',
          authNode: 'add',
        },
        key: 'btn-add',
      },
      {
        type: 'button',
        label: '删除',
        options: {
          icon: 'yrt-shanchu2',
          type: 'primary',
          authNode: 'delete',
        },
        key: 'btn-delete',
      },
    ],
    options: {
      icon: 'yrt-anniuzu',
    },
    key: 'btn-group01',
  },
  {
    type: 'button-group',
    label: '按钮组',
    buttons: [
      {
        type: 'button',
        label: '审核',
        options: {
          icon: 'yrt-shenpi6',
          type: 'success',
          authNode: 'auditing',
        },
        key: 'btn-confirm',
      },
    ],
    options: {
      icon: 'yrt-anniuzu',
    },
    key: 'btn-group02',
  },
  {
    type: 'button-group',
    label: '按钮组',
    buttons: [
      {
        type: 'button',
        label: '刷新',
        options: {
          icon: 'yrt-shuaxin',
          type: 'default',
          authNode: 'refresh',
        },
        key: 'btn-refresh',
      },
      {
        type: 'button',
        label: '导出',
        options: {
          icon: 'yrt-daochu1',
          type: 'default',
          authNode: 'export',
        },
        key: 'btn-export',
      },
      {
        type: 'button',
        label: '打印',
        options: {
          icon: 'yrt-dayin3',
          type: 'default',
          authNode: 'print',
        },
        key: 'btn-print',
      },
    ],
    options: {
      icon: 'yrt-anniuzu',
    },
    key: 'btn-group03',
  },
];
