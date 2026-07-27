<template>
  <div class="datalist-container">
    <!--工具栏-->
    <data-list-toolbar v-if="!hiddenToolbar" v-model:quick-search-value="state.quickSearchValue" v-model:quick-search-type="state.quickSearchType" :fields="fields" :buttons="buttons" :auth-nodes="props.authNodes" :refresh-loading="state.refreshLoading" :btn-read-only="btnReadOnly" :load-data="myHook.loadData" :editor-ref-name="editorRefName" :data-list-selections="currentDataListSelections" :search-fields="state.searchFields" :dropdown-data="dropdownStore.state.dataList" :button-click="buttonClick" :quick-search="quickSearch" :quick-search-fields="quickSearchFields" :right-width="rightWidth" :data-options="dataOptions" :is-simple-search="isSimpleSearch" :listActionHook="aHook" @on-super-reset="aHook.onSuperReset" @on-toolbar-change="aHook.onToolbarChange">
      <template v-slot:button-tool2-slot>
        <slot name="button-tool2-slot"></slot>
      </template>
    </data-list-toolbar>

    <!-- 自定义区域内容 -->
    <slot name="datalist-customer-area"></slot>
    <!--tab导航-->
    <tabs-nav :tab-nav-list="tabNavList" @on-tabs-nav-change="aHook.onTabsNavChange"></tabs-nav>
    <el-tabs v-if="props.dataOptions.openWaterfall" v-model="state.browserType" @tab-click="browserTabClick">
      <el-tab-pane label="瀑布流" name="waterfall"></el-tab-pane>
      <el-tab-pane label="列表模式" name="table"></el-tab-pane>
    </el-tabs>
    <!--瀑布流数据列表-->
    <slot v-if="state.browserType === 'waterfall' && props.dataOptions.openWaterfall" name="datalist-waterfall" :data="state.dataList">未实现瀑布流，请联系管理员</slot>
    <!--table数据列表-->
    <template v-else>
      <el-table ref="dataListRef" :data="state.dataList" :show-summary="props.dataOptions.showSumField" :summary-method="aHook.getSummaries" :max-height="props.dataOptions.maxHeight || 715" :row-style="props.rowStyle" :cell-style="(props.cellStyle as any)" :row-key="dataOptions.idField" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :default-expand-all="state.defaultExpandAll" :show-overflow-tooltip="false" highlight-current-row :size="props.size" class="table-region" @selection-change="aHook.handleSelectionChange" @header-click="aHook.headerClick" @sort-change="aHook.sortChange" @expand-change="aHook.expandChange" :key="state.expandkey">
        <el-table-column :width="'30px'" type="selection" fixed="left" class="col-selection" align="center"></el-table-column>
        <el-table-column :width="'30px'" :index="(index:number) => (dataOptions.pageIndex - 1) * dataOptions.pageSize + index + 1" type="index" fixed="left" class="col-index" label="#" align="center">
          <template #header>
            <span @click="state.showAttrDialog = true">#</span>
          </template>
        </el-table-column>
        <el-table-column v-if="openExpand" :width="'30px'" type="expand">
          <template #default="{ row, column }">
            <slot :row="row" :col="column" name="expand-slot"></slot>
          </template>
        </el-table-column>
        <template v-for="(col, index) in currentFields">
          <!--操作列插槽-->
          <el-table-column v-if="col.prop == '_action' && !col.hidden && dataOptions.showActionField" :key="index" :sortable="!!col.sortable ? 'custom' : false" :label="col.label" :width="col.width || 'auto'" :header-align="col.headerAlign || 'left'" :align="col.align || 'left'" fixed="right">
            <template #header>
              <span>{{ col.label }}</span>
              <el-link type="primary" class="margin-left-10" @click="state.showSetDialog = true">设置</el-link>
            </template>
            <template #default="{ row }">
              <slot :row="row" :col="col" name="action-column-slot">
                <template v-for="(btn, btnIndex) in col.action">
                  <template v-if="props.authNodes[btn.action]">
                    <el-button :key="btnIndex" type="primary" link size="small" @click="aHook.onRowActionClick(btn, col, row)">{{ btn.label }}</el-button>
                  </template>
                </template>
              </slot>
            </template>
          </el-table-column>
          <el-table-column v-else-if="col.prop != '_action' && !col.hidden" :key="'k' + index" :sortable="!!col.sortable ? 'custom' : false" :prop="col.prop" :label="$tt(col.label)" :width="col.width || 'auto'" :min-width="col.minWidth" :header-align="col.headerAlign || 'left'" :align="col.align || 'left'" :fixed="col.fixed">
            <template #header>
              <span>{{ col.label }}</span>
              <el-tooltip v-if="col.remark" class="item" effect="dark" placement="top">
                <template #content>
                  <span>
                    <pre style="margin: 0px">{{ col.remark }}</pre>
                  </span>
                </template>
                <SvgIcon name="ele-QuestionFilled" class="margin-left-5" />
              </el-tooltip>
            </template>
            <template #default="{ row }">
              <!--通用列插槽-->
              <slot :row="row" :col="col" :translateText="aHook.translateText" name="common-column-slot">
                <template v-if="col.prop == dataOptions.linkColumn">
                  <el-link type="primary" @click="aHook.linkEditor(row[dataOptions.idField], row)">
                    {{ common.formatData(row, col) }}
                  </el-link>
                </template>
                <template v-else>
                  <!-- 通用标签颜色着色 -->
                  <template v-if="col.tagColorList && col.tagColorList.length && row[col.prop] !== undefined">
                    <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
                      {{ common.formatData(row, col) }}
                    </el-tag>
                  </template>
                  <template v-else>
                    {{ common.formatData(row, col) }}
                  </template>
                </template>
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </template>
    <div class="pagination-container">
      <el-pagination v-model:currentPage="dataOptions.pageIndex" v-model:page-size="dataOptions.pageSize" :page-sizes="[5, 10, 15, 20, 50, 100, 200, 300, 500, 1000]" :total="dataOptions.total" background layout="total, sizes, prev, pager, next, jumper" :onUpdate:page-size="aHook.handleSizeChange" :onUpdate:current-page="aHook.handleCurrentChange"></el-pagination>
    </div>
    <!-- 数据列表 底部 统计表格 -->
    <slot name="datalist-footer"></slot>

    <!--设置是否可以显示字段-->
    <el-dialog ref="dialogRef" v-model="state.showSetDialog" title="参数设置" top="10vh" class="show-set-dialog" width="600px" draggable>
      <el-alert :closable="false" title="拖动字段可以调整顺序，点击右侧开关可以设置字段是否显示" type="success" class="alert-msg"></el-alert>
      <ul class="draggable-main">
        <li class="item">
          <span>字段名</span>
          <span class="right"> 字段显示 </span>
          <span class="right margin-right-10"> 显示排序 </span>
        </li>
      </ul>
      <!-- <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
				<draggable :list="currentFields" item-key="label" class="draggable-main" tag="ul" :animation="300" handle=".handle" chosen-class="chosen-item" :move="aHook.fieldSetMove" @start="aHook.startDrag" @end="aHook.endDrag">
					<template #item="{ element }">
						<li :class="['item', { over: element === state.targetElement }]">
							<i class="handle yrt-yidong1"></i>
							<span>{{ element.label }}</span>
							<el-switch v-model="element.hidden" :active-value="false" :inactive-value="true" class="right"></el-switch>
							<el-switch v-model="element.sortable" :active-value="true" :inactive-value="false" class="right margin-right-30"></el-switch>
						</li>
					</template>
				</draggable>
			</el-scrollbar> -->
      <template #footer>
        <div class="dialog-footer space-between">
          <div class="item">
            <el-checkbox v-model="state.isNotSelections" @change="aHook.isNotSelectionsChange">取消勾选记忆</el-checkbox>
          </div>
          <div class="item">
            <template v-if="isCustomField">
              <span>字段排序已自定义</span>
              <el-button type="primary" link @click="aHook.resetTableConfig">点击还原默认</el-button>
            </template>
            <el-button @click="state.showSetDialog = false">取 消</el-button>
            <el-button type="primary" icon="icon-baocun" @click="aHook.saveTableConfig">确 定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <import-dialog v-model:visible="state.importOptions.visible" :import-options="state.importOptions" :dataOptions="props.dataOptions" @on-close="onCloseImport"></import-dialog>

    <!-- 批量导出对话框 -->
    <export-dialog ref="export-dialog" v-model:visible="state.exportOptions.visible" :exportOptions="state.exportOptions" :export-data="aHook.exportData">
      <template v-slot:export-module-list>
        <slot name="export-module-list"></slot>
      </template>
    </export-dialog>

    <!-- 打印对话框 -->
    <print-dialog v-model:visible="state.printOptions.printVisible" :data-options="dataOptions" :dataListSelections="dataListSelections" :printOptions="state.printOptions"></print-dialog>

    <!--显示字段属性-->
    <table-info-dialog v-model:visible="state.showAttrDialog" :data-options="dataOptions" :fields="fields"></table-info-dialog>
  </div>
