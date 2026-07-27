import { ComponentInternalInstance } from 'vue';
import { BaseProperties, EditorType } from '../../types/base-type';
import { ResultInfo } from '/@/types/base-type';
import useDropdownStore from '/@/stores/modules/dropdown';
import { PageEditorBo, EditorOptions, EditorVo, SaveEditorBo, DetailParamsBo, DetailInfo } from '/@/api/types';
import { getEditor, saveEditor, copyEditor, stopEditor, openEditor, auditingEditor } from '/@/api/common/baseApi';
import { to } from 'await-to-js';
import { BaseObject, DataType, PageListBo, QueryBo, QueryType } from '/@/types/common';
import moment from 'moment';
const dropdownStore = useDropdownStore();

/**
 * 数据加载函数
 * @param options 加载参数
 * @returns
 */
export default function editorHook(options: EditorOptions) {
  let { props, state, detailFields, isShowDialog, currentAction, currentDisabled, currentTop, masterFields, events } = options;

  let ins = getCurrentInstance() as ComponentInternalInstance;
  let proxy = ins.proxy as BaseProperties;

  // 扩展按钮事件
  const onButtonAction = (authNode: any) => {
    let result;
    if (props.editButtonClick) {
      result = props.editButtonClick(authNode, state.editorVo.master);
    }
    if (result !== undefined) {
      return;
    }
    switch (authNode) {
      case 'auditing':
        // 审核
        auditing();
        break;
      case 'copy':
        // 复制
        copy();
        break;
      case 'stop':
        // 终止
        stop();
        break;
      case 'open':
        // 开启
        open();
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
        item.options.defaultValue = JSON.stringify(item.options.defaultValue) == '{}' ? '' : item.options.defaultValue;
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
            const formatter = item.options.formatter || 'YYYY-MM-DD HH:mm:ss';
            defaultValue = proxy.common.formatDate(new Date(), formatter);
          }
          state.editorVo.master[item.options.prop] = defaultValue;
        } else {
          let defaultValue = item.options.defaultValue;
          // 当前默认用户
          if (defaultValue === '{currentNickName}') {
            let userInfo = proxy.common.getUserInfo();
            state.editorVo.master['nickName'] = userInfo.nickName;
            let userId = userInfo.userId;
            state.editorVo.master['userId'] = userId;
          } else if (defaultValue === '{currentDeptName}') {
            let userInfo = proxy.common.getUserInfo();
            state.editorVo.master['deptName'] = userInfo.deptName;
            let deptId = userInfo.deptId;
            state.editorVo.master['deptId'] = deptId;
          } else {
            state.editorVo.master[item.options.prop] = item.options.defaultValue;
          }
        }
      }
    });
  };

  // 获得主表字段信息
  const getFieldInfo = (fieldName: string) => {
    // 字段信息
    let fieldInfo: any = null;
    let _getRecursionField = function (array: any) {
      array.forEach((item: any) => {
        if (item.type === 'grid') {
          item.columns.forEach((colItem: any) => {
            _getRecursionField(colItem.fields);
          });
        } else if (item.type === 'inline-group') {
          _getRecursionField(item.fields);
        } else if (item.type === 'detail-grid') {
          _getRecursionField(item.fields);
        } else {
          if (item.options && item.options.prop === fieldName) {
            fieldInfo = item;
          }
        }
      });
    };
    _getRecursionField(props.editorOptions.fields);

    return fieldInfo;
  };

  // 获得主明细字段信息
  const getDetailFieldInfo = (detailInfo: any, fieldName: string) => {
    detailInfo = detailInfo ? detailInfo : detailFields.value[0];
    const _fields = detailInfo.fields;
    return _fields.find((item: any) => item.prop === fieldName);
  };

  // 允许外部调用新建数据
  const addData = () => {
    if (props.editorType === EditorType.INNER) {
      let query = proxy.$route.query;
      let querys = Object.keys(query).map((k) => k + '=' + query[k]);
      let params = querys.join('&');
      if (!params) params = 'id=0';
      let path = props.dataOptions.router + '?' + params;
      proxy.$router.push(path);
    } else if (props.editorType === EditorType.SINGLE) {
      isShowDialog.value = false;
    } else if (props.editorType === EditorType.DIALOG) {
      isShowDialog.value = true;
    }
    currentAction.value = 'add';
    state.detailPageDisabled = true;
    let top = proxy.common.getDialogTop();
    props.config.top = top;

    // 主表数据处理
    Object.keys(state.editorVo.master).forEach((key) => {
      if (Array.isArray(state.editorVo.master[key])) {
        state.editorVo.master[key] = [];
      } else {
        state.editorVo.master[key] = null;
      }
    });
    dropdownStore.loadDropDown({
      dataOptions: props.dataOptions,
      editorOptions: props.editorOptions,
    });
    getDefaultValue(props.editorOptions.fields);
    // 新建设置默认值
    Object.keys(props.defaultValue).forEach((key) => {
      if (['value', 'label'].indexOf(key) < 0) {
        state.editorVo.master[key] = props.defaultValue[key];
      }
    });

    // 编辑器中的默认值
    const editorDefaultValue = props.dataOptions.editorDefaultValue;
    if (editorDefaultValue) {
      Object.keys(editorDefaultValue).forEach((key) => {
        state.editorVo.master[key] = editorDefaultValue[key];
      });
    }

    // 明细表处理
    state.editorVo.detailList = detailFields.value
      .filter((item: any) => !item.options.isVirtual)
      .map((item: any) => {
        return {
          code: 200,
          result: true,
          total: 0,
          subTableName: proxy.common.toCamelCase(item.subTableName),
          rows: [],
        };
      });

    // 可编辑
    currentDisabled.value = false;
    proxy.$nextTick(() => {
      let form = proxy.$refs['editor-form'];
      // 清除验证
      if (form) {
        proxy.$refs['editor-form'].clearValidate();
      }

      // 编辑加载后事件
      events.onAddLoadAfter(state.editorVo.master, props.editorConfig);
      // 添加加载后事件
      proxy.mittBus.emit('on-add-load-after', { master: state.editorVo.master, editorConfig: props.editorConfig });
    });

    return state.editorVo.master;
  };

  /**
   * 编辑数据
   */
  const loadEditData = async (id = 0, master?: any, isInit?: any) => {
    if (!id) {
      id = props.dataOptions.idValue;
    }
    if (!master) {
      master = state.editorVo.master;
    }
    if (isInit) {
      // 将明细分页码初始化为1
      detailFields.value.forEach((item: any) => {
        item.options.pageIndex = 1;
      });
    }

    if (props.editorType === EditorType.INNER) {
      // _id=0，表示在新建页面过来刷新页面数据不需要跳转页面
      let _id = Number(proxy.$route.query.id);
      if (_id !== 0) {
        let path = `${proxy.$route.path}?id=${id}`;
        proxy.$router.push(path);
      }
    } else if (props.editorType === EditorType.SINGLE) {
      isShowDialog.value = false;
    } else {
      isShowDialog.value = true;
    }

    // 编辑加载前事件
    events.onEditLoadBefore(master);
    currentAction.value = 'edit';
    state.detailPageDisabled = false;
    state.initLoading = true;
    let top = proxy.common.getDialogTop();
    currentTop.value = top;

    // 获取默认值
    getDefaultValue(props.editorOptions.fields);

    // 加载下拉框
    await dropdownStore.loadDropDown({
      dataOptions: props.dataOptions,
      editorOptions: props.editorOptions,
    });

    // 明细参数处理
    let detailParams = detailFields.value
      .filter((item: any) => !item.options.isVirtual)
      .map((item: any) => {
        // 排序字段
        let orderByColumn: Array<string> = [];
        let orderBy: Array<string> = [];
        if (item.options.orderBy) {
          Object.keys(item.options.orderBy).forEach((key) => {
            orderByColumn.push(key);
            orderBy.push(item.options.orderBy[key].toLowerCase());
          });
        } else {
          orderByColumn.push(item.options.idField);
          orderBy.push('ASC');
        }

        const newItem: any = {
          subTableName: item.subTableName,
          idField: item.options.idField,
          pageIndex: item.options.pageIndex,
          pageSize: item.options.pageSize,
          title: item.options.title,
          orderByColumn: orderByColumn.join(','),
          isAsc: orderBy.join(','),
        };
        if (item.options.fixedWhere && item.options.fixedWhere.length) {
          newItem.queryBoList = item.options.fixedWhere;
        }
        if (item.folder) {
          newItem.folder = item.folder;
        }
        if (item.options.showSumField) {
          newItem.sumColumnNames = item.options.sumColumnNames;
        }
        return newItem;
      });

    props.dataOptions.idValue = id;
    let pageParams: PageEditorBo = {
      prefixRouter: props.dataOptions.prefixRouter,
      tableName: props.dataOptions.tableName,
      detailParams,
    };
    pageParams = Object.assign(pageParams, props.dataOptions);
    // 加载编辑页面数据
    let resResult = await getEditor(pageParams);
    if (resResult.result) {
      showData(resResult.data, pageParams.detailParams);
    } else {
      proxy.common.showMsg(resResult);
    }
    state.initLoading = false;
  };

  // 显示数据
  const showData = (dataInfo: EditorVo, detailParams: Array<DetailParamsBo>, showType = 'load') => {
    // 原始数据加工处理
    if (typeof props.doDataParser === 'function') {
      props.doDataParser(dataInfo);
    }

    if (!dataInfo || !dataInfo.master) {
      proxy.$message.error('没有加载到数据！');
      state.initLoading = false;
      return;
    }
    //主表扩展字段处理
    if (dataInfo.master.expandFields) {
      let expandFields = dataInfo.master.expandFields;
      if (typeof expandFields !== 'object') {
        expandFields = JSON.parse(dataInfo.master.expandFields);
      }
      dataInfo.master = Object.assign({}, expandFields, dataInfo.master);
    }
    //明细处理扩展字段
    dataInfo.detailList = dataInfo.detailList.map((detailInfo, detailIndex) => {
      detailInfo.rows = detailInfo.rows.map((rowInfo) => {
        if (rowInfo.expandFields) {
          let expandFields = rowInfo.expandFields;
          if (typeof expandFields !== 'object') {
            expandFields = JSON.parse(rowInfo.expandFields);
          }
          return Object.assign({}, expandFields, rowInfo);
        }
        // 数据转换
        Object.keys(rowInfo).forEach((key) => {
          let val = rowInfo[key];
          if (val === '') val = null;
          let detailFieldInfo = getDetailFieldInfo(detailFields.value[detailIndex], key);
          if (typeof val === 'string' && detailFieldInfo && detailFieldInfo.type === 'select' && detailFieldInfo.multiple) {
            val = val.split(',');
            if (key.indexOf('Id') === key.length - 2) {
              val.forEach((valItem: any, valIndex: number) => {
                val[valIndex] = Number(valItem);
              });
            }
            rowInfo[key] = val;

            // 主键ID处理为数组
            let keyProp = detailFieldInfo.keyProp;
            if (keyProp) {
              let keyVal = rowInfo[keyProp];
              if (typeof keyVal === 'string') {
                keyVal = keyVal.split(',');
                if (key.indexOf('Id') === key.length - 2) {
                  keyVal.forEach((valItem: any, valIndex: number) => {
                    keyVal[valIndex] = Number(valItem);
                  });
                }
                rowInfo[keyProp] = keyVal;
              }
            }
          } else if (typeof val === 'string' && key.indexOf('Id') === key.length - 2 && proxy.common.isNumber(val)) {
            val = Number(val);
            rowInfo[key] = val;
          }
        });

        return rowInfo;
      });
      return detailInfo;
    });
    const tranData = translate(dataInfo.master);
    if (showType === 'save') {
      detailParams.forEach((item: any) => {
        tranData[item.detailViewName] = state.editorVo.master[item.detailViewName];
      });
    }

    state.editorVo = dataInfo;
    state.editorVo.master = tranData;
    state.editorVo.detailList = dataInfo.detailList.map((m) => {
      m.subTableName = m.tableName as any;
      delete m.tableName;
      return m;
    });
    // 设置主键ID
    props.dataOptions.idValue = state.editorVo.master[props.dataOptions.idField];
    // 明细数据处理
    detailFields.value
      .filter((item: any) => !item.options.isVirtual)
      .forEach((detail: { subTableName: string }) => {
        const subTableName = proxy.common.toCamelCase(detail.subTableName);
        // 新数据集合
        const newDetailInfo = dataInfo.detailList.find((item: any) => proxy.common.toCamelCase(item.subTableName) === subTableName);
        if (!newDetailInfo) return;

        translateDetails(detail, newDetailInfo.rows);
      });
    proxy.$nextTick(() => {
      // 清除验证
      window.setTimeout(() => {
        let form = proxy.$refs['editor-form'];
        // 清除验证
        if (form) {
          proxy.$refs['editor-form'].clearValidate();
        }
      }, 50);
      // 编辑加载后事件
      events.onEditLoadAfter(state.editorVo.master, props.editorConfig);
    });
  };

  // 刷新数据
  const reload = async () => {
    await loadEditData(props.dataOptions.idValue, state.editorVo.master);
  };

  // 主表数据转换
  const translate = (dataObj: any) => {
    if (!dataObj) return dataObj;

    // 转换函数
    const _translate = (fields: any) => {
      fields.forEach((field: any) => {
        let prop = field.options.prop;
        const v = dataObj[prop];
        if (field.type === 'cascader' || (field.type === 'select' && field.options.multiple) || (field.type === 'date' && field.options.type === 'dates')) {
          if (Array.isArray(v)) {
            return v;
          } else if (v) {
            dataObj[prop] = v.split(',');
            if (['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(field.options.dataType) >= 0) {
              dataObj[prop].forEach((p: any, index: number) => {
                dataObj[prop][index] = Number(p);
              });
            }
            // 主键ID处理为数组
            const keyProp = field.options.keyProp;
            if (keyProp) {
              const keyValues = dataObj[keyProp];
              if (keyValues) {
                if (!Array.isArray(keyValues)) {
                  dataObj[keyProp] = keyValues.split(',');
                }
                dataObj[keyProp].forEach((item: any, index: any) => {
                  dataObj[keyProp][index] = Number(item);
                });
              } else {
                dataObj[keyProp] = [];
              }
            }
          } else {
            dataObj[prop] = [];
          }
        } else if (field.type === 'checkbox') {
          if (Array.isArray(v)) {
            return v;
          } else if (v) {
            dataObj[prop] = v.split(',');
          } else {
            dataObj[prop] = [];
          }
        } else if (['float', 'bigDecimal'].indexOf(field.options && field.options.dataType) >= 0) {
          let scale = 2;
          if (field.formatter) {
            const arr = field.formatter.split('.');
            scale = arr[1].length;
          } else if (field.options.formatter) {
            const arr = field.options.formatter.split('.');
            scale = arr.length >= 2 ? arr[1].length : 4;
          }
          dataObj[prop] = proxy.common.round(v, scale); // 保留两位小数
          // dataObj[prop] = proxy.common.formatDate(v, formatter);
        } else if (field.dataType === 'date' || (field.options && field.options.dataType === 'date')) {
          if (v) {
            let formatter = 'YYYY-MM-DD';
            if (field.formatter) formatter = field.formatter;
            dataObj[prop] = proxy.common.formatDate(v, formatter);
          }
        } else if (field.dataType === 'datetime' || (field.options && field.options.dataType === 'datetime')) {
          if (v) {
            let formatter = 'YYYY-MM-DD HH:mm:ss';
            if (field.formatter) formatter = field.formatter;
            dataObj[prop] = proxy.common.formatDate(v, formatter);
          }
        }
      });
    };

    // 循环转换
    props.editorOptions.fields.forEach((item: any) => {
      if (['detail-grid'].indexOf(item.type) >= 0) {
        return true;
      }

      if (['grid'].indexOf(item.type) >= 0) {
        item.columns.forEach((col: any) => {
          _translate(col.fields);
        });
      } else if (['inline-group'].indexOf(item.type) >= 0) {
        _translate(item.fields);
      }
    });
    _translate(props.editorOptions.fields);

    return dataObj;
  };

  // 明细表数据转换
  const translateDetails = (detail: any, detailRows: any) => {
    for (const row of detailRows) {
      detail.fields.forEach((field: any) => {
        let prop = field.prop;
        let v = row[prop];
        if (v === undefined) v = '';
        if (field.dataType === 'date') {
          if (v) {
            let formatter = 'YYYY-MM-DD';
            if (field.formatter) formatter = field.formatter;
            v = proxy.common.formatDate(v, formatter);
            row[prop] = v;
          }
        } else if (field.dataType === 'datetime') {
          if (v) {
            let formatter = 'YYYY-MM-DD HH:mm:ss';
            if (field.formatter) formatter = field.formatter;
            v = proxy.common.formatDate(v, formatter);
            row[prop] = v;
          }
        } else if (['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(field.dataType) >= 0) {
          row[prop] = Number(v);
        } else if (field.dataType === 'decimal') {
          let scale = 2;
          if (field.formatter === '%') {
            scale = 2;
          } else if (field.formatter) {
            const arr = field.formatter.split('.');
            scale = arr[1].length;
          }
          v = proxy.common.round(v, scale); // 保留两位小数
          row[prop] = v;
        } else {
          // 将数据转为触发数据
          row[prop] = v;
        }
      });
    }
  };

  // 修改主表字段值
  const changeValue = (prop: any, value: any) => {
    state.editorVo.master[prop] = value;
    if (proxy.$refs['editor-form']) {
      proxy.$refs['editor-form'].validate();
    }
  };

  // 关闭对话框
  const cancel = () => {
    isShowDialog.value = false;
  };
  // 提交数据
  const submit = async (isClose: any, callback?: any) => {
    state.isSavedCloseDialog = !!isClose;
    return new Promise((resolve) => {
      proxy.$refs['editor-form'].validate(async (valid: any) => {
        let result = false;
        if (valid) {
          result = await saveCheck(callback);
        } else {
          proxy.$message.error('表单验证不通过，请正确填写表单！');
          result = false;
        }
        resolve(result); // 返回 状态给qiankun
      });
    });
  };

  // 保存数据
  const saveCheck = async (callback: any) => {
    // 保存前事件
    const reValue = props.onSaveBefore(state.editorVo.master, callback);
    if (reValue === false) {
      state.saveLoading = false;
      return false;
    }
    await save(callback);
    return true;
  };

  // 保存数据
  const save = async (callback?: any) => {
    setExtendFields();
    state.saveLoading = true;
    let master: any = {};
    // 数据转换
    Object.keys(state.editorVo.master).forEach((key) => {
      let val = state.editorVo.master[key];
      let fieldInfo = getFieldInfo(key);
      if (val === '') val = null;
      if (Array.isArray(val) && !fieldInfo?.options?.arraySubmit) {
        val = val.join(',');
        master[key] = val;
      } else {
        if (['date', 'datetime'].indexOf(fieldInfo?.options?.dataType) >= 0 && val) {
          val = moment(val.toString()).format('YYYY-MM-DD HH:mm:ss');
        }
        master[key] = val;
      }
    });
    // 明细表参数
    const detailParams = detailFields.value
      .filter((item: any) => !item.options.isVirtual)
      .map((item: any) => {
        // 排序字段
        let orderByColumn: Array<string> = [];
        let orderBy: Array<string> = [];
        if (item.options.orderBy) {
          Object.keys(item.options.orderBy).forEach((key) => {
            orderByColumn.push(key);
            orderBy.push(item.options.orderBy[key].toLowerCase());
          });
        } else {
          orderByColumn.push(item.options.idField);
          orderBy.push('ASC');
        }

        const newItem: BaseObject = {
          subTableName: item.subTableName,
          idField: item.options.idField,
          pageIndex: item.options.pageIndex,
          pageSize: item.options.pageSize,
          title: item.options.title,
          orderByColumn: orderByColumn.join(','),
          isAsc: orderBy.join(','),
        };

        if (item.folder) {
          newItem.folder = item.folder;
        }
        if (item.options.showSumField) {
          newItem.sumColumnNames = item.options.sumColumnNames;
        }

        return newItem;
      });

    // 明细表数据
    let detailList: Array<any> = state.editorVo.detailList
      .map((detailInfo, detailIndex: number) => {
        return {
          subTableName: detailInfo.subTableName,
          rows: detailInfo.rows
            .filter((f) => f.__ischange__)
            .map((rowMap) => {
              // 数据转换
              Object.keys(rowMap).forEach((key) => {
                let val = rowMap[key];
                let fieldInfo = getDetailFieldInfo(detailFields.value[detailIndex], key); // 获得明细表字段信息
                if (val === '') val = null;
                if (Array.isArray(val)) {
                  val = val.join(',');
                  rowMap[key] = val;
                } else {
                  if (['date', 'datetime'].indexOf(fieldInfo?.options?.dataType) >= 0 && val) {
                    val = moment(val.toString()).format('YYYY-MM-DD HH:mm:ss');
                  }
                  rowMap[key] = val;
                }
              });
              return rowMap;
            }),
        };
      })
      .filter((item) => item.rows.some((s) => s.__ischange__));

    let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
      data: {
        master: master,
        detailList,
      },
      detailParams,
    });
    // 是否新建，根据主键是否有值
    params.add = !master[props.dataOptions.idField];
    const [err, res] = await to(saveEditor(params));
    if (err) {
      state.saveLoading = false;
      return;
    }

    proxy.common.showMsg(res);
    if (res.result && res.data) {
      showData(res.data, params.detailParams);
      refreshDataList(); // 刷新列表
      // 保存后事件
      events.onSaveAfter();
      if (typeof callback === 'function') {
        setTimeout(() => {
          callback();
        }, 800);
      } else {
        if (state.isSavedCloseDialog) {
          isShowDialog.value = false;
        }
      }
    } else {
      proxy.$message.warning('保存数据返回数据失败！');
    }
    state.saveLoading = false;
  };

  /**
   * 字段change事件
   * @param ref 当前输入框ref
   * @param val 值
   * @param field 字段信息
   * @param master 主表信息
   * @param selectItemOptions 选中项数组集合
   */
  const onChange = (ref: any, val: any, field: any, master: any, selectItemOptions: any[]) => {
    // 保存后事件
    events.onChange(ref, val, field, master, selectItemOptions);
  };

  // 字段Focus事件
  const onFocus = (ref: any, val: any, event: any, field: any) => {
    events.onFocus(ref, val, event, field);
  };

  // 字段blur事件
  const onBlur = (ref: any, val: any, event: any, field: any) => {
    events.onBlur(ref, val, event, field);
  };

  // 通用开启
  const open = (callback?: Function) => {
    proxy
      .$confirm('确定要进行开启操作吗, 是否继续?', '开启操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      .then(() => {
        _open();
      })
      .catch(() => {
        proxy.$message.info('已取消开启');
      });

    const _open = async () => {
      let idValue = state.editorVo.master[props.dataOptions.idField];
      state.initLoading = true;
      idValue = [idValue].join(',');

      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: idValue,
      });
      let res = await openEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        if (typeof callback === 'function') {
          callback(res);
        }
        await reload();
        await refreshDataList(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  // 通用终止
  const stop = (callback?: Function) => {
    // 终止前事件
    const reValue = props.onStopBefore([state.editorVo.master]);
    if (reValue === false) return;

    proxy
      .$confirm('确定要进行终止操作吗, 是否继续?', '终止操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        _stop();
      })
      .catch(() => {
        proxy.$message.info('已取消终止');
      });

    const _stop = async () => {
      let idValue = state.editorVo.master[props.dataOptions.idField];
      state.initLoading = true;
      idValue = [idValue].join(',');

      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: idValue,
      });
      let res = await stopEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        if (typeof callback === 'function') {
          callback(res);
        }
        await reload();
        await refreshDataList(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  // 通用审核
  const auditing = () => {
    if (state.editorVo.master.auditing === 2) {
      proxy.$message.error('已审核的单子不允许重复审核');
      return;
    }
    proxy
      .$confirm('审核后将无法进行修改, 是否继续?', '审核操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        await _auditing();
      })
      .catch(() => {});

    const _auditing = async () => {
      let idValue = state.editorVo.master[props.dataOptions.idField];
      state.initLoading = true;
      idValue = [idValue].join(',');

      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: idValue,
      });
      let res = await auditingEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        isShowDialog.value = false;
        refreshDataList(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  /**
   * 复制
   */
  const copy = (callback?: Function) => {
    proxy
      .$confirm('确定要复制此单据吗?', '复制操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        await _copy();
      })
      .catch(() => {
        proxy.$message.info('取消复制');
      });

    const _copy = async () => {
      let idValue = state.editorVo.master[props.dataOptions.idField];
      state.initLoading = true;

      // 明细表参数
      const detailParams = detailFields.value
        .filter((item: any) => !item.options.isVirtual)
        .map((item: any) => {
          const newItem = Object.assign(
            {
              subTableName: item.subTableName,
            },
            item.options
          );
          if (item.folder) {
            newItem.folder = item.folder;
          }
          if (item.options.showSumField) {
            newItem.sumColumnNames = item.options.sumColumnNames;
          }
          return newItem;
        });
      let params: SaveEditorBo = Object.assign({}, props.dataOptions, {
        idValue: idValue,
        detailParams,
      });
      let res = await copyEditor(params);
      proxy.common.showMsg(res);

      if (res.result) {
        if (typeof callback === 'function') {
          callback(res);
        }
        events.onCopyAfter(idValue);
        isShowDialog.value = false;
        refreshDataList(); // 刷新列表
      }
      state.initLoading = false;
    };
  };

  // 编辑窗体关闭前事件
  const onBeforeClose = (done: any) => {
    // 将明细分页码初始化为1
    detailFields.value.forEach((item: any) => {
      item.options.pageIndex = 1;
    });
    const reVal = props.beforeClose();
    if (reVal) {
      done();
    }
  };

  // 批量导出
  const exportData = (exportId: any, vueDataId: any, detailInfo: DetailInfo) => {
    // 查询条件
    const queryBoList: Array<QueryBo> = [];
    queryBoList.push({
      dataType: DataType.LONG,
      label: '外键ID',
      column: props.dataOptions.idField,
      queryType: QueryType.EQ,
      values: props.dataOptions.idValue,
    });

    // 求和字段
    let sumColumnNames = detailInfo.fields
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
    if (detailInfo.options.orderBy) {
      Object.keys(detailInfo.options.orderBy).forEach((key) => {
        orderByColumn.push(key);
        orderBy.push(detailInfo.options.orderBy[key].toLowerCase());
      });
    } else {
      orderByColumn.push(detailInfo.options.idField);
      orderBy.push('ASC');
    }

    let params: PageListBo = {
      menuId: props.dataOptions.menuId,
      prefixRouter: detailInfo.options.prefixRouter,
      listMethod: undefined, // 列表方法名
      tableName: detailInfo.subTableName,
      pageIndex: detailInfo.options.pageIndex,
      pageSize: detailInfo.options.pageSize,
      orderByColumn: orderByColumn.join(','),
      isAsc: orderBy.join(','),
      sumColumnNames: sumColumnNames,
      queryBoList: queryBoList,
    };

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

  // 获得焦点
  const onKeyup = (ref: any, val: any, event: any, field: any, tableData: any) => {
    events.onKeyUp(ref, val, event, field, tableData);
  };

  // 按键抬起
  const onKeyDown = (ref: any, val: any, event: any, field: any, tableData: any) => {
    events.onKeyDown(ref, val, event, field, tableData);
  };

  // 表格下拉框行改变事件
  const onRowChange = (ref: any, selectedRow: any, field: any, val: any) => {
    events.onRowChange(ref, selectedRow, field, val);
  };

  // 下拉框项单击事件
  const onRowClick = (ref: any, itemData: any, field: any, master: any, val: any) => {
    Object.keys(itemData).forEach((key) => {
      master[key] = itemData[key];
    });
    events.onRowClick(ref, itemData, field, master, val);
  };

  // 下拉框项单击事件
  const editorContainerClick = () => {
    detailFields.value.forEach((detail: any) => {
      detail['currentRow'] = null;
      if (proxy.$refs['detail-table-' + detail.subTableView]) {
        proxy.$refs['detail-table-' + detail.subTableView][0].setCurrentRow(null);
      }
    });
    // 触发编辑器点击事件
    proxy.mittBus.emit('onEditorClick', state.editorVo.master);
  };

  // 窗口打开时
  const opened = () => {
    Object.keys(proxy.$refs)
      .filter((item: any) => item.indexOf('input-') >= 0)
      .forEach((key) => {
        if (proxy.$refs[key].length) {
          proxy.$refs[key][0].init();
        }
      });
  };

  // 获得分组fields
  const getGroupFields = (tabGroupName: any) => {
    const fields: Array<any> = masterFields.value.filter((item: any) => {
      if (tabGroupName === '[未分组]') {
        return !item.tabGroupName;
      } else {
        return item.tabGroupName === tabGroupName;
      }
    });

    return fields;
  };

  // 获得明细数据集
  const getDetailDataList = (detailInfo: DetailInfo) => {
    if (detailInfo.subTableName) {
      let subTableName = proxy.common.toCamelCase(detailInfo.subTableName);
      const detailDataInfo = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(item.subTableName) === subTableName);
      if (detailDataInfo) {
        detailInfo.options.total = detailDataInfo.total; // 设置明细总行数
        return detailDataInfo.rows;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  // 设置扩展字段数据值
  const setExtendFields = () => {
    // 获得扩展字段
    let getExpandField = (expandFields: any, fields: any, dataInfo: any) => {
      fields.forEach((item: any) => {
        if (item.type === 'grid') {
          item.columns.forEach((colItem: any) => {
            getExpandField(expandFields, colItem.fields, dataInfo);
          });
        } else if (item.type === 'inline-group') {
          getExpandField(expandFields, item.fields, dataInfo);
          // } else if (item.type === "detail-grid") {
          //   getExpandField(item.fields);
        } else {
          if (item.options && item.options.isExpandField) {
            // 表格对字段时，需要将关联的多字段作为扩展字段
            if (item.options.searchFields) {
              const searchFields = item.options.searchFields.split(',');
              for (let field of searchFields) {
                if (field.indexOf('as') > 0) {
                  const _fields = field.split('as');
                  field = _fields[1].replace(/ /gi, '');
                  expandFields[field] = dataInfo[field];
                } else {
                  expandFields[field] = dataInfo[field];
                }
              }
            } else {
              let v = dataInfo[item.options.prop];
              if (v && ['date', 'datetime'].indexOf(item.options.dataType) >= 0) {
                v = proxy.common.formatDate(v, item.formatter || 'YYYY-MM-DD HH:mm:ss');
              }
              expandFields[item.options.prop] = v;
            }
          } else if (item.isExpandField) {
            // 明细字段
            let v = dataInfo[item.prop];
            if (v && ['date', 'datetime'].indexOf(item.dataType) >= 0) {
              v = proxy.common.formatDate(v, item.formatter || 'YYYY-MM-DD HH:mm:ss');
            }
            expandFields[item.prop] = v;
          }
        }
      });
    };

    // 主表字段
    let expandFields = state.editorVo.master.expandFields || {};
    getExpandField(expandFields, props.editorOptions.fields, state.editorVo.master);
    if (!proxy.common.isEmptyObject(expandFields)) {
      state.editorVo.master.expandFields = expandFields;
    } else {
      state.editorVo.master.expandFields = null;
    }

    // 明细表字段
    if (detailFields.value.length) {
      for (const detailInfo of detailFields.value) {
        const detailRows = getDetailDataList(detailInfo);
        for (const row of detailRows) {
          let detailExpandFields = row.expandFields;
          if (typeof detailExpandFields === 'string' || !detailExpandFields) {
            detailExpandFields = JSON.parse(row.expandFields || '{}');
          }
          getExpandField(detailExpandFields, detailInfo.fields, row);
          if (!proxy.common.isEmptyObject(detailExpandFields)) {
            row.expandFields = detailExpandFields;
          } else {
            row.expandFields = null;
          }
        }
      }
    }
  };

  // 表单验证
  const validate = () => {
    if (proxy.$refs['editor-form']) {
      proxy.$refs['editor-form'].validate();
    }
  };

  // 树形下拉框获得点击项
  const onTreeNodeClick = (data: any, node: any, el: any, labels: any, values: any, field: any) => {
    // 仅选择叶节点
    if (!node.isLeaf && field.options.onlySelectLeaf) return;

    let key = field.options.prop;
    // 将下拉框中的值赋给表单
    if (Object.keys(data).findIndex((item: any) => item === key) >= 0) {
      Object.keys(data).forEach((key) => {
        if (['value', 'label', 'hasChild', 'hasFactChild', 'state', 'attributes'].indexOf(key) < 0) {
          state.editorVo.master[key] = data[key];
        }
      });
    } else {
      state.editorVo.master[key] = data[key];
    }
    proxy.mittBus.emit('on-tree-node-click', { data, node, el, labels, values, field });
  };

  /**
   * 明细字段排序
   * @param params
   */
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
    reload();
  };

  // 文件上传完毕后事件
  const onUploadAfter = (ref: any, file: any, field: any, master: any) => {
    proxy.mittBus.emit('on-upload-after', { ref, file, field, master });
  };

  /**
   * 设置字段disabled值
   * @excludeField 排除字段
   */
  const setFieldsDisabled = (excludeFields: any, disabled: any) => {
    // 获得扩展字段
    const getFieldInfo = (fields: any) => {
      fields.forEach((item: any) => {
        if (item.type === 'grid') {
          item.columns.forEach((colItem: any) => {
            getFieldInfo(colItem.fields);
          });
        } else if (item.type === 'inline-group') {
          getFieldInfo(item.fields);
        } else {
          if (item.options) {
            if (excludeFields.indexOf(item.options.prop) < 0) {
              item.options.disabled = disabled;
            }
          }
        }
      });
    };

    // 主表字段
    getFieldInfo(props.editorOptions.fields);
  };

  /**
   * 获取插槽字段名称
   */
  const getSlotNames = (firstField: any) => {
    let _props = [];
    if (firstField.fields) {
      for (let subField of firstField.fields) {
        _props.push({
          prop: subField.options.prop,
          label: 'label-' + subField.options.prop,
          blank: 'blank-' + subField.options.prop,
        });
      }
    } else {
      _props.push({
        prop: firstField.options.prop,
        label: 'label-' + firstField.options.prop,
        blank: 'blank-' + firstField.options.prop,
      });
    }
    return _props;
  };

  /**
   * 获取文件上传插槽字段名称
   */
  const getFileSlotNames = (firstField: any) => {
    let _props = [];
    if (firstField.fields) {
      for (let subField of firstField.fields) {
        _props.push({
          prop: subField.options.prop,
          file: 'file-' + subField.options.prop,
        });
      }
    } else {
      _props.push({
        prop: firstField.options.prop,
        file: 'file-' + firstField.options.prop,
      });
    }
    return _props;
  };

  // 清空数据
  const reset = () => {
    // 清空主表数据
    Object.keys(state.editorVo.master).forEach((key) => {
      state.editorVo.master[key] = null;
    });

    // 清空明细
    for (let detail of state.editorVo.detailList) {
      detail.rows = [];
      detail.total = 0;
    }
  };

  // 刷新列表
  const refreshDataList = () => {
    let editorCheckCode = proxy.common.getGUID(); // 获取编辑器校验码
    props.dataOptions.editorCheckCode = editorCheckCode;
    // 触发刷新列表数据
    proxy.mittBus.emit('on-list-refresh', { editorCheckCode });
  };

  return {
    state,
    onChange,
    onFocus,
    onKeyup,
    onRowChange,
    onRowClick,
    onTreeNodeClick,
    onUploadAfter,
    onKeyDown,
    onBlur,
    onBeforeClose,
    opened,
    save,

    getGroupFields,
    getSlotNames,
    getFileSlotNames,
    editorContainerClick,
    getDetailDataList,
    /**
     * 获取编辑页面数据
     */
    editorVo: toRef(state, 'editorVo'),

    onButtonAction,
    getFieldInfo,
    getDetailFieldInfo,
    submit,
    cancel,
    addData,
    /**
     * 编辑数据
     */
    loadEditData,
    reload,
    exportData,
    setFieldsDisabled,
    /**
     * 复制
     */
    copy,
    /**
     * 重置，清空数据
     */
    reset,
  };
}
