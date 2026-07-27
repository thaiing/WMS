/**
 * BaseHook参数
 */
export interface BaseHookParams {
  // 配置参数
  config?: EmptyObjectType;
  /**
   * 自定义路由地址
   */
  custoJsonmRoute?: string;
  /**
   * 父级路由地址
   */
  parentRoute?: string;
  /**
   * 自定义初始化函数
   */
  init?: () => Promise<boolean>;
  /**
   * 自定义数据处理
   */
  doData?: (item: any, baseParams: BaseHookParams) => boolean;
  /**
   * 自定义权限处理
   */
  doAuth?: () => boolean;
}

export interface ResultInfo {
  /**
   * 执行结果状态：
   * result=true，表示成功
   * result=false，表示失败
   */
  result: boolean;
  /**
   * 执行结果返回数据data
   */
  data: any;
  /**
   * 执行结果返回数据dynamic
   */
  dynamic: any;
  /**
   * 执行结果返回消息提示
   */
  msg: string;
}

/**
 * 明细字段数据结构
 */
export interface DetailField {
  /**
   * 字段名
   */
  prop: string;
  /**
   * 字段描述
   */
  label: string;
  /**
   * 字段类型：string，byte, integer, long, double, bigDecimal
   */
  dataType: string;
  /**
   * 可排序
   */
  sortable: boolean;
  /**
   * 隐藏
   */
  hidden: boolean;
  /**
   * 是否快速查询
   */
  isQuickSearch: boolean;
  /**
   * 字段唯一键
   */
  key: string;
  /**
   * 表头对齐方式
   */
  headerAlign: string;
  /**
   * 对齐方式
   */
  align: string;
  /**
   * 编辑框类型：input、select等
   */
  type: string;
  /**
   * 字段描述
   */
  options: {
    /**
     * 宽度
     */
    width: string;
    /**
     * 默认值
     */
    defaultValue: string;
    /**
     * 多选
     */
    multiple: boolean;
    /**
     * 禁用
     */
    disabled: boolean;
    /**
     * 可清除内容
     */
    clearable: boolean;
    /**
     * 字段占位符描述
     */
    placeholder: '';
    /**
     * 必填
     */
    required: boolean;
    /**
     * 显示标签
     */
    showLabel: boolean;
    /**
     * 不显示标签
     */
    noLabel: boolean;
    /**
     * 下拉框静态参数
     */
    options: Array<any>;
    /**
     * 访问模式：bindDropdown、false、true
     */
    remote: string | boolean;
    /**
     * 访问参数
     */
    remoteOptions: [];
    /**
     * 绑定下拉框ID
     */
    dropdownId: number;
    /**
     * 字段映射属性
     */
    props: {
      value: 'value';
      label: 'label';
    };
  };
  /**
   * 关联字段主键
   */
  keyProp: string;
  /**
   * 列宽
   */
  width: number;
  calcType: string;
  calcExpress: string;
  calcMainField: string;
  calcEmitFields: string;
  [key: string]: any;
}

export interface MsgboxOpts {
  /**
   * MessageBox 标题
   */
  title?: string;
  /**
   * MessageBox消息正文内容
   */
  message?: string;
  /**
   * 是否将 message 属性作为 HTML 片段处理
   */
  dangerouslyUseHTMLString?: boolean;
  /**
   * 消息类型，用于显示图标 success / info / warning / error
   */
  type?: string;
  /**
   * 消息自定义图标，该属性会覆盖 type 的图标
   */
  icon?: string | any;
  /**
   * MessageBox 的自定义类名
   */
  customClass?: string;
  /**
   * 	MessageBox 的自定义内联样式
   */
  customStyle?: Record<string, string>;
  /**
   * 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调函数。
   */
  callback?: string;
  /**
   * MessageBox 是否显示右上角关闭按钮
   */
  showClose?: boolean;
  /**
   * messageBox 关闭前的回调，会暂停消息弹出框的关闭过程。
   */
  beforeClose?: string;
  /**
   * 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 Esc 键）进行区分
   */
  distinguishCancelAndClose?: boolean;
  /**
   * 是否在 MessageBox 出现时将 body 滚动锁定
   */
  lockScroll?: boolean;
  /**
   * 是否显示取消按钮
   */
  showCancelButton?: boolean;
  /**
   * 是否显示确定按钮
   */
  showConfirmButton?: boolean;
  /**
   * 	取消按钮的文本内容
   */
  cancelButtonText?: string;
  /**
   * 确定按钮的文本内容
   */
  confirmButtonText?: string;
  /**
   * 取消按钮的自定义类名
   */
  cancelButtonClass?: string;
  /**
   * 	确定按钮的自定义类名
   */
  confirmButtonClass?: string;
  /**
   * 是否可通过点击遮罩关闭 MessageBox
   */
  closeOnClickModal?: boolean;
  /**
   * 是否可通过按下 ESC 键关闭 MessageBox
   */
  closeOnPressEscape?: boolean;
  /**
   * 	是否在 hashchange 时关闭 MessageBox
   */
  closeOnHashChange?: boolean;
  /**
   * 是否显示输入框
   */
  showInput?: boolean;
  /**
   * 输入框的占位符
   */
  inputPlaceholder?: string;
  /**
   * 输入框的类型
   */
  inputType?: string;
  /**
   * 输入框的初始文本
   */
  inputValue?: string;
  /**
   * 输入框的校验表达式
   */
  inputPattern?: string;
  /**
   * 	输入框的校验函数。 应该返回一个 boolean 或者 string， 如果返回的是一个 string 类型，那么该返回值会被赋值给 inputErrorMessage 用于向用户展示错误消息。
   */
  inputValidator?: string;
  /**
   * 校验未通过时的提示文本
   */
  inputErrorMessage?: string;
  /**
   * 是否居中布局
   */
  center?: boolean;
  /**
   * messageBox是否可拖放
   */
  draggable?: boolean;
  /**
   * 是否使用圆角按钮
   */
  'round-button'?: boolean;
  /**
   * 自定义确认和取消按钮的尺寸
   */
  'button-size'?: string;
}

