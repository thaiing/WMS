<template>
  <div class="biz-container">
    <split-pane :max-width="500" :default-width="260" split="vertical">
      <template #paneL>
        <div class="left-container">
          <el-form class="form-tool">
            <el-form-item class="margin-bottom-0">
              <el-input v-model="state.filterText" placeholder="搜索名称" class="search-input">
                <template #append>
                  <el-button title="刷新" @click="treeRefresh"><i class="yrt-chaxun2"></i></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="padding-right-0 margin-bottom-0">
              <el-scrollbar :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
                <!--数据tree-->
                <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="(node:any, resolve:any) => loadTreeNode(node, resolve)" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="deptId" @node-click="nodeClick">
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
          <!--数据Table-->
          <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :loadDataBefore="loadDataBefore" :action-field="state.actionField"></yrt-data-list>

          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>
        </div>
      </template>
    </split-pane>

    <!--数据权限设置-->
    <post-auth-dialog ref="post-auth-dialog" v-model:visible="state.postAuthVisible" :user-id="state.currentUserId"></post-auth-dialog>
  </div>
</template>

<script setup lang="ts" name="system-permission-deptPost">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
const PostAuthDialog = defineAsyncComponent(() => import('./components/post-auth-dialog.vue'));
import YrtDataList from '/@/components/common/yrtDataList.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
import baseHook from '/@/components/hooks/baseHook';
import { DataType, OrderByType, OrderItem, PageListBo, QueryBo, QueryType, SearchField } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorRef, dataListRef, buttonClick, detailButtonClick, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  filterText: '',
  dataTree: [],
  props: {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  },
  // 当前选中项
  currentNode: null as any,
  addLevel: 'brother',
  // 编辑级联是否加载完毕
  isTreeLoaded: false,
  // 所有类目树
  treeNodes: [] as any[],
  // 显示数据权限对话框
  postAuthVisible: false,
  // 当前选中用户ID
  currentUserId: 0,
  // 自定义操作列
  actionField: {
    prop: '_action',
    label: '操作',
    width: '150',
    headerAlign: 'center',
    align: 'center',
    action: [
      {
        type: 'button',
        action: 'postAuth',
        label: '模块权限',
        onClick(btnInfo: any, rowData: any, colInfo: any) {
          state.postAuthVisible = true;
          state.currentUserId = rowData.deptPostId;
          return true;
        },
      },
      {
        type: 'button',
        action: 'modify',
        label: '编辑',
        onClick(btnInfo: any, rowData: any, colInfo: any) {
          base.editorRef.value.loadEditData(rowData.deptPostId, rowData);
          return true;
        },
      },
      {
        type: 'button',
        action: 'delete',
        label: '删除',
      },
    ],
    hidden: false,
  },
});
//#endregion

onMounted(() => {
  setTimeout(() => {
    let field = base.editorRef.value.getFieldInfo('fullDeptId');
    cascaderLoadNode(null, 0, field);
    state.isTreeLoaded = true;
  }, 3000);
});

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
    whereList.push({
      column: 'delFlag',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.CHAR,
    });
  } else {
    whereList.push({
      column: 'parentId',
      values: node.data.deptId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
    whereList.push({
      column: 'delFlag',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.CHAR,
    });
  }

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'sysDept',
    keyName: 'deptId',
    nodeName: 'deptName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let headers = {
    repeatSubmit: false,
  };
  let res = await postData(url, params, headers);

  if (res.result) {
    res.data.forEach((element: any) => {
      element.label = element['deptName'];
      element.isLeaf = !element.hasChild;
    });
    resolve(res.data);
  } else {
    proxy.$message.error(res.msg);
  }
};

// 搜索导航
const filterTreeNode = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

// 点击tree导航节点
const nodeClick = async (data: any, node?: any, el?: any) => {
  if (editorRef) {
    state.currentNode = proxy.$refs.tree.currentNode;
    await dataListRef.value.loadData();
  } else {
    proxy.$message.error('编辑器正在初始化');
  }
};

// 刷新tree
const treeRefresh = () => {
  state.filterText = '';
  state.currentNode = null; // 清空选中项
  dataListRef.value.loadData(); // 重新加载数据

  let root = proxy.$refs.tree.store.root;
  while (root.childNodes.length) {
    proxy.$refs.tree.remove(root.childNodes[0]);
  }
  loadTreeNode(root, (data: any) => {
    root.doCreateChildren(data);
  });
};

// 获取下一节点
const getAfterNode = (childNodes: Array<any>, node: any): any => {
  //获取同级后一个节点，node父节点的所有子节点，node当前节点
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].id == node.id) {
      if (i < childNodes.length - 1) {
        return childNodes[i + 1];
      } else {
        //没有后面一个节点
        return null;
      }
    } else if (childNodes[i].children) {
      //有下级，递归查询
      return getAfterNode(childNodes[i].children, node);
    }
  }
  return null;
};

// 加载前事件
const loadDataBefore = (pageParams: PageListBo, searchFields: Array<SearchField>) => {
  let currentNode = state.currentNode;
  if (currentNode) {
    pageParams.otherParams = {
      currentDeptId: currentNode.data.deptId,
    };
  } else {
    pageParams.otherParams = {
      currentDeptId: null,
    };
  }

  return true;
};
// 编辑获得焦点
const onFocus = (ref: any, val: any, event: any, field: any) => {
  if (!state.isTreeLoaded && field.options.prop === 'fullDeptId') {
    cascaderLoadNode(ref, 0, field);
    state.isTreeLoaded = true;
  }
};
// 编辑改变数据
base.onChange = (ref: any, val: any, field: any, master: any) => {
  if (field.options.prop === 'fullDeptId') {
    // 设置表单数据
    base.masterData.value.parentId = val[val.length - 1];
    let fullDeptName = [];
    let currentNodes = state.treeNodes;
    for (let id of val) {
      let currentNode = currentNodes.find((item) => item.value === id);
      fullDeptName.push(currentNode.label);
      currentNodes = currentNode.children;
    }
    base.masterData.value.fullDeptName = fullDeptName.join('/');
    base.masterData.value.delFlag = 0;
  }
  if (field.options.prop === 'vueUrl' && val) {
    master.vueFilePath = '@/views' + val;
    master.vueName = val.replace(/\//gi, '-').replace(/^-/gi, '');
  }
};
// 编辑框级联加载子集数据
const cascaderLoadNode = async (ref: any, val: any, field: any) => {
  let whereList: Array<QueryBo> = []; // 查询条件
  whereList.push({
    column: 'parentId',
    values: 0,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  whereList.push({
    column: 'delFlag',
    values: 0,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNodeAll';
  let params = {
    tableName: 'sysDept',
    keyName: 'deptId',
    nodeName: 'deptName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    var items = [
      {
        value: 0,
        label: '根',
        children: res.data,
      },
    ];
    state.treeNodes = items;
    if (field) field.options.options = items;
  }
};
</script>
