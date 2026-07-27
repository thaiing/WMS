import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '../../types/base-type';
import listLoadHook, { ListLoadOptions } from './listLoadHook';
import { ResultInfo } from '/@/types/base-type';
import useDropdownStore from '/@/stores/modules/dropdown';
import { DataType, QueryType } from '/@/types/common';
import { auditingEditor, reAuditingEditor, postData, removeData } from '/@/api/common/baseApi';
import { DeleteBo, SaveEditorBo } from '/@/api/types';
import to from 'await-to-js';
const dropdownStore = useDropdownStore();

/**
 * 数据加载函数
 * @param options 加载参数
 * @returns
 */
export default function actionHook(options: ListLoadOptions) {
  const { props, currentData, state, quickSearch, currentDataListSelections, currentFields, events } = options;
  const myHook = listLoadHook({ props, currentData, state, quickSearch, currentDataListSelections, currentFields, events });

  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy: BaseProperties;
  proxy = ins.proxy as BaseProperties;

  //#region 方法
  /**
   * 保存表格列参数设置
   */
  const saveTableConfig = () => {
    state.showSetDialog = false;
    let json = JSON.stringify(currentFields.value);
    let router = proxy.$route.fullPath;
    let key = 'tableConfig_' + router;
    localStorage.setItem(key, json);
    proxy.$message.success('保存成功！');
  };

  /**
   * 还原表格列参数设置
   */
  const resetTableConfig = () => {
    state.showSetDialog = false;
    let router = proxy.$route.fullPath;
    let key = 'tableConfig_' + router;
    localStorage.removeItem(key);
    proxy.$message.success('还原成功，请刷新页面！');
  };

  // 获得快速查询字段提示Placeholder
  const getQuickSearchPlaceolder = () => {
    let label = '';
    props.fields
      .filter((item: any) => {
        return item.isQuickSearch === true;
      })
      .forEach((v: any) => {
        if (label) label += '/';
        label += v.label;
      });
    if (!label) label = '没用可用查询字段';
    else label = '请输入' + label;
    return label;
  };

  /**
   * 行数据操作事件
   * @param btnInfo
   * @param colInfo
   * @param rowData
   * @returns
   */
  const onRowActionClick = (btnInfo: any, colInfo: any, rowData: any) => {
    const id = rowData[props.dataOptions.idField];
    let result = null;
    if (btnInfo.onClick) {
      result = btnInfo.onClick(btnInfo, rowData, colInfo);
    }
    if (result !== undefined && result !== null) {
      return;
    }
    switch (btnInfo.action) {
      case 'modify':
        linkEditor(id, rowData);
        break;
      case 'delete':
        deleteData([rowData]);
        break;
      case 'batchStop':
        batchStop([rowData]);
        break;
      default:
        proxy.$message.warning('未定义行数据操作事件');
        break;
    }
  };
  // 删除数据
  const deleteData = (rows: Array<any>, callback?: Function) => {
    // 删除前事件
    const reValue = props.onDeleteBefore(props.dataOptions, rows);
    if (reValue === false) return;

    let isAuditing = false;
    if (Array.isArray(rows)) {
      rows.forEach((item: any) => {
        if (item.auditing === 2) {
          proxy.$message.error('已审核的数据不允许删除');
          isAuditing = true;
        }
      });
    }
    if (isAuditing) return;

    let deletedIDs = rows;
    if (Array.isArray(rows)) {
      deletedIDs = rows.map((item: any) => {
        return item[props.dataOptions.idField];
      });
    } else {
      proxy.$message.error('删除数据无效！');
      return;
    }
    if (!deletedIDs.length) {
      proxy.$message.error('至少选择一项进行删除操作');
      return;
    }
    proxy
      .$confirm('此操作将永久删除选中的数据, 是否继续?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        //不添加异步，因为 后台做重写删除事件如果 throw 会提示下面的 已取消删除
        _delete();
      })
      .catch(() => {
        proxy.$message.info('已取消删除');
      });

    const _delete = async () => {
      let params: DeleteBo = {
        prefixRouter: props.dataOptions.prefixRouter,
        idField: props.dataOptions.idField,
        idValue: deletedIDs,
        menuId: props.dataOptions.menuId,
        tableName: props.dataOptions.tableName,
        deleteUrl: props.dataOptions.deleteUrl,
      };
      let res = await removeData(params);
      proxy.common.showMsg(res);
      if (res.result) {
        myHook.loadData();
        if (typeof callback === 'function') {
          callback();
        }
      }
    };
  };

  // 批量导入对话框
  const importDialog = (btnOpts: any) => {
    state.importOptions.visible = true;
    state.importOptions.label = btnOpts.label;
    state.importOptions.importId = btnOpts.options.importId;
    state.importOptions.menuId = props.dataOptions.menuId;
    state.importOptions.tableName = props.dataOptions.tableName;
  };

  // 批量导出对话框
  const exportDialog = (btnOpts: any) => {
    state.exportOptions.visible = true;
    state.exportOptions.label = btnOpts.label;
    state.exportOptions.exportId = btnOpts.options.exportId;
  };

  // 批量导出
  const exportData = async (exportId: number, vueDataId: number) => {
    let params = myHook.getPageParams();
    const idValues: Array<any> = [];
    props.dataListSelections.forEach((rowData: any) => {
      idValues.push(rowData[props.dataOptions.idField]);
    });
    if (idValues.length) {
      params.queryBoList.push({
        column: props.dataOptions.idField,
        values: idValues.join(','),
        queryType: QueryType.IN,
        dataType: DataType.LONG,
      });
    }
    // 导出模板数据
    let url = '/system/dataHandler/export/exportData';
    params.pageSize = 50000;
    params.otherParams = {
      exportId,
      vueDataId,
      isExport: true,
    };
    let pageParams = {
      pageQuery: JSON.stringify(params),
    };
    state.initLoading = true;
    proxy?.download(url, pageParams); // 下载导出数据
    state.initLoading = false;
  };

  // 批量打印
  const print = (authNode: string, btnOpts: any) => {
    debugger;
    let ids = [];
    props.dataListSelections.forEach((item: any) => {
      ids.push(item[props.dataOptions.idField]);
    });
    if (!ids.length) {
      proxy.$message.error('至少选择一项！');
      return;
    }
    state.printOptions = {
      printVisible: true,
      authNode: authNode,
      baskReportUrl: btnOpts.options?.baskReportUrl,
    };

    // let params = Object.assign({}, props.dataOptions);
    // // 明细参数处理
    // let ref = this.findRef(this.editorRefName);
    // params.detailList = ref.detailFields.map(item => {
    //   const newItem = {
    //     tableName: item.subTableName,
    //     pageIndex: item.options.pageIndex,
    //     pageSize: item.options.pageSize,
    //     idField: item.options.idField,
    //     orderBy: item.options.orderBy
    //   };
    //   if (item.options.showSumField) {
    //     newItem.sumColumnNames = item.options.sumColumnNames;
    //   }
    //   return newItem;
    // });
    // const key = proxy.common.getGUID();
    // sessionStorage[key] = JSON.stringify(params);
    // let menuId = props.dataOptions.menuId;
    // window.open("/print/base/" + menuId + "/" + ids.join(",") + "?key=" + key);
  };

  // 批量开启
  const batchOpen = (rows: Array<any>) => {
    proxy
      .$confirm('确定要批量进行开启操作吗, 是否继续?', '开启操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _batchOpen();
      })
      .catch(() => {
        proxy.$message.info('已取消开启');
      });

    const _batchOpen = () => {
      let openIds: Array<any> = rows;
      if (Array.isArray(rows)) {
        openIds = rows.map((item: any) => {
          return item[props.dataOptions.idField];
        });
      }
      if (!openIds) openIds = ['0'];
      let url = '/api/common/open';
      state.initLoading = true;
      let params = Object.assign({}, props.dataOptions, {
        openNodeApi: true,
        modelName: props.dataOptions.tableView,
        idValues: openIds,
      });
      // proxy.common.ajax(
      // 	url,
      // 	params,
      // 	(res: ResultInfo) => {
      // 		proxy.common.showMsg(res);
      // 		if (res.result) {
      // 			myHook.loadData();
      // 		}
      // 		state.initLoading = false;
      // 	},
      // 	false
      // );
    };
  };

  // 批量终止
  const batchStop = (rows: Array<any>) => {
    // 终止前事件
    const reValue = props.onStopBefore(rows);
    if (reValue === false) return;

    proxy
      .$confirm('终止后将回到最初状态，确定操作吗, 是否继续?', '终止操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _batchStop();
      })
      .catch(() => {
        proxy.$message.info('已取消终止');
      });

    const _batchStop = () => {
      let stopIDs: Array<any> = rows;
      if (Array.isArray(rows)) {
        stopIDs = rows.map((item: any) => {
          return item[props.dataOptions.idField];
        });
      }
      if (!stopIDs) stopIDs = ['0'];
      let url = '/api/common/stop';
      state.initLoading = true;
      let params = Object.assign({}, props.dataOptions, {
        modelName: props.dataOptions.tableView,
        idValues: stopIDs,
      });
    };
  };

  // 审核，这里默认调用批量审核
  const batchAuditing = (rows: Array<any>) => {
    if (!rows.length) {
      proxy.$message.error('至少选择一行');
      return;
    }
    if (props.onBatchAuditingBefore(rows) === false) {
      return;
    } else {
      for (const row of rows) {
        if (row.auditing === 2) {
          proxy.$message.error('已审核的单子不允许重复审核');
          return;
        }
      }
    }

    proxy
      .$confirm('审核后将无法进行修改, 是否继续?', '审核操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _batchAuditing();
      })
      .catch(() => {
        proxy.$message.info('已取消审核');
      });

    const _batchAuditing = async () => {
      let AuditIDs = rows;
      if (Array.isArray(rows)) {
        AuditIDs = rows.map((item: any) => {
          return item[props.dataOptions.idField];
        });
      }

      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: AuditIDs,
      });
      let res = await auditingEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        myHook.loadData(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  // 反审核，这里默认调用批量反审核
  const reBatchAuditing = (rows: Array<any>) => {
    if (!rows.length) {
      proxy.$message.error('至少选择一行');
      return;
    }
    if (props.onReBatchAuditingBefore(rows) === false) {
      return;
    } else {
      for (const row of rows) {
        if (row.auditing !== 2) {
          proxy.$message.error('只有已审核的单子才允许反审核操作');
          return;
        }
      }
    }

    proxy
      .$confirm('确定要批量进行反审核操作吗?', '审核操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _reBatchAuditing();
      })
      .catch(() => {
        proxy.$message.info('已取消审核');
      });

    const _reBatchAuditing = async () => {
      let AuditIDs = rows;
      if (Array.isArray(rows)) {
        AuditIDs = rows.map((item: any) => {
          return item[props.dataOptions.idField];
        });
      }

      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: AuditIDs,
      });
      let res = await reAuditingEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        myHook.loadData(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  // 选择items
  const handleSelectionChange = (rows: any) => {
    currentDataListSelections.value = rows;
    events.onSelectionChange(rows);
  };

  // 分页大小改变
  const handleSizeChange = (pageSize: number) => {
    props.dataOptions.pageSize = pageSize;
    myHook.loadData();
  };

  // 当前页码大小改变
  const handleCurrentChange = (pageIndex: number) => {
    props.dataOptions.pageIndex = pageIndex;
    myHook.loadData();
  };

  // 列表字段显示顺序移动
  const fieldSetMove = (evt: any) => {
    state.targetElement = evt.relatedContext.element;
  };

  const endDrag = () => {
    state.targetElement = undefined;
    state.drag = false;
  };

  const startDrag = () => {
    state.targetElement = undefined;
    state.drag = true;
  };

  // 翻译下拉框值
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

  // 连接弹出对话框编辑器
  const linkEditor = (id: any, rowData: any) => {
    let editorCheckCode = proxy.common.getGUID(); // 获取编辑器校验码，用于仅对当前实例响应onOpenEditor
    props.dataOptions.editorCheckCode = editorCheckCode;
    proxy.mittBus.emit('onOpenEditor', { id, rowData, editorCheckCode });
  };

  // 获取查询条件
  const getSearchFields = () => {
    return state.searchFields;
  };

  // 计算求和
  const getSummaries = () => {
    const sums = [];
    // 求和字段
    let sumColumnNames = props.fields
      .filter((item: any) => {
        return item.isSum;
      })
      .map((item: any) => {
        return item.prop;
      });

    sums[0] = '合';
    sums[1] = '';
    let length = 2;
    // 如果打开了展开列
    if (props.openExpand) {
      length = 3;
    }
    props.fields
      .filter((item: any) => {
        return !item.hidden;
      })
      .forEach((field: any, index: any) => {
        let footerRows = props.dataOptions.footerRows;
        if (sumColumnNames.indexOf(field.prop) >= 0 && footerRows && footerRows.length) {
          let footerRow = footerRows[0];
          if (footerRow) sums[index + length] = Number(footerRow[field.prop] || 0);
        } else {
          sums[index + length] = '';
        }
      });

    return sums;
  };
  // tabnav导航筛选条件改变
  const onTabsNavChange = (where: any) => {
    state.tabNavWhere = where;
    myHook.loadData();
  };
  // 表头单击事件
  const headerClick = (column: any, event: any) => {
    if (event.target && event.target.innerText === '#') {
      state.showAttrDialog = true;
    }
  };
  // 添加高级查询条件
  const addSearchFields = (addList: any) => {
    // let addList= [{propName:"",value:""},{propName:"",value:""}];
    addList.forEach((item: any) => {
      const fieldInfo: any = state.searchFields.find((f: any) => {
        return f.prop === item.propName;
      });
      if (fieldInfo) {
        fieldInfo.value = item.value;
      }
    });
  };

  // 重置查询条件
  const onSuperReset = () => {
    // 重置导航查询条件
    state.tabNavWhere = [];
    props.tabNavList.forEach((item: any) => {
      item.value = null;
      item._value = null;
    });
    // 重置事件
    proxy.mittBus.emit('on-super-reset', {});
  };

  // 获得是否加载完毕
  const getLoadFinished = () => {
    return state.isLoadFinished;
  };

  // 排序
  const sortChange = (param: any) => {
    const { column, prop, order } = param;
    props.dataOptions.orderBy = {};
    let _order = order === 'ascending' ? 'ASC' : 'DESC';
    // 扩展字段
    const colInfo: any = props.fields.find((item: any) => item.prop === prop);
    if (colInfo.isExpandField) {
      props.dataOptions.orderBy = {
        prop: prop,
        order: _order,
        isExpandField: true,
      };
    } else {
      props.dataOptions.orderBy[prop] = _order;
      delete props.dataOptions.orderBy.order;
      delete props.dataOptions.orderBy.isExpandField;
    }
    myHook.loadData();
  };

  // 展开子集
  const expandChange = (row: any, expandedRows: any) => {
    events.onExpandChange(row, expandedRows);
  };

  // 目的是让列表页面重新渲染一下
  const setCurrentRow = () => {
    if (state.dataList.length) {
      proxy.$refs.dataList.setCurrentRow(state.dataList[0]);
    }
  };

  // 导航栏改变事件
  const onToolbarChange = (val: any, colInfo: any, searchFields: any) => {
    proxy.mittBus.emit('on-toolbar-change', { val, colInfo, searchFields });
  };

  // 选中行
  const selectRows = (rows: Array<any>) => {
    if (!Array.isArray(rows) || !rows.length) return;

    const idField = props.dataOptions.idField;
    if (!idField) return;

    const _rows = state.dataList.filter((item: any) => rows.some((s) => s[idField] === item[idField]));
    proxy.$refs.dataList.toggleRowSelection(_rows);
  };

  /**
   * 勾选记忆
   */
  const isNotSelectionsChange = () => {
    const url = proxy.$route.path.replace(/\//gi, '-');
    const key = 'isNotSelections' + url;
    localStorage[key] = state.isNotSelections;
    state.showSetDialog = false;
    proxy.$message.success('设置完成');
  };
  //#endregion

  return {
    saveTableConfig,
    resetTableConfig,
    getQuickSearchPlaceolder,
    onRowActionClick,
    deleteData,
    importDialog,
    exportDialog,
    exportData,
    print,
    batchOpen,
    batchStop,
    batchAuditing,
    reBatchAuditing,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    fieldSetMove,
    endDrag,
    startDrag,
    translateText,
    linkEditor,
    getSearchFields,
    getSummaries,
    onTabsNavChange,
    headerClick,
    addSearchFields,
    onSuperReset,
    getLoadFinished,
    sortChange,
    expandChange,
    setCurrentRow,
    onToolbarChange,
    selectRows,
    isNotSelectionsChange,
  };
}