import { AxiosStatic } from 'axios';
import { BaseObject, QueryBo } from './common';
import { EditorVo } from '../api/types';
export interface BaseProperties extends ComponentPublicInstance {
  /**
   * 事件穿透工具
   */
  mittBus: {
    emit: (eventName: string, options: any) => {};
    on: (eventName: string, options: any) => {};
    off: (eventName: string) => {};
  };
  /**
   * http请求工具axios
   */
  axios: AxiosStatic;
  /**
   * $refs
   */
  $refs: any;
  /**
   * 消息处理
   */
  $message: {
    /**
     * 显示错误信息
     */
    info: (msg: string) => {};
    /**
     * 显示错误信息
     */
    error: (msg: string) => {};
    /**
     * 显示成功信息
     */
    success: (msg: string) => {};
    /**
     * 显示警告信息
     */
    warning: (msg: string) => {};
  };
  /**
   * msgbox确认对话框
   * @options 参数
   */
  $msgbox(options: MsgboxOpts): Promise<any>;
  /**
   * confirm确认对话框
   * @messgage 内容
   * @title 标题
   * @options 参数
   */
  $confirm(message: string, title: string, options?: MsgboxOpts): Promise<any>;
  /**
   * alert对话框
   * @messgage 内容
   * @title 标题
   * @options 参数
   */
  $alert(message: string, title: string, options?: MsgboxOpts): Promise<any>;
  /**
   * prompt对话框
   * @messgage 内容
   * @title 标题
   * @options 参数
   */
  $prompt(message: string, title: string, options?: MsgboxOpts): Promise<any>;
  /**
   * 全局参数
   */
  dataOptions: DataOptions;
  /**
   * 列表页面参数
   */
  dataListOptions: DataListOptions;
  /**
   * 编辑页面参数
   */
  editorOptions: EditorOptions;
  /**
   * 权限点
   */
  authNodes: any;
  /**
   * 按钮是否只读权限点
   */
  btnReadOnly: {
    save: boolean;
    auditing: boolean;
    add: boolean;
    delete: boolean;
    stop: boolean;
    open: boolean;
  };
  /**
   * 是否加载完毕
   */
  isLoaded: boolean;
  /**
   * 组件名称
   */
  subName: string;
  /**
   * 编辑器对象
   */
  editorRefName: string;
  /**
   * 编辑器对象
   */
  dataListRefName: string;
  /**
   * 明细数据集
   */
  detailRows: Array<DetailField>;
  /**
   * 编辑器对象
   */
  editorRef: EditorRef;
  /**
   * 列表对象
   */
  dataListRef: DataListRef;
  /**
   * 编辑页面主表数据对象
   */
  masterData: any;
  /**
   * 明细数据集
   */
  detailRows2: Array<DetailField>;
  /**
   * 编辑明细表信息1
   */
  detailInfo: {
    type: 'detail-grid';
    label: '明细布局';
    fields: Array<DetailField>;
    options: {
      /**
       * 显示边框
       */
      border: boolean;
      /**
       * 表格尺寸
       */
      size: string;
      /**
       * 页面索引
       */
      pageIndex: number;
      /**
       * 分页大小
       */
      pageSize: number;
      /**
       * 当前选行集合
       */
      detailSelections: Array<any>;
      /**
       * 主键名称
       */
      idField: string;

      /**
       * 条件
       */
      fixedWhere: any;
    };
    /**
     * 按钮参数
     */
    buttons: Array<any>;
    /**
     * 唯一键值
     */
    key: string;
    subTableName: '';
  };
  /**
   * 编辑明细表信息2
   */
  detailInfo2: {
    type: 'detail-grid';
    label: '明细布局';
    fields: Array<DetailField>;
    options: {
      /**
       * 显示边框
       */
      border: boolean;
      /**
       * 表格尺寸
       */
      size: string;
      /**
       * 页面索引
       */
      pageIndex: number;
      /**
       * 分页大小
       */
      pageSize: number;
      /**
       * 当前选行集合
       */
      detailSelections: Array<any>;
      /**
       * 主键名称
       */
      idField: string;
    };
    /**
     * 按钮参数
     */
    buttons: Array<any>;
    /**
     * 唯一键值
     */
    key: string;
    subTableName: '';
  };
  /**
   * 父级对象
   */
  $parent: any;
  /* ==============================================
   *  以下为方法定义
   * ==============================================*/
  /**
   * 主表按钮点击事件处理
   * @authNode 权限点
   */
  buttonClick: (authNode: string) => {};
  /**
   * 明细表按钮点击事件处理
   * @authNode 权限点
   */
  detailButtonClick: (authNode: string) => {};
  /**
   * 连接弹出对话框编辑器
   * @id 主表ID
   */
  linkEditor: (id: any) => {};
  /**
   * 刷新所有页面的下拉框
   */
  refreshDropdown: () => {};
  /**
   * 初始化数据
   */
  init: (callback?: Function) => {};
  /**
   * 列表工具栏点击事件
   */
  loadAuth(uiParams: any, callback?: Function): Promise<any>;
  /**
   * 合并自定义设置
   */
  setUserJson: (res: any) => {};
  /**
   * 编辑数据
   */
  editData: (id: number, rowData?: any) => {};
  /**
   * 切换tab视图，将对应的编辑器或者列表显示
   */
  showTagView: () => {};
}

