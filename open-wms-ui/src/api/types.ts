import { PropType, WritableComputedRef } from 'vue';
import { BaseObject, DataType, QueryBo } from '../types/common';

/**
 * 注册
 */
export type RegisterForm = {
  tenantId: string;
  username: string;
  password: string;
  confirmPassword?: string;
  code?: string;
  uuid?: string;
  userType?: string;
};

/**
 * 登录请求
 */
export interface LoginData {
  tenantId: string;
  username: string;
  phoneNumber?: string;
  password: string;
  rememberMe?: boolean;
  code?: string;
  uuid?: string;
  clientId?: string;
  grantType?: string;
  /**
   * 用户获取临时用户权限，例如扫描单据自动登录
   */
  token?: string;
  redirect?: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  redirectUrl: string;
  access_token: string;
}

/**
 * 验证码返回
 */
export interface VerifyCodeResult {
  captchaEnabled: boolean;
  /**
   * 需要校验验证码
   */
  isCheck: boolean;
  uuid?: string;
  img?: string;
}

/**
 * 租户详情
 */
export interface TenantVO {
  companyName: string;
  domain: any;
  tenantId: string;
}

/**
 * 租户信息
 */
export interface TenantInfo {
  tenantEnabled: boolean;
  voList: TenantVO[];
}
/**
 * 列表页面查询参数
 */
export interface PageEditorBo {
  prefixRouter: string;
  tableName: string;
  detailParams: Array<DetailParamsBo>;
  [x: string]: string | number | Array<any>;
}

/**
 * 编辑页面获取数据参数
 */
export interface EditorVo {
  /**
   * 主表数据
   */
  master: EmptyObjectType;
  /**
   * 明细表数据
   */
  detailList: Array<DetailDataBo>;
  [x: string]: string | number | Array<any> | Object;
}

/**
 * 删除数据返回结果
 */
export interface DeleteVo {
  /**
   * 返回代码
   */
  code: number;
  /**
   * 返回结果状态，boolean
   */
  result: boolean;
  /**
   * 返回消息
   */
  msg: string;
  [x: string]: string | number | Array<any> | Object;
}

/**
 * 编辑变量数据结构
 */
export interface EditorState {
  saveLoading: boolean; // 保存loading
  initLoading: boolean; // 加载数据初始化loading
  editorVo: EditorVo;
  // 表单数据集合，明细数据集合:{subTableName:{total:10,rows:[{}], footer:[{}]}}
  dropdownData: Record<string, any>; // 下拉框数据集合
  // 模块tree prop参数配置
  treeProps: Record<string, any>;
  // TREE选择器右侧图标
  treeSuffixIcon: string;
  // 显示批量导入对话框参数
  importOptions: any;
  // 显示批量导出对话框参数
  batchExport: Record<string, any>;
  // 明细分页器禁用
  detailPageDisabled: boolean;
  // 显示字段属性对话框
  tableAttr: Record<string, any>;
  // 当前选中tab
  activeTabName: string;
  isSavedCloseDialog: boolean;
  // 显示字段属性对话框
  showMainFieldsDialog: boolean;
}

/**
 * 编辑器事件定义
 */
export type EditorEventsList = 'onSaveAfter' | 'onChange' | 'onEditLoadBefore' | 'onEditLoadAfter' | 'onDetailChange' | 'onDetailDeleteAfter' | 'onRowChange' | 'onKeyUp' | 'onKeyDown' | 'onFocus' | 'onBlur' | 'onCopyAfter' | 'onAddLoadAfter' | 'onRowClick' | 'onDetailRowClick';
/**
 * Editor Hook数据结构
 */
export interface EditorOptions {
  props: any;
  state: EditorState;
  detailFields: ComputedRef<any[]>;
  isShowDialog: WritableComputedRef<any>;
  currentAction: WritableComputedRef<any>;
  currentDisabled: WritableComputedRef<any>;
  currentTop: WritableComputedRef<any>;
  masterFields: ComputedRef<any[]>;
  events: Record<EditorEventsList, Function>;
}

/**
 * 保存页面获取数据参数
 */
export interface SaveEditorBo {
  prefixRouter: string;
  idField: string;
  idValue: number;
  menuId: number;
  tableName: string;
  /**
   * 是否新建
   */
  add: boolean;
  detailParams: Array<DetailParamsBo>;
  data: {
    /**
     * 主表数据
     */
    master: {
      [x: string]: string | number | null;
    };
    /**
     * 明细表数据
     */
    detailList: Array<DetailDataBo>;
    [x: string]: string | number | Array<any> | Object;
  };
  [x: string]: string | number | Array<any> | Object;
}

/**
 * 删除页面获取数据参数
 */
export interface DeleteBo {
  prefixRouter: string;
  idField: string;
  idValue: Array<number>;
  menuId: number;
  tableName: string;
  /**
   * 自定义接口
   */
  deleteUrl?: string;
}

/**
 * 明细参数BO
 */
export interface DetailParamsBo {
  subTableName: string;
  idField: string;
  folder: string;
  sumColumnNames: string;
  [x: string]: string;
}
/**
 * 明细数据BO
 */
export interface DetailDataBo {
  subTableName: string;
  total: number;
  rows: Array<any>;
  code: number;
  result: boolean;

  [x: string]: string | number | Array<any> | boolean;
}
/**
 * 明细信息
 */
export interface DetailInfo {
  /**
   * 明细表名
   */
  subTableName: string;
  /**
   * 明细参数集合
   */
  options: DetailInfoOptions;
  /**
   * 明细字段集合
   */
  fields: Array<FiledInfo>;
}
/**
 * 明细信息
 */
export interface DetailInfoOptions {
  /**
   * 明细总行数 */
  total: number;
  border: boolean;
  size: string;
  pageIndex: number;
  pageSize: number;
  /**
   * 选中行 */
  detailSelections: [];
  /**
   * 主键字段名 */
  idField: string;
  /**
   * 后端路由
   */
  prefixRouter: string;
  /**
   * 排序字段
   */
  orderBy: any;

  [x: string]: string | number | Array<any> | boolean;
}
/**
 * 字段信息
 */
export interface FiledInfo {
  prop: string;
  label: string;
  dataType: DataType;
  sortable: boolean;
  hidden: boolean;
  isQuickSearch: boolean;
  key: string;
  model: string;
  isSum: boolean;
  tagColorList: any[];

  [x: string]: string | number | Array<any> | boolean;
}