</template>

<script setup lang="ts" name="yrt-data-list">
import { ComponentInternalInstance } from 'vue';
import ImportDialog from '/@/components/common/components/import-dialog.vue';
import ExportDialog from '/@/components/common/components/export-dialog.vue';
import TabsNav from '/@/components/common/components/tabs-nav.vue';
import DataListToolbar from '/@/components/common/components/data-list-toolbar.vue';
import TableInfoDialog from './components/table-info-dialog.vue';
import PrintDialog from '/@/components/common/components/print-dialog.vue';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import { QueryBo, SearchField } from '/@/types/common';
import listLoadHook from '../hooks/listLoadHook';
import { StateOptions } from '../hooks/listLoadHook';
import actionHook from '../hooks/listActionHook';
import useDropdownStore from '/@/stores/modules/dropdown';
import { QueryType } from '/@/types/common';

const dropdownStore = useDropdownStore();
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;

// 事件定义
const emit = defineEmits(['update:dataListSelections', 'update:data', 'on-load-data-after', 'on-expand-change', 'on-selection-change']);

//#region 定义属性
const props = defineProps({
  // 数据加载地址
  loadUrl: {
    type: String,
    default: '/api/common/loadDataList',
  },
  // 默认数据
  data: {
    type: Array,
    default: () => [],
  },
  // 字段定义
  fields: {
    type: Array<SearchField>,
    required: true,
    default: () => Array<SearchField>,
  },
  // 按钮定义
  buttons: {
    type: Array,
    required: false,
    default: () => [],
  },
  // 按钮点击事件
  buttonClick: {
    type: Function,
    required: false,
    default: null,
  },
  // 数据参数
  dataOptions: {
    type: Object as PropType<DataOptions>,
    default: () => {
      return {
        total: 10,
      };
    },
  },
  // 操作列自定义
  actionField: {
    type: Object,
    default: null,
  },
  // 选中项
  dataListSelections: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 编辑器ref名
  editorRefName: {
    type: String,
    default: 'editor-dialog',
  },
  // 固定条件
  fixedWhere: {
    type: Object,
    default: null,
  },
  // 权限集合
  authNodes: {
    type: Object,
    required: true,
    default: () => {},
  },
  // 按钮是否可用
  btnReadOnly: {
    type: Object,
    required: false,
    default: () => {
      return {
        save: false,
        auditing: false,
        add: false,
        delete: false,
        stop: false,
        open: false,
      };
    },
  },
  // 删除前事件
  onDeleteBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 终止前事件
  onStopBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 打开页面默认时加载数据
  isInitLoad: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  // tab导航数据结构
  tabNavList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 快捷查询扩展条件集合
  quickSearchFields: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 右侧搜索宽度
  rightWidth: {
    type: Number,
    default: () => {
      return 380;
    },
  },
  // 加载数据前事件
  loadDataBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 批量审核事件
  onBatchAuditingBefore: {
    type: Function,
    default: () => {
      return () => {
        return true;
      };
    },
  },
  // 批量反审核事件
  onReBatchAuditingBefore: {
    type: Function,
    default: () => {
      return () => {
        return true;
      };
    },
  },
  // 表格最大高度
  // maxHeight: {
  // 	type: [String, Number],
  // 	default: () => {
  // 		return 715;
  // 	},
  // },
  // 数据转换
  onTranslate: {
    type: Function,
    default: () => {
      return () => {
        return true;
      };
    },
  },
  // 行样式
  rowStyle: {
    type: Object || Function,
  },
  // 单元格样式
  cellStyle: {
    type: [Object, Function],
    default: () => {
      return () => {
        return {};
      };
    },
  },
  // 开启展开
  openExpand: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  // 加载子集
  loadSub: {
    type: [Object, Function],
    default: () => {
      return () => {
        return [];
      };
    },
  },
  // 隐藏操作工具栏
  hiddenToolbar: {
    type: Boolean,
    default: false,
  },
  // 简易查询
  isSimpleSearch: {
    type: Boolean,
    default: false,
  },
  // 是否为静态数据
  isStaticData: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'default',
  },
});
//#endregion

