<template>
  <div class="selector-dialog-container">
    <el-dialog v-model="isShowDialog" draggable :title="config.title" :top="state.editorOptions.config.top" :width="state.editorOptions.config.width" append-to-body class="selector-dialog" @open="onOpen">
      <div class="selector-container">
        <el-form ref="searcher-form" :inline="true" :model="state.searchData" class="searcher-form">
          <template v-for="(field, index) in state.editorOptions.fields" :key="index">
            <el-form-item>
              <el-select v-if="field.type == 'select'" :ref="'select-' + field.options.prop" :key="field.key" v-model="state.searchData[field.options.prop]" :clearable="true" :placeholder="field.label" :multiple="field.options.multiple" :disabled="field.options.disabled" filterable class="w-150" :style="getStyle(field)" @change="change(proxy.$refs['select-' + field.options.prop][0], state.searchData[field.options.prop], field)">
                <el-option v-for="item in getOptions(field)" :key="item.id" v-bind="item" :label="item.label" :value="item.value" :option="item"></el-option>
              </el-select>
              <!-- 表格选择框 -->
              <template v-else-if="field.type === 'table-select'">
                <table-select v-model="state.searchData[field.options.prop]" :label-field="field.options.prop" :form-data="state.searchData" :field="field" :columns="field.options.columns" :label="field.label" :disabled="field.options.disabled" input-width="150px" :popover-width="field.options.popoverWidth || '300px'" :placeholder="field.label" @on-focus="(ref: any, val: any, event: any) => { onFocus(ref, val, event, field); }" @on-item-click="(ref: any, val: any, itemData: any) => { itemClick(ref, val, itemData, field); }" @on-change="(ref: any, val: any) => { change(ref, val, field); }" @on-key-up="(ref: any, val: any, event: any, tableData: any) => { onKeyup(ref, val, event, field, tableData); }" @on-row-change="(ref: any, selectedRow: any) => { onRowChange(ref, selectedRow, field); }"></table-select>
              </template>
              <!-- 树选择框 -->
              <tree-select v-else-if="field.type == 'tree'" v-model="state.searchData[field.options.prop]" :options="field.options" :label="field.label" :tree-load="(node:any, resolve:any) =>treeLoad(node, resolve, field)" :disabled="field.options.disabled" :node-key-value="getNodeKeyValue(field)" class="w-150" @on-focus="(ref:any, val:any, event:any) =>onFocus(ref, val, event, field)" @on-change="(ref:any, val:any) =>change(ref, val, field)" @on-tree-node-click="(data:any, node:any, el:any, labels:any, values:any) => onTreeNodeClick(data, node, el, labels, values, field)"></tree-select>
              <el-input v-else :ref="'input-' + field.options.prop" :key="'input-' + field.key" v-model="state.searchData[field.options.prop]" :clearable="true" :placeholder="field.label" class="w-150" @keydown.stop.enter="base.search()" :disabled="field.options.disabled"></el-input>
            </el-form-item>
          </template>
          <slot name="search-form-item"></slot>
          <el-form-item>
            <el-button type="primary" icon="CircleCheckFilled" @click="base.search()">查询</el-button>
            <el-button type="default" icon="RefreshRight" @click="base.reset()">重置</el-button>
          </el-form-item>
        </el-form>
        <!--数据Table-->
        <el-table ref="datatable" :data="state.dataList" :max-height="400" :summary-method="base.getSummaries" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" highlight-current-row border size="small" class="table-region" default-expand-all :row-key="state.dataOptions.idField" @selection-change="handleSelectionChange" @click.stop @header-click="base.headerClick">
          <el-table-column width="35px" type="selection" class="col-selection" fixed="left"></el-table-column>
          <el-table-column :index="base.getIndex" fixed="left" label="#" width="40px" type="index" class="col-index">
            <template #header>
              <span @click="state.showAttrDialog = true">#</span>
            </template>
          </el-table-column>
          <template v-for="(col, index) in state.dataListOptions.fields">
            <el-table-column v-if="!col.hidden" :key="index" :sortable="!!col.sortable" :prop="col.prop" :label="col.label" :width="col.width ? Number(col.width) : 'auto'" :min-width="col.minWidth ? Number(col.minWidth) : undefined" :header-align="col.headerAlign || 'left'" :align="col.align || 'left'">
              <template #default="{ row }">
                <!--列插槽-->
                <slot :row="row" :col="col" :translateText="base.translateText" name="common-column-slot">
                  <template v-if="col.dropdownId > 0 || (col.options && col.options.dropdownId > 0)">
                    {{ base.translateText(col.prop, row[col.prop], col?.options?.dropdownId, col) }}
                  </template>
                  <template v-else-if="col.prop == state.dataOptions.linkColumn">
                    <el-link type="primary" @click="linkSelectData(row)">
                      {{ common.formatData(row, col) }}
                    </el-link>
                  </template>
                  <template v-else-if="col.prop == 'singleSignCode'">
                    <!-- {{ row[col.prop] }} -->
                    <div>
                      <el-link type="primary" @click="base.singleSignCodeRule(row)">{{ row[col.prop] }}</el-link>
                      <span class="sn-count">[SN数：{{ row[col.prop] ? row[col.prop].split(',').length : 0 }}]</span>
                    </div>
                  </template>
                  <template v-else>
                    <template v-if="['date', 'datetime'].indexOf(col.dataType) >= 0 && col.formatter">
                      {{ common.formatDate(row[col.prop], col.formatter) }}
                    </template>
                    <template v-else-if="['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(col.dataType) >= 0 && col.formatter">
                      {{ common.formatNumber(row[col.prop], col.formatter) }}
                    </template>
                    <template v-else>
                      {{ row[col.prop] }}
                    </template>
                  </template>
                </slot>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="state.dataOptions.pageIndex" :page-sizes="[5, 10, 15, 20, 50, 100, 200, 300, 400, 1000]" :page-size="state.dataOptions.pageSize" :total="state.dataOptions.total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          <div class="page-right">
            <slot name="page-right-slot"></slot>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <div class="footer-left">
          <slot name="footer-button-region"></slot>
        </div>
        <div class="footer-right">
          <el-button icon="CloseBold" @click="_cancel">取 消</el-button>
          <el-button :loading="state.selectorLoading" type="primary" icon="Select" @click="onSelectData">确认选择</el-button>
        </div>
      </div>
    </el-dialog>

    <!--显示字段属性-->
    <table-info-dialog v-model="state.showAttrDialog" :data-options="state.dataOptions" :fields="state.dataListOptions.fields"></table-info-dialog>

    <el-dialog v-model="state.singleSignCodeVisible" draggable width="500px" title="SN号">
      <div class="dialog-info">
        <el-form :model="state.snConfig" label-width="100px">
          <el-form-item label="唯一码">
            <el-input v-model="state.snConfig.singleSignCode" type="textarea" :rows="6" placeholder="请输入唯一码"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="yrt-selector">
