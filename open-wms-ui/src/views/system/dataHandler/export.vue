<template>
  <div ref="container" class="biz-container">
    <split-pane :max-width="500" :default-width="260" split="vertical">
      <template #paneL>
        <div class="left-container">
          <el-form class="form-tool" @submit.stop.prevent>
            <el-form-item class="margin-bottom-0">
              <el-input v-model="state.filterText" placeholder="搜索名称" class="search-input" @keyup.enter="treeRefresh">
                <template #append>
                  <el-button title="刷新" @click="treeRefresh"><i class="yrt-chaxun2"></i></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="padding-right-0 margin-bottom-0">
              <template v-if="state.filterText">
                <div v-for="item in state.filterDataList" class="filter-box" :class="item.exportId === state.currentNode.exportId ? 'active' : ''" @click="nodeClick(item)">
                  <div class="filter-title">{{ item.tableNameCn }}</div>
                  <div class="sub-path" v-html="item.parentNameAll"></div>
                </div>
                <el-result v-if="!state.filterDataList.length" icon="warning" title="没有查询到数据"></el-result>
              </template>
              <el-scrollbar v-else :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
                <!--数据tree-->
                <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="(node:any, resolve:any) => loadTreeNode(node, resolve)" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="exportId" @node-click="nodeClick">
                  <template #default="{ node, data }">
                    <span class="custom-tree-node">
                      <span>
                        <i v-if="data.hasChild" class="el-icon-menu"></i>
                        <i v-else class="el-icon-tickets"></i>
                        {{ node.label }}
                      </span>
                    </span>
                  </template>
                </el-tree>
              </el-scrollbar>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!--右侧主区-->
      <template #paneR>
        <div class="right-container">
          <!--通用信息 编辑器-->
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>设置导出字段 - {{ state.title }}</span>
              </div>
            </template>
            <el-tabs v-model="state.currentTabId" @tab-click="vueDataClick" @tab-remove="vueDataRemove" @dblclick="vueDataTabDblClick">
              <template v-for="(tab, index) in state.vueDataList">
                <el-tab-pane v-if="index == 0" :ref="'tab' + index" :closable="false" :name="'' + index" :label="tab.label"></el-tab-pane>
                <el-tab-pane v-else :ref="'tab' + index" :name="'' + index" :label="tab.label" closable></el-tab-pane>
              </template>
            </el-tabs>
            <el-row class="field-row">
              <el-col ref="leftCard" :span="9">
                <el-card class="field-card">
                  <template #header>
                    <div class="clearfix">
                      <template v-if="state.currentNode.exportId">
                        <span>{{ state.currentNode.tableNameCn }}（{{ state.currentNode.exportId }}）</span>
                        <el-link type="primary" @click="state.dialogVisibleModule = true">编辑模块</el-link>
                        <el-link type="danger" @click="deleteModule()">删除模块</el-link>
                      </template>
                    </div>
                  </template>
                  <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
                    <draggable :list="state.fields" item-key="index" :group="{ name: 'group', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" tag="ul" class="field-group">
                      <template #item="{ element, index }">
                        <li class="field-item" @click="handleSelectWidgetLeft(index)">
                          <el-checkbox v-model="element.check">
                            {{ element.cnName }}( <span :style="'color:' + (element.enable ? 'blue' : 'red')">{{ element.enable ? '开启' : '已关闭' }}</span
                            >, {{ element.orderNum }})
                          </el-checkbox>
                          <div>
                            <el-link type="primary" @click="handleWidgetEditLeft(index)">编辑</el-link>
                            <el-link type="danger" @click="deleteField(element)">删除</el-link>
                          </div>
                        </li>
                      </template>
                    </draggable>
                  </el-scrollbar>
                  <div v-if="state.currentNode.exportId" class="card-footer">
                    <el-link type="primary" @click="selectAll()">{{ state.check ? '反选' : '全选' }}</el-link>
                    <el-link type="primary" @click="changeEnable(1)">开启导出</el-link>
                    <el-link type="danger" @click="changeEnable(0)">关闭导出</el-link>
                    <el-link type="primary" @click="addField">新增字段</el-link>
                    <el-link type="danger" @click="deleteField()">删除字段</el-link>
                    <span class="right">(共{{ state.fields.length }}个字段)</span>
                  </div>
                </el-card>
              </el-col>
              <el-col v-if="state.currentTab.vueDataId" :span="2" class="drag-col">
                <div class="icon">
                  <i class="icon-jiaoyiguanli"></i>
                </div>
                <div class="text">左右拖拽</div>
              </el-col>
              <el-col v-if="state.currentTab.vueDataId" :span="13">
                <el-card class="field-card2">
                  <template #header>
                    <div class="clearfix">
                      <span>已选字段</span>
                      <el-button type="primary" link class="right no-padding" icon="yrt-addplus" @click="showFieldDialog()">添加自定义字段</el-button>
                    </div>
                  </template>
                  <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
                    <draggable v-model="state.currentTab.vueData" item-key="index" group="group" ghost-class="ghost" :animation="300" chosen-class="chosen-item" tag="ul" class="field-group draggable-main" @add="handleWidgetAdd">
                      <template #item="{ element, index }">
                        <li :index="index" class="field-item">
                          <el-button :item-data="element" type="primary" plain icon="icon-liebiao3" class="selected-item" @click="handleSelectWidget(index)">{{ element.cnName }}</el-button>
                          <el-input v-model="element.aliasName" placeholder="自定义标题名" class="w-120"></el-input>
                          <el-input v-model="element.colExpression" placeholder="计算公式" class="w-150"></el-input>
                          <div v-if="state.currentTab.vueDataId !== 0" class="tool">
                            <el-button v-if="state.selectWidget && state.selectWidget.key == element.key" title="编辑" class="widget-action-btn" circle plain type="primary" @click.stop="handleWidgetEdit(index)">
                              <i class="icon-bianji"></i>
                            </el-button>
                            <el-button v-if="state.selectWidget && state.selectWidget.key == element.key" title="删除" class="widget-action-btn" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
                              <i class="yrt-shanchu2"></i>
                            </el-button>
                          </div>
                        </li>
                      </template>
                    </draggable>
                  </el-scrollbar>
                </el-card>
              </el-col>
            </el-row>
            <div class="footer">
              <el-button type="success" @click="createFolder">新建文件夹</el-button>
              <el-button type="success" @click="imortModule">导入模块</el-button>
              <el-button type="success" @click="copeVueData">复制一个新模板</el-button>
              <el-button ref="common-btn" type="primary" @click="saveData">保存</el-button>
              <el-alert :closable="false" title="说明" type="info" show-icon class="msg">
                <div class="line-height-1_5">
                  将左侧候选字段拖放到右侧，选中右侧字段，可以删除不需要的字段。<br />
                  <span class="color-red">自定义字段名称请使用大括号括起来，例如：{销售价} * 2</span>
                </div>
              </el-alert>
            </div>
          </el-card>
        </div>
      </template>
    </split-pane>

    <!--左侧标准字段弹出窗-->
    <el-dialog draggable v-model="state.dialogVisibleLeft" title="标准字段编辑" append-to-body width="30%">
      <el-form ref="form" :model="state.selectWidgetLeft" label-width="120px">
        <el-form-item label="字段中文名">
          <el-input v-model="state.selectWidgetLeft.cnName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="字段英文名">
          <el-input v-model="state.selectWidgetLeft.columnName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model.number="state.selectWidgetLeft.orderNum" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="state.selectWidgetLeft.enable" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="state.selectWidgetLeft.dataType" placeholder="请选择数据类型" clearable class="w-200">
            <el-option v-for="item in state.dataTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="格式化模板">
          <el-select v-model="state.selectWidgetLeft.dataFormatter" clearable class="w-200">
            <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
            <el-option label="YYYY-MM-DD" value="YYYY-MM-dd"></el-option>
            <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-dd HH:mm:ss"></el-option>
            <el-option label="￥0.00" value="￥0.00"></el-option>

            <el-option label="#" value="#"></el-option>
            <el-option label="#.#" value="#.#"></el-option>
            <el-option label="0.#" value="0.#"></el-option>
            <el-option label="0.##" value="0.##"></el-option>
            <el-option label="0.###" value="0.###"></el-option>
            <el-option label="0.####" value="0.####"></el-option>
            <el-option label="0.#####" value="0.#####"></el-option>
            <el-option label="0.######" value="0.######"></el-option>
            <el-option label="0.#######" value="0.#######"></el-option>
            <el-option label="0.########" value="0.########"></el-option>
            <el-option label="0.0" value="0.0"></el-option>
            <el-option label="0.00" value="0.00"></el-option>
            <el-option label="0.000" value="0.000"></el-option>
            <el-option label="0.0000" value="0.0000"></el-option>
            <el-option label="0.00000" value="0.00000"></el-option>
            <el-option label="0.000000" value="0.000000"></el-option>
            <el-option label="0.0000000" value="0.0000000"></el-option>
            <el-option label="0.00000000" value="0.00000000"></el-option>
            <el-option label="%" value="%"></el-option>
            <el-option label="大单位格式化" value="大单位格式化"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启扩展字段">
          <el-switch v-model="state.selectWidgetLeft.isExpandField" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisibleLeft = false">关闭</el-button>
          <el-button type="primary" @click="saveFieldLeft">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--右侧自定义字段弹出窗-->
    <el-dialog draggable v-model="state.dialogFieldVisible" title="自定义字段编辑" append-to-body width="30%">
      <el-form ref="form" :model="state.formData" label-width="120px">
        <el-form-item label="字段中文名">
          <el-input v-model="state.formData.cnName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="字段英文名">
          <el-input v-model="state.formData.columnName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="开启扩展字段">
          <el-switch v-model="state.formData.isExpandField" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="state.formData.dataType" placeholder="请选择数据类型" clearable class="w-200">
            <el-option v-for="item in state.dataTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="格式化模板">
          <el-select v-model="state.formData.dataFormatter" clearable class="w-200">
            <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
            <el-option label="YYYY-MM-DD" value="YYYY-MM-dd"></el-option>
            <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-dd HH:mm:ss"></el-option>
            <el-option label="￥0.00" value="￥0.00"></el-option>
            <el-option label="#" value="#"></el-option>
            <el-option label="#.#" value="#.#"></el-option>
            <el-option label="0.#" value="0.#"></el-option>
            <el-option label="0.##" value="0.##"></el-option>
            <el-option label="0.###" value="0.###"></el-option>
            <el-option label="0.####" value="0.####"></el-option>
            <el-option label="0.#####" value="0.#####"></el-option>
            <el-option label="0.######" value="0.######"></el-option>
            <el-option label="0.#######" value="0.#######"></el-option>
            <el-option label="0.########" value="0.########"></el-option>
            <el-option label="0.0" value="0.0"></el-option>
            <el-option label="0.00" value="0.00"></el-option>
            <el-option label="0.000" value="0.000"></el-option>
            <el-option label="0.0000" value="0.0000"></el-option>
            <el-option label="0.00000" value="0.00000"></el-option>
            <el-option label="0.000000" value="0.000000"></el-option>
            <el-option label="0.0000000" value="0.0000000"></el-option>
            <el-option label="0.00000000" value="0.00000000"></el-option>
            <el-option label="%" value="%"></el-option>
            <el-option label="大单位格式化" value="大单位格式化"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启扩展字段">
          <el-switch v-model="state.formData.isExpandField" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogFieldVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveField">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--编辑模块弹出窗-->
    <el-dialog draggable v-model="state.dialogVisibleModule" title="导出模块编辑" append-to-body width="30%">
      <el-form ref="form" :model="state.currentNode" label-width="120px">
        <el-form-item label="模块ID">
          {{ state.currentNode.exportId }}
        </el-form-item>
        <el-form-item label="自定义模块ID">
          <el-input v-model.number="state.currentNode.customExportId" type="number" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-input v-model="state.currentNode.tableNameCn" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="表名">
          <el-input v-model="state.currentNode.tableName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="父级ID">
          <el-input v-model="state.currentNode.parentId" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model.number="state.currentNode.orderNum" class="w-200"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisibleModule = false">关闭</el-button>
          <el-button type="primary" @click="saveModule">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-dataHandler-export">
