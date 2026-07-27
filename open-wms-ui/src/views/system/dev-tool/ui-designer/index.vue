<template>
  <el-container id="designer-container" class="designer-container" @keydown.f2="createBaseVue('json')" @keydown.f3="createBaseVue('save')">
    <el-aside width="250px" class="components-list">
      <sticky :z-index="20" :stickyTop="1" class-name="left-sticky">
        <el-collapse v-model="state.collapseActiveName" accordion>
          <el-collapse-item ref="masterTableTtem" title="主表字段" name="主表字段">
            <template #title>
              <span class="left title">{{ state.moduleNode.tableTenantName }}</span>
              <el-popover ref="treePopover" popper-class="my-popover" class="right margin-left-30" :width="400" placement="bottom-start" trigger="click">
                <template #reference>
                  <el-button type="primary" link>选择模块</el-button>
                </template>
                <el-scrollbar :noresize="false" :native="false" wrap-class="module-tree scrollbar-wrap">
                  <el-tree ref="module-tree" :load="loadModuleNode" :props="state.moduleProps" lazy @node-click="moduleclick">
                    <template #default="{ node, data }">
                      <span class="custom-tree-node">
                        <template v-if="!node.isLeaf">
                          <span v-if="node.expanded"> <i class="icon-wenjianjiazhankai"></i> {{ node.label }} </span>
                          <span v-else> <i class="icon-wenjianjia"></i> {{ node.label }} </span>
                        </template>
                        <template v-else>
                          <span> <i class="icon-wenjian1"></i> {{ node.label }} </span>
                        </template>
                      </span>
                    </template>
                  </el-tree>
                </el-scrollbar>
                <el-footer style="padding-top: 10px; border-top: 1px solid #f3f3f3; text-align: right">
                  <el-button type="default" @click="treePopover.hide()">关闭</el-button>
                  <el-button type="primary" @click="treeRefresh">刷新</el-button>
                </el-footer>
              </el-popover>
            </template>
            <el-scrollbar :noresize="false" :native="false" wrap-class="fields scrollbar-wrap">
              <draggable :list="state.fieldComponents" item-key="label" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
                <template #item="{ element }">
                  <li class="form-edit-widget-label">
                    <a>
                      <i :class="element.icon"></i>
                      <span>{{ element.label }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </el-scrollbar>
          </el-collapse-item>
          <el-collapse-item title="明细字段" name="明细字段">
            <template v-if="state.detailFields.length">
              <el-scrollbar :noresize="false" :native="false" wrap-class="fields scrollbar-wrap">
                <draggable :list="state.detailFields" item-key="label" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
                  <template #item="{ element }">
                    <li class="form-edit-widget-label">
                      <a>
                        <i :class="element.icon"></i>
                        <span>{{ element.label }}</span>
                      </a>
                    </li>
                  </template>
                </draggable>
              </el-scrollbar>
            </template>
            <template v-else>
              <div class="margin-top-no margin-bottom-20 padding-0-10 color-gray">这里是表单明细字段列表，请在编辑页面中关联子表名</div>
            </template>
          </el-collapse-item>
          <el-collapse-item title="基础字段">
            <draggable :list="state.basicComponents" item-key="label" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
              <template #item="{ element }">
                <li class="form-edit-widget-label">
                  <a>
                    <i :class="element.icon"></i>
                    <span>{{ element.label }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </el-collapse-item>
          <el-collapse-item title="高级字段" name="高级字段">
            <draggable :list="state.advanceComponents" item-key="label" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
              <template #item="{ element }">
                <li class="form-edit-widget-label">
                  <a>
                    <i :class="element.icon"></i>
                    <span>{{ element.label }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </el-collapse-item>
          <el-collapse-item title="布局字段" name="高级字段">
            <draggable :list="state.layoutComponents" item-key="label" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
              <template #item="{ element }">
                <li class="form-edit-widget-label data-grid">
                  <a>
                    <i :class="element.icon"></i>
                    <span>{{ element.label }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </el-collapse-item>
          <el-collapse-item title="按钮设置" name="按钮设置">
            <draggable :list="state.buttonComponents" item-key="label" :group="{ name: 'button-group', pull: 'clone', put: false }" :sort="false" ghost-class="button-ghost" tag="ul">
              <template #item="{ element }">
                <li class="form-edit-widget-label data-grid">
                  <a>
                    <i :class="element.options.icon"></i>
                    <span>{{ element.label }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </sticky>
    </el-aside>

    <el-container class="center-container" direction="vertical">
      <sticky :z-index="2000" :stickyTop="0" height="40px" class-name="content-tool">
        <div class="space-between">
          <el-tabs v-model="state.tableTenantId" class="tabs-nav" @tab-click="vueDataClick" @tab-remove="vueDataRemove" @dblclick="vueDataTabDblClick">
            <template v-for="(tab, index) in state.uiDataList">
              <el-tab-pane v-if="index == 0" :ref="'tab' + index" :closable="false" :name="'' + index" :label="(tab.designMode === 'user' ? '*' : '') + tab.label"></el-tab-pane>
              <el-tab-pane v-else :ref="'tab' + index" :name="'' + index" :label="(tab.designMode === 'user' ? '*' : '') + tab.label" :closable="tab.designMode === 'user' || state.designMode === 'system'"></el-tab-pane>
            </template>
          </el-tabs>
          <el-popover v-if="state.uiDataList.length" placement="bottom-start" :title="state.uiDataList[0].label + ' - 所有关联模块'" width="600" trigger="hover" popper-class="padding-10">
            <template v-for="(tab, index) in state.uiDataList">
              <el-link :label="'' + index" border size="small" class="module-item" @click="vueDataClick({ index: '' + index })">{{ tab.label }}</el-link>
            </template>
            <template #reference>
              <el-button type="primary" link class="margin-top-5">查看全部</el-button>
            </template>
          </el-popover>
        </div>

        <div class="right-tools">
          <el-button v-if="state.designMode !== 'user'" type="primary" link size="small" @click="copeVueData"><i class="yrt-fuzhi2"></i> 复制</el-button>
          <el-button type="primary" link size="small" @click="handleReset"><i class="icon-reset"></i> 重置</el-button>
          <el-button type="primary" link size="small" @click="handleGenerateJson"><i class="icon-liulan3"></i> 查看</el-button>
          <el-button type="primary" link size="small" id="btnsave" @click="createBaseVue('save')"><i class="icon-baocun"></i> 保存(F3)</el-button>
          <el-button type="primary" link size="small" @click="createBaseVue('json')"><i class="icon-save"></i> 生成(F2)</el-button>
        </div>
      </sticky>

      <div class="content">
        <el-tabs v-model="state.editRegionTab" @tab-click="tabClick">
          <el-tab-pane :label="state.widgetFormData.dataOptions.isPDA ? 'App列表页面' : '管理页面'" name="ManagerConfig">
            <div :class="{ 'widget-empty': state.widgetFormData.dataListOptions.fields.length == 0 }" style="min-height: 1200px">
              <widget-form-app v-if="state.widgetFormData.dataOptions.isPDA" ref="widgetForm" :data="state.widgetFormData" v-model:select="state.widgetFormSelect" v-model:config-type="state.configType" v-model:detail-fields="state.detailFields" :field-components="state.fieldComponents"></widget-form-app>
              <manager-form v-else ref="managerForm" :data="state.widgetFormData" v-model:select="state.widgetFormSelect" v-model:config-type="state.configType" :field-components="state.fieldComponents"></manager-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="state.widgetFormData.dataOptions.isPDA ? 'App扫描页面' : '编辑页面'" name="WidgetConfig">
            <div :class="{ 'widget-empty': state.widgetFormData.editorOptions.fields.length == 0 }" style="min-height: 1200px">
              <widget-form ref="widgetForm" :data="state.widgetFormData" v-model:select="state.widgetFormSelect" v-model:config-type="state.configType" v-model:detail-fields="state.detailFields" :field-components="state.fieldComponents"></widget-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-container>

    <el-aside class="widget-config-container">
      <sticky :z-index="20" :stickyTop="1" class-name="left-sticky">
        <el-container>
          <el-header height="45px" class="param-header">
            <div :class="{ active: state.configTab == 'widget' }" class="config-tab" @click="handleConfigSelect('widget')">字段属性</div>
            <div :class="{ active: state.configTab == 'form' }" class="config-tab" @click="handleConfigSelect('form')">表单属性</div>
          </el-header>
          <el-main class="config-content">
            <el-scrollbar v-show="state.configTab == 'widget'" :noresize="false" :native="false" wrap-class="config scrollbar-wrap">
              <manager-config v-if="state.configType === 'ManagerConfig'" :data="state.widgetFormSelect" :data-options="state.widgetFormData.dataOptions" :basic-components="state.basicComponents"></manager-config>
              <widget-config v-if="state.configType === 'WidgetConfig'" :data="state.widgetFormSelect" :data-options="state.widgetFormData.dataOptions" :basic-components="state.basicComponents"></widget-config>
            </el-scrollbar>
            <el-scrollbar v-show="state.configTab == 'form'" :noresize="false" :native="false" wrap-class="config scrollbar-wrap">
              <form-config :data="state.widgetFormData" :editor-config="state.widgetFormData.editorOptions.config" :data-options="state.widgetFormData.dataOptions"></form-config>
            </el-scrollbar>
          </el-main>
        </el-container>
      </sticky>
    </el-aside>

    <cus-dialog ref="jsonPreview" :visible="state.jsonVisible" title="生成JSON并保存Vue文件" width="800px" form @on-close="state.jsonVisible = false">
      <div id="jsoneditor" style="height: 400px; width: 100%">{{ state.jsonData }}</div>
      <template #action>
        <el-button data-clipboard-target=".ace_text-input" @dblclick="proxy.$message.success('复制成功')">双击复制</el-button>
        <el-button :loading="state.createLoading" type="primary" data-clipboard-target=".ace_text-input" @click="createBaseVue('jsoneditor')">保存并生成Vue文件</el-button>
      </template>
    </cus-dialog>

    <cus-dialog ref="codePreview" :visible="state.codeVisible" title="生成页面" form width="800px" @on-close="state.codeVisible = false">
      <div id="codeeditor" style="height: 500px; width: 100%">{{ state.htmlTemplate }}</div>
      <template #action>
        <el-button id="closebtn" @click="state.codeVisible = false">关闭</el-button>
      </template>
    </cus-dialog>
  </el-container>
</template>

<script setup lang="ts" name="system-dev-tool-ui-designer">
import { to } from 'await-to-js';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import { postData, getData, deleteData } from '/@/api/common/baseApi';
import Draggable from 'vuedraggable';
import WidgetConfig from './WidgetConfig.vue';
import ManagerConfig from './ManagerConfig.vue';
import FormConfig from './FormConfig.vue';
import WidgetForm from './WidgetForm.vue';
import WidgetFormApp from './WidgetFormApp.vue';
import ManagerForm from './ManagerForm.vue';
import CusDialog from './CusDialog.vue';
import Sticky from '/@/components/sticky/index.vue';
import { useUserStore } from '/@/stores/modules/user';

const route = useRoute();
const userStore = useUserStore();

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
let treePopover = ref();
let masterTableTtem = ref();

import { fieldComponents, basicComponents, layoutComponents, advanceComponents, buttonComponents, defaultDataListButtons } from './componentsConfig.js';
import { loadJs } from './util/index.js';
import { generateMixinCode, generateMainCode } from './generateMixinCode.js';

//#region 定义变量
const state = reactive({
  fieldComponents,
  basicComponents,
  layoutComponents,
  advanceComponents,
  buttonComponents,
  defaultDataListButtons,
  collapseActiveName: '',
  // 设计模式
  designMode: 'system',
  // 租户设置参数列表All
  tableTenantListAll: [] as any[],
  // 所有UI列表
  uiDataList: [] as any[],
  // vue页面ID
  tableTenantId: '0',

  // 明细字段
  detailFields: [],

  // 当前配置参数设置组件
  configType: 'ManagerConfig',

  // 模块tree prop参数配置
  moduleProps: {
    label: 'label',
    // children: "zones",
    isLeaf: function (data: any, node: any) {
      return data.hasChild !== 1;
    },
  },
  // 模块字段信息
  moduleNode: {
    tableTenantName: '【请选择模块】',
    tableId: 0,
    tableName: null,
    parentId: null,
    detailName: null,
    idField: null,
    codeRegular: null,
    linkColumn: null,
    orderBy: {},
    jsonData: '',
    prefixRouter: null,
    webRouter: null,
    editorType: 'dialog', // 对话框模式
  },

  // 设计器数据结构
  widgetFormData: {
    // 数据加载及保存参数
    dataOptions: {
      tableName: 'Base_Provider',
      idField: 'provider_Id',
      webRouter: '/basic/asset/provider',
      idValue: 0,
      codeRegular: 'providerCode', // 自动编码字段
      linkColumn: null, // 链接到弹出编辑窗口的字段
      menuId: 428,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      orderBy: {},
      showActionField: false, // 列表页显示Action列
      tableId: 0,
      tableTenantId: null,
      tableTenantName: null,
      isPDA: null,
      vueType: null,
    },
    // 数据管理器对话框参数
    dataListOptions: {
      // 表格数据
      // data: [],
      // 表格列
      fields: [] as any[],
      // 表格工具栏
      buttons: [],
    },

    // 编辑器对话框参数
    editorOptions: {
      fields: [],
      config: {
        labelWidth: '100px', // 标签文字宽度
        labelPosition: 'right', // 标签位置
        top: '3vh', // 对话框底部距离
        width: '1200px', // 对话框宽度
        visible: false, // 是否显示添加实验室对话框
        disabled: false, // 是否禁用
        title: '', // 对话框标题
        action: 'add', // 接收值为：add、edit
        formInline: false, // 行内表单
        saveButtonText: '保存',
      },
    },
  },

  // 设计器默认数据结构
  widgetFormDataDefault: {
    // 数据加载及保存参数
    dataOptions: {
      projectName: 'BasicInfo',
      tableName: 'Base_Provider',
      idField: 'provider_Id',
      webRouter: '/basic/asset/provider',
      idValue: 0,
      codeRegular: 'providerCode', // 自动编码字段
      linkColumn: null, // 链接到弹出编辑窗口的字段
      menuId: 428,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      orderBy: {},
      showActionField: false, // 列表页显示Action列
    },
    // 数据管理器对话框参数
    dataListOptions: {
      // 表格数据
      data: [],
      // 表格列
      fields: [],
      // 表格工具栏
      buttons: JSON.parse(JSON.stringify(defaultDataListButtons)),
    },

    // 编辑器对话框参数
    editorOptions: {
      fields: [],
      config: {
        labelWidth: '100px', // 标签文字宽度
        formWidth: 'auto', // 表单宽度
        labelPosition: 'right', // 标签位置
        top: '3vh', // 对话框底部距离
        width: '1200px', // 对话框宽度
        visible: false, // 是否显示添加实验室对话框
        disabled: false, // 是否禁用
        title: '资产分类',
        action: 'add', // 接收值为：add、edit
        formInline: false, // 行内表单
        saveButtonText: '保存',
      },
    },
  },
  // 设计器类型：管理页面、编辑页面
  editRegionTab: 'ManagerConfig',
  configTab: 'widget',
  widgetFormSelect: null as any, // 选中项
  previewVisible: false,
  jsonVisible: false,
  codeVisible: false,
  widgetModels: {},
  blank: '',
  htmlTemplate: '',
  jsonData: '', // 创建混入文件内容
  createLoading: false, // 创建页面loading
  // 导航树参数
  treeClickParam: {
    data: null,
    node: null,
    element: null,
  },
});
//#endregion

//#region 计算属性
const currentTabId = computed({
  get() {
    return parseInt(state.tableTenantId);
  },
  set(newValue: any) {
    state.tableTenantId = newValue;
  },
});
//#endregion

//#region wacth
watch(
  () => state.widgetFormData,
  (val) => {
    let item = state.uiDataList[currentTabId.value];
    if (item) {
      item.jsonData = JSON.stringify(val);
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => state.widgetFormSelect,
  (val: any) => {
    // PDA时增加属性，设置默认值
    const isPDA = state.widgetFormData.dataOptions.isPDA && ['static', 'input', 'datetime'].indexOf(val.type) >= 0;
    if (isPDA && typeof val.visible === 'undefined') {
      val.visible = true; // 是否显示
    }
    if (isPDA && typeof val.labelOptions === 'undefined') {
      val.labelOptions = {
        showColon: false,
        styles: {
          width: '75px',
          'max-width': '',
          'font-size': '14px',
          'text-align': 'right',
          'line-height': '24px',
          'font-weight': '',
          color: '#808080',
          'background-color': '',
          padding: '0px 5px 0px 0px',
          margin: '',
        },
      };
    }
    if (isPDA && typeof val.textOptions === 'undefined') {
      val.textOptions = {
        styles: {
          width: 'auto',
          'max-width': '',
          'font-size': '14px',
          'text-align': 'left',
          'line-height': '24px',
          'font-weight': '',
          'white-space': '',
          color: '#000',
          'background-color': '',
          padding: '0px 2px',
          margin: '',
        },
      };
    }
  },
  { deep: true, immediate: true }
);
//#endregion

// 获取设计模式
state.designMode = route.fullPath.indexOf('user') >= 0 ? 'user' : 'system';
onMounted(() => {
  loadJs('https://auod-beijing.oss-cn-beijing.aliyuncs.com/ace/src-min-noconflict/ace.js');
});

onActivated(() => {
  state.designMode = route.fullPath.indexOf('user') >= 0 ? 'user' : 'system';
});

const handleConfigSelect = (value: any) => {
  state.configTab = value;
};

const handleMoveEnd = (evt: any) => {
  // console.log("end", evt);
};

const handleMoveStart = (params: any) => {
  let { oldIndex } = params;
  // console.log("start", oldIndex, state.basicComponents);
};

const handleMove = () => {
  return true;
};

// 预览设计
const handlePreview = () => {
  state.previewVisible = true;
};

// 重置，重新开始设计
const handleReset = () => {
  if (!state.moduleNode.tableName) {
    proxy.$message.error('请选择需要设计的模块！');
    return;
  }
  proxy
    .$confirm('确定要重置设计，将重新开始设计, 是否继续?', '重置提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      reset();
      proxy.$message.success('重置成功!');
    })
    .catch(() => {
      proxy.$message.info('已取消重置');
    });
};

const reset = () => {
  let data = state.moduleNode;
  state.widgetFormData = Object.assign({}, state.widgetFormDataDefault, {
    dataOptions: {
      tableName: data.tableName,
      idField: data.idField,
      idValue: 0,
      codeRegular: data.codeRegular, // 自动编码字段
      linkColumn: data.linkColumn, // 链接到弹出编辑窗口的字段
      prefixRouter: data.prefixRouter, // 后端路由
      webRouter: data.webRouter, // 前端路由
      menuId: null,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      orderBy: data.orderBy,
      showActionField: false, // 列表页显示Action列
      editorType: 'dialog', // 对话框模式
    },
    // 数据管理器对话框参数
    dataListOptions: {
      // 表格数据
      data: [],
      // 表格列
      fields: [],
      // 表格工具栏
      buttons: JSON.parse(JSON.stringify(defaultDataListButtons)),
    },
    // 编辑器对话框参数
    editorOptions: {
      fields: [],
      config: {
        labelWidth: '100px', // 标签文字宽度
        labelPosition: 'right', // 标签位置
        top: '3vh', // 对话框底部距离
        width: '1200px', // 对话框宽度
        visible: false, // 是否显示添加实验室对话框
        disabled: false, // 是否禁用
        title: null, // 对话框标题
        action: 'add', // 接收值为：add、edit
        formInline: false, // 行内表单
        saveButtonText: '保存',
      },
    },
  });
  // 对话框标题名称
  state.widgetFormData.editorOptions.config.title = data.tableTenantName;
  state.configType = 'WidgetConfig'; // 参数设置组件类型
  state.widgetFormSelect = null; // 编辑页面选中项
};

// 加载模块节点树
const loadModuleNode = async (node: any, resolve: any) => {
  let loading: any = null;

  proxy.$nextTick(async () => {
    let whereList: Array<QueryBo> = []; // 查询条件
    if (node.level === 0) {
      whereList.push({
        column: 'parentId',
        values: 0,
        queryType: QueryType.EQ,
        dataType: DataType.INT,
      });

      let treeEl = proxy.$refs['module-tree'];
      loading = ElLoading.service({
        target: treeEl.$el,
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        customClass: 'tree-loading',
      });
    } else {
      whereList.push({
        column: 'parentId',
        values: node.data.tableId,
        queryType: QueryType.EQ,
        dataType: DataType.INT,
      });
    }

    let orderByList: Array<OrderItem> = []; // 排序提交
    orderByList.push({
      column: 'orderNum',
      orderByType: OrderByType.DESC,
    });
    orderByList.push({
      column: 'tableId',
      orderByType: OrderByType.ASC,
    });
    let url = '/system/core/common/loadTreeNode';
    let params = {
      tableName: 'genTable',
      keyName: 'tableId',
      nodeName: 'tableComment',
      fixHasChild: false,
      showOutsideNode: false,
      parentName: 'parentId',
      whereList: whereList, // 查询条件
      orderByList: orderByList, // 排序字段
      extendColumns: 'tableName,jsonData,keyName,codeRegular,linkColumn,orderBy,prefixRouter,webRouter',
    };
    let res = await postData(url, params);

    if (res.result) {
      resolve(res.data);
    } else {
      proxy.$message.error(res.msg);
    }
    if (loading) loading.close();
  });
};

// 刷新tree
const treeRefresh = () => {
  let root = proxy.$refs['module-tree'].store.root;
  while (root.childNodes.length) {
    proxy.$refs['module-tree'].remove(root.childNodes[0]);
  }
  loadModuleNode(root, (data: any) => {
    root.doCreateChildren(data);
  });
};

// 选择模块单击事件
const moduleclick = async (data: any, node: any, element: any) => {
  state.treeClickParam.data = data;
  state.treeClickParam.node = node;
  state.treeClickParam.element = element;

  if (!node.isLeaf) return;
  let orderBy = data.orderBy;
  try {
    orderBy = JSON.parse(orderBy);
  } catch (error) {
    orderBy = {};
    if (data.keyName) {
      orderBy[data.keyName] = 'DESC';
    }
  }

  state.moduleNode = {
    tableTenantName: data.tableComment,
    tableId: data.tableId,
    tableName: data.tableName,
    parentId: data.parentId,
    detailName: data.detailName,
    idField: data.keyName,
    codeRegular: data.codeRegular,
    linkColumn: data.linkColumn,
    orderBy: orderBy,
    jsonData: data.jsonData,
    prefixRouter: data.prefixRouter,
    webRouter: data.webRouter,
    editorType: 'dialog', // 对话框模式
  };
  await loadVueDataList(state.moduleNode, node, element);
  await loadModuleFields(state.moduleNode, node, element);
  treePopover.value.hide();
  if (!masterTableTtem.value.isActive) {
    state.collapseActiveName = '主表字段';
  }
};

// 加载VueData列表
const loadVueDataList = async (data: any, node: any, element: any) => {
  let queryBoList = [
    {
      column: 'tableId',
      values: data.tableId,
      queryType: QueryType.EQ,
      dataType: DataType.STRING,
    },
  ];

  let url = '/generator/tableTenant/selectList';
  const [err, res] = await to(postData(url, queryBoList));
  if (err) {
    return;
  }

  if (res.result) {
    state.uiDataList = []; // 清空
    let dataList = res!.data.map((item: any, index: any, arr: any) => {
      let field = {
        tableTenantId: Number(item.tableTenantId),
        tableId: Number(item.tableId),
        label: item.tableTenantName,
        jsonData: item.jsonData,
        /**
         * fromTableTenantId==0时为gen_table的自定义UI（即主模块的用户自定义UI），在用户UI设计器中操作
         * fromTableTenantId>0是为gen_table_tenant的自定义UI，在用户UI设计器中操作
         * fromTableTenantId==-1是为gen_table的原始复制UI，在系统UI设计器中操作
         */
        fromTableTenantId: Number(item.fromTableTenantId), // 来源ID
        isTenantSetting: !!data.fromTableTenantId, // 用户自定义设置
      };
      return field;
    });
    state.tableTenantListAll = dataList;

    // 系统设计
    if (state.designMode === 'system') {
      // 获取原始所有复制项
      const otherVueList = state.tableTenantListAll.filter((item) => item.fromTableTenantId == -1);
      state.uiDataList = [
        {
          tableTenantId: 0, // 0表示为主表VueData
          tableId: data.tableId,
          label: data.tableTenantName,
          jsonData: data.jsonData,
          fromTableTenantId: data.fromTableTenantId,
          isTenantSetting: false, // 用户自定义设置
          designMode: 'system',
        },
      ].concat(otherVueList);
    } else {
      // 判断主tab是否已自定义
      const customVue = state.tableTenantListAll.find((item) => item.fromTableTenantId === 0);
      if (customVue) {
        customVue.designMode = 'user';
        state.uiDataList.push(customVue);
      } else {
        state.uiDataList = [
          {
            tableTenantId: 0, // 0表示为主表VueData
            tableId: data.tableId,
            label: data.tableTenantName,
            jsonData: data.jsonData,
            fromTableTenantId: data.fromTableTenantId,
            isTenantSetting: false, // 用户自定义设置
            designMode: 'system',
          },
        ];
      }
      // 获取原始所有复制项
      const otherVueList = state.tableTenantListAll.filter((item) => item.fromTableTenantId === -1);
      for (const vueInfo of otherVueList) {
        // 查找租户是否已经自定义
        const tenantData = state.tableTenantListAll.find((item) => item.fromTableTenantId === vueInfo.tableTenantId);
        if (tenantData) {
          tenantData.designMode = 'user';
          state.uiDataList.push(tenantData);
        } else {
          vueInfo.designMode = 'system';
          state.uiDataList.push(vueInfo);
        }
      }
    }
    // 设置当前tab项
    if (state.uiDataList.length) {
      state.tableTenantId = '0';
      setCurrentJsonData(state.uiDataList[0].jsonData);
    }
  }
};

// 加载模块字段
const loadModuleFields = async (data: any, node: any, element: any) => {
  let url = `/tool/gen/column/${data.tableId}`;
  const [err, res] = await to(getData(url));
  if (err) return;

  if (res.result) {
    state.fieldComponents = res.data.rows.map((item: any, index: any, arr: any) => {
      let dataType = proxy.common.caseStyle(item.javaType);
      if (dataType === 'date') {
        dataType = 'datetime';
      }
      let field = {
        type: 'input',
        label: item.columnComment,
        dataType: dataType,
        icon: 'yrt-danhangshurukuang',
        options: {
          prop: item.javaField,
          searchRowNo: 0,
          width: '100%',
          noLabel: false,
          defaultValue: '',
          required: false,
          pattern: '',
          placeholder: '',
        },
      };
      return field;
    });
  } else {
    proxy.common.showMsg(res);
  }
};

// 生成JSON
const handleGenerateJson = () => {
  let webRouter = state.widgetFormData.dataOptions.webRouter;

  state.jsonVisible = true;
  if (webRouter) {
    let last = webRouter.lastIndexOf('/');
    if (last === webRouter.length - 1) {
      webRouter = webRouter.substring(0, webRouter.length - 1);
      state.widgetFormData.dataOptions.webRouter = webRouter;
    }
  }
  state.jsonData = generateMixinCode(state.widgetFormData);

  proxy.$nextTick(() => {
    // eslint-disable-next-line
    const editor = window.ace.edit('jsoneditor');
    editor.session.setMode('ace/mode/jsx');
  });
};

// 生成文件
const createBaseVue = async (type: any) => {
  // if (state.designMode === 'user' && userStore.tenantId === '000000') {
  //   proxy.$message.error('模板不允许用户自定义操作');
  //   return;
  // }

  if (!state.moduleNode.tableId) {
    proxy.$message.error('请选择模块后再执行保存操作！');
    return;
  }
  let webRouter = '';
  if (type === 'json') {
    webRouter = state.widgetFormData.dataOptions.webRouter;
    let tableName = state.widgetFormData.dataOptions.tableName;
    if (!webRouter || !tableName) {
      proxy.$message.error('请在表单属性里面填写必填属性');
      return;
    }
  }
  let jsonData: string = '';
  if (type === 'jsoneditor') {
    const editor = window.ace.edit('jsoneditor');
    jsonData = editor.getSelectedText();
    type = 'json';
  }

  let node = state.uiDataList[currentTabId.value];
  // UI布局参数
  if (!jsonData) {
    jsonData = JSON.stringify(state.widgetFormData, null, 2);
  } else {
    state.widgetFormData = JSON.parse(jsonData);
  }
  if (!jsonData) {
    proxy.$message.error('没有可保存的数据！');
    return;
  }
  // 更新节点数据
  node.jsonData = jsonData;
  state.widgetFormData.dataOptions.tableId = state.moduleNode.tableId;
  state.widgetFormData.dataOptions.tableTenantId = node.tableTenantId; // 节点ID
  state.widgetFormData.dataOptions.tableTenantName = node.label; // 节点名称
  const mainCode = generateMainCode(webRouter);

  state.createLoading = true;
  const isPDA = !!state.widgetFormData.dataOptions.isPDA;
  const vueType = state.widgetFormData.dataOptions.vueType;
  const menuId = state.widgetFormData.dataOptions.menuId;
  let url = '/generator/tableTenant/saveui';
  let params = {
    designMode: state.designMode, // 设计模式：用户自定义、系统
    tableId: state.moduleNode.tableId,
    webRouter: state.widgetFormData.dataOptions.webRouter,
    mainCode: mainCode,
    jsonData: jsonData,
    tableTenantId: node.tableTenantId,
    tableTenantName: node.label,
    fromTableTenantId: node.fromTableTenantId,
    type: type, // 保存方式：保存、生成
    isPDA: isPDA,
    vueType: vueType,
    menuId: menuId,
    version: 3,
  };

  let res = await postData(url, params);

  proxy.common.showMsg(res);
  state.createLoading = false;

  if (res.result) {
    state.moduleNode.jsonData = jsonData; // 保存数下拉框中的VueData
    if (currentTabId.value === 0) {
      let node = proxy.$refs['module-tree'].getCurrentNode();
      node.jsonData = jsonData;
    }
    // tab node
    const tabNode = state.uiDataList[currentTabId.value];
    tabNode.tableTenantId = res.data.tableTenantId;
    node.tableTenantId = res.data.tableTenantId;
    tabNode.fromTableTenantId = res.data.fromTableTenantId;
    node.fromTableTenantId = res.data.fromTableTenantId;
    state.jsonVisible = false;
    if (state.designMode === 'user') {
      tabNode.designMode = 'user';
    }
  }
};

// jsonData Tab点击切换
const vueDataClick = (tab: any) => {
  if (tab.index) {
    currentTabId.value = tab.index;
  }
  let item = state.uiDataList[currentTabId.value];
  setCurrentJsonData(item.jsonData);
};

// 设置当前VueData
const setCurrentJsonData = (jsonData: any) => {
  if (jsonData) {
    state.widgetFormData = JSON.parse(jsonData);
    if (!state.widgetFormData.dataListOptions.fields) {
      state.widgetFormData.dataListOptions.fields = [];
    }
    state.widgetFormSelect = null; // 编辑页面选中项
    // 设置默认选中项
    if (state.widgetFormData.dataListOptions.fields.length) {
      state.configType = 'ManagerConfig'; // 参数设置组件类型
      state.widgetFormSelect = state.widgetFormData.dataListOptions.fields[0]; // 管理页面选中项

      // 整理dataType 临时用
      for (let field of state.widgetFormData.dataListOptions.fields) {
        if (!field.dataType && field.options && field.options.dataType) {
          field.dataType = field.options.dataType;
        }
        if (field.options) {
          delete field.options.dataType;
        }
      }
    }

    // 整理明细中dataType
    let details: any[] = state.widgetFormData.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');
    for (let detail of details) {
      for (let field of detail.fields) {
        if (!field.dataType && field.options && field.options.dataType) {
          field.dataType = field.options.dataType;
        }
        if (field.options) {
          delete field.options.dataType;
        }
      }
    }

    // 转小写，按钮名字
    const changeButtons = (buttons: any) => {
      buttons.forEach((item: any) => {
        if (item.type === 'button') {
          item.options.authNode = item.options.authNode;
        } else if (item.type === 'button-group') {
          changeButtons(item.buttons);
        }
      });
    };
    changeButtons(state.widgetFormData.dataListOptions.buttons);
  } else {
    reset();
  }
};

// 复制VueData
const copeVueData = () => {
  proxy
    .$prompt('请输入模块别名', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then((params: any) => {
      let { value } = params;
      if (value) {
        let newVueData = JSON.parse(JSON.stringify(state.uiDataList[currentTabId.value]));
        newVueData.label = value;
        newVueData.tableTenantId = -1; // -1表示为新增
        newVueData.fromTableTenantId = -1; // -1表示为gen_table的原始复制UI，在系统UI设计器中操作
        state.uiDataList.push(newVueData);
      }
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

// 删除VueData Item
const vueDataRemove = (name: any) => {
  let index = parseInt(name);
  let vueDataItem = state.uiDataList[index];
  console.log(vueDataItem);
  let tip = '此操作将永久删除该VueData, 是否继续?';
  if (state.designMode === 'user') {
    tip = '此操作将还原到标准模式, 是否继续?';
  }
  proxy
    .$confirm(tip, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      index = parseInt(name);
      vueDataItem = state.uiDataList[index];
      if (vueDataItem.tableTenantId > 0) {
        let url = '/generator/tableTenant/remove/' + vueDataItem.tableTenantId;
        let res = await deleteData(url);

        if (res.result) {
          if (vueDataItem.designMode === 'user') {
            proxy.$message.success('还原成功！');
          } else {
            state.uiDataList.splice(index, 1);
            proxy.$message.success('删除成功！');
          }
          moduleclick(state.treeClickParam.data, state.treeClickParam.node, state.treeClickParam.element);
        }
      } else if (vueDataItem.tableTenantId === 0) {
        proxy.$message.error('主VueData不允许删除！');
      } else {
        state.uiDataList.splice(index, 1);
        proxy.$message.success('删除成功！');
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 修改VueData名称
const vueDataTabDblClick = () => {
  let vueDataItem = state.uiDataList[currentTabId.value];
  proxy
    .$prompt('请输入模块新名称', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: vueDataItem.label,
    })
    .then(async (options: any) => {
      let { value } = options;
      if (!value) {
        proxy.$message.error('名称不能为空！');
        return;
      }
      if (vueDataItem.tableTenantId > 0) {
        let url = '/api/sys/mvcVueData/updateTitle';
        let params = {
          tableTenantId: vueDataItem.tableTenantId,
          title: value,
        };
        let res = await postData(url, params);
        proxy.common.showMsg(res);
        vueDataItem.label = value;
      } else {
        vueDataItem.label = value;
      }
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

const tabClick = (pane: any, ev: any) => {
  state.widgetFormSelect = null;
  state.configType = pane.paneName;
};
</script>

<style lang="scss">
@import './styles/cover.scss';
@import './styles/index.scss';

.content {
  :deep(.el-tabs__header) {
    margin: 0 0 2px;
  }
}

.param-header {
  padding: 0 5px !important;
}

.tree-popover {
  padding: 0 0px !important;
}

.module-item {
  margin-right: 20px;
  margin-bottom: 10px;
  color: #0885ce !important;
}
</style>