import TreeSelect from '/@/components/base/TreeSelect.vue';
import TableInfoDialog from '/@/components/common/components/table-info-dialog.vue';
import selectorHook from '/@/components/hooks/selectorHook';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';

import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-tree-node-click', 'on-focus', 'tree-load', 'on-selected', 'on-page-size-change', 'select-change', 'on-change', 'update:top', 'on-item-click', 'on-key-up', 'on-row-change']);

//#region 定义属性
const props = defineProps({
  // 配置参数
  config: {
    type: Object,
    default: () => {
      return {
        top: '15vh',
        width: '1000px',
        title: '商品选择器',
        // 是否显示添加实验室小组对话框
        visible: false,
        // 选择器路由
        router: '/selector/s-product-selector',
        fixedWhere: {},
      };
    },
  },
  // 数据访问地址
  url: {
    type: String,
    default: '/api/common/loadDataList',
  },
  // 查询条件钩子属性函数
  setSearchDefault: {
    type: Function,
    default: () => {},
  },
  // 自定义条件钩子函数
  getCustomWhere: {
    type: Function,
    required: false,
    default: () => {
      return '';
    },
  },
  // 加载数据前事件
  loadDataBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 数据转换
  onTranslate: {
    type: Function,
    default: () => {
      return () => {
        return true;
      };
    },
  },
});
//#endregion

const base = selectorHook(props);
const { baseState } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
});
//#endregion

//#region 计算属性
// 是否显示dialog
const isShowDialog = computed({
  get() {
    return props.config.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.visible，通知父级组件变量值同步更新
  },
});

// 获得下拉框options
const getOptions = computed(() => {
  return function (field: any) {
    const dropdownId = field.options && field.options.dropdownId ? field.options.dropdownId : field.dropdownId;
    let options = [];
    if (dropdownId) {
      let key = 'dropdown' + dropdownId;
      const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
      if (ddlItem) {
        options = ddlItem.value;
      }
    } else {
      if (field.options) {
        options = field.options.options;
      }
    }
    return options;
  };
});
//#endregion

onMounted(() => {});

onActivated(() => {
  props.setSearchDefault(state.searchData);
});

// 关闭窗口
const _cancel = () => {
  emit('update:visible', !props.config.visible); // 双向绑定prop.visible，通知父级组件变量值同步更新
};

// 字段change事件
const change = (ref: any, val: any, field: any) => {
  emit('on-change', ref, val, field);
};

// 选择items
const handleSelectionChange = (val: any) => {
  state.dataListSelections = val;
  // 选中后返回items
  emit('select-change', val);
};

// 分页大小改变
const handleSizeChange = (pageSize: number) => {
  state.dataOptions.pageSize = pageSize;
  base.loadData();
  emit('on-page-size-change', pageSize);
};

// 当前页码大小改变
const handleCurrentChange = (val: any) => {
  state.dataOptions.pageIndex = val;
  base.loadData();
};

// 选择数据
const onSelectData = () => {
  if (!state.dataListSelections.length) {
    proxy.$message.error('至少选择一条记录');
    return;
  }
  // 不允许选择开启规格的主商品
  if (state.dataListSelections.some((item: any) => item.openSpec)) {
    proxy.$message.error('不允许选择主商品，请选择子商品');
    return;
  }
  // 标示已经修改
  state.dataListSelections.forEach((item: any) => (item.__ischange__ = true));
  const rows = JSON.parse(JSON.stringify(state.dataListSelections));
  emit('on-selected', rows);
};