import '/@/theme/animate.css';
import Draggable from 'vuedraggable';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, ResultInfo } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import { postData, deleteData } from '/@/api/common/baseApi';
import { BaseObject } from '/@/types/common';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { to } from 'await-to-js';
const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
const _dataTypeList = [
  { id: 'none', name: 'none' },
  { id: 'string', name: 'string' },
  { id: 'byte', name: 'byte' },
  { id: 'integer', name: 'integer' },
  { id: 'long', name: 'long' },
  { id: 'double', name: 'double' },
  { id: 'bigDecimal', name: 'bigDecimal' },
  { id: 'boolean', name: 'boolean' },
  { id: 'datetime', name: 'datetime' },
  { id: 'date', name: 'date' },
  { id: 'month', name: 'month' },
];

//#region 定义变量
const state = reactive({
  filterText: '',
  dataTree: [],
  props: {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  },
  /**
   * 当前选中项
   */
  currentNode: {} as any,
  // 是否全选
  check: false,
  value: '-',
  editMode: 'common',
  title: '请选择模块',
  // 已经选择好的项
  currentTab: {} as any,
  // 默认规则
  defaultCodeRegular: null,
  // 加载状态
  loading: false,
  // 字段候选项
  fields: [] as Array<any>,
  // 左侧选中项
  selectWidgetLeft: {
    enable: 1,
  } as any,
  // 选中项
  selectWidget: {} as BaseObject,
  // 当前导出模板Tab Id
  currentTabId: '0',
  // 当前选中菜单下的导出模板列表
  vueDataList: [] as Array<any>,
  // 左侧自定义字段弹窗
  dialogVisibleLeft: false,
  // 自定义字段弹窗
  dialogFieldVisible: false,
  // 编辑模块弹出窗
  dialogVisibleModule: false,
  // 自定义字段
  formData: {
    columnName: null,
    cnName: null,
    isExpandField: 1,
  } as any,
  // 数据类型列表
  dataTypeList: _dataTypeList,
  filterDataList: [] as any[], // 搜索结果
});
//#endregion

