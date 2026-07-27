<template>
  <div>
    <el-tabs v-model="state.tabName" class="components-list">
      <el-tab-pane label="字段选择器" name="field-tab">
        <el-collapse v-model="state.collapseActiveName" accordion>
          <el-collapse-item ref="masterTableTtem" title="主表字段">
            <template #title>
              <span class="left title">{{ currentModuleNode.cnName }}</span>
              <el-popover ref="treePopover" class="right" width="400" trigger="click">
                <template #reference>
                  <el-button type="primary" link>选择模块</el-button>
                </template>
                <el-scrollbar :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
                  <el-tree ref="module-tree" :load="loadModuleNode" :props="state.moduleProps" lazy @node-click="moduleclick">
                    <template #default="{ node, data }">
                      <span class="custom-tree-node">
                        <template v-if="!node.isLeaf">
                          <span v-if="node.expanded"> <i class="yrt-wenjianjiazhankai"></i> {{ node.label }} </span>
                          <span v-else> <i class="yrt-wenjianjia"></i> {{ node.label }} </span>
                        </template>
                        <template v-else>
                          <span> <i class="yrt-wenjian1"></i> {{ node.label }} </span>
                        </template>
                      </span>
                    </template>
                  </el-tree>
                </el-scrollbar>
                <el-footer style="padding-top: 10px; border-top: 1px solid #f3f3f3; text-align: right">
                  <el-button type="primary" @click="() => treePopover.hide()">关闭</el-button>
                </el-footer>
              </el-popover>
            </template>
            <el-scrollbar :noresize="false" :native="false" wrap-class="fields scrollbar-wrap">
              <draggable :list="state.fieldComponents" item-key="index" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
                <template #item="{ element, index }">
                  <li class="form-edit-widget-label">
                    <a>
                      <i :class="element.icon"></i>
                      <span>{{ element.label.title }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </el-scrollbar>
          </el-collapse-item>
          <el-collapse-item title="明细字段">
            <template v-if="currentDetailFields.length">
              <el-scrollbar :noresize="false" :native="false" wrap-class="fields scrollbar-wrap">
                <draggable :list="currentDetailFields" item-key="index" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
                  <template #item="{ element, index }">
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
            <draggable :list="basicComponents" item-key="index" :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" ghost-class="ghost" :move="handleMove" tag="ul" @end="handleMoveEnd" @start="handleMoveStart">
              <template #item="{ element, index }">
                <li class="form-edit-widget-label">
                  <a>
                    <i :class="element.icon"></i>
                    <span>{{ element.label.title }}</span>
                  </a>
                </li>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="模板选择" name="template-tab" class="template-tab">
        <el-form class="form-tool">
          <el-form-item>
            <el-input v-model="state.filterText" placeholder="搜索名称" class="search-input">
              <template #append>
                <el-button title="刷新" @click="treeRefresh"><i class="yrt-chaxun2"></i></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-scrollbar :noresize="false" :native="false" wrap-class="tree-template scrollbar-wrap">
              <!--数据tree-->
              <el-tree ref="template-tree" :data="state.dataTree" :props="state.templateProps" :load="(node:any, resolve:any) => loadTemplateNode(node, resolve)" :filter-node-method="filterTreeNode" :draggable="state.treeDraggable" highlight-currentlazy lazy node-key="printTemplateId" @node-click="templateNodeclick" @node-drag-start="treeNodeDragStart" @node-drag-end="treeNodeDragEnd" class="tree-box">
                <template #default="{ node, data }">
                  <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
                    <span>
                      <i v-if="data.hasChild" class="ele-menu"></i>
                      <i v-else class="ele-tickets"></i>
                      <template v-if="data.isEdit">
                        <el-input v-model="data.label" size="small" class="w-150" @blur="treeNodeEditBlur(node, data)" @click.stop></el-input>
                      </template>
                      <template v-else> {{ node.label }} ({{ data.menuId }}) </template>
                    </span>
                    <span v-show="data == state.treeNodeOverItem" style="position: absolute; right: 0; background-color: white; padding: 0 8px">
                      <el-button type="primary" link size="small" title="复制" @click="() => treeNodeCopy(node, data)">
                        <i class="yrt-fuzhi" />
                      </el-button>
                      <el-button type="primary" link size="small" title="添加子级" @click="() => treeNodeAppend(node, data)">
                        <i class="yrt-addplus" />
                      </el-button>
                      <el-button type="primary" link size="small" title="编辑" @click.stop="() => treeNodeEdit(node, data)">
                        <i class="yrt-iconfontcolor32" />
                      </el-button>
                      <el-button type="primary" link size="small" title="删除" @click="() => treeNodeRemove(node, data)">
                        <i class="yrt-shanchu1"></i>
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--编辑弹出-->
    <el-dialog draggable v-model="state.editVisible" title="修改模板名称" width="500px" append-to-body>
      <el-form label-width="100px">
        <el-form-item label="模板ID">
          {{ state.editForm.printTemplateId }}
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input v-model="state.editForm.templateName" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="父级ID">
          <el-input v-model="state.editForm.parentId" class="w-200"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.editVisible = false">取消</el-button>
          <el-button type="primary" @click="modifyTemplate()">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="left-aside">
import Draggable from 'vuedraggable';
import { fieldComponents } from '../componentsConfig.js';
import { BaseProperties, DataOptions } from '/@/types/base-type';
import { postData, deleteData, getData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';

import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:moduleNode', 'update:detailFields', 'update:widgetFormData']);
let treePopover = ref();
let masterTableTtem = ref();

//#region 定义属性
const props = defineProps({
  basicComponents: {
    type: Array,
    default: () => [],
  },
  detailFields: {
    type: Array,
    default: () => [],
  },
  moduleNode: {
    type: Object,
    default: () => {},
  },
  widgetFormData: {
    type: Object,
    default: () => {},
  },
  resetDoList: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  tabName: 'field-tab',
  fieldComponents,
  // 搜索关键词
  filterText: '',
  // tree数据集合
  dataTree: [],
  // 鼠标滑过Item
  treeNodeOverItem: {},
  // 鼠标选中Item
  currentTreeNode: {
    isEdit: false,
    label: '',
  },
  // 记录修改前当前行名称
  currentOldLabel: '',

  // 模块tree prop参数配置
  moduleProps: {
    label: 'label',
    // children: "zones",
    isLeaf: function (data: any, node: any) {
      return data.hasChild !== 1;
    },
  },

  // 模板tree prop参数配置
  templateProps: {
    label: 'templateName',
    // children: "zones",
    isLeaf: function (data: any, node: any) {
      return '' + data.hasChild !== '1';
    },
  },
  // 模板节点选中项
  currentNodeKey: null,
  // 树模板可以拖拽
  treeDraggable: false,
  // 编辑对象
  editForm: {
    templateName: null,
    parentId: 0,
    printTemplateId: 0,
  },
  // 显示编辑对话框
  editVisible: false,
  collapseActiveName: '',
});
//#endregion

//#region 计算属性
const currentModuleNode = computed({
  get: function () {
    return props.moduleNode;
  },
  set: function (newVal) {
    emit('update:moduleNode', newVal); // 双向绑定，通知父级组件变量值同步更新
  },
});
const currentDetailFields = computed({
  get: function () {
    return props.detailFields;
  },
  set: function (newVal) {
    emit('update:detailFields', newVal); // 双向绑定，通知父级组件变量值同步更新
  },
});
const currentWidgetFormData = computed({
  get: function () {
    return props.widgetFormData;
  },
  set: function (newVal) {
    emit('update:widgetFormData', newVal); // 双向绑定，通知父级组件变量值同步更新
  },
});
//#endregion

//#region wacth
watch(
  () => state.filterText,
  (newVal) => {
    if (proxy.$refs['template-tree']) proxy.$refs['template-tree'].filter(newVal);
  },
  { deep: true, immediate: true }
);
//#endregion

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

// 选择模块单击事件
const moduleclick = (data: any, node: any, element: any) => {
  if (!node.isLeaf) return;

  currentModuleNode.value = {
    projectName: data.ProjectName,
    cnName: data.cnName,
    table_Id: data.table_Id,
    tableName: data.tableName,
    tableView: data.tableView,
    dBServer: data.DBServer,
    dBServerReadOnly: data.DBServerReadOnly,
    parentId: data.parentId,
    detailName: data.DetailName,
    idField: data.keyIDs,
    codeRegular: data.codeRegular,
    linkColumn: data.linkColumn,
    sortName: data.sortName,
    vueData: data.vueData,
  };
  loadModuleFields(data, node, element);
  treePopover.value.hide();
  if (!masterTableTtem.value.isActive) {
    state.collapseActiveName = '主表字段';
  }
};

// 加载模块字段
const loadModuleFields = async (data: any, node: any, element: any) => {
  let url = `/tool/gen/column/${data.tableId}`;
  const [err, res] = await to(getData(url));
  if (err) {
    return;
  }
  if (res.result) {
    state.fieldComponents = res.data.rows.map((item: any, index: any, arr: any) => {
      let field = {
        type: 'field',
        label: {
          title: item.columnComment,
          showColon: true,
          styles: {
            width: '100px',
            'font-size': '14px',
            'text-align': 'right',
            'line-height': '30px',
          },
        },
        text: {
          prop: proxy.common.toCamelCase(proxy.common.caseStyle(item.columnName)),
          styles: {
            width: '170px',
            'font-size': '14px',
            'text-align': 'left',
            'line-height': '30px',
          },
        },
        icon: 'yrt-danhangshurukuang',
        options: {
          x: 50,
          y: 5,
          z: 0,
          w: 280,
          h: 30,
          minw: 30,
          minh: 30,
          parent: true,
          snap: false,
          snapTolerance: 20,
        },
        styles: {
          'font-size': '16px',
          'font-weight': 'normal',
          'font-style': 'normal',
          'white-space': 'nowrap',
          'text-decoration': 'none',
        },
      };

      return field;
    });
  } else {
    proxy.common.showMsg(res);
  }
};

// 加载模板节点树
const loadTemplateNode = async (node: any, resolve: any) => {
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
      values: node.data.printTemplateId,
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
    column: 'printTemplateId',
    orderByType: OrderByType.ASC,
  });

  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'sys_print_template',
    keyName: 'printTemplateId',
    nodeName: 'templateName',
    fixHasChild: false,
    isBreakWay: false,
    displayBreakWay: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: 'vueData,parentId,menuId',
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    if (node.level === 0) {
      res.data.push({
        printTemplateId: -1,
        hasChild: '1',
        templateName: '[未使用节点]',
      });
    }
    res.data.forEach((element: any) => {
      element.label = element['templateName'];
      element.isLeaf = !element.hasChild;
      element.isEdit = false;
    });

    resolve(res.data);
    proxy.$nextTick(() => {
      if (state.currentNodeKey) {
        proxy.$refs['template-tree'].setCurrentKey(state.currentNodeKey);
      }
    });
  } else {
    proxy.$message.error(res.msg);
  }
};

