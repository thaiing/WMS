/**
 * 基础对象类型
 */
export interface BaseObject {
  [x: string]: string | number | Array<any> | boolean | Function | Object | null;
}

/**
 * 查询类型
 */
export enum QueryType {
  /**
   * 查询字段，多个字段用英文逗号分隔
   */
  SELECT = 'SELECT',
  /**
   * 等于
   */
  EQ = 'EQ',
  /**
   * 不等于
   */
  NE = 'NE',
  /**
   * 大于
   */
  GT = 'GT',
  /**
   * 大于等于
   */
  GE = 'GE',
  /**
   * 小于
   */
  LT = 'LT',
  /**
   * 小于等于
   */
  LE = 'LE',
  /**
   * 查询条件IN
   */
  IN = 'IN',
  /**
   * 查询条件LIKE
   */
  LIKE = 'LIKE',
  /**
   * 查询条件NOT IN
   */
  NOTIN = 'NOTIN',
  /**
   * NULL值
   */
  ISNULL = 'ISNULL',
  /**
   * BETWEEN查询
   */
  BETWEEN = 'BETWEEN',
  /**
   * 扩展字段查询
   */
  EXPANDFIELDS = 'EXPANDFIELDS',
  /**
   * 树查询
   */
  TREE = 'TREE',
  /**
   * AND子查询
   */
  SUBQUERY = 'SUBQUERY',
  /**
   * 自定义
   */
  CUSTOM = 'CUSTOM',
  /**
   * 顺序排
   */
  ORDERBYASC = 'ORDERBYASC',
  /**
   * 倒序排
   */
  ORDERBYDESC = 'ORDERBYDESC',
  /**
   * GROUPBY
   */
  GROUPBY = 'GROUPBY',
  /**
   * MAX
   */
  MAX = 'MAX',
  /**
   * MIN
   */
  MIN = 'MIN',
  /**
   * ISNOTNULL
   */
  ISNOTNULL = 'ISNOTNULL',
}

/**
 * 数据类型
 */
export enum DataType {
  /**
   * 布尔
   */
  BOOLEAN = 'BOOLEAN',
  /**
   * 字符
   */
  CHAR = 'CHAR',
  /**
   * 字节
   */
  BYTE = 'BYTE',
  /**
   * 短整型
   */
  SHORT = 'SHORT',
  /**
   * 整型
   */
  INT = 'INT',
  /**
   * BIGDECIMAL
   */
  BIGDECIMAL = 'BIGDECIMAL',
  /**
   * 长整型
   */
  LONG = 'LONG',
  /**
   * 浮点
   */
  FLOAT = 'FLOAT',
  /**
   * 双精度
   */
  DOUBLE = 'DOUBLE',
  /**
   * 字符串
   */
  STRING = 'STRING',
  /**
   * 日期时间
   */
  DATETIME = 'DATETIME',
  /**
   * 日期
   */
  DATE = 'DATE',
}

/**
 * 排序类型
 */
export enum OrderByType {
  /**
   * 顺序
   */
  ASC = 'ASC',
  /**
   * 倒序
   */
  DESC = 'DESC',
}

/**
 * 排序行项目
 */
export interface OrderItem {
  /**
   * 字段名称
   */
  column: string;
  /**
   * 排序类型
   */
  orderByType: OrderByType;
}

/**
 * 列表页面查询参数
 */
export interface PageListBo {
  menuId: number;
  prefixRouter: string;
  tableName: string;
  pageSize: number;
  pageIndex: number;
  orderByColumn: string;
  isAsc: string;
  sumColumnNames?: any[];
  listMethod?: string;
  queryBoList: Array<QueryBo>;
  otherParams?: EmptyObjectType;
}

/**
 * 条件行项目
 */
export interface QueryBo {
  /**
   * 字段名称
   */
  column: string;
  /**
   * 扩展字段
   */
  extColumn?: string;
  /**
   * 字段值
   */
  values: string | number | undefined;
  /**
   * 查询类型
   */
  queryType: QueryType;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 字段描述
   */
  label?: string;
  /**
   * 范围查询开始值
   */
  fromValue?: string | number | undefined;
  /**
   * 范围查询结束值
   */
  toValue?: string | number | undefined;
  /**
   * 是否or查询
   */
  or?: boolean;
  /**
   * AND子查询字段
   */
  subQueryBo?: Array<QueryBo>;
}

/**
 * 查询字段
 */
export interface SearchField {
  /**
   * 查询字段
   */
  prop: string;
  /**
   * 主键字段
   */
  keyProp: string;
  /**
   * 查询框描述
   */
  label: string;
  /**
   * 数据类型
   */
  dataType: DataType;
  /**
   * 查询框类型
   */
  type: string;
  /**
   * 查询参数
   */
  options: BaseObject;
  /**
   * 查询运算符
   */
  operator: QueryType;
  /**
   * 查询值
   */
  value: string | number | Array<any> | null;
  /**
   * 下拉框ID
   */
  dropdownId: string;
  /**
   * 查询字段顺序
   */
  searchRowNo: number;
  /**
   * 下拉框可以多选
   */
  multiple: Boolean;
  /**
   * 下拉框可以筛选
   */
  filterable: Boolean;
  /**
   * 是否扩展字段
   */
  isExpandField: Boolean;
  /**
   * 扩展字段名
   */
  expandFieldName?: string;
  /**
   * 模糊查询
   */
  isFuzzyQuery: Boolean;
  /**
   * 查询框宽度
   */
  width: string;
  /**
   * ajax请求参数
   */
  ajaxParams?: BaseObject;
  /**
   * 仅选择叶节点
   */
  onlySelectLeaf?: Boolean;
  /**
   * 查询默认值
   */
  searchDefaultValue?: string;
  /**
   * 范围查询开始值
   */
  fromValue?: string | number | undefined;
  /**
   * 范围查询结束值
   */
  toValue?: string | number | undefined;
  /**
   * 任意字段
   */
  [x: string]: string | number | Array<any> | boolean | Function | Object | null | undefined;
}