onMounted(() => {});

// 获得左侧类目导航节点数据
const loadTreeNode = async (node: any, resolve: any) => {
  let whereList: Array<QueryBo> = []; // 查询条件
  if (node.level === 0) {
    whereList.push({
      column: 'parentId',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  } else {
    whereList.push({
      column: 'parentId',
      values: node.data.exportId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  }

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'sysExport',
    keyName: 'exportId',
    nodeName: 'tableNameCn',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: 'tableName,parentId,orderNum,customExportId',
  };
  let res = await postData(url, params);

  if (res.result) {
    if (node.level === 0) {
      res.data.push({
        exportId: -1,
        hasChild: 1,
        tableNameCn: '[未使用节点]',
      });
    }
    res.data.forEach((element: any) => {
      element.label = element['tableNameCn'];
      element.isLeaf = !element.hasChild;
    });
    resolve(res.data);
  } else {
    proxy.$message.error(res.msg);
  }
};

// 刷新tree
const treeRefresh = async () => {
  state.filterDataList = [];
  if (!state.filterText) {
    let root = proxy.$refs.tree.store.root;
    while (root.childNodes.length) {
      proxy.$refs.tree.remove(root.childNodes[0]);
    }
    loadTreeNode(root, (data: any) => {
      root.doCreateChildren(data);
    });
    return;
  }
  let url = '/system/dataHandler/export/searchTree/' + encodeURI(state.filterText);
  let params = {};
  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    state.filterDataList = res.data;
  }
};

// 搜索导航
const filterTreeNode = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

// 点击tree导航节点
const nodeClick = async (item: any, node?: any, el?: any) => {
  state.currentNode = item;
  state.currentNode.customExportId = Number(state.currentNode.customExportId);
  state.title = item.tableNameCn;
  state.currentTabId = '0';

  // 查询条件
  let queryBoList: Array<QueryBo> = [
    {
      column: 'exportId',
      values: state.currentNode.exportId,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    },
    {
      column: 'orderNum',
      values: 'orderNum',
      queryType: QueryType.ORDERBYDESC, // 字段排序
      dataType: DataType.STRING,
    },
  ];

  let url = '/system/dataHandler/exportColumn/selectList';
  let params = queryBoList;

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    state.fields = res.data.map((item: any) => {
      // 扩展字段处理为对象值
      if (item.expandFields) {
        item = Object.assign(item, JSON.parse(item.expandFields));
      }

      item.check = false;
      return item;
    });
    // 初始化标准模板
    let vueData = state.fields.map((item) => {
      let key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);
      return {
        cnName: item.cnName,
        columnName: item.columnName,
        colExpression: item.colExpression,
        aliasName: item.aliasName,
        orderNum: item.orderNum,
        key: key,
      };
    });
    state.vueDataList = [
      {
        vueDataId: 0, // 0表示为主模板
        exportId: 0,
        label: '系统标准模板',
        vueData: vueData,
      },
    ];
    state.currentTab = state.vueDataList[0];
    // 加载vueData列表
    await loadVueDtaList();
  }
};