// 连接点击选中
const linkSelectData = (row: any) => {
  row = JSON.parse(JSON.stringify(row));
  emit('on-selected', [row]);
};

// 清除选中项
const clearSelection = () => {
  if (proxy.$refs.datatable) {
    proxy.$refs.datatable.clearSelection();
  }
};

// 对话框显示完后
const onOpen = () => {
  clearSelection();
};

// 树形输入框load
const treeLoad = (node: any, resolve: any, subField: any) => {
  emit('tree-load', node, resolve, subField);
  // 默认加载数据
  if (!subField.isLoaded) {
    let keyName = subField.ajaxParams.keyName;
    if (!keyName) {
      proxy.$message.error('未设置tree下拉框ajax加载参数！');
      return;
    }
    proxy.$nextTick(() => {
      let where = {};
      let userInfo = proxy.common.getUserInfo();
      if (node.level === 0) {
        where = {
          parentId: 0,
        };
      } else {
        where = {
          parentId: node.data[subField.ajaxParams.keyName],
        };
      }

      let url = '/api/common/loadTreeNode';
      let params = subField.ajaxParams;
      params.where = where;
      // proxy.common.ajax(
      // 	url,
      // 	params,
      // 	(res) => {
      // 		if (res.result) {
      // 			resolve(res.data);
      // 		} else {
      // 			the.$message.error(res.msg);
      // 		}
      // 	},
      // 	true
      // );
    });
  }
};

// tree当前Key Value
const getNodeKeyValue = (field: any) => {
  if (field.options.keyProp) {
    return state.searchData[field.options.keyProp];
  } else {
    return state.searchData[field.options.prop];
  }
};

// 获得焦点
const onFocus = (ref: any, val: any, event: any, field: any) => {
  emit('on-focus', ref, val, event, field);
};

// 树形下拉框获得点击项
const onTreeNodeClick = (data: any, node: any, el: any, labels: any, values: any, field: any) => {
  // 仅选择叶节点
  if (!node.isLeaf && field.options.onlySelectLeaf) return;

  let key = field.options.prop;
  // 将下拉框中的值赋给表单
  if (Object.keys(data).findIndex((item) => item === key) >= 0) {
    Object.keys(data).forEach((key, index) => {
      if (['value', 'label', 'hasChild', 'hasFactChild', 'state', 'attributes'].indexOf(key) < 0) {
        state.searchData[key] = data[key];
      }
    });
  } else {
    state.searchData[key] = data[key];
  }
  emit('on-tree-node-click', data, node, el, labels, values, field);
};

// input-select item click event
const itemClick = (ref: any, val: any, itemData: any, field: any) => {
  emit('on-item-click', ref, val, itemData, field, state.searchData);
};

// 按键抬起
const onKeyup = (ref: any, val: any, event: any, field: any, tableData?: any) => {
  // if (["decimal"].indexOf(field.options.dataType) >= 0) {
  //   props.formData[field.options.prop] = Number(val);
  // }
  emit('on-key-up', ref, val, event, field, tableData);
};

// 获得焦点
const onRowChange = (ref: any, selectedRow: any, field: any) => {
  emit('on-row-change', ref, selectedRow, field);
};

// 设置样式
const getStyle = (field: any) => {
  let style: any = {};
  if (field.options.width && field.options.width.indexOf('px')) {
    style.width = field.options.width + ' !important';
  }
  return style;
};

// 对外暴露属性和方法
defineExpose({
  /**
   * 设置查询条件值
   */
  setSearchValue: base.setSearchValue,
  /**
   * 初始化页面
   */
  init: base.init,
  /**
   * 设置为只读
   */
  setReadOnly: base.setReadOnly,
  /**
   * 执行查询操作
   */
  search: base.search,
});
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selector-dialog {
  .selector-container {
    .splitter-title {
      background-color: #f2f6fc;
      padding: 0px 10px;
      margin-bottom: 10px;
      border-bottom: #dcdfe6 2px double;
      position: relative;

      .title {
        padding: 5px 3px;
        border-bottom: #036fba 3px solid;
        font-size: 16px;
        display: inline-block;
        position: relative;
        bottom: -2px;
      }
    }

    .selector-table {
      padding: 0px;
    }

    .footer {
      text-align: center;
      padding: 30px 0 0;

      a.create {
        display: block;
        color: #036fba;
        text-decoration: underline;
        padding: 20px;
      }

      .el-button {
        padding: 15px 50px;
        font-size: 20px;
        background-color: #036fba;
      }
    }

    :deep(.el-select__selection.is-near) {
      margin-left: 1px;
    }
    :deep(.el-tag) {
      padding: 0 0px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.selector-dialog {
  .el-dialog__body {
    padding: 10px 20px 10px 10px;
  }

  .pagination-container {
    margin-top: 10px;
  }

  .el-table .el-table__header th,
  .el-table .el-table__body td {
    text-align: left !important;
  }
}
</style>
