import { RouteLocationNormalizedLoaded } from 'vue-router';
declare global {
  /**
   * 界面字段隐藏属性
   */
  interface FieldOption {
    key: number;
    label: string;
    visible: boolean;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 是否显示
     */
    visible: boolean;
  }

  interface UploadOption {
    /** 设置上传的请求头部 */
    headers: { [key: string]: any };

    /** 上传的地址 */
    url: string;
  }

  /**
   * 导入属性
   */
  interface ImportOption extends UploadOption {
    /** 是否显示弹出层 */
    open: boolean;
    /** 弹出层标题 */
    title: string;
    /** 是否禁用上传 */
    isUploading: boolean;

    /** 其他参数 */
    [key: string]: any;
  }
  /**
   * 字典数据  数据配置
   */
  interface DictDataOption {
    label: string;
    value: string;
    elTagType?: ElTagType;
    elTagClass?: string;
  }

  interface BaseEntity {
    createBy?: any;
    createTime?: string;
    updateBy?: any;
    updateTime?: any;
  }

  /**
   * 分页数据
   * T : 表单数据
   * D : 查询参数
   */
  interface PageData<T, D> {
    form: T;
    queryParams: D;
    rules: FormRules;
  }
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageIndex: number;
    pageSize: number;
  }

  // 申明外部 npm 插件模块
  declare module 'vue-grid-layout';
  declare module 'qrcodejs2-fixes';
  declare module 'splitpanes';
  declare module 'js-cookie';
  declare module '@wangeditor/editor-for-vue';
  declare module 'js-table2excel';
  declare module 'qs';
  declare module 'sortablejs';

  // 声明一个模块，防止引入文件时报错
  declare module '*.json';
  declare module '*.png';
  declare module '*.jpg';
  declare module '*.scss';
  declare module '*.ts';
  declare module '*.js';

  // 声明文件，*.vue 后缀的文件交给 vue 模块来处理
  declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }

  // 声明文件，定义全局变量
  /* eslint-disable */
  declare interface Window {
    nextLoading: boolean;
    BMAP_SATELLITE_MAP: any;
    BMap: any;
    ace: any; // 代码编辑器
    bpmnInstances: any;
    route: RouteLocationNormalizedLoaded;
    closePrintDialog: any; // 关闭打印窗口
    amisScoped: any; // amis对象
    amisMethods: any; // amis通用方法

    /* BI参数 */
    _server: any;
    // amis下的函数方法
    common: any;
  }

  // Math扩展方法
  /* eslint-disable */
  declare interface Math {
    /**
     * 四舍五入方法，注意是首字母是大写
     * @param num 需要四舍五入的数字
     * @param dec 保留小数位数，默认两位
     * @returns 返回四舍五入后的数字
     */
    Round: (num: number, dec?: number) => number;
  }

  // 声明路由当前项类型
  declare type RouteItem<T = any> = {
    path: string;
    name?: string | symbol | undefined | null;
    redirect?: string;
    k?: T;
    meta?: {
      title?: string;
      isLink?: string;
      isHide?: boolean;
      isKeepAlive?: boolean;
      isAffix?: boolean;
      isIframe?: boolean;
      roles?: string[];
      icon?: string;
      isDynamic?: boolean;
      isDynamicPath?: string;
      isIframeOpen?: string;
      loading?: boolean;
      activeMenu?: string;
      dynamicPath?: string;
      menuId?: number;
      routeParams?: Record<String, String>;
    };
    children?: T[];
    query?: { [key: string]: T };
    params?: { [key: string]: T };
    contextMenuClickId?: string | number;
    commonUrl?: string;
    isFnClick?: boolean;
    url?: string;
    transUrl?: string;
    title?: string;
    id?: string | number;
  };

  // 声明路由 to from
  declare interface RouteToFrom<T = any> extends RouteItem {
    path?: string;
    children?: T[];
  }

  // 声明路由当前项类型集合
  declare type RouteItems<T extends RouteItem = any> = T[];

  // 声明 ref
  declare type RefType<T = any> = T | null;

  // 声明 HTMLElement
  declare type HtmlType = HTMLElement | string | undefined | null;

  // 申明 children 可选
  declare type ChilType<T = any> = {
    children?: T[];
  };

  // 申明 数组
  declare type EmptyArrayType<T = any> = T[];

  // 申明 对象
  declare type EmptyObjectType<T = any> = {
    [key: string]: T;
  };

  // 申明 select option
  declare type SelectOptionType = {
    value: string | number;
    label: string | number;
  };

  // 鼠标滚轮滚动类型
  declare interface WheelEventType extends WheelEvent {
    wheelDelta: number;
  }

  // table 数据格式公共类型
  declare interface TableType<T = any> {
    total: number;
    loading: boolean;
    param: {
      pageIndex: number;
      pageSize: number;
      [key: string]: T;
    };
  }
}
export {};