//#region 定义变量
const state: StateOptions = reactive({
  drag: false,
  targetElement: undefined,
  // 可以显示字段
  showFields: props.fields.map((v: any) => {
    return !v.hidden && v.label;
  }) as Array<SearchField>,
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
    importId: 0,
    url: '',
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
  idSelections: [],
  // 不需要记忆选中
  isNotSelections: false,
  // 瀑布流tab
  browserType: 'waterfall',
});
//#endregion

//#region 计算属性
// 可用字段
const currentFields = computed(() => {
  var _fields: Array<any> = [...props.fields];
  var _index = _fields.findIndex((item: any) => {
    return item.prop === '_action';
  });
  if (_index < 0 && props.dataOptions.showActionField) {
    if (props.actionField) {
      _fields.push(props.actionField);
    } else {
      _fields.push(state.actionFieldDefault);
    }
  }
  return _fields;
});

// 快速查询
const quickSearch = computed(() => {
  var quick = {
    fields: props.fields
      .filter((item: any) => {
        return item.isQuickSearch === true;
      })
      .map((v: any) => {
        var item = {
          prop: v.prop,
          label: v.label,
          type: v.type,
        };
        return item;
      }),
    placeholder: aHook.getQuickSearchPlaceolder(),
    type: '精确',
  };
  return quick;
});