// 加载VueData列表
const loadVueDtaList = async () => {
  let exportId = state.currentNode.exportId;
  let url = '/system/dataHandler/exportVueData/selectByExportId';
  let params = {
    exportId: exportId,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    res.data.forEach((item: any) => {
      let vueDataItem = JSON.parse(item.vueData);
      vueDataItem.vueDataId = item.vueDataId;
      vueDataItem.exportId = item.exportId;
      vueDataItem.label = item.vueDataName;
      state.vueDataList.push(vueDataItem);
    });
  }
};

// 拖拽添加事件
const handleWidgetAdd = (evt: any) => {
  const newIndex = evt.newIndex;
  let newItem = state.currentTab.vueData[newIndex];
  newItem = JSON.parse(JSON.stringify(newItem));
  newItem.key = new Date().valueOf() + '_' + Math.ceil(Math.random() * 99999);
  state.currentTab.vueData[newIndex] = newItem;
};

// 左侧选中
const handleSelectWidgetLeft = (index: number) => {
  state.selectWidgetLeft = state.fields[index];
};

// 选中
const handleSelectWidget = (index: number) => {
  state.selectWidget = state.currentTab.vueData[index];
};

// 删除选择项
const handleWidgetDelete = (index: number) => {
  if (state.currentTab.length - 1 === index) {
    if (index === 0) {
      state.selectWidget = {};
    } else {
      state.selectWidget = state.currentTab.vueData[index - 1];
    }
  } else {
    state.selectWidget = state.currentTab.vueData[index + 1];
  }

  state.currentTab.vueData.splice(index, 1);
};

