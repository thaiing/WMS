<template>
  <el-form class="search-region" @submit.prevent>
    <el-form-item class="margin-bottom-10">
      <div class="tool-left">
        <slot name="button-tool-slot">
          <template v-for="button in currentButton">
            <!--分组按钮-->
            <el-button-group v-if="button.type == 'button-group' && hasValidButton(button.buttons)" class="tool-group">
              <template v-for="(btn, btnIndex) in button.buttons">
                <template v-if="btn.type === 'button'">
                  <template v-if="['refresh', 'helper'].indexOf(btn.options.authNode) >= 0 || authNodes[btn.options.authNode]">
                    <el-button :name="btn.options.authNode" :loading="btn.options.authNode == 'refresh' && refreshLoading" :type="btn.options.type" @click="() => onButtonAction(btn.options.authNode, btn)">
                      <template #icon>
                        <svg-icon :name="btn.options.icon" class="text-size-n" :size="14" />
                      </template>
                      {{ $tt(btn.label) }}
                    </el-button>
                  </template>
                </template>
                <template v-else-if="btn.type === 'button-dropdown' && authNodes[btn.options.authNode]">
                  <!--下拉框按钮-->
                  <el-dropdown style="margin-left: 0 !important">
                    <el-button :type="btn.options.type"> {{ btn.label }} <svg-icon name="ele-ArrowDown" class="ml-10"></svg-icon> </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <template v-for="(item, itemIndex) in btn.options.options">
                          <el-dropdown-item v-if="authNodes[item.authNode]" @click="onButtonAction(item.authNode, btn)">{{ item.label }}</el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </template>
            </el-button-group>
            <template v-else-if="button.type === 'button-dropdown' && authNodes[button.options.authNode]">
              <!--下拉框按钮-->
              <el-dropdown class="ml-10">
                <el-button :type="button.options.type"> {{ button.label }} <svg-icon name="ele-ArrowDown" class="ml-10"></svg-icon> </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <template v-for="(item, itemIndex) in button.options.options">
                      <el-dropdown-item v-if="authNodes[item.authNode]" @click="onButtonAction(item.authNode, button)">{{ item.label }}</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <!--不分组按钮-->
            <template v-else-if="['refresh', 'helper'].indexOf(button.options.authNode) >= 0 || authNodes[button.options.authNode]">
              <el-button :disabled="btnReadOnly[button.options.authNode]" v-bind="button.options" @click="() => onButtonAction(button.options.authNode, button)">
                <template #icon>
                  <svg-icon :name="button.options.icon" class="text-size-n" :size="14" />
                </template>
                {{ $tt(button.label) }}
              </el-button>
            </template>
          </template>
        </slot>
        <slot name="button-tool2-slot"></slot>
      </div>
      <div :class="['tool-right', { 'search-only-line': dataOptions.searchOnlyLine }]">
        <!-- 快速查询字段 - 自定义 -->
        <template v-for="(col, index) in currentQuickSearchFields">
          <div v-if="['date', 'datetime'].indexOf(col.dataType) >= 0" :key="'col' + index" class="inline-block">
            <el-date-picker v-model="col.value" :picker-options="col.type === 'daterange' ? state.datePickOptions : null" :start-placeholder="col.label + '开始日期'" :type="col.type" align="right" unlink-panels range-separator="至" end-placeholder="结束日期" value-format="YYYY-MM-DD HH:mm:ss" class="w-230"></el-date-picker>
          </div>
          <div v-else-if="col.type === 'select'" :key="'select' + index" class="inline-block">
            <el-select v-model="col.value" :placeholder="col.label" :multiple="col.multiple" clearable class="w-120 inline-block" @change="change(col)">
              <el-option v-for="(item, optionIndex) in col.dropdownData" :key="'ops' + optionIndex" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div v-else-if="col.type === 'textarea'" :key="'textarea' + index" class="inline-block">
            <el-input v-model="col.value" :placeholder="col.label" :rows="1" type="textarea" class="search-texarea"></el-input>
          </div>
          <div v-else :key="index" class="w-120 inline-block">
            <el-input v-model="col.value" :placeholder="col.label" @keydown.stop.enter="loadData('quick')"></el-input>
          </div>
        </template>
        <!-- 快速查询字段 - 常用查询字段 -->
        <template v-for="(col, index) in searchFields_quick">
          <div v-if="['date', 'datetime'].indexOf(col.dataType) >= 0" :key="index" class="inline-block">
            <el-date-picker v-model="col.value" :picker-options="state.datePickOptions" type="daterange" align="right" unlink-panels :range-separator="$tt('至')" :start-placeholder="col.label + $tt('开始日期')" :end-placeholder="$tt('结束日期')" value-format="YYYY-MM-DD HH:mm:ss" class="w-230"></el-date-picker>
          </div>
          <template v-else-if="col.type == 'select'">
            <el-select :key="'col_' + index" v-model="col.value" :placeholder="col.label" :multiple="col.multiple" :filterable="!!col.filterable" clearable class="inline-block" :style="{ width: col.width }" @change="change(col)">
              <el-option v-for="(item, optionIndex) in getOptions(col)" :key="'ops' + optionIndex" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
          <!-- 表格选择框 -->
          <template v-else-if="col.type === 'table-select'">
            <table-select v-model="col.value" :form-data="col" :field="col" :columns="col.options.columns" :label="col.label" :input-width="col.width" :placeholder="col.label" :value-field="col.options.valueField" :label-field="col.options.labelField" class="mr-5" @on-row-click="() => change(col)"></table-select>
          </template>
          <div v-else :key="'input_' + index" class="inline-block">
            <el-input v-model="col.value" :placeholder="col.label" :style="{ width: col.width }" @keydown.stop.enter="loadData('quick')"></el-input>
          </div>
        </template>

        <!-- 快速查询字段 - 关键词 -->
        <el-input ref="quickSearchInput" v-model="currentQuickSearchValue" :type="state.searchInpuType" :rows="1" :placeholder="quickSearch.placeholder" class="search-input" @keydown.stop.enter="loadData('quick')">
          <template #prepend>
            <el-select v-model="currentQuickSearchType" :placeholder="$tt('请选择')" class="w-70" @change="changeQuickSearchType">
              <el-option :label="$tt('精确')" value="精确"></el-option>
              <el-option :label="$tt('模糊')" value="模糊"></el-option>
              <el-option :label="$tt('多行')" value="多行"></el-option>
            </el-select>
          </template>
        </el-input>
        <el-button type="primary" class="search-btn margin-left-5" @click="quickSearchData">{{ $tt('查询') }}</el-button>
        <el-button v-if="!isSimpleSearch" class="search-btn super-reset" link @click="superReset(true)">{{ $tt('重置') }}</el-button>
        <el-button v-if="!isSimpleSearch" class="show-supper-searcher" link @click.stop="showPopupRight">{{ $tt('高级') }}</el-button>
        <el-dropdown v-if="!isSimpleSearch" placement="bottom" style="display: contents">
          <el-button type="primary" link>
            快捷查询
            <i class="el-icon-arrow-down el-icon-right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="space-between" @click="onMenuItem('day')">
                <span class="txt">今天数据</span>
              </el-dropdown-item>
              <el-dropdown-item class="space-between" @click="onMenuItem('week')">
                <span class="txt">最近一周</span>
              </el-dropdown-item>
              <el-dropdown-item class="space-between" @click="onMenuItem('month')">
                <span class="txt">最近一月</span>
              </el-dropdown-item>
              <el-dropdown-item class="space-between" @click="onMenuItem('year')">
                <span class="txt">最近一年</span>
              </el-dropdown-item>
              <template v-for="(item, index) in state.mySearchList">
                <el-dropdown-item v-if="index === 0" divided :command="item.name" class="space-between" @click="onMenuItem(item)">
                  <span class="txt">{{ item.name }}</span>
                  <i class="el-icon-delete ico" @click.stop="deleteMenuItem(index)"></i>
                </el-dropdown-item>
                <el-dropdown-item v-else :command="item.name" class="space-between" @click="onMenuItem(item)">
                  <span class="txt">{{ item.name }}</span>
                  <i class="el-icon-delete ico" @click.stop="deleteMenuItem(index)"></i>
                </el-dropdown-item>
              </template>
              <el-dropdown-item divided class="space-between" @click="onMenuItem('custom')">
                <span class="txt">自定义快捷查询</span>
                <el-tooltip effect="dark" placement="top">
                  <template #content>
                    <div class="line-height-1_5">
                      1、在弹窗的高级查询条件中，设置好查询条件后
                      <br />
                      2、点击“保存快捷查询”按钮 <br />
                      3、即可将当前设置查询条件作为快捷查询
                    </div>
                  </template>
                  <i class="el-icon-info ico"></i>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!--高级查询侧滑-->
        <popup-right v-if="!isSimpleSearch" :top="'48px'" :width="'820px'" :height="'auto'" :is-active="state.popupRightActive" class="popup-right">
          <template #header>
            <div class="header">{{ $tt('高级查询') }}</div>
          </template>
          <div class="main">
            <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
              <el-form :inline="true" label-width="110px">
                <template v-for="(col, index) in currentSearchFields">
                  <el-form-item v-if="col.prop != '_action'" :key="index" :label="col.label">
                    <template v-if="col.type == 'select'">
                      <el-select v-model="col.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px">
                        <el-option v-for="item in state.operators" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <el-select v-model="col.value" :multiple="!!col.multiple" :placeholder="$tt('请选择')" clearable filterable class="w-200">
                        <el-option v-for="(item, optionIndex) in getOptions(col)" :key="'ops' + optionIndex" :label="item.label === null ? '' : item.label" :value="item.value === null ? '' : item.value"></el-option>
                      </el-select>
                    </template>
                    <template v-else-if="col.type == 'radio'">
                      <el-select v-model="col.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px">
                        <el-option v-for="item in state.operators" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <el-radio-group v-model="col.value">
                        <el-radio v-for="(item, optionIndex) in getOptions(col)" :key="'ops' + optionIndex" :label="item.value">{{ item.label }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else-if="col.type == 'tree'">
                      <el-select v-model="col.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px">
                        <el-option v-for="item in state.operators" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <tree-select v-model="col.value" :options="{ prop: col.prop, width: '200px' }" :label="col.label" :tree-load="(node: any, resolve: any) => { treeLoad(node, resolve, col) }" @on-tree-node-click="(data: any, node: any, el: any) => { onTreeNodeClick(data, node, el, col) }"></tree-select>
                    </template>

                    <!-- 表格选择框 -->
                    <template v-else-if="col.type === 'table-select'">
                      <el-select v-model="col.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px">
                        <el-option v-for="item in state.operators" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <table-select v-model="col.value" :form-data="col" :field="col" :columns="col.options.columns" :label="col.label" :input-width="200" :placeholder="col.options.placeholder" :value-field="col.options.valueField" :label-field="col.options.labelField"></table-select>
                    </template>
                    <template v-else>
                      <template v-if="['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(col.dataType) >= 0">
                        {{ $tt('从') }}：
                        <el-input v-model.number="col.fromValue" :placeholder="$tt('开始值')" type="number" style="width: 102px" @keydown.stop.enter="loadData()"></el-input>
                        <span class="margin-left-10">{{ $tt('到') }}：</span>
                        <el-input v-model.number="col.toValue" :placeholder="$tt('结束值')" type="number" style="width: 102px" @keydown.stop.enter="loadData()"></el-input>
                      </template>
                      <template v-else-if="['date', 'datetime'].indexOf(col.dataType) >= 0">
                        <el-date-picker v-model="col.value" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="'结束日期'" style="width: 275px"></el-date-picker>
                        <!-- <el-date-picker v-model="col.value" type="daterange" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date">
                        </el-date-picker> -->
                      </template>
                      <template v-else>
                        <el-select v-model="col.operator" :default-first-option="true" :placeholder="$tt('请选择')" class="operator" style="width: 70px" @change="if (col.operator === 'null') col.value = null;">
                          <el-option v-for="item in state.operators" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-model="col.value" :disabled="col.operator == 'null'" :type="col.operator === 'IN' ? 'textarea' : 'text'" :rows="1" class="w-200" @keydown.stop.enter="() => loadData()"></el-input>
                      </template>
                    </template>
                  </el-form-item>
                </template>
              </el-form>
            </el-scrollbar>
          </div>
          <template #footer>
            <div class="footer">
              <el-button class="left" link @click="hidePopupRight">{{ $tt('关闭') }}</el-button>
              <el-button class="left" link @click="saveSearch">{{ $tt('保存快捷查询') }}</el-button>
              <el-button class="right" @click="superReset(true)">{{ $tt('重置') }}</el-button>
              <el-button class="right mr-10 pl-10 pr-10" type="primary" @click="superSearcher">{{ $tt('查询') }}</el-button>
            </div>
          </template>
        </popup-right>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="data-list-toolbar">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import moment from 'moment';
import PopupRight from '/@/components/base/PopupRight.vue';
import TreeSelect from '/@/components/base/TreeSelect.vue';
import TableSelect from '/@/components/base/TableSelect.vue';

import useDropdownStore from '/@/stores/modules/dropdown';
import { PropType } from 'vue';
const dropdownStore = useDropdownStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:quickSearchValue', 'update:quickSearchType', 'on-super-reset', 'tree-load', 'on-toolbar-change']);

//#region 定义属性
const props = defineProps({
  // 字段定义
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 按钮定义
  buttons: {
    type: Array,
    required: false,
    default: () => [] as any[],
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
      return {} as DataOptions;
    },
  },
  // 刷新按钮loading
  refreshLoading: {
    type: Boolean,
    required: true,
    default: false,
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
  // 加载数据
  loadData: {
    type: Function,
    required: true,
    default: () => {},
  },
  // 编辑器ref
  editorRefName: {
    type: String,
    required: true,
  },
  // 选中项
  dataListSelections: {
    type: Array,
    required: true,
  },
  // 高级查询字段
  searchFields: {
    type: Array,
    required: true,
  },
  // 下拉框数据
  dropdownData: {
    type: Array,
    required: true,
  },
  // 快速查询参数设置
  quickSearch: {
    type: Object,
    required: true,
  },
  // 关键词查询值
  quickSearchValue: {
    type: String,
    required: true,
  },
  // 查询类别
  quickSearchType: {
    type: String,
    required: true,
  },
  // 快捷查询扩展条件集合
  quickSearchFields: {
    type: Array,
    required: true,
  },
  // 右侧搜索宽度
  rightWidth: {
    type: Number,
    required: true,
  },
  // 简易查询
  isSimpleSearch: {
    type: Boolean,
    default: false,
  },
  // 简易查询
  listActionHook: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 权限集合
  authNodes: {
    type: Object,
    required: true,
    default: () => {},
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 是否显示右侧弹出窗
  popupRightActive: false,
  // 查询运算符
  operators: [
    { value: 'LIKE', label: '模糊' },
    { value: 'ISNULL', label: '空值' },
    { value: 'GE', label: '>=' },
    { value: 'LE', label: '<=' },
    { value: 'EQ', label: '=' },
    { value: 'NE', label: '<>' },
    { value: 'IN', label: '多行' },
  ],
  datePickOptions: {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近一个月',
        onClick(picker: any) {
          const end = new Date();
          const start = moment().subtract(1, 'months').toDate();
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近三个月',
        onClick(picker: any) {
          const end = new Date();
          const start = moment().subtract(3, 'months').toDate();
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近半年',
        onClick(picker: any) {
          const end = new Date();
          const start = moment().subtract(6, 'months').toDate();
          picker.$emit('pick', [start, end]);
        },
      },
      {
        text: '最近一年',
        onClick(picker: any) {
          const end = new Date();
          const start = moment().subtract(12, 'months').toDate();
          picker.$emit('pick', [start, end]);
        },
      },
    ],
  },
  // 快速查询框类别
  searchInpuType: 'text',
  // 显示保存查询弹窗
  saveVisible: false,
  // 我的查询列表
  mySearchList: [] as Array<any>,
});
//#endregion

//#region 计算属性
const currentButton = computed(() => {
  return props.buttons as any;
});
const currentQuickSearchFields = computed(() => {
  return props.quickSearchFields as any;
});
const currentSearchFields = computed(() => {
  return props.searchFields as Array<any>;
});

// 判断按钮组是否存在可用按钮
const hasValidButton = computed(() => {
  return (buttons: any) => {
    const authNodes = Object.assign({}, props.authNodes, {
      refresh: true,
      helper: true,
    });
    return (
      buttons.filter((btn: any) => {
        return authNodes[btn.options.authNode];
      }).length > 0
    );
  };
});

// 高级查询筛出序号>=200的字段作为快速查询
const searchFields_quick = computed(() => {
  return props.searchFields
    .filter((item: any) => {
      return item.searchRowNo >= 200;
    })
    .sort(function (a: any, b: any) {
      if (a.searchRowNo > b.searchRowNo) {
        return -1;
      }
      if (a.searchRowNo < b.searchRowNo) {
        return 1;
      }
      return 0;
    }) as any;
});

// 快捷查询值
const currentQuickSearchValue = computed({
  get() {
    return props.quickSearchValue;
  },
  set(newValue) {
    emit('update:quickSearchValue', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 快捷查询类别
const currentQuickSearchType = computed({
  get() {
    return props.quickSearchType;
  },
  set(newValue) {
    localStorage['quickSearchType'] = newValue;
    emit('update:quickSearchType', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
    if (newValue === '多行') {
      state.searchInpuType = 'textarea';
    }
  },
});

// 获得下拉框options
const getOptions = computed(() => {
  return function (col: any) {
    let options = [];
    if (col.dropdownId > 0) {
      let key = 'dropdown' + col.dropdownId;
      const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
      if (ddlItem) {
        options = ddlItem.value;
      }
    } else if (col.options && col.options.dropdownId) {
      let key = 'dropdown' + col.options.dropdownId;
      const ddlItem = dropdownStore.state.dataList.find((item) => item.key === key);
      if (ddlItem) {
        options = ddlItem.value;
      }
    } else if (col.options && col.options.remote === false) {
      options = col.options.options;
    }
    if (!options) {
      options = [];
    }
    return options;
  };
});
//#endregion

onMounted(async () => {
  const quickSearchType = localStorage['quickSearchType'] || '精确';
  currentQuickSearchType.value = quickSearchType;

  // 我的查询条件
  const key = proxy.$route.path;
  let dataList = [];
  const strList = localStorage.getItem(key);
  if (strList) {
    dataList = JSON.parse(strList);
  }
  state.mySearchList = dataList;
});

// 工具栏按钮事件
const onButtonAction = (authNode: string, btnOpts: any, btn?: any) => {
  let result;
  if (props.buttonClick) {
    result = props.buttonClick(authNode, btnOpts, btn);
  }
  if (result !== undefined) {
    return;
  }
  proxy.$nextTick(() => {
    switch (authNode) {
      case 'add':
        // 触发新建事件
        proxy.mittBus.emit('onAdd', { editorRefName: props.editorRefName, index: 0 });
        break;
      case 'refresh':
        // 刷新
        props.loadData();
        break;
      case 'delete':
        // 批量删除
        props.listActionHook.deleteData(props.dataListSelections);
        break;
      case 'import':
        // 批量导入
        props.listActionHook.importDialog(btnOpts);
        break;
      case 'export':
        // 批量导出
        props.listActionHook.exportDialog(btnOpts);
        break;
      case 'print':
        // 默认打印
        props.listActionHook.print(authNode, btnOpts);
        break;
      case 'batchOpen':
        // 批量开启
        props.listActionHook.batchOpen(props.dataListSelections);
        break;
      case 'batchStop':
        // 批量终止
        props.listActionHook.batchStop(props.dataListSelections);
        break;
      case 'auditing':
      case 'multiAuditing':
      case 'batchAuditing':
        // 批量审核
        props.listActionHook.batchAuditing(props.dataListSelections);
        break;
      case 'reMultiAuditing':
        // 批量反审核
        props.listActionHook.reBatchAuditing(props.dataListSelections);
        break;
    }
  });
};

// 显示搜索侧滑栏
const showPopupRight = (e: MouseEvent) => {
  state.popupRightActive = !state.popupRightActive;
  document.addEventListener('click', hidePopupRight, false);
};

// 隐藏搜索侧滑栏
const hidePopupRight = (e: any) => {
  if (e?.target?.closest('.el-popper')) {
    return;
  }
  state.popupRightActive = false;
  document.removeEventListener('click', hidePopupRight, false);
};

// 重置高级查询
const superReset = (reset: any) => {
  state.searchInpuType = 'text';
  currentQuickSearchType.value = '模糊';
  currentQuickSearchValue.value = '';
  props.searchFields.concat(props.quickSearchFields).forEach((item: any) => {
    item.operator = 'EQ';
    if (item.type === 'select') {
      item.value = item.multiple ? [] : null;
    } else {
      item.value = null;
      if (typeof item.fromValue !== undefined) {
        item.fromValue = null;
        item.toValue = null;
      }
    }
  });
  if (reset) {
    // 重置事件
    emit('on-super-reset');
    window.setTimeout(() => {
      props.loadData();
    }, 100);
  }
};

// 快速查询
const quickSearchData = () => {
  // 重置分页索引
  props.dataOptions.pageIndex = 1;
  props.loadData('quick');
};

// 高级查询
const superSearcher = () => {
  // 重置分页索引
  props.dataOptions.pageIndex = 1;
  props.loadData();
  // props.hidePopupRight();
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
      //   url,
      //   params,
      //   (res: any) => {
      //     if (res.result) {
      //       resolve(res.data);
      //     } else {
      //       proxy.$message.error(res.msg);
      //     }
      //   },
      //   true
      // );
    });
  }
};

// 树形下拉框获得点击项
const onTreeNodeClick = (data: any, node: any, el: any, field: any) => {
  // 仅选择叶节点
  if (!node.isLeaf && field.onlySelectLeaf) return;

  let keyProp = field.keyProp;
  if (keyProp) {
    field.keyValue = data[keyProp];
  }
  let prop = field.prop;
  field.value = data[prop];
};

// 获取数据
const changeQuickSearchType = (val: any) => {
  props.searchFields.forEach((item: any) => {
    if (val === '模糊') {
      item.operator = 'LIKE';
    } else {
      item.operator = 'EQ';
    }
  });
};

// 导航栏查询条件改变事件
const change = (colInfo: any) => {
  props.loadData('quick');
  let val = colInfo.value;
  emit('on-toolbar-change', val, colInfo, props.searchFields);
};

// 保存查询条件
const saveSearch = () => {
  if (state.mySearchList.length > 10) {
    proxy.$message.error('最大支持10个自定义查询条件');
    return;
  }

  const key = proxy.$route.path;
  const data = {
    quickSearchFields: props.quickSearchFields
      .filter((f: any) => f.value)
      .map((m: any) => {
        return {
          prop: m.prop,
          operator: m.operator,
          value: m.value,
        };
      }),
    searchFields_quick: searchFields_quick.value
      .filter((f: any) => f.value)
      .map((m: any) => {
        return {
          prop: m.prop,
          operator: m.operator,
          value: m.value,
        };
      }),
    searchFields: props.searchFields
      .filter((f: any) => f.value)
      .map((m: any) => {
        return {
          prop: m.prop,
          operator: m.operator,
          value: m.value,
        };
      }),
    currentQuickSearchValue: currentQuickSearchValue.value,
    currentQuickSearchType: currentQuickSearchType.value,
  };
  if (!data.quickSearchFields.length && !data.searchFields_quick.length && !data.searchFields.length && !data.currentQuickSearchValue) {
    proxy.$message.error('没有可保存的条件');
    return;
  }

  proxy
    .$prompt('请输入名称', '保存查询条件', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(({ value }) => {
      state.popupRightActive = true;
      if (!value) {
        proxy.$message.error('名称不能为空');
        return;
      }
      const item = state.mySearchList.find((item: any) => item.name === value);
      if (item) {
        item.data = data;
      } else {
        state.mySearchList.push({
          name: value,
          data: data,
        });
      }
      localStorage.setItem(key, JSON.stringify(state.mySearchList));
      proxy.$message.success('保存成功');
    })
    .catch(() => {
      state.popupRightActive = true;
      proxy.$message.info('已取消');
    });
};

// 删除查询条件
const deleteMenuItem = (index: any) => {
  state.mySearchList.splice(index, 1);
  const key = proxy.$route.path;
  localStorage.setItem(key, JSON.stringify(state.mySearchList));
  proxy.$message.success('删除成功');
};

// 选择筛选条件
const onMenuItem = (row: any) => {
  if (row !== 'custom') {
    superReset(false);
  }

  let field: any = props.searchFields.find((item: any) => item.prop === 'createTime');
  if (row === 'day') {
    if (field) {
      const day = moment(new Date()).format('YYYY-MM-DD');
      field.fromValue = day;
      field.toValue = day + ' 23:59:59';
    }
    quickSearchData();
    return;
  } else if (row === 'week') {
    if (field) {
      const day = moment(new Date()).format('YYYY-MM-DD');
      field.fromValue = moment(day).add(-7, 'days').format('YYYY-MM-DD');
      field.toValue = day + ' 23:59:59';
    }
    quickSearchData();
    return;
  } else if (row === 'month') {
    if (field) {
      const day = moment(new Date()).format('YYYY-MM-DD');
      field.fromValue = moment(day).add(-30, 'days').format('YYYY-MM-DD');
      field.toValue = day + ' 23:59:59';
    }
    quickSearchData();
    return;
  } else if (row === 'year') {
    if (field) {
      const day = moment(new Date()).format('YYYY-MM-DD');
      field.fromValue = moment(day).add(-1, 'years').format('YYYY-MM-DD');
      field.toValue = day + ' 23:59:59';
    }
    quickSearchData();
    return;
  } else if (row === 'custom') {
    state.popupRightActive = true;
    return;
  }
  currentQuickSearchValue.value = row.data.currentQuickSearchValue;
  currentQuickSearchType.value = row.data.currentQuickSearchType;
  row.data.quickSearchFields.forEach((item: any) => {
    const field = props.quickSearchFields.find((f: any) => f.prop === item.prop) as any;
    field.operator = item.operator;
    field.value = item.value;
  });
  row.data.searchFields_quick.forEach((item: any) => {
    const field = searchFields_quick.value.find((f: any) => f.prop === item.prop) as any;
    field.operator = item.operator;
    field.value = item.value;
  });
  row.data.searchFields.forEach((item: any) => {
    const field = props.searchFields.find((f: any) => f.prop === item.prop) as any;
    field.operator = item.operator;
    field.value = item.value;
  });

  quickSearchData();
};
</script>

<style lang="scss" scoped>
.el-button {
  padding: 8px 8px;
}

.search-region {
  .tool-left {
    float: left;

    .tool-group + .tool-group {
      margin-left: 10px;
    }

    .el-button--medium {
      padding: 10px 10px;
    }
  }

  .tool-right {
    text-align: right;
    min-width: 380px;

    &.search-only-line {
      text-align: left;
      clear: both;
      margin-top: 50px;
    }

    .inline-block {
      margin-bottom: 0px;
      margin-right: 5px;
    }

    .search-texarea {
      :deep(textarea) {
        min-height: 36px !important;
        line-height: 24px !important;
        max-width: 150px;
      }
    }

    .search-input {
      width: calc(100% - 110px);
      max-width: 250px;

      :deep(.el-input__inner) {
        padding-left: 5px;
        padding-right: 5px;
      }

      :deep(.el-input__suffix) {
        right: 0;
      }

      :deep(.el-input__prefix) {
        left: 2px;
      }

      :deep(textarea) {
        min-height: 36px !important;
        line-height: 24px !important;
      }
    }

    .search-btn {
      &.el-button--text {
        padding: 10px 0;
      }
    }

    .show-supper-searcher {
      padding-left: 0px;
      padding-right: 0px;
    }

    :deep(.el-date-editor) {
      .el-range-separator {
        width: 25px;
      }

      .el-range__close-icon {
        width: 10px;
      }
    }

    > .el-select + .el-select {
      margin-left: 5px;
    }

    .el-button + .el-button {
      margin-left: 0px;
    }

    .popup-right {
      text-align: left;
      line-height: 1.2;
      z-index: 1000;
      .el-button {
        padding: 10px 15px;
      }

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
              margin-right: 10px;

              .el-date-editor .el-range-separator {
                width: 25px;
              }

              .operator {
                :deep(.el-input__inner) {
                  padding-left: 5px;
                  padding-right: 20px;
                  text-align: center;
                }
              }
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
    display: block;
  }

  :deep(.el-input__wrapper) {
    padding: 1px 5px;
  }
}

.space-between {
  padding-right: 3px !important;
  min-width: 150px;

  &::before {
    display: none !important;
  }

  .ico {
    line-height: 25px;
    display: inline-block;
    padding-left: 10px;
    padding-top: 3px;
  }
}
</style>
