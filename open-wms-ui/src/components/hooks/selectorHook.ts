import { toRefs, reactive, onMounted, computed, getCurrentInstance, ComponentInternalInstance, onActivated, watch, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseHookParams, BaseProperties, EditorType, DataOptions } from '../../types/base-type';
import { getPageConfig, getPageList, postData } from '../../api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
import { BaseObject, DataType, PageListBo, QueryBo, QueryType, SearchField } from '/@/types/common';

import useAuthNode from '/@/stores/modules/authNode';
import to from 'await-to-js';
const dropdownStore = useDropdownStore();

const authNodeStore = useAuthNode();
interface CustomProperties extends BaseProperties {
  initCallBack(): any;
}

export default function selectorHook(props: any, baseParams?: BaseHookParams) {
  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy: CustomProperties;
  proxy = ins.proxy as CustomProperties;
  const route = useRoute();
  const router = useRouter();

  //#region 变量
  const state = reactive({
    // 加载数据初始化loading
    initLoading: false,
    // 刷新数据
    refreshLoading: false,
    // 初始化加载完成
    isLoadFinished: false,
    dataOptions: {
      idField: '',
      tableId: 0,
      vueDataId: 0,
      tableView: '',
      idValue: 0,
      menuId: 0,
      pageSize: 15,
      total: 0,
      pageIndex: 1,
      isLoaded: false,
      editorType: EditorType.UNKNOWN, // 编辑类型，弹出还是内嵌
      global_editorProhibitCloseOnClickModal: false, //编辑页面禁止通过点击空白处关闭对话框
      tableName: '',
      webRouter: '', // 当前路由
      prefixRouter: '', // 后端路由
      editorCheckCode: '', // editor当前实例校验码
      where: {},
      footerRows: [],
      fixedWhere: {},
    } as DataOptions,

    dataListOptions: {
      fields: <any>[],
      buttons: <any>[],
    },
    editorOptions: {
      config: {
        width: '1000px',
        top: '15vh',
      },
      fields: <any>[],
      buttons: <any>[],
    },
    // 列表选中项
    dataListSelections: [],
    // 权限点
    authNodes: {
      save: true,
    } as any,
    // 按钮是否只读
    btnReadOnly: {
      save: false,
      auditing: false,
      add: false,
      delete: false,
      stop: false,
      open: false,
    },
    isLoaded: false,
    // 配置参数
    sysConfig: {
      // 商品 - 不默认货主/供应商
      sku_noDefaultConsignorProvider: false,
      // 商品 - 货主/供应商后不可编辑
      sku_editConsignorProvider: false,
      // 库存 - 不默认货主/供应商
      sku_noDefaultConsignorProvider_storage: false,
      // 库存 - 货主/供应商后不可编辑
      sku_editConsignorProvider_storage: false,
    } as any,

    // 高级查询字段
    searchFields: [] as Array<SearchField>,
    dropdownLoaded: false, // 下拉框是否加载完毕
    selectorLoading: false, // 查询loading
    // 表单数据集合
    searchData: {} as any,
    // 数据集合
    dataList: [],
    // 显示字段属性对话框
    showAttrDialog: false,
    singleSignCodeVisible: false,
    snConfig: {
      productPosition_Id: 0,
      singleSignCode: '',
    },
    selectRuleRow: {} as any,
  });
  //#endregion

  // 初始化数据
  let init = async (callback?: Function) => {
    let router = props.config.router;
    if (baseParams?.custoJsonmRoute) {
      router = baseParams.custoJsonmRoute;
    }
    if (!router) {
      proxy.$message.error('未设置查询去的路由');
      return;
    }
    state.dataList = [];

    // 加载页面布局数据
    let jsonUrl = '/static' + router + '.json';
    let pageConfig = await getPageConfig(jsonUrl);
    if (pageConfig.status !== 200) {
      proxy.$message.error('加载json配置文件错误：' + pageConfig.statusText);
      return;
    }

    const uiParams = pageConfig.data;
    // 系统自动计算列宽
    uiParams.dataListOptions.fields.forEach((field: any) => {
      field.minWidth = field.minWidth || 80;
    });

    // 获得表格自定义设置，存储在本地localStorage
    let key = 'tableConfig_' + router;
    let fields = localStorage.getItem(key);
    if (fields) {
      fields = JSON.parse(fields);
      uiParams.dataListOptions.fields = fields;
    }

    // 加载权限
    await loadAuth(uiParams, callback);
    await search(); // 默认加载查询
  };

  // 加载权限
  let loadAuth = async (uiParams: any, callback?: Function) => {
    // 获得明细表
    let subTableViews = uiParams.editorOptions.fields.filter((item: any) => item.type === 'detail-grid').map((item: any) => item.subTableName);

    // 加载页面权限
    let params = {
      ...uiParams.dataOptions,
      // 根据原始名称找到用户自定义UI ID，名称优先于fromVueDataId
      tableTenantName: uiParams.dataOptions.tableTenantName,
      // 根据原始ID找到用户自定义UIID
      fromTableTenantId: uiParams.dataOptions.tableTenantId,
      subTableViews: subTableViews,
    };
    // 获取权限点、自定义参数、UI
    let res: any = await authNodeStore.loadAuthNode(params);
    state.authNodes = res.authNodes;
    // 自定义UI
    if (!res.global_closeUserUIJson && res.userUIJson && res.userUIJson.dataOptions) {
      state.dataOptions = res.userUIJson.dataOptions;
      state.dataListOptions = res.userUIJson.dataListOptions;
      state.editorOptions = res.userUIJson.editorOptions;
    } else {
      // 加载默认页面UI参数
      state.dataOptions = uiParams.dataOptions;
      state.dataListOptions = uiParams.dataListOptions;
      state.editorOptions = uiParams.editorOptions;
    }

    // 自定义全局开关参数参数
    state.dataOptions.global_editorProhibitCloseOnClickModal = !!res.global_editorProhibitCloseOnClickModal;
    // 自定义表名
    let tableName = proxy.$options.tableName;
    if (tableName) {
      state.dataOptions.tableName = tableName;
    }

    // 获得表格自定义设置
    let router = proxy.$route.fullPath;
    let key = 'tableConfig_' + router;
    let fields = localStorage.getItem(key);
    let _fields: Array<any> = [];
    if (fields) {
      _fields = JSON.parse(fields);
      state.dataListOptions.fields = _fields;
    }
    // 开启全局数据排序
    if (res.global_openSortable) {
      state.dataListOptions.fields.forEach((item: any) => {
        const f = _fields.find((r) => r.prop === item.prop);
        if (item.prop === '_action') {
          item.sortable = false;
        } else {
          if (f) {
            item.sortable = f.sortable;
          } else {
            item.sortable = true;
          }
        }
      });
    }

    // 合并自定义设置
    setUserJson(res);

    // 自定义函数，用于处理数据
    let _init = baseParams?.init;
    if (typeof _init === 'function') {
      _init();
    }
    // 自定义函数，用于权限
    let doAuth = baseParams?.doAuth;
    if (typeof doAuth === 'function') {
      doAuth();
    }
    // 优先加载下拉框，然后在加载数据
    await dropdownStore.loadDropDown({
      dataListOptions: state.dataListOptions,
      dataOptions: state.dataOptions,
      editorOptions: state.editorOptions,
    });

    if (typeof callback === 'function') {
      callback();
    }
  };

  // 合并自定义设置
  let setUserJson = (res: any) => {
    const userJson = res.userJson;
    // 查找明细字段
    let _findEditorField = function (array: Array<any>, prop: string) {
      for (const item of array) {
        if (item.type === 'grid') {
          for (const colItem of item.columns) {
            const _field: any = _findEditorField(colItem.fields, prop);
            if (_field) return _field;
          }
        } else if (item.type === 'inline-group') {
          const _field: any = _findEditorField(item.fields, prop);
          if (_field) return _field;
        } else if (item.type === 'detail-grid') {
          const _field: any = _findEditorField(item.fields, prop);
          if (_field) return _field;
        } else {
          if (item.options && item.options.prop === prop) {
            return item;
          }
        }
      }
    };
    if (userJson && userJson.fields) {
      // 存在自定义排序
      let hasSortNo = false;
      userJson.fields.forEach((field: any) => {
        // 列表页面
        const _field = state.dataListOptions.fields.find((f: any) => f.prop === field.prop);
        if (_field) {
          if (field.sortNo) {
            _field.sortNo = field.sortNo;
            hasSortNo = true;
          }
          if (field.label) {
            _field.label = field.label;
          }
          if (field.width) {
            _field.width = field.width;
          }
        }
        // 编辑页面
        const _fieldEditor = _findEditorField(state.editorOptions.fields, field.prop);
        if (_fieldEditor) {
          if (field.label) {
            _fieldEditor.label = field.label;
          }
          if (field.blank !== undefined) {
            _fieldEditor.options.required = !field.blank;
            if (_fieldEditor.rules) {
              const rule = _fieldEditor.rules.find((item: any) => item.required);
              if (rule) {
                rule.required = !field.blank;
              }
            }
          }
        }
      });
      // 列表进行排序
      if (hasSortNo) {
        state.dataListOptions.fields.sort((a: any, b: any) => {
          return (a.sortNo || 0) > (b.sortNo || 0) ? -1 : 1;
        });
      }
    }

    // 系统自动计算列宽
    state.dataListOptions.fields.forEach((field: any) => {
      let width = 80;
      if (field.label) {
        const _width = 16 * field.label.length;
        if (_width > width) {
          width = _width;
        }
      }
      // 开启全局数据排序
      if (res.global_openSortable) {
        width += 25;
      }
      if (field.remark) {
        width += 20;
      } else if (field.prop === 'batchNumber') {
        // 批次号
        if (width < 200) width = 200;
      }
      if (width > field.width || !field.width) {
        field.minWidth = width;
        delete field.width;
      }
    });

    // 获得明细表
    let subTableViews = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');

    // 明细字段处理
    const subUserJsons = res.subUserJsons;
    subUserJsons.forEach((item: any) => {
      const userJson = item.userJson;
      const subFields = subTableViews.find((row: any) => row.subTableName === item.subTableName).fields;
      if (userJson && userJson.fields) {
        // 存在自定义排序
        let hasSortNo = false;
        userJson.fields.forEach((field: any) => {
          // 明细列表
          const _field = subFields.find((f: any) => f.prop === field.prop);
          if (_field) {
            if (field.sortNo) {
              _field.sortNo = field.sortNo;
              hasSortNo = true;
            }
            if (field.label) {
              _field.label = field.label;
            }
            if (field.width) {
              _field.width = field.width;
            }
          }
        });
        // 列表进行排序
        if (hasSortNo) {
          subFields.sort((a: any, b: any) => {
            return (a.sortNo || 0) > (b.sortNo || 0) ? -1 : 1;
          });
        }
      }
    });
  };

  /**
   * 翻译下拉框值
   */
  const translateText = (prop: any, val: any, dropdownId: any, col: any) => {
    if (col && col.options) {
      if (col.options.remote === 'bindDropdown') {
        const _dropdown_Id = col.options.dropdownId;
        if (_dropdown_Id > 0) {
          dropdownId = _dropdown_Id;
        }
        const ddList = dropdownStore.getDropdown(dropdownId);
        if (!ddList) return val;
        const item = ddList.value.find((item: any) => {
          return item.value === val;
        });
        if (!item) return val;
        return item.label;
      } else if (col.options.remote === false) {
        const ddList = col.options.options;
        if (!ddList) return val;
        const item = ddList.find((item: any) => {
          return item.value === val;
        });
        if (!item) return val;
        return item.label;
      } else {
        return val;
      }
    } else {
      const ddList = dropdownStore.getDropdown(dropdownId);
      if (!ddList) return val;
      const item = ddList.value.find((item: any) => {
        return item.value === val;
      });
      if (!item) return val;
      return item.label;
    }
  };

  // 设置查询条件值
  const setSearchValue = (prop: any, value: any) => {
    if (['storageId', 'storageName', 'consignorId', 'consignorCode', 'consignorName', 'providerId', 'providerCode', 'providerShortName'].indexOf(prop) >= 0) {
      if (props.config.title === '商品选择器') {
        // 系统参数sku_autoDefaultConsignorProvider开启，自动默认值
        if (!state.sysConfig.sku_noDefaultConsignorProvider) {
          state.searchData[prop] = value;
        }
      } else if (props.config.title === '商品库存选择器') {
        // 系统参数sku_noDefaultConsignorProvider_storage开启，自动默认值
        if (!state.sysConfig.sku_noDefaultConsignorProvider_storage) {
          state.searchData[prop] = value;
        }
      } else {
        state.searchData[prop] = value;
      }
    } else {
      state.searchData[prop] = value;
    }
  };
  // 设置为只读
  const setReadOnly = (fieldName: any, disabled: any) => {
    const fieldInfo = state.editorOptions.fields.find((item: any) => item.options.prop === fieldName);
    if (['storageName', 'consignorName', 'providerShortName'].indexOf(fieldName) >= 0) {
      if (props.config.title === '商品选择器') {
        // 系统参数sku_editConsignorProvider开启，可编辑筛选框
        if (fieldInfo && !state.sysConfig.sku_editConsignorProvider) {
          fieldInfo.options.disabled = disabled;
        }
      } else if (props.config.title === '商品库存选择器') {
        // 系统参数sku_editConsignorProvider_storage开启，可编辑筛选框
        if (fieldInfo && !state.sysConfig.sku_editConsignorProvider_storage) {
          fieldInfo.options.disabled = disabled;
        }
      } else {
        if (fieldInfo) {
          fieldInfo.options.disabled = disabled;
        }
      }
    } else {
      if (fieldInfo) {
        fieldInfo.options.disabled = disabled;
      }
    }
  };
  /**
   * 计算求和
   */
  const getSummaries = (params: any) => {
    let { columns, data } = params;
    const sums = [];
    // 求和字段
    let sumColumnNames = state.dataListOptions.fields
      .filter((item: any) => {
        return item.isSum;
      })
      .map((item: any) => {
        return item.prop;
      });

    sums[0] = '';
    sums[1] = '和计';
    state.dataListOptions.fields
      .filter((item: any) => {
        return !item.hidden;
      })
      .forEach((field: any, index: number) => {
        let footerRows = state.dataOptions.footerRows;
        if (sumColumnNames.indexOf(field.prop) >= 0 && footerRows && footerRows.length) {
          let footerRow = footerRows[0];
          sums[index + 2] = footerRow[field.prop];
        } else {
          sums[index + 2] = '';
        }
      });

    return sums;
  };

  // 获得快速查询条件
  const getWhere = (): Array<QueryBo> => {
    let where: Array<QueryBo> = [];
    Object.keys(state.searchData).forEach((field) => {
      let val = state.searchData[field];
      let propInfo = state.editorOptions.fields.find((item: any) => {
        return item.options.prop === field;
      });
      if (!propInfo) {
        // state.$message.error(field + "未设置为查询条件");
        return;
      }
      if ((!Array.isArray(val) && val) || (Array.isArray(val) && val.length)) {
        if (propInfo.options.keyProp) {
          field = propInfo.options.keyProp;
          val = state.searchData[field]; // 重新获取keyProp的值
          where.push({
            column: field,
            values: val,
            queryType: QueryType.EQ,
            dataType: DataType.LONG,
          });
        } else if (propInfo.type === 'select') {
          if (Array.isArray(val)) {
            where.push({
              column: field,
              values: val.join(','),
              queryType: QueryType.IN,
              dataType: DataType.STRING,
            });
          } else {
            where.push({
              column: field,
              values: val,
              queryType: QueryType.EQ,
              dataType: DataType.STRING,
            });
          }
        } else if (propInfo.type === 'tree') {
          where.push({
            column: field,
            values: state.searchData.typeId,
            queryType: QueryType.TREE,
            dataType: DataType.STRING,
          });
        } else {
          if (val === '>0') {
            where.push({
              column: field,
              values: 0,
              queryType: QueryType.GT,
              dataType: DataType.DOUBLE,
            });
          } else if (val === '>=0') {
            where.push({
              column: field,
              values: 0,
              queryType: QueryType.GE,
              dataType: DataType.DOUBLE,
            });
          } else if (val === '=0') {
            where.push({
              column: field,
              values: 0,
              queryType: QueryType.EQ,
              dataType: DataType.INT,
            });
          } else {
            where.push({
              column: field,
              values: val,
              queryType: QueryType.LIKE,
              dataType: DataType.STRING,
            });
          }
        }
      }
    });
    // 固定查询条件
    if (props.config.fixedWhere) {
      Object.keys(props.config.fixedWhere).forEach((key) => {
        let item = props.config.fixedWhere[key];
        let queryType = QueryType.EQ;
        let dataType = DataType.STRING;
        if (typeof item === 'object') {
          queryType = item.operator;
          item = item.value;
        }
        if (proxy.common.isNumber(item)) {
          dataType = DataType.BIGDECIMAL;
        }
        where.push({
          column: key,
          dataType: dataType,
          queryType: queryType,
          values: item,
        });
      });
    }
    // 获得自定义条件
    let customWhere = props.getCustomWhere();
    if (customWhere) {
      where = Object.assign(where, customWhere);
    }

    return where;
  };

  /**
   * 加载数据
   * @param callback 回调函数
   */
  const loadData = async (callback?: Function) => {
    const where = getWhere();
    await loadDataServer(where, callback);
  };

  /**
   * 重新服务器上加载数据
   * @param where
   * @param callback
   * @returns
   */
  const loadDataServer = async (queryBoList: Array<QueryBo>, callback?: Function) => {
    if (props.config.fixedWhere) {
      state.dataOptions.fixedWhere = props.config.fixedWhere;
    }
    var sumColumnNames = state.dataListOptions.fields
      .filter((item: any) => {
        return item.isSum;
      })
      .map((item: any) => {
        return {
          prop: item.prop,
          isExpandField: item.isExpandField,
          expandFieldName: item.expandFieldName || 'expandFields',
        };
      });
    if (!state.dataOptions || !state.dataOptions.tableName) {
      return;
    }

    // 排序字段
    let orderByColumn: Array<string> = [];
    let orderBy: Array<string> = [];
    let _orderBy: any = state.dataOptions.orderBy;
    if (_orderBy) {
      Object.keys(_orderBy).forEach((key) => {
        orderByColumn.push(key);
        orderBy.push(_orderBy[key].toLowerCase());
      });
    } else {
      orderByColumn.push(state.dataOptions.idField);
      orderBy.push('ASC');
    }

    let pageParams: PageListBo = {
      menuId: state.dataOptions.menuId,
      prefixRouter: state.dataOptions.prefixRouter,
      tableName: state.dataOptions.tableName,
      pageIndex: state.dataOptions.pageIndex,
      pageSize: state.dataOptions.pageSize,
      orderByColumn: orderByColumn.join(','),
      isAsc: orderBy.join(','),
      sumColumnNames: sumColumnNames,
      queryBoList: queryBoList,
      listMethod: state.dataOptions.listMethod,
    };

    // 加载前事件
    if (props.loadDataBefore(pageParams, state.searchFields) === false) {
      return;
    }
    state.initLoading = true;
    state.refreshLoading = true;

    let resResult = await getPageList(pageParams);
    if (resResult.result) {
      props.onTranslate(resResult.rows); // 自定义数据转换事件
      state.dataList = resResult.rows;
      translate(state.dataList); // 内部默认数据转换
      if (state.dataOptions.script) {
        try {
          state.dataList.forEach(() => {
            if (state.dataOptions.script) eval(state.dataOptions.script);
          });
        } catch (error: any) {
          proxy.$message.error(`加载数据执行脚本错误：${error.message}`);
        }
      }
      state.dataOptions.total = resResult.total;
      state.dataOptions.footerRows = resResult.footer;
    } else {
      proxy.common.showMsg(resResult);
    }
    state.initLoading = false;
    state.refreshLoading = false;
    state.isLoadFinished = true;
    if (typeof callback === 'function') {
      callback(resResult);
    }

    // 库存监测记录中，跳转打开详情页面
    if (proxy.$route.query.showdetail === 'true') {
      const id = proxy.$route.query.id;

      if (id) {
        const ref = proxy.$parent.$refs[props.editorRefName];
        ref.editData(id);
      }
    }

    proxy.mittBus.emit('on-load-data-after', state.dataList);
  };

  // 数据转换
  const translate = (rows: Array<any>) => {
    for (const row of rows) {
      state.dataListOptions.fields.forEach((field: any) => {
        var prop = field.prop;
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

  // 表格行号
  const getIndex = (index: number) => {
    return (state.dataOptions.pageIndex - 1) * state.dataOptions.pageSize + index + 1;
  };

  // 获得配置参数
  const getConfig = async () => {
    let keys = Object.keys(state.sysConfig).join(',');
    let url = '/system/core/config/getConfigValues';
    let params = {
      keys: keys,
    };
    let header = {
      repeatSubmit: false, // 允许重复加载
    };
    let [err, res] = await to(postData(url, params, header));
    if (err) {
      return;
    }
    if (res?.result) {
      // 获得参数值列表，将数字转换为对象
      res.data.forEach((item: any) => {
        let configKey = item.configKey; // 字段名称
        let configValue = item.configValue;

        if (proxy.common.isNumber(item.configValue)) {
          configValue = parseInt(item.configValue);
        }
        state.sysConfig[configKey] = !!configValue;
      });
    }
  };

  const singleSignCodeRule = (row: any) => {
    state.singleSignCodeVisible = true;
    state.selectRuleRow = row;
    const sn = state.selectRuleRow['singleSignCode'];
    let snList = [];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item: any) => item); // 有效SN
    validSnList = validSnList.map((item: any) => item.trim());
    validSnList.push('');

    state.snConfig.singleSignCode = validSnList.join('\n');
    state.snConfig.productPosition_Id = state.selectRuleRow['productPosition_Id'];
  };

  // 重置
  const reset = () => {
    Object.keys(state.searchData).forEach((key) => {
      let propInfo = state.editorOptions.fields.find((item: any) => {
        return item.options.prop === key;
      });
      // disabled=true的不清除
      if (!propInfo || propInfo.options.disabled) {
        return false;
      }
      if (propInfo.type === 'select') {
        if (Array.isArray(state.searchData[key])) {
          state.searchData[key] = [];
        } else {
          state.searchData[key] = null;
        }
      } else {
        state.searchData[key] = null;
      }
    });
  };

  // 点击#显示字段信息
  const headerClick = (column: any, event: any) => {
    if (event.target && event.target.innerText === '#') {
      state.showAttrDialog = true;
    }
  };

  // 加载初始化默认值
  const initDefaultValue = () => {
    state.editorOptions.fields.forEach((item: any) => {
      if (!item.options.defaultValue) return;
      const prop = item.options.prop;

      if (Array.isArray(item.options.defaultValue)) {
        state.searchData[prop] = item.options.defaultValue;
      } else {
        if (item.type === 'select') {
          if (item.options && item.options.multiple) {
            state.searchData[prop] = [item.options.defaultValue];
          } else {
            state.searchData[prop] = item.options.defaultValue;
          }
        } else {
          state.searchData[prop] = item.options.defaultValue;
        }
      }
    });
  };
  // 搜索查询
  const search = () => {
    state.dataOptions.pageIndex = 1;
    loadData();
  };

  // 页面加载完后事件
  onMounted(async () => {
    await getConfig(); // 获取配置参数
    if (!state.isLoaded) {
      state.isLoaded = true;
      await init();
    }
  });

  return {
    baseState: state,
    translateText,

    /**
     * 开始查询
     */
    search,
    /**
     * 获得快速查询条件
     */
    getWhere,
    loadData,
    getIndex,
    /**
     * 计算求和
     */
    getSummaries,
    /**
     * 设置查询条件值
     */
    setSearchValue,
    getConfig,
    reset,
    headerClick,
    singleSignCodeRule,
    init,
    /**
     * 设置为只读
     */
    setReadOnly,
  };
}
