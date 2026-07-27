import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '../../types/base-type';
import { getPageList } from '../../api/common/baseApi';
import { QueryBo, PageListBo, BaseObject, SearchField, QueryType, DataType } from '/@/types/common';
import to from 'await-to-js';
import moment from 'moment';
import _ from 'lodash';

let state = {
  drag: false,
  targetElement: undefined,
  // 可以显示字段
  showFields: [] as Array<SearchField>,
  // 显示设置对话框
  showSetDialog: false,
  // 数据集合
  dataList: [] as Array<any>,
  // 加载数据初始化loading
  initLoading: false,
  // 刷新数据
  refreshLoading: false,
  // 初始化加载完成
  isLoadFinished: false,
  // 下拉框数据集合
  // dropdownData: {},
  // 下拉框是否已加载
  dropdownLoaded: false,

  // 开启默认展开全部
  defaultExpandAll: false,
  expandkey: '',
  // 高级查询字段
  searchFields: [] as Array<SearchField>,
  // 操作列默认定义
  actionFieldDefault: {
    prop: '_action',
    label: '操作',
    width: '100',
    headerAlign: 'center',
    align: 'center',
    action: [
      {
        type: 'button',
        action: 'modify',
        label: '编辑',
      },
      {
        type: 'button',
        action: 'delete',
        label: '删除',
      },
    ],
    hidden: false,
  },
  // 显示批量导入对话框参数
  importOptions: {
    visible: false,
    label: '批量导入',
    url: '/api/common/uploadSingleFile',
    importId: 0,
    menuId: 0, // 模块ID
    tableName: '', // 表名
  },
  // 显示批量导出对话框参数
  exportOptions: {
    visible: false,
    label: '批量导出',
    exportId: 0,
  },
  // 显示字段属性对话框
  showAttrDialog: false,
  // 查询关键词
  quickSearchValue: '',
  // 查询类别
  quickSearchType: '精确',
  // tabNav 查询条件
  tabNavWhere: [] as Array<QueryBo>,
  // 显示打印对话框
  printOptions: {
    printVisible: false,
    authNode: '',
    baskReportUrl: '',
  },
  // 记录当前选中ID
  idSelections: [] as any[],
  // 不需要记忆选中
  isNotSelections: false,
  // 瀑布流tab
  browserType: 'table',
};

/**
 * 列表页面变量数据类型
 */
export type StateOptions = typeof state;
/**
 * 列表事件定义
 */
export type ListEventsList = 'onLoadDataAfter' | 'onExpandChange' | 'onSelectionChange';
/**
 * 列表页面查询参数
 */
export interface ListLoadOptions {
  props: any;
  currentData: any;
  currentFields: ComputedRef<any[]>;
  state: StateOptions;
  quickSearch: any;
  currentDataListSelections: any;
  events: Record<ListEventsList, Function>;
}

/**
 * 数据加载函数
 * @param options 加载参数
 * @returns
 */