// 搜索导航
const filterTreeNode = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

// 选择模块单击事件
const templateNodeclick = (data: any, node: any, element: any) => {
  if (state.currentTreeNode) state.currentTreeNode.isEdit = false;
  state.currentTreeNode = data;
  state.currentOldLabel = state.currentTreeNode.label;
  state.currentNodeKey = proxy.$refs['template-tree'].getCurrentKey();

  if (data.vueData) {
    props.resetDoList();
    const vueData = JSON.parse(data.vueData);
    if (vueData.fields) {
      const subTableInfo = vueData.fields.find((item: any) => item.type === 'table'); // 明细表参数
      if (subTableInfo && !Array.isArray(subTableInfo.footFields)) {
        subTableInfo.footFields = []; // 修复历史数据，表格脚本数组
      }
    }

    currentWidgetFormData.value = proxy.common.objectToCase(vueData);
  }
};

// 获得当前节点
const getCurrentNode = () => {
  let node = proxy.$refs['template-tree'].getCurrentNode();
  return node;
};

// tree鼠标进入
const treeNodeOver = (node: any, data: any) => {
  state.treeNodeOverItem = data;
};

// tree鼠标移出
const treeNodeOut = (node: any, data: any) => {
  state.treeNodeOverItem = {};
};

// 刷新tree
const treeRefresh = () => {
  state.filterText = '';
  let root = proxy.$refs['template-tree'].store.root;
  while (root.childNodes.length) {
    proxy.$refs['template-tree'].remove(root.childNodes[0]);
  }
  loadTemplateNode(root, (data: any) => {
    root.doCreateChildren(data);
  });
};

