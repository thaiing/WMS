import { toRefs, reactive, onMounted, computed, getCurrentInstance, ComponentInternalInstance, onActivated, watch, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BaseHookParams, BaseProperties, EditorType, DetailField, DataOptions, DataListRef, EditorRef, BtnReadOnly } from '../../types/base-type';
import { getPageConfig, postData } from '../../api/common/baseApi';
import useDropdownStore from '/@/stores/modules/dropdown';
import useAuthNode from '/@/stores/modules/authNode';
import to from 'await-to-js';
import { DetailInfo } from '/@/api/types';
const dropdownStore = useDropdownStore();
const authNodeStore = useAuthNode();
export declare const YrtDataList: import('element-plus/es/utils').SFCWithInstall<
  import('vue').DefineComponent<{
    /**
     * @description 加载数据
     */
    loadData: (callback?: Function | undefined) => Promise<void>;
  }>
>;
interface CustomProperties extends BaseProperties {
  initCallBack(): any;
}

export default function baseHook(baseParams?: BaseHookParams) {
  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy: CustomProperties;
  proxy = ins.proxy as CustomProperties;
  const route = useRoute();
  const router = useRouter();

  //#region 变量
  const state = reactive({
    // 配置参数
    config: {} as EmptyObjectType,
    dataOptions: {
      idField: '',
      idValue: 0,
      menuId: 0,
      menuName: '',
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
    } as DataOptions,

    dataListOptions: {
      fields: <any>[],
      buttons: [],
    },
    editorOptions: {
      config: {} as any,
      fields: <any>[],
      buttons: <any>[],
    },
    // 列表选中项
    dataListSelections: [] as any[],
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
      sortingRegularAdd: false,
      confirm: false,
    } as BtnReadOnly,
    isLoaded: false,
    /**
     * 显示列表页面
     */
    showPageList: true,
    /**
     * 实例编辑页面
     */
    editorInfo: {
      refName: proxy.common.getGUID(),
      action: 'add',
      visible: false,
    },
    /**
     * 审核流程对话框
     */
    flowVisible: false,
    /**
     * 审核流单据数据对象
     */
    billInfo: {
      menuId: 0,
      menuName: '' as string | undefined,
      billId: 0,
      billCode: '',
    },
  });
  //#endregion

  //#region 计算属性
  //组件后缀名
  const subName = computed(() => {
    let name = proxy.$options.name;
    if (name) name = '-' + name;
    return name;
  });
  // 当前激活编辑ref
  const editorRefName = computed(() => {
    let refName = String(state.editorInfo?.refName || 0);
    return refName;
  });
  // 列表页ref
  const dataListRefName = computed(() => {
    return 'data-list' + subName.value;
  });
  // 编辑对话框组件
  const editorRef = computed(() => {
    let refName = state.editorInfo?.refName || '';
    let ref = proxy.$refs[refName] as EditorRef;
    return ref;
  });
  // 列表组件
  const dataListRef = computed(() => {
    return proxy.$refs[dataListRefName.value] as DataListRef;
  });
  // 编辑主表数据
  const masterData = computed(() => {
    return editorRef.value.editorVo.master;
  });
  // 编辑明细表数据1
  const detailRows = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 0) return [];

    const subTableName = proxy.common.toCamelCase(details[0].subTableName);
    let detailList = editorRef.value.editorVo.detailList;
    if (detailList) {
      let detail = detailList.find((item) => proxy.common.toCamelCase(item.subTableName) == subTableName);
      if (!detail) return [];
      return detail.rows;
    } else {
      return [];
    }
  });
  // 编辑明细表数据2
  const detailRows2 = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 1) return [];

    const subTableName = proxy.common.toCamelCase(details[1].subTableName);
    let detailList = editorRef.value.editorVo.detailList;
    if (detailList) {
      let detail = detailList.find((item) => proxy.common.toCamelCase(item.subTableName) == subTableName);
      if (!detail) return [];
      return detail.rows;
    } else {
      return [];
    }
  });
  // 编辑明细表数据3
  const detailRows3 = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 2) return [];

    const subTableName = proxy.common.toCamelCase(details[2].subTableName);
    let detailList = editorRef.value.editorVo.detailList;
    if (detailList) {
      let detail = detailList.find((item) => proxy.common.toCamelCase(item.subTableName) == subTableName);
      if (!detail) return [];
      return detail.rows;
    } else {
      return [];
    }
  });

  // 编辑明细表数据4
  const detailRows4 = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 3) return [];

    const subTableName = proxy.common.toCamelCase(details[3].subTableName);
    let detailList = editorRef.value.editorVo.detailList;
    if (detailList) {
      let detail = detailList.find((item) => proxy.common.toCamelCase(item.subTableName) == subTableName);
      if (!detail) return [];
      return detail.rows;
    } else {
      return [];
    }
  });

  // 编辑明细表数据5
  const detailRows5 = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 4) return [];

    const subTableName = proxy.common.toCamelCase(details[4].subTableName);
    let detailList = editorRef.value.editorVo.detailList;
    if (detailList) {
      let detail = detailList.find((item) => proxy.common.toCamelCase(item.subTableName) == subTableName);
      if (!detail) return [];
      return detail.rows;
    } else {
      return [];
    }
  });
  // 编辑明细表信息1
  const detailInfo = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 0) return null;

    return details[0];
  });
  // 编辑明细表信息2
  const detailInfo2 = computed(() => {
    let details = state.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    if (details.length <= 0) return null;

    return details[1];
  });
  //#endregion

  //#region 方法
  let methods = {
    /**
     * 获得配置参数
     */
    async getConfig() {
      if (!baseParams?.config?.value) return;

      let keys = Object.keys(baseParams.config.value).join(',');
      if (!keys) return;

      let url = '/system/core/config/getConfigValues';
      let params = {
        keys: keys,
      };
      let [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      if (res?.result) {
        // 获得参数值列表，将数字转换为对象
        res.data.forEach((item: any) => {
          let configKey = item.configKey; // 字段名称
          let configValue = item.configValue;

          if (typeof baseParams?.doData === 'function') {
            baseParams.doData(item, baseParams);
          } else {
            if (proxy.common.isNumber(item.configValue)) {
              configValue = parseInt(item.configValue);
            }
            baseParams!.config!.value[configKey] = !!configValue;
          }
        });
        state.config = baseParams.config.value;
      }
    },
    /**
     * 列表工具栏点击事件
     */
    buttonClick(authNode: string) {},

    /**
     * 明细工具栏点击事件
     * @authNode 权限点名
     * @detail 明细表信息
     * @btnOpts 按钮参数
     * 返回参数：返回true将不执行默认方法
     */
    detailButtonClick(authNode: string, detail: any, btnOpts: any) {},

    // 连接弹出对话框编辑器
    linkEditor(id: any, row?: any) {
      openEditor(id, row);
    },
    // 将图片字符串转为数组
    getPicList: (pics: any) => {
      if (proxy.common.isJSON(pics)) {
        return JSON.parse(pics).map((m: any) => m.url);
      } else {
        let picList = pics ? pics.split(',') : [];
        return picList;
      }
    },
    // 显示小图
    showSmallPic: (pic: any) => {
      let url = '';
      if (proxy.common.isJSON(pic)) {
        url = pic.url;
      } else if (pic) {
        url = pic;
      }

      // 已经是缩略图直接返回
      if (url && url.indexOf('/thumb/') > 0) {
        return url;
      }

      // 使用缩略图
      let urls = url.split('/');
      let name = urls[urls.length - 1];
      url = url.replace(name, 'thumb/' + name);

      return url;
    },
    isPicUrl: (url: string) => {
      if (!url) return false;

      let pics = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];
      let extName = url.substring(url.lastIndexOf('.'));
      return pics.indexOf(extName) >= 0;
    },
    /**
     * 通用弹窗确认提交到后端
     * @param url 后端url
     * @param comfirmText 确认提示文本内容
     * @returns
     */
    commonSubmit: (url: string, comfirmText: string, callback?: Function) => {
      let selectInfos: Array<any> = state.dataListSelections;
      if (!selectInfos.length) {
        proxy.$message.error('至少选择一项操作');
        return;
      }

      ElMessageBox.confirm(comfirmText, '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          url = url + '/' + selectInfos.map((item) => item[state.dataOptions.idField]).join(',');
          const [err, res] = await to(postData(url, {}));
          if (err) {
            return;
          }

          proxy.common.showMsg(res);
          if (res.result) {
            await dataListRef.value.loadData();
            if (typeof callback === 'function') callback();
          }
        })
        .catch(() => {});
    },
  };

  // 初始化数据
  let init = async (callback?: Function) => {
    let router = proxy.$route.path;
    if (baseParams?.custoJsonmRoute) {
      router = baseParams.custoJsonmRoute;
    }

    // 加载页面布局数据
    let jsonUrl = '/static' + router + '.json';
    let pageConfig = await getPageConfig(jsonUrl);
    if (pageConfig.status !== 200) {
      proxy.$message.error('加载json配置文件错误：' + pageConfig.statusText);
      return;
    }

    const uiParams = pageConfig.data;
    // 系统自动计算列宽
    // uiParams.dataListOptions.fields.forEach((field: any) => {
    // 	field.minWidth = field.minWidth || 80;
    // });

    // 获得表格自定义设置，存储在本地localStorage
    let key = 'tableConfig_' + router;
    let fields = localStorage.getItem(key);
    if (fields) {
      fields = JSON.parse(fields);
      uiParams.dataListOptions.fields = fields;
    }

    // 加载权限
    await loadAuth(uiParams, callback);
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
      await _init();
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
    // 加载配置参数
    await methods.getConfig();
    // 加载列表数据
    if (dataListRef.value) dataListRef.value.loadData();

    if (typeof callback === 'function') {
      callback();
    }
  };

  // 初始化回调函数
  let initCallBack = () => {
    if (state.dataOptions.webRouter === route.path) {
      if ([EditorType.INNER, EditorType.SINGLE, EditorType.DIALOG].indexOf(state.dataOptions.editorType) >= 0) {
        // 获取页面类型
        let idString = router.currentRoute.value.query.id as string;
        if (idString === undefined) {
          return;
        }

        let id = Number(idString);
        // 嵌入编辑
        if (id > 0) {
          openEditor(id);
        } else {
          let editorRef = state.editorInfo;
          let refName = editorRef?.refName || '';
          let refs = proxy.$refs[refName];
          if (refs && refs.length) {
            proxy.$nextTick(() => {
              refs.addData();
            });
          }
        }
      }
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
      if (field.label && !field.width) {
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
      // 没有自定义宽度时，自动计算
      if (!field.width) {
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

  let openEditor = (id: number, rowData?: any) => {
    // 监听编辑页面打开
    let refName: string = state.editorInfo.refName;

    proxy.$nextTick(() => {
      let editorRefName = proxy.$refs[refName];
      if (editorRefName) {
        editorRefName.loadEditData(id, rowData); // 进入到编辑器中加载数据
      }
    });
  };
  //#endregion

  //#region 编辑页面事件
  let eventMethods = {
    /**
     * 主表改变事件
     * @ref ref引用
     * @val 当前变值
     * @field 字段信息
     * @master 主表数据
     */
    onChange: (ref: any, val: any, field: DetailField, master: any) => {},

    /**
     * 主表改变事件
     * @ref ref引用
     * @val 当前变值
     * @field 字段信息
     * @master 主表数据
     */
    onRowChange: (ref: any, val: any, field: DetailField, master: any) => {},

    /**
     * 明细改变事件
     * @ref 主表数据
     * @val 当前变值
     * @row 当前行数据
     * @field 字段信息
     * @detailRows 明细数据集合
     */
    onDetailChange: (ref: any, val: any, row: any, field: any, detailRows: Array<any>) => {},

    /**
     * 编辑页面加载前事件
     * @master 主表数据
     */
    onEditLoadBefore: (master: any) => {},

    /**
     * 编辑页面加载后事件
     * @master 主表数据
     */
    onEditLoadAfter: (master: any) => {},

    /**
     * 保存前事件
     * @master 主表数据
     * 返回true，可以提交保存；返回false，将阻止提交
     */
    onSaveBefore: (master: any) => {
      return true;
    },

    /**
     * 删除前事件
     * @dataOptions dataOptions
     * @rows 要删除的数据
     * 返回true，可以提交保存；返回false，将阻止提交
     */
    onDeleteBefore(dataOptions: any, rows: any) {},

    /**
     * 字段Focus事件
     * @ref 输入框ref
     * @val 输入框值
     * @event event事件
     * @field 字段信息
     */
    onFocus: (ref: any, val: any, event: any, field: any) => {},

    /**
     * 失去焦点
     * @ref 输入框ref
     * @val 输入框值
     * @event event事件
     * @field 字段信息
     */
    onBlur: (ref: any, val: any, event: any, field: any) => {},

    /**
     * 保持后事件
     * @master 主表数据
     */
    onSaveAfter: (master: any) => {},

    /**
     * 新建保存后
     * @master 主表数据
     */
    onAddLoadAfter: (master: any) => {},

    /**
     * 明细删除前事件
     * @param master
     */
    onDetailDeleteBefore: (deletedRows: Array<any>, detailInfo: DetailInfo) => {},

    /**
     * 明细删除后事件
     * @param master
     */
    onDetailDeleteAfter: (deletedRows: Array<any>, detailInfo: DetailInfo) => {},

    /**
     * 主表表格下拉框行点击
     * @detailRow 明细当前行数据对象
     */
    onRowClick: (ref: any, val: any, field: any, master: any) => {},

    /**
     * 明细行点击
     * @row 明细当前行数据对象
     * @field 字段
     * @colum 当前列信息
     * @event 事件
     * @fields 所有列信息
     * @master 主表数据
     */
    onDetailRowClick: (row: any, column: any, event: Event, fields: any, master: any) => {},

    /**
     * 明细下拉框远程加载
     * @query 查询关键词
     * @row 当前行数据
     * @col 当前列属性
     */
    detailRemoteMethod: (query: string, row: any, col: any) => {},
    /**
     * 下拉框远程加载
     * @query 查询关键词
     * @row 当前行数据
     * @col 当前列属性
     */
    dataRemoteMethod: (query: string, col: any) => {},
  };
  //#endregion

  onActivated(() => {
    initCallBack();
  });

  onMounted(async () => {
    // 监听新建事件
    proxy.mittBus.on('onAdd', (params: any) => {
      let { editorRefName, index } = params;
      if (state.dataOptions.webRouter === route.path) {
        let refName = state.editorInfo.refName;
        let refs = proxy.$refs[refName];
        if (refs) {
          refs.addData({ editorRefName, index });
        }
      }
    });
    // 监听编辑页面打开
    proxy.mittBus.on('onOpenEditor', (params: any) => {
      let { id, rowData, editorCheckCode } = params;
      let fullPath = proxy.$route.fullPath;

      if (!baseParams?.parentRoute && state.dataOptions.editorCheckCode === editorCheckCode && fullPath === state.dataOptions.webRouter) {
        openEditor(id, rowData);
      }
    });
    if (!state.isLoaded) {
      state.isLoaded = true;
      await init(initCallBack);
    }
    console.log('layout ------ mounted');
  });

  watch(
    () => router.currentRoute.value.query,
    (newPath, oldPath) => {
      if (!oldPath) {
        return;
      }
    },
    { immediate: true }
  );

  return {
    baseState: state,
    subName,
    editorInfo: state.editorInfo,
    editorRefName,
    dataListRefName,
    detailRows,
    /**
     * 编辑器ref
     */
    editorRef,
    /**
     * 列表ref
     */
    dataListRef,
    masterData,
    detailRows2,
    detailRows3,
    detailRows4,
    detailRows5,
    detailInfo,
    detailInfo2,

    ...methods,
    ...eventMethods,
  };
}