/**
 * DataOptions 全局参数
 */
export interface DataOptions {
  /**
   * 主键名
   */
  idField: string;
  /**
   * 主键名
   */
  idValue: string | number;
  /**
   * 表ID
   */
  tableId?: number;
  /**
   * 表视图ID
   */
  vueDataId?: number;
  /**
   * 主键名
   */
  tableView?: string;
  /**
   * 模块ID
   */
  menuId: number;
  /**
   * 分页大小，默认为15
   */
  pageSize: number;
  /**
   * 列表数据总行数
   */
  total: number;
  /**
   * 当前分页索引
   */
  pageIndex: number;
  /**
   * 编辑页面禁止通过点击空白处关闭对话框
   */
  global_editorProhibitCloseOnClickModal: boolean;
  /**
   * 模块关联表名
   */
  tableName: string;
  /**
   * 页面路由地址
   */
  webRouter: string;
  /**
   * 后端路由地址
   */
  prefixRouter: string;
  /**
   * 编辑类型
   */
  editorType: EditorType;
  /**
   * 查询条件
   */
  where?: BaseObject;
  /**
   * 查询独立行
   */
  searchOnlyLine?: boolean;
  /**
   * 连接字段
   */
  linkColumn?: string;
  /**
   * 显示操作列
   */
  showActionField?: boolean;
  /**
   * 显示求和列
   */
  showSumField?: boolean;
  /**
   * 表格最大高度
   */
  maxHeight?: string;
  /**
   * 编辑器校验码，用于区分不同模块弹出
   */
  editorCheckCode?: string;
  /**
   * 统计栏
   */
  footerRows?: Array<any>;
  fixedWhere?: BaseObject;
  script?: string;
  orderBy?: BaseObject;
  /**
   * 开启编辑页面折叠
   */
  openTabGroup?: boolean;
  /**
   * 列表方法
   */
  listMethod?: string;
  /**
   * 开启瀑布流
   */
  openWaterfall?: boolean;
  /**
   * 开启审核流
   */
  openAuditFlow?: boolean;
  /**
   * 审核部署ID
   */
  deployId?: string;
  /**
   * 自动编码字段
   */
  codeRegular?: string | null;
  /**
   * 其他数据
   */
  otherData?: Record<string, object>;
}