// 复制节点
const treeNodeCopy = (node: any, data: any) => {
  proxy
    .$prompt('请输入复制新模板名称', '复制模板', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(async (options: any) => {
      let { value } = options;
      if (!value) {
        proxy.$message.error('名称不能为空');
        return;
      }

      let url = '/system/core/printTemplate/copyEditor';
      let params = {
        idValue: data.value, // 当前ID
        data: {
          master: {
            templateName: value,
          },
        },
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      treeRefresh();
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

// 新建节点
const treeNodeAppend = (node: any, data: any) => {
  proxy
    .$prompt('请输入模板名称', '添加子级模板', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    .then(async (options: any) => {
      let { value } = options;
      if (!value) {
        proxy.$message.error('名称不能为空');
        return;
      }

      let url = '/api/sys/printTemplate/addItem';
      let params = {
        parentId: data.value, // 父级ID
        templateName: value,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      treeRefresh();
    })
    .catch(() => {
      proxy.$message.info('取消输入');
    });
};

// 编辑节点
const treeNodeEdit = (node: any, data: any) => {
  // data.isEdit = true;
  state.treeDraggable = false;
  state.editVisible = true;
  state.editForm.templateName = data.templateName;
  state.editForm.parentId = data.parentId;
  state.editForm.printTemplateId = data.printTemplateId;
};

// 删除
const treeNodeRemove = (node: any, data: any) => {
  proxy
    .$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      let id = data.value || data.printTemplateId;
      let url = '/system/core/printTemplate/remove/' + id;
      const [err, res] = await to(deleteData(url));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);
      treeRefresh();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 失去焦点后修改数据
const treeNodeEditBlur = async (node: any, data: any) => {
  data.isEdit = false;
  state.treeDraggable = true;
  if (state.currentOldLabel === data.label) {
    return;
  }

  let url = '/api/sys/printTemplate/updateTitle';
  let params = {
    id: data.value,
    value: data.label,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  treeRefresh();
};

// 开始拖拽
const treeNodeDragStart = (draggingNode: any, evt: any) => {};

// 拖拽操作
const treeNodeDragEnd = async (draggingNode: any, dropNode: any, dropType: any, evt: any) => {
  if (!state.treeDraggable) {
    state.treeDraggable = true;
    return;
  }
  // 不允许拖入到子集的下面
  let stopChildren = draggingNode.childNodes.find((item: any) => {
    return item.data.value === dropNode.data.value;
  });
  if (stopChildren) {
    return;
  }
  // 拖拽到自己身上不响应
  if (draggingNode.data.value === dropNode.data.value) {
    return;
  }

  let url = '/api/sys/printTemplate/moveItem';
  let params = {
    id: draggingNode.data.value, // 当前ID
    value: dropNode.data.value, // 父级ID
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  treeRefresh();
};

// 保存模板名称
const modifyTemplate = async () => {
  let url = '/system/core/printTemplate/update';
  let params = state.editForm;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  proxy.common.showMsg(res);
  treeRefresh();
  state.editVisible = false; // 关闭对话框
};

// 对外暴露属性和方法
defineExpose({
  /**
   * 获得当前节点
   */
  getCurrentNode,
});
</script>

<style lang="scss" scoped>
$primary-color: #409eff;
$primary-background-color: #ecf5ff;

.components-list {
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden !important;

  .widget-cate {
    padding: 8px 12px;
    font-size: 13px;
  }

  ul {
    position: relative;
    overflow: hidden;
    padding: 0 10px 10px;
    margin: 0;
  }

  .form-edit-widget-label {
    font-size: 12px;
    display: block;
    width: 48%;
    line-height: 26px;
    position: relative;
    float: left;
    left: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1%;
    color: #333;
    border: 1px solid #f4f6fc;

    &:hover {
      color: $primary-color;
      border: 1px dashed $primary-color;
    }

    & > a {
      display: block;
      cursor: move;
      background: #f4f6fc;
      border: 1px solid #f4f6fc;

      i {
        margin-right: 6px;
        margin-left: 8px;
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        top: 3px;

        &.yrt-danhangshurukuang {
          font-size: 20px;
          margin-top: -5px;
          margin-right: 3px;
        }

        &.yrt-fuhao-shuzishurukuang {
          font-size: 20px;
          margin-right: 3px;
          margin-top: -5px;
        }

        &.yrt-kaiguanclose {
          font-size: 20px;
          margin-right: 3px;
          margin-top: -5px;
        }
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  .el-collapse-item__header {
    padding-left: 10px;
  }

  .el-collapse-item__content {
    padding-bottom: 0px;
  }
}

.scrollbar-wrap {
  ul {
    margin-bottom: 10px;
  }
}

:deep(.tree.scrollbar-wrap) {
  max-height: 410px;
  overflow-x: hidden;
  padding: 10px;

  .el-tree {
    margin-bottom: 10px;
  }
}
:deep(.tree-template.scrollbar-wrap) {
  max-height: 600px;
  overflow-x: hidden;
  padding: 0px;

  .el-tree {
    margin-bottom: 10px;
  }
}
:deep(.fields.scrollbar-wrap) {
  max-height: 410px;
  overflow-x: hidden;
  padding: 0px;
}

.template-tab {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 4px;
  .form-tool {
    padding-top: 10px;
    .el-form-item {
      padding: 0 10px;
    }
    .search-input {
      width: 100%;
    }
    .btn-search,
    .btn-refresh {
      padding: 10px;
    }
    .btn-refresh {
      margin-left: 0px;
    }
  }
  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #a7ccf7;
    color: white;
    .el-button--text {
      color: white;
    }
    height: 30px;
  }
  .tree-box {
    width: 100%;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-button + .el-button {
    margin-left: 3px;
  }
}
</style>