// 选中items
const currentDataListSelections = computed({
  get() {
    return props.dataListSelections;
  },
  set(val) {
    emit('update:dataListSelections', val);
  },
});

// 是否自定义字段列设置
const isCustomField = computed(() => {
  var router = proxy.$route.fullPath;
  var key = 'tableConfig_' + router;
  var fields = localStorage.getItem(key);
  return !!fields;
});

// 数据
const currentData = computed({
  get() {
    return props.data;
  },
  set(val) {
    emit('update:data', val);
  },
});
//#endregion

//#region wacth
watch(
  () => props.fields,
  (newVal) => {
    var fields: Array<SearchField> = [];
    // 如果没有设置条件，默认显示所有字段
    if (!fields.length) {
      fields = props.fields.filter((item: any) => {
        return item.prop !== '_action';
      });
    }
    fields = fields.map((v) => {
      var operator: QueryType = v.isFuzzyQuery ? QueryType.LIKE : QueryType.EQ;
      if (v.type === 'select' || v.type === 'tree' || v.type === 'radio') {
        operator = QueryType.EQ;
      }
      let val: Array<any> | null = null;
      if (v.searchDefaultValue) {
        val = (v.multiple ? [v.searchDefaultValue] : []) as Array<any>;
      }
      const width = (v.searchWidth || 120) + 'px';
      var item: SearchField = {
        prop: v.prop,
        keyProp: v.keyProp,
        label: v.label,
        dataType: v.dataType,
        type: v.type,
        options: v.options,
        operator: operator,
        value: val,
        dropdownId: v.dropdownId,
        searchRowNo: v.searchRowNo,
        multiple: v.multiple,
        filterable: v.filterable,
        isExpandField: !!v.isExpandField,
        isFuzzyQuery: !!v.isFuzzyQuery,
        width: width, // 查询框宽度
      };
      if (v.expandFieldName) {
        item.expandFieldName = v.expandFieldName;
      }
      if (v.type === 'tree') {
        item.ajaxParams = v.ajaxParams;
        item.onlySelectLeaf = v.onlySelectLeaf;
      }
      return item;
    });
    state.searchFields = fields;
  },
  { deep: true, immediate: true }
);
//#endregion

//#region 定义事件
const events = {
  /**
   * 保存后事件
   */
  onLoadDataAfter(dataList: any[]) {
    emit('on-load-data-after', dataList);
  },
  /**
   * 展开事件
   */
  onExpandChange(row: any, expandedRows: any) {
    emit('on-expand-change', row, expandedRows);
  },
  /**
   * 选中事件
   */
  onSelectionChange(rows: any) {
    emit('on-selection-change', rows);
  },
};
//#endregion

