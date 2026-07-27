import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '../../types/base-type';
import editorHook from './editorHook';
import { DeleteBo, DetailDataBo, DetailInfo, EditorOptions } from '/@/api/types';
import { postData, removeData } from '/@/api/common/baseApi';
import to from 'await-to-js';

/**
 * 数据加载函数
 * @param options 加载参数
 * @returns
 */
export default function editorDetailHook(options: EditorOptions) {
  const { props, state, detailFields, isShowDialog, currentAction, currentDisabled, currentTop, masterFields, events } = options;
  // 主操作hook
  const eHook = editorHook(options);

  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy = ins.proxy as BaseProperties;

  //#region 方法

  // 明细按钮单击事件
  const onDetailButtonAction = (authNode: any, detail: DetailInfo, btnOpts: any) => {
    let result;
    if (props.detailButtonClick) {
      result = props.detailButtonClick(authNode, detail, btnOpts);
    }
    if (result !== undefined) {
      return;
    }
    const row: any = {};
    switch (authNode) {
      case 'detailAdd':
        // 批量添加
        detail.fields.forEach((field: any) => {
          row[field.prop] = null;
        });
        addDetailDataRow([row], detail.subTableName);
        break;
      case 'detailDelete':
        // 批量删除
        detailDelete(detail.options.detailSelections, detail);
        break;
      case 'detailImport':
        // 批量导入
        importDialog(detail, btnOpts);
        break;
      case 'detailExport':
        // 批量导出
        exportDialog(detail, btnOpts);
        break;
    }
  };

  // 获取默认值
  const getDefaultValue = (fields: any) => {
    fields.forEach((item: any) => {
      if (['detail-grid'].indexOf(item.type) >= 0) {
        return true;
      }
      if (['grid'].indexOf(item.type) >= 0) {
        item.columns.forEach((col: any) => {
          getDefaultValue(col.fields);
        });
      } else if (['inline-group'].indexOf(item.type) >= 0) {
        getDefaultValue(item.fields);
      } else {
        if (!item.options.defaultValue && item.options.defaultValue !== 0) {
          return;
        }

        if (['radio'].indexOf(item.type) >= 0) {
          let v = item.options.defaultValue;
          if (item.options.dataType === 'float') {
            v = parseFloat(item.options.defaultValue);
          }
          state.editorVo.master[item.options.prop] = v;
        } else if (['byte', 'integer', 'long'].indexOf(item.options.dataType) >= 0) {
          state.editorVo.master[item.options.prop] = parseInt(item.options.defaultValue);
        } else if (['double', 'bigDecimal'].indexOf(item.options.dataType) >= 0) {
          state.editorVo.master[item.options.prop] = parseFloat(item.options.defaultValue);
        } else if (['date', 'datetime'].indexOf(item.options.dataType) >= 0) {
          let defaultValue = item.options.defaultValue;
          if (defaultValue === '{currentDate}') {
            const format = item.options.format || 'YYYY-MM-DD HH:mm:ss';
            defaultValue = proxy.common.formatDate(new Date(), format);
          }
          state.editorVo.master[item.options.prop] = defaultValue;
        } else {
          let defaultValue = item.options.defaultValue;
          // 当前默认用户
          if (defaultValue === '{currentNickName}') {
            let nickName = proxy.common.getUserInfo().nickName;
            state.editorVo.master['nickName'] = nickName;
            let userId = proxy.common.getUserInfo().userId;
            state.editorVo.master['userId'] = userId;
          } else if (defaultValue === '{currentDeptName}') {
            let deptName = proxy.common.getUserInfo().deptName;
            state.editorVo.master['deptName'] = deptName;
            let deptId = proxy.common.getUserInfo().deptId;
            state.editorVo.master['deptId'] = deptId;
          } else {
            state.editorVo.master[item.options.prop] = item.options.defaultValue;
          }
        }
      }
    });
  };

  // 获得主明细字段信息
  const getDetailFieldInfo = (fieldName: any) => {
    const _fields = detailFields.value[0].fields;
    return _fields.find((item: any) => item.prop === fieldName);
  };

  /**
   * 添加明细数据
   * @param rows
   * @param subTableName
   * @returns
   */
  const addDetailDataRow = (rows: any, subTableName: any) => {
    if (!Array.isArray(rows)) {
      proxy.$message.error('添加明细数据必须为数组');
      return;
    }
    if (!subTableName && detailFields.value.length) {
      // 默认为第一个明细表名称
      subTableName = detailFields.value[0].subTableName;
    }
    subTableName = proxy.common.toCamelCase(subTableName);
    if (subTableName) {
      rows.forEach((row) => {
        row.__ischange__ = true; // 新增
        row[props.dataOptions.idField] = 0; // 新增时外键ID为0
        const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
        if (detailDataInfo) {
          let index = detailDataInfo.rows.length;
          detailDataInfo.rows[index] = row;
          // 明细行数
          detailDataInfo.total = detailDataInfo.rows.length;
        }
      });
    }
  };

  // 明细背景颜色设置
  const detailRowStyle = (row: any, rowIndex: any, detail: any) => {
    let style = '';
    let idField = proxy.common.toCamelCase(detail.options.idField);
    let idVal = row[idField];
    if (!idVal) {
      style = 'background-color:#ffffdf';
    }
    return style;
  };

  // 明细求和方式
  const getDetailSummaries = (columns: any, data: any, detail: any) => {
    const sums = [];
    // 求和字段
    let sumColumnNames = detail.fields
      .filter((item: any) => {
        return item.isSum;
      })
      .map((item: any) => {
        return item.prop;
      });

    sums[0] = '';
    sums[1] = '';
    detail.fields.forEach((field: any, index: any) => {
      let footerRows = state.editorVo.detailList[detail.subTableName].footer as any[];
      if (sumColumnNames.indexOf(field.prop) >= 0 && footerRows && footerRows.length) {
        let footerRow = footerRows[0];
        sums[index + 2] = footerRow[field.prop];
      } else {
        sums[index + 2] = '';
      }
    });

    return sums;
  };

  // 明细字段change事件
  const onDetailChange = (ref: any, val: any, row: any, field: DetailField, rows: Array<any>) => {
    row['__ischange__'] = true;
    events.onDetailChange(ref, val, row, field, rows);
    // 自定义事件
    if (field && field.calcType === 'change' && field.calcExpress) {
      // 自定义表达式
      try {
        // eslint-disable-next-line
        eval(field.calcExpress);
      } catch (error) {
        proxy.$alert(`错误提示：${error}，表达式内容：${field.calcExpress}`, '表达式错误', {
          confirmButtonText: '确定',
        });
      }
    }
    // 计算求和
    if (field && field.calcMainField) {
      // 主表求和字段计算
      const total = rows.reduce(
        (totalItem: any, currItem: any) => {
          totalItem.num += Number(currItem[field.prop]) || 0;
          return totalItem;
        },
        { num: 0 }
      );
      state.editorVo.master[field.calcMainField] = total.num;
    }
    // 关联触发字段
    if (field && field.calcEmitFields) {
      const emitFields: Array<string> = field.calcEmitFields.split(',');
      for (const emitField of emitFields) {
        const _val = field[emitField];
        const _field = getDetailFieldInfo(emitField);
        if (_field) {
          onDetailChange(ref, _val, row, _field, rows);
        }
      }
    }
  };

  // 选择items
  const handleSelectionChange = (val: any, detail: any) => {
    detail.options.detailSelections = val;
  };

  // 分页大小改变
  const handleSizeChange = (val: any, detail: any) => {
    detail.options.pageSize = val;
    eHook.loadEditData(props.dataOptions.idValue);
  };

  // 当前页码大小改变
  const handleCurrentChange = (val: any, detail: any) => {
    detail.options.pageIndex = val;
    eHook.loadEditData(props.dataOptions.idValue);
  };

  // 明细单元格单击事件
  const onDetailCellClick = (detail: any, row: any, col: any, cell: any, event: any) => {
    detail['currentRow'] = row;
    proxy.mittBus.emit('on-detail-cell-click', { detail, row, col, cell, event });
  };

  // 明细当前行改变
  const onDetailCurrentChange = (detail: any, currentRow: any, oldCurrentRow: any) => {
    detail['currentRow'] = currentRow;
  };

  // 明细行点击
  const onDetailRowClick = (row: any, column: any, event: Event, fields?: any) => {
    events.onDetailRowClick(row, column, event, fields);
  };

  // 明细标题点击事件
  const detailHeaderClick = (column: any, event: any, detail: any) => {
    if (event.target.innerText === '#') {
      state.tableAttr.showAttrDialog = true;
      state.tableAttr.dataOptions = {
        tableName: detail.subTableName,
        idField: detail.options.idField,
        router: props.dataOptions.router,
        menuId: props.dataOptions.menuId,
        linkColumn: null,
        orderBy: detail.options.orderBy,
      };
      state.tableAttr.fields = detail.fields.map((item: any) => {
        if (!item.width) {
          item.width = 'auto';
        }
        return item;
      });
    }
  };

  // 排序
  const sortChange = (params: any) => {
    const { column, prop, order } = params;
    column;
    const fields = detailFields.value[0].fields;
    const options = detailFields.value[0].options;
    options.orderBy = {};
    let _order = order === 'ascending' ? 'ASC' : 'DESC';
    // 扩展字段
    const colInfo = fields.find((item: any) => item.prop === prop);
    if (colInfo.isExpandField) {
      options.orderBy = {
        prop: prop,
        order: _order,
        isExpandField: true,
      };
    } else {
      options.orderBy[prop] = _order;
      delete options.orderBy.order;
      delete options.orderBy.isExpandField;
    }
    eHook.reload();
  };

  // 删除明细数据
  const detailDelete = (selectedRows: any[], detailInfo: DetailInfo) => {
    selectedRows = selectedRows.filter((row) => !row.__delete__);
    // 终止前事件
    const reValue = props.onDetailDeleteBefore(selectedRows, detailInfo);
    if (!reValue) return;
    proxy
      .$confirm('此操作将永久删除选中的数据, 是否继续?', '删除操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _delete();
      })
      .catch(() => {
        proxy.$message.info('已取消删除');
      });

    const _delete = async () => {
      let deletedIDs = selectedRows
        .map((item: any) => {
          return item[detailInfo.options.idField] || '0';
        })
        .filter((item: any) => {
          return item !== '0';
        });
      if (!deletedIDs.length) {
        let subTableName = proxy.common.toCamelCase(detailInfo.subTableName);
        const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
        if (!detailDataInfo) return;

        // 没有任何已经保存要删除的数据
        selectedRows.forEach((item: any) => {
          // 删除明细
          let detailRows = detailDataInfo.rows;
          detailRows.splice(
            detailRows.findIndex((_row: any) => _row === item),
            1
          );
          item.__delete__ = true;
        });
        events.onDetailDeleteAfter(selectedRows, detailInfo);
        proxy.$message.success('数据删除成功');
        return;
      }

      state.initLoading = true;
      let params: DeleteBo = {
        prefixRouter: detailInfo.options.prefixRouter,
        idField: detailInfo.options.idField,
        idValue: deletedIDs,
        menuId: 0,
        tableName: detailInfo.subTableName,
      };

      const [err, res] = await to(removeData(params));
      if (err) {
        state.saveLoading = false;
        return;
      }

      if (res.result) {
        let subTableName = proxy.common.toCamelCase(detailInfo.subTableName);
        const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
        if (!detailDataInfo) return;
        selectedRows.forEach((item: any) => {
          // 删除明细
          let detailRows = detailDataInfo.rows;
          detailRows.splice(
            detailRows.findIndex((_row: any) => _row === item),
            1
          );
        });
        // 明细删除后事件
        events.onDetailDeleteAfter(selectedRows, detailInfo);
        await eHook.save(); // 保存数据，防止数据修改
      }
      state.initLoading = false;
    };
  };

  // 明细批量导入对话框
  const importDialog = (detailInfo: DetailInfo, btnOpts: any) => {
    state.importOptions.visible = true;
    state.importOptions.label = btnOpts.label;
    state.importOptions.importId = btnOpts.options.importId;
    state.importOptions.mainId = props.dataOptions.idValue; // 外键ID
    state.importOptions.detailInfo = detailInfo;
  };

  // 明细批量导出对话框
  const exportDialog = (detailInfo: DetailInfo, btnOpts: any) => {
    state.batchExport.visible = true;
    state.batchExport.label = btnOpts.label;
    state.batchExport.options = btnOpts.options;
    state.batchExport.options.detailInfo = detailInfo;
    state.batchExport.mainId = props.dataOptions.idValue; // 外键ID
    // 初始化模板
    proxy.$nextTick(() => {
      proxy.$refs['export-dialog'].getTemplateList();
    });
  };
  //#endregion

  /**
   * 清空明细数据
   * @param subTableName
   * @returns
   */
  const clearDetailDataRow = async (subTableName: any) => {
    if (!subTableName && detailFields.value.length) {
      // 默认为第一个明细表名称
      subTableName = detailFields.value[0].subTableName;
    }
    subTableName = proxy.common.toCamelCase(subTableName);
    if (subTableName) {
      const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
      if (!detailDataInfo) return;
      // 删除明细
      let detailRows = detailDataInfo.rows;

      // 明细结构信息
      const detailInfo = detailFields.value.find((item: any) => proxy.common.toCamelCase(item.subTableName) === subTableName);
      if (detailInfo) {
        let detailIdField = detailInfo.options.idField; // 明细主键
        let deletedIDs = detailRows.filter((f) => f[detailIdField]).map((m) => m[detailIdField]); // 获取明细ID集合
        //i 不需要相加，一直从第0个开始删除直到删完
        for (let i = 0; i < detailRows.length; i) {
          detailRows.splice(i, 1);
        }

        if (deletedIDs && deletedIDs.length) {
          // 执行删除明细
          let params: DeleteBo = {
            prefixRouter: detailInfo.options.prefixRouter,
            idField: detailInfo.options.idField,
            idValue: deletedIDs,
            menuId: 0,
            tableName: detailInfo.subTableName,
          };

          const [err, res] = await to(removeData(params));
        }
      }
    }
  };

  /**
   * 标识明细数据删除
   * @param subTableName
   * @returns
   */
  const flagDeleteDetailList = async (subTableName: any) => {
    if (!subTableName && detailFields.value.length) {
      // 默认为第一个明细表名称
      subTableName = detailFields.value[0].subTableName;
    }
    subTableName = proxy.common.toCamelCase(subTableName);
    if (subTableName) {
      const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
      if (!detailDataInfo) return;
      // 明细结构信息
      const detailInfo = detailFields.value.find((item: any) => proxy.common.toCamelCase(item.subTableName) === subTableName);
      // 删除明细
      let detailRows = detailDataInfo.rows;
      let detailIdField = detailInfo.options.idField; // 明细主键
      let deletedIDs = detailRows.filter((f) => f[detailIdField]).map((m) => m[detailIdField]); // 获取
      detailRows.forEach((item: any) => {
        // 删除明细
        let detailRows = detailDataInfo.rows;
        detailRows.splice(
          detailRows.findIndex((_row: any) => _row === item),
          0
        );
      });
      if (!subTableName && detailFields.value.length) {
        // 默认为第一个明细表名称
        subTableName = detailFields.value[0].subTableName;
      }
      subTableName = proxy.common.toCamelCase(subTableName);
      if (subTableName) {
        const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
        if (detailDataInfo) {
          //i 不需要相加，一直从第0个开始删除直到删完
          for (let i = 0; i < detailDataInfo.rows.length; i) {
            detailDataInfo.rows.splice(i, 1);
          }
        }
      }
      return deletedIDs;
    }
    return [];
  };

  return {
    onDetailButtonAction,

    detailRowStyle,
    getDetailSummaries,
    handleSelectionChange,
    onDetailCellClick,
    onDetailCurrentChange,
    detailHeaderClick,
    sortChange,
    onDetailRowClick,
    onDetailChange,
    handleSizeChange,
    handleCurrentChange,
    addDetailDataRow,
    clearDetailDataRow,
    flagDeleteDetailList,
  };
}