export default function listLoadHook(options: ListLoadOptions) {
  const { props, currentData, state, quickSearch, currentDataListSelections, events } = options;

  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy = ins.proxy as BaseProperties;

  /**
   * 加载数据
   * @param callback 回调函数
   */
  const loadData = async (callback?: Function) => {
    // 静态数据查询
    if (props.isStaticData) {
      const pageIndex = props.dataOptions.pageIndex;
      const pageSize = props.dataOptions.pageSize;
      let dataList: any = currentData.value;

      // 排序
      if (props.dataOptions.orderBy) {
        Object.keys(props.dataOptions.orderBy).forEach((key) => {
          const order = props.dataOptions.orderBy[key];
          dataList.sort((a: any, b: any) => {
            if (order === 'ASC') {
              return a[key] > b[key] ? 1 : -1;
            } else {
              return a[key] > b[key] ? -1 : 1;
            }
          });
        });
      }
      if (state.quickSearchValue && quickSearch.value.fields.length) {
        // 搜索数据
        dataList = dataList.filter((item: any) => {
          let isMatching = false;
          const keys = ('' + state.quickSearchValue).split('\n').filter((f) => f);
          keys.forEach((key) => {
            quickSearch.value.fields.forEach((f: any) => {
              const prop = f.prop;
              const value = '' + item[prop];
              if (state.quickSearchType === '模糊') {
                if (value.indexOf(key) >= 0) {
                  isMatching = true;
                }
              } else {
                // 精确匹配
                if (value === key) {
                  isMatching = true;
                }
              }
            });
          });
          return isMatching;
        });
      }
      props.dataOptions.total = dataList.length;
      state.dataList = dataList.filter((item: any, index: number) => index >= (pageIndex - 1) * pageSize && index < pageIndex * pageSize);
    } else {
      await loadDataServer(callback);
    }
  };

  /**
   * 重新服务器上加载数据
   * @param where
   * @param callback
   * @returns
   */
  const loadDataServer = async (callback?: Function) => {
    if (!props.dataOptions || !props.dataOptions.tableName) {
      return;
    }
    let pageParams = getPageParams();
    // 加载前事件
    if (props.loadDataBefore(pageParams, state.searchFields) === false) {
      return;
    }
    state.initLoading = true;
    state.refreshLoading = true;

    let resResult = await to(getPageList(pageParams));
    let [err, res] = resResult;
    if (err) {
      return;
    }
    proxy.common.showMsg(resResult);

    if (res?.result) {
      //明细扩展字段处理
      res.rows = res.rows.map((item: any) => {
        if (item.expandFields) {
          let expandFields = item.expandFields;
          if (typeof expandFields !== 'object') {
            expandFields = JSON.parse(item.expandFields);
          }
          item = Object.assign({}, expandFields, item);
        }
        if (item.detailExpandFields) {
          let detailExpandFields = item.detailExpandFields;
          if (typeof detailExpandFields !== 'object') {
            detailExpandFields = JSON.parse(item.detailExpandFields);
          }
          item = Object.assign({}, detailExpandFields, item);
        }
        return item;
      });

      props.onTranslate(res.rows); // 自定义数据转换事件
      state.dataList = res.rows;
      translate(state.dataList); // 内部默认数据转换
      if (props.dataOptions.script) {
        try {
          state.dataList.forEach(() => {
            // eslint-disable-next-line
            eval(props.dataOptions.script);
          });
        } catch (error: any) {
          proxy.$message.error(`加载数据执行脚本错误：${error.message}`);
        }
      }
      props.dataOptions.total = res.total;
      props.dataOptions.footerRows = res.footer;
    }
    nextTick(() => {
      state.initLoading = false;
      state.refreshLoading = false;
      state.isLoadFinished = true;
    });
    //把所有的展开都关闭掉
    state.defaultExpandAll = false;
    state.expandkey = '' + +new Date();

    if (typeof callback === 'function') {
      callback(res);
    }

    // 库存监测记录中，跳转打开详情页面
    if (proxy.$route.query.showdetail === 'true') {
      const id = proxy.$route.query.id;

      if (id) {
        const ref = proxy.$parent.$refs[props.editorRefName];
        ref.editData(id);
      }
    }
    if (!state.isNotSelections) {
      // 自动记一下选中行
      proxy.$nextTick(() => {
        reSelected();
      });
    }

    // 加载后事件
    events.onLoadDataAfter(state.dataList);
  };

  const getPageParams = () => {
    const queryBoList: Array<QueryBo> = getAllWhere();
    state.idSelections = props.dataListSelections.map((item: any) => item[props.dataOptions.idField]);

    // 固定查询条件
    let fixedWhere = props.dataOptions.fixedWhere || {};
    if (props.fixedWhere) {
      fixedWhere = Object.assign({}, fixedWhere, props.fixedWhere);
    }
    if (fixedWhere) {
      // 将JSON对象转为后端需要的QueryBo数组对象
      Object.keys(fixedWhere).forEach((prop) => {
        let fieldInfo = getFieldInfo(prop);
        let queryType = QueryType.EQ;
        let values = fixedWhere[prop];
        if (typeof values === 'string' && values.includes(',')) {
          queryType = QueryType.IN;
        } else if (Array.isArray(values)) {
          queryType = QueryType.IN;
          values = values.join(','); // 转为逗号分隔的字符串
        } else if (typeof values === 'string' || typeof values === 'number') {
          queryType = QueryType.EQ;
        } else if (typeof values == 'object') {
          // 复杂对象的处理
          queryType = values.queryType;
          values = values.value;
        }
        queryBoList.push({
          column: prop,
          values: values,
          queryType: queryType,
          dataType: fieldInfo?.dataType?.toUpperCase() || DataType.STRING,
        });
      });
    }
    let sumColumnNames = props.fields
      .filter((item: any) => {
        return item.isSum;
      })
      .map((item: any) => {
        return {
          prop: item.prop,
          expandField: item.isExpandField,
          expandFieldName: item.expandFieldName,
        };
      });

    // 排序字段
    let orderByColumn: Array<string> = [];
    let orderBy: Array<string> = [];
    if (props.dataOptions.orderBy) {
      Object.keys(props.dataOptions.orderBy).forEach((key) => {
        orderByColumn.push(key);
        orderBy.push(props.dataOptions.orderBy[key].toLowerCase());
      });
    } else {
      orderByColumn.push(props.dataOptions.idField);
      orderBy.push('ASC');
    }

    let pageParams: PageListBo = {
      menuId: props.dataOptions.menuId,
      prefixRouter: props.dataOptions.prefixRouter,
      listMethod: props.dataOptions.listMethod, // 列表方法名
      tableName: props.dataOptions.tableName,
      pageIndex: props.dataOptions.pageIndex,
      pageSize: props.dataOptions.pageSize,
      orderByColumn: orderByColumn.join(','),
      isAsc: orderBy.join(','),
      sumColumnNames: sumColumnNames,
      queryBoList: queryBoList,
    };

    return pageParams;
  };

  // 数据转换
  const translate = (rows: Array<any>) => {
    for (const row of rows) {
      props.fields.forEach((field: any) => {
        let prop = field.prop;
        if (field.dataType === 'date') {
          const v = row[prop];
          if (v) {
            let formatter = 'YYYY-MM-DD';
            if (field.formatter) formatter = field.formatter;
            row[prop] = proxy.common.formatDate(v, formatter);
          }
        } else if (field.dataType === 'datetime') {
          const v = row[prop];
          if (v) {
            let formatter = 'YYYY-MM-DD HH:mm:ss';
            if (field.formatter) formatter = field.formatter;
            row[prop] = proxy.common.formatDate(v, formatter);
          }
        } else if (field.dataType === 'decimal') {
          const v = row[prop];
          row[prop] = proxy.common.round(v, 4); // 保留两位小数
        } else {
          const v = row[prop];
          if (Array.isArray(v)) {
            row[prop] = v.join('/');
          }
        }
      });
    }
  };

  // 加载数据后重新选中行
  const reSelected = () => {
    const rows: Array<any> = [];
    for (const row of state.dataList) {
      const exist = state.idSelections.find((id: number) => '' + id === '' + row[props.dataOptions.idField]);
      if (exist) {
        rows.push(row);
        proxy.$refs.dataListRef.toggleRowSelection(row); // 自动选中
      }
    }
    currentDataListSelections.value = rows;
  };

  /**
   * 获得高级查询条件
   * @returns
   */
  const getWhere = (): Array<QueryBo> => {
    // 高级查询
    let fields: Array<QueryBo> = state.searchFields
      .filter((item: SearchField) => {
        let result = false;
        if (Array.isArray(item.value)) {
          result = item.value.length > 0 || !!item.fromValue || !!item.toValue;
        } else if (item.operator === QueryType.ISNULL) {
          result = true;
        } else {
          //result = !_.isEmpty(item.value) || !!item.fromValue || !!item.toValue;
          result = item.value !== null || !!item.fromValue || !!item.toValue;
        }
        return result;
      })
      .map((item: SearchField) => {
        let val: any = item.value;
        if (item.keyProp) {
          val = item.keyValue || item.value;
        }
        if (typeof val === 'string') {
          val = val.trim();
        }
        if (item.operator === QueryType.IN && typeof val === 'string') {
          val = val.replace(/\r/gi, '').split('\n');
        }
        let dataType = item.dataType.toUpperCase() as DataType;
        dataType = item.keyProp ? DataType.LONG : dataType; // 存在keyProp转为long
        let queryType = Array.isArray(val) ? QueryType.IN : item.operator; // 查询类型
        if (Array.isArray(val)) {
          if ([DataType.DATETIME, DataType.DATE].indexOf(dataType) >= 0) {
            val = val.map((item) => moment(item).format('YYYY-MM-DD'));
            val[1] += ' 23:59:59';
            queryType = QueryType.BETWEEN;
          }
        }
        const data: QueryBo = {
          dataType: dataType,
          label: item.label,
          column: item.keyProp || item.prop,
          queryType: queryType,
          values: val?.toString(),
        };
        if (item.fromValue !== null && item.fromValue !== undefined) {
          data.fromValue = item.fromValue;
        }
        if (item.toValue) {
          data.toValue = item.toValue;
        }
        if (data.fromValue || data.toValue) {
          data.queryType = QueryType.BETWEEN;
          data.values = data.fromValue + ',' + data.toValue;
        }
        // 扩展字段
        if (item.isExpandField) {
          data.column = props.dataOptions.idField;
          data.queryType = QueryType.EXPANDFIELDS;
          data.extColumn = item.expandFieldName;
        }
        return data;
      });

    // 将自定义查询条件合并到高级查询中
    props.quickSearchFields.forEach((item: any) => {
      if (!item.value || (Array.isArray(item.value) && !item.value.length)) {
        return;
      }
      item.value = item.value?.toString().trim();

      if (typeof item.getWhere === 'function') {
        const queryBo: QueryBo = item.getWhere(item.value, proxy.$parent);

        if (queryBo) fields.push(queryBo);
      } else {
        fields.push(item);
      }
    });
    return fields;
  };

  /**
   * 获得快速查询条件
   * @param type
   * @returns
   */
  const getQuickWhere = (type?: any) => {
    let where: Array<QueryBo> = [];
    if (!quickSearch.value.fields.length) {
      if (type === 'quick') {
        proxy.$message.error('未设置快速查询字段！');
      }
      return where;
    }
    // 快速查询
    if (state.quickSearchValue && quickSearch.value.fields.length) {
      const val = state.quickSearchValue
        .trim()
        .replace(/\r|'|=| /gi, '')
        .replace(/\n/gi, ',');
      quickSearch.value.fields.forEach((item: any) => {
        let queryType = QueryType.EQ;
        if (state.quickSearchType === '多行') {
          queryType = QueryType.IN;
        } else if (state.quickSearchType === '模糊') {
          queryType = QueryType.LIKE;
        }
        where.push({
          column: item.prop,
          queryType: queryType,
          dataType: DataType.STRING,
          values: val,
          or: true,
        });
      });
    }

    // 以上条件作为整体子查询
    let parentWhere: Array<QueryBo> = [];
    if (where.length) {
      parentWhere.push({
        column: 'subQuery',
        queryType: QueryType.SUBQUERY,
        dataType: DataType.STRING,
        values: undefined,
        subQueryBo: where,
      });
    }
    return parentWhere;
  };

  /**
   * 获取全部查询条件
   * @returns
   */
  const getAllWhere = (): Array<QueryBo> => {
    // 高级查询条件
    let where = getWhere();
    // 合并快速查询条件
    let quitWhere = getQuickWhere();
    where = where.concat(quitWhere);
    // 合并tabNav查询条件
    if (Object.keys(state.tabNavWhere).length) {
      where = where.concat(state.tabNavWhere);
    }
    return where;
  };

  /**
   * 获得字段信息
   * @param fieldName
   * @returns
   */
  const getFieldInfo = (fieldName: string) => {
    // 字段信息
    return props.fields.find((item: any) => item.prop === fieldName);
  };

  return {
    loadData,
    loadDataServer,
    translate,
    reSelected,
    getWhere,
    getQuickWhere,
    getAllWhere,
    /**
     * 获得分页查询条件
     */
    getPageParams,
  };
}