// 左侧编辑选择项
const handleWidgetEditLeft = (index: number) => {
  state.dialogVisibleLeft = true;
};

// 编辑选择项
const handleWidgetEdit = (index: number) => {
  state.dialogFieldVisible = true;
  state.formData.columnName = state.selectWidget.columnName;
  state.formData.cnName = state.selectWidget.cnName;
  state.formData.isExpandField = state.selectWidget.isExpandField;
};

// common类型保存
const saveData = async () => {
  if (state.currentTab.vueDataId === 0) {
    proxy.$message.error('系统标准模板不允许操作！');
    return;
  }
  let vueData = JSON.stringify(state.currentTab);
  let exportId = state.currentNode.exportId;

  let url = '/system/dataHandler/exportVueData/saveData';
  let params = {
    vueDataId: state.currentTab.vueDataId,
    label: state.currentTab.label,
    vueData: vueData,
    exportId: exportId,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.currentTab.vueDataId = res.data.vueDataId;
  }
};

// vueData Tab点击切换
const vueDataClick = (tab: any, event: any) => {
  let item = state.vueDataList[parseInt(tab.index)];
  state.currentTab = item;
};

// 复制VueData
const copeVueData = () => {
  proxy
    .$prompt('请输入新导入设置名称', '复制当前项', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(({ value }) => {
      if (value) {
        let currentItem = state.vueDataList[Number(state.currentTabId)];
        if (!currentItem) {
          proxy.$message.error('需要复制的数据不存在！');
          return;
        }
        let newVueData = JSON.parse(JSON.stringify(currentItem));
        newVueData.vueDataId = -1; // -1表示为新增
        newVueData.label = value;
        state.vueDataList.push(newVueData);
        proxy.$message.success('复制成功');
      } else {
        proxy.$message.error('名称不能为空');
      }
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

// 删除VueData Item
const vueDataRemove = (name: any) => {
  proxy
    .$confirm('此操作将永久删除该VueData, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let index = parseInt(name);
      let vueDataItem = state.vueDataList[index];
      if (vueDataItem.vueDataId > 0) {
        let url = '/system/dataHandler/exportVueData/remove/' + vueDataItem.vueDataId;
        const [err, res] = await to(deleteData(url));
        if (err) {
          return;
        }

        proxy.common.showMsg(res);
        if (res.result) {
          state.vueDataList.splice(index, 1);
        }
      } else if (vueDataItem.vueDataId === 0) {
        proxy.$message.error('主VueData不允许删除！');
      } else {
        state.vueDataList.splice(index, 1);
        proxy.$message.success('删除成功！');
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 修改VueData名称
const vueDataTabDblClick = () => {
  let vueDataItem = state.vueDataList[Number(state.currentTabId)];
  proxy
    .$prompt('请输入新名称', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: vueDataItem.label,
    })
    .then(async ({ value }) => {
      if (!value) {
        proxy.$message.error('名称不能为空！');
        return;
      }
      if (vueDataItem.vueDataId > 0) {
        let url = '/system/dataHandler/exportVueData/updateTitle';
        let params = {
          vueDataId: vueDataItem.vueDataId,
          title: value,
        };
        const [err, res] = await to(postData(url, params));
        if (err) {
          return;
        }

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

// 显示添加对话框
const showFieldDialog = () => {
  state.dialogFieldVisible = true;
  state.formData.columnName = null;
  state.formData.cnName = null;
  state.formData.isExpandField = 0;
};

// 左侧修改字段
const saveFieldLeft = async () => {
  if (!state.selectWidgetLeft.columnName) {
    proxy.$message.error('英文字段名称不能为空');
    return;
  }
  if (!state.selectWidgetLeft.cnName) {
    proxy.$message.error('中文字段名称不能为空');
    return;
  }
  let url = '/system/dataHandler/export/saveFieldLeft';
  let params = state.selectWidgetLeft;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg({
      result: true,
      msg: '执行成功',
    });
    //如果是新增添加字段
    if (!state.selectWidgetLeft.columnId) {
      state.selectWidgetLeft.columnId = res.msg;
      state.fields.push(state.selectWidgetLeft);
    }
    state.dialogVisibleLeft = false;
  } else {
    proxy.common.showMsg(res);
  }
};

// 修改字段
const saveField = () => {
  if (!state.formData.columnName) {
    proxy.$message.error('英文字段名称不能为空');
    return;
  }
  if (!state.formData.cnName) {
    proxy.$message.error('中文字段名称不能为空');
    return;
  }
  const fieldInfo = state.currentTab.vueData.find((item: any) => item.columnName === state.formData.columnName);
  // 修改
  if (fieldInfo) {
    fieldInfo.cnName = state.formData.cnName;
    fieldInfo.columnName = state.formData.columnName;
    fieldInfo.isExpandField = state.formData.isExpandField;
    fieldInfo.dataType = state.formData.dataType;
    fieldInfo.dataFormatter = state.formData.dataFormatter;
    proxy.$message.success('修改成功');
  } else {
    // 新增
    let index = state.currentTab.vueData.length;
    state.currentTab.vueData.push({
      cnName: state.formData.cnName,
      columnName: state.formData.columnName,
      isExpandField: state.formData.isExpandField,
      dataType: state.formData.dataType,
      dataFormatter: state.formData.dataFormatter,
      colExpression: null,
      key: 'key_' + index,
      aliasName: '',
    });
    proxy.$message.success('添加成功');
  }
  state.dialogFieldVisible = false;
};

// 保存模块
const saveModule = async () => {
  if (!state.currentNode.tableNameCn) {
    proxy.$message.error('模块名称不能为空');
    return;
  }
  if (!state.currentNode.tableName) {
    proxy.$message.error('表名不能为空');
    return;
  }
  let url = '/system/dataHandler/export/saveModule';
  let params = state.currentNode;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.dialogVisibleModule = false;
    treeRefresh(); // 刷新左侧
    state.currentNode = {};
    state.fields = [];
  }
};

// 导入模块
const imortModule = () => {
  let currentItem = state.currentNode;
  if (!state.currentNode) {
    proxy.$message.error('请选择需要放置的节点');
    return;
  }
  proxy
    .$prompt('请输入模块表别名', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: '',
    })
    .then(async ({ value }) => {
      if (!value) {
        proxy.$message.error('名称不能为空！');
        return;
      }
      let url = '/system/dataHandler/export/importModule';
      let params = {
        exportId: currentItem.exportId,
        tableName: value,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      if (res.result) {
        treeRefresh();
      }
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

// 全选
const selectAll = () => {
  state.check = !state.check;
  for (const field of state.fields) {
    field.check = state.check;
  }
};

//
const changeEnable = async (enable: number) => {
  const idList = state.fields.filter((item) => item.check).map((item) => item.columnId);
  if (!idList.length) {
    proxy.$message.error('至少勾选一项！');
    return;
  }
  let url = '/system/dataHandler/export/changeEnable';
  let params = {
    idList: idList,
    enable: enable,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  nodeClick(state.currentNode); // 刷新字段
};

// 新增字段
const addField = () => {
  state.dialogVisibleLeft = true;
  state.selectWidgetLeft = {
    exportId: state.currentNode.exportId,
    cnName: '',
    columnName: '',
    orderNum: 0,
    enable: 1,
  };
};

// 删除字段
const deleteField = (field?: any) => {
  let idList: Array<any> = [];
  if (field) {
    idList.push(field.columnId);
  } else {
    idList = state.fields.filter((item) => item.check).map((item) => item.columnId);
  }
  if (!idList.length) {
    proxy.$message.error('至少勾选一项！');
    return;
  }
  const submit = async () => {
    let url = '/system/dataHandler/export/deleteField';
    let params = {
      idList: idList,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    proxy.common.showMsg(res);
    nodeClick(state.currentNode); // 刷新字段
  };

  proxy
    .$confirm('此操作将永久删除该字段, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      submit();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 删除模块
const deleteModule = () => {
  if (!state.currentNode.exportId) {
    proxy.$message.error('至少勾选一项！');
    return;
  }
  const submit = async () => {
    let url = '/system/dataHandler/export/deleteModule';
    let params = {
      exportId: state.currentNode.exportId,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    proxy.common.showMsg(res);
    if (res.result) {
      treeRefresh(); // 刷新左侧
      state.currentNode = {};
      state.fields = [];
    }
  };

  proxy
    .$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      submit();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 新建文件夹
const createFolder = () => {
  proxy
    .$prompt('请输入文件夹名称', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: '',
    })
    .then(async ({ value }) => {
      if (!value) {
        proxy.$message.error('名称不能为空！');
        return;
      }
      let url = '/api/sys/export/createFolder';
      let params = {
        tableView: value,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      if (res.result) {
        treeRefresh();
      }
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};
</script>

<style lang="scss" scoped>
.regular-aside {
  :deep(.el-menu) {
    .el-sub-menu {
      .el-menu-item,
      .el-submenu__title {
        height: 35px;
        line-height: 35px;
      }

      .el-menu-item.is-active {
        background-color: #ecf5ff;
      }

      &.is-active,
      &.is-opened {
        background-color: #66b1ff;

        .el-submenu__title {
          color: white;

          .el-icon-menu,
          .el-submenu__icon-arrow {
            color: white;
          }

          &:hover {
            background-color: #66b1ff;
          }
        }
      }
    }
  }
}

.box-card {
  :deep(.el-card__body) {
    padding: 0px 20px 20px;
  }

  :deep(.scrollbar-wrap) {
    max-height: 440px;
    overflow-x: hidden;
    padding: 0px;
  }

  .field-row {
    width: 1300px;
    margin-top: 8px;

    .field-card {
      width: 100%;
      height: 540px;

      :deep(.el-card__body) {
        padding: 10px 0px 10px 5px;
      }

      .field-group {
        margin: 0;
        padding: 0 10px 20px 0;

        .field-item {
          padding: 5px 10px 5px 5px;
          display: flex;
          justify-content: space-between;

          &:nth-of-type(odd) {
            background-color: #ecf5ff;
          }
        }
      }

      .card-footer {
        padding-top: 5px;
        font-size: 12px;
        color: #afafaf;
        padding-right: 10px;

        .right {
          line-height: 1.5;
        }
      }
    }

    .drag-col {
      text-align: center;
      padding-top: 150px;
      line-height: 3;
      color: #888;

      .icon {
        color: dodgerblue;

        i {
          font-size: 60px;
        }
      }
    }

    .field-card2 {
      width: auto;
      height: 520px;

      :deep(.el-card__body) {
        padding: 10px 5px 10px 20px;
      }

      .field-group {
        margin: 0;
        padding: 0 10px 20px 0;

        .field-item {
          padding: 0px 10px 10px 0;

          .selected-item {
            padding: 10px 10px;
            width: 200px;
          }

          .splitter {
            width: 100px;
          }

          .custom-letter {
            width: 150px;
          }
        }
      }
    }
  }

  .footer {
    width: 920px;
    padding: 40px 10px 20px;
    text-align: center;

    .msg {
      line-height: 1.5;
      margin-top: 30px;
      text-align: left;
      font-size: 14px;
    }
  }

  .demo.el-alert {
    display: inline-table;

    :deep(.el-alert__icon) {
      position: relative;
      top: 20px;
    }
  }
}
</style>

<style lang="scss" scoped>
.biz-container {
  margin: 0px;
  .filter-box {
    margin-top: 10px;
    padding: 5px;
    line-height: 1.5;
    cursor: pointer;
    border: 1px solid #fff;
    width: 100%;
    border-radius: 5px;
    &:hover,
    &.active {
      background-color: #e5f0f8;
      border: 1px solid #4981a8;
    }
    .filter-title {
      font-size: 16px;
      font-weight: bold;
    }
    .sub-path {
      color: #a0a0a0;
      font-size: 14px;
    }
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-sub-menu__title) {
  color: let(--el-text-color-primary) !important;
}

:deep(.el-menu-item) {
  color: let(--el-text-color-primary) !important;
}

.field-item {
  position: relative;

  .tool {
    position: absolute;
    z-index: 100;
    left: 160px;
    top: 20px;

    .widget-action-btn {
      width: 36px !important;
      height: 36px !important;
    }
  }
}

.draggable-main {
  min-height: 400px;
  margin: 0;
  padding: 0;

  li.item {
    border: 1px solid #f8f8f8;
    padding: 10px;
    margin: 1px;
    background-color: #f3f3f3;
    line-height: 30px;

    &.over {
      background-color: #fff;
    }

    &.active {
      background-color: rgb(211, 228, 253);
    }

    &.chosen-item {
      border: 1px dotted rgb(44, 104, 163);
      background-color: #409eff;
      color: white;
    }
  }
}
</style>