//#region onMounted
// 不需要记忆选中
const url = proxy.$route.path.replace(/\//gi, '-');
const key = 'isNotSelections' + url;
state.isNotSelections = localStorage[key] === 'true';

onMounted(async () => {
  // 监听编辑页面保存后刷新列表
  proxy.mittBus.on('on-list-refresh', (params: any) => {
    if (props.dataOptions.editorCheckCode === params.editorCheckCode) {
      myHook.loadData();
    }
  });
});
//#endregion

const myHook = listLoadHook({ props, currentData, state, quickSearch, currentDataListSelections, currentFields, events });
const aHook = actionHook({ props, currentData, state, quickSearch, currentDataListSelections, currentFields, events });

onMounted(async () => {});

// 浏览模式切换
const browserTabClick = () => {};

// 关闭导入对话框
const onCloseImport = async () => {
  await myHook.loadData();
};

// 对外暴露属性和方法
defineExpose({
  /**
   * 当前页面数据列表
   */
  dataList: state.dataList,
  /**
   * 加载数据
   */
  loadData: myHook.loadData,
  /**
   * 重新加载数据
   */
  reload: myHook.loadData,
  /**
   * 连接编辑页面
   */
  linkEditor: aHook.linkEditor,
  /**
   * 删除列表
   */
  deleteData: aHook.deleteData,
  /**
   * 获取查询条件
   */
  getAllWhere: myHook.getAllWhere,
});
</script>

<style lang="scss" scoped>
.datalist-container {
  min-width: 0;
  max-width: 100%;
  background-color: white;
  border-radius: 4px;
  padding: 10px;

  .search-region {
    .tool-left {
      .tool-group + .tool-group {
        margin-left: 10px;
      }

      .el-button--medium {
        padding: 10px 10px;
      }
    }

    .tool-right {
      text-align: right;

      .search-input {
        width: calc(100% - 80px);
        max-width: 300px;

        .search-btn {
          padding: 10px;
        }
      }

      .show-supper-searcher {
        margin-left: 10px;
      }

      .popup-right {
        text-align: left;
        line-height: 1.2;
        z-index: 10;

        .header {
          background-color: #f6f6f6;
          padding: 10px;
        }

        .main {
          background-color: #fff;
          padding: 0;
          min-height: 400px;

          :deep(.el-scrollbar) {
            height: 395px;
          }

          :deep(.scrollbar-wrap) {
            max-height: 410px;
            overflow-x: hidden;

            .el-form {
              padding: 10px;

              .el-form-item {
                margin-bottom: 10px;
              }
            }
          }
        }

        .footer {
          background-color: #f6f6f6;
          padding: 10px;
          overflow: hidden;
        }
      }
    }

    :deep(.el-form-item__content) {
      position: static;
    }
  }

  .table-region {
    width: 100%;
    max-width: 100%;
    z-index: 0;

    /* begin 解决合计滚动条问题 */
    // overflow: auto;
    // &::after {
    //   position: relative;
    // }
    // :deep(.el-table__header-wrapper),
    // :deep(.el-table__body-wrapper),
    // :deep(.el-table__footer-wrapper) {
    //   overflow: visible;
    // }
    /* end 解决合计滚动条问题 */
    :deep(.el-checkbox) {
      height: 24px;
    }

    :deep(.cell) {
      line-height: 20px;
      padding-left: 5px;
      padding-right: 0px;
    }

    .el-button--mini {
      padding: 2px 0;
    }

    :deep(.el-button--medium) {
      padding: 2px 0px;
    }

    :deep(td) {
      padding: 5px 0;
    }
  }
}

/* el-popover列是否显示设置 */
.table-op-col {
  .set {
    color: #0465a8;
    cursor: pointer;
    display: inline-block;
    margin-left: 20px;
  }
}

.col-set-group {
  padding-bottom: 30px;

  .col-set-item {
    width: 50%;
    padding-top: 15px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}

.col-set-footer {
  padding: 20px 0px 10px;
  text-align: right;
  border-top: 1px solid #e4e7ed;
}

/* ********************************************** */

.list-complete-enter-active {
  overflow: hidden;
  transition: all 1s;
}

.list-complete-leave-active {
  margin-top: 0px;
  overflow: hidden;
  transition: all 1s;
}

.list-complete-enter,
.list-complete-leave-to {
  height: 0px;
  opacity: 0;
  padding: 0px;
  margin-top: 0px;
  overflow: hidden;
}

.pagination-container {
  max-width: 100%;
  overflow-x: auto;
  margin-top: 10px;
}

@media screen and (max-width: 600px) {
  .datalist-container {
    padding: 8px;
  }

  .pagination-container {
    :deep(.el-pagination) {
      flex-wrap: wrap;
      gap: 6px 0;
    }
  }
}
</style>

<style lang="scss">
.show-set-dialog {
  & > .el-dialog__body {
    padding: 10px 20px !important;
  }

  .scrollbar-wrap {
    max-height: 400px;
  }

  .alert-msg {
    margin-bottom: 10px;
  }

  .draggable-main {
    margin: 0;
    padding: 0;

    li.item {
      border: 1px solid #f8f8f8;
      padding: 10px;
      margin: 1px;
      background-color: #f3f3f3;

      &.over {
        background-color: #fff;
      }

      &.chosen-item {
        border: 1px dotted rgb(44, 104, 163);
        background-color: #409eff;
        color: white;

        .handle {
          color: white;
        }
      }

      .handle {
        cursor: move;
        color: rgb(70, 70, 71);
      }
    }
  }
}
</style>