/**
 * DataListOptions 列表页面参数
 */
export interface DataListOptions {
  fields: Array<any>;
  buttons: Array<DataListOptionsButtonGroup>;
}

export interface DataListOptionsButtonGroup {
  type: string;
  label: string;
  buttons: Array<DataListOptionsButton>;
  options: {
    icon: string;
  };
  key: string;
}
export interface DataListOptionsButton {
  type: string;
  label: string;
  options: {
    icon: string;
    type: string;
    authNode: string;
  };
  key: string;
}

/**
 * EditorOptions 编辑页面参数
 */
export interface EditorOptions {
  /**
   * 编辑页面配置参数
   */
  config: EditorOptionsConfig;
  fields: Array<any>;
}

/**
 * 编辑参数editorOptions中的config
 */
export interface EditorOptionsConfig {
  top: string;
  title: string;
  // 是否显示添加实验室小组对话框
  visible: boolean;
  /**
   * 是否禁用
   */
  disabled: boolean;
  // 编辑时KeyId
  id: number;
  // 保存按钮文本
  saveButtonText: string;
  // 行内表单模式
  formInline: boolean;
}

/**
 * 页面编辑器Ref参数类型
 */
export interface EditorRef {
  /**
   * 重新加载列表数据
   */
  reload: () => {};
  /**
   * 新建数据
   */
  addData: () => {};
  /**
   * 编辑数据
   */
  loadEditData: (id: Number, master?: any, isInit?: boolean) => {};
  /**
   * 编辑框数据对象
   */
  formData: any;
  /**
   * 修改主表字段值
   * @prop 字段名
   * @value 需要修改的字段值
   */
  changeValue: (prop: string, value: string | number) => {};
  /**
   * 关闭编辑
   */
  cancel: () => {};
  /**
   * 添加明细数据
   * @rows 行数据集合
   * @subTableName 子表名称
   */
  addDetailDataRow: (rows: Array<any>, subTableName?: string) => {};
  /**
   * 清空明细数据
   * @subTableName 子表名称
   */
  clearDetailDataRow: (subTableName?: string) => {};
  /**
   * 标识明细数据删除
   * @subTableName 子表名称
   */
  flagDeleteDetailList: (subTableName?: string) => any[];
  /**
   * 关闭编辑
   * @rows 方法体
   */
  save: (callback?: any) => {};
  /**
   * 明细字段
   */
  detailFields: Array<any>;
  /**
   * 设置下拉框值
   * @dropdownId 下拉框ID
   * @data 下拉框值
   */
  setDropdownData: (dropdownId: number, data: Array<any>) => {};
  /**
   * 编辑页面数据
   * @returns
   */
  editorVo: EditorVo;
  /**
   * 复制
   */
  copy: (callback: any) => {};
  /**
   * 获取字段信息
   */
  getFieldInfo: (fieldName: string) => any;
}

/**
 * 列表页面Ref参数类型
 */
export interface DataListRef {
  /**
   * 当前页面数据列表
   */
  dataList: any[];
  /**
   * 重新加载数据
   */
  reloadData: (where: any, callback?: any) => {};
  /**
   * 删除数据
   */
  deleteData: (selectedRows: Array<any>, detail?: any) => {};
  /**
   * 设置当前行
   */
  setCurrentRow: () => {};
  /**
   * 是否加载完毕
   */
  getLoadFinished: () => boolean;
  /**
   * 加载列表数据
   * @callback 方法体
   */
  loadData: (callback?: any) => {};
  /**
   * 重新刷新列表数据
   * @callback 方法体
   */
  reload: (callback?: any) => {};
  /**
   * 获取全部查询条件
   */
  getAllWhere: () => Array<QueryBo>;
}

/**
 * 编辑类型：弹窗、嵌入
 */
export enum EditorType {
  UNKNOWN = '',
  /**
   * 单页面编辑
   */
  SINGLE = 'single',
  /**
   * 内嵌多页面编辑
   */
  INNER = 'inner',
  /**
   * 对话框模式
   */
  DIALOG = 'dialog',
}
/**
 * btnReadOnly按钮参数设置
 */
export interface BtnReadOnly {
  /**
   * 保存
   */
  save: boolean;
  /**
   * 审核
   */
  auditing: boolean;
  /**
   * 添加
   */
  add: boolean;
  /**
   * 删除
   */
  delete: boolean;
  /**
   * 终止
   */
  stop: boolean;
  /**
   * 开启
   */
  open: boolean;
  /**
   * 确认
   */
  confirm: boolean;
  /**
   * 其他按钮权限
   */
  [key: string]: any;
}
