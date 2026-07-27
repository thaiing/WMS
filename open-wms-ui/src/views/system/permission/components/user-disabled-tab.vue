<template>
  <div ref="container" class="tab-container">
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
                <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="(node:any, resolve:any)=>loadTreeNode(node, resolve)" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="deptId" @node-click="nodeClick">
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
          <transition name="slide-right" mode="out-in">
            <!--数据Table-->
            <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :loadDataBefore="loadDataBefore"></yrt-data-list>
          </transition>

          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes"></yrt-editor>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script setup lang="ts" name="user-disabled-tab">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, ResultInfo } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType, PageListBo, SearchField } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import { BaseHookParams } from '/@/types/base-type';

const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 自定义页面参数
let baseParams: BaseHookParams = {
  custoJsonmRoute: '/system/permission/user',
};
const base = baseHook(baseParams);
const { baseState, dataListRefName, editorRefName, editorRef, dataListRef, buttonClick, detailButtonClick, editorInfo } = base;

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
    whereList.push({
      column: 'delFlag',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.BYTE,
    });
  } else {
    whereList.push({
      column: 'parentId',
      values: node.data.deptId,
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
    tableName: 'sysDept',
    keyName: 'deptId',
    nodeName: 'deptName',
    fixHasChild: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
  };
  let res = await postData(url, params);

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
  // 加载不可用条件
  pageParams.queryBoList.push({
    column: 'enable',
    dataType: DataType.BYTE,
    queryType: QueryType.EQ,
    values: 0,
  });

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
</script>

<style lang="scss" scoped>
.tab-container {
  position: relative;
  margin: 0px;
  min-height: calc(100vh - 165px);
  overflow-x: hidden;

  .left-container {
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
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }

    :deep(.tree.scrollbar-wrap) {
      max-height: calc(100vh - 138px);
      overflow-x: hidden;
      padding: 10px 10px 20px;

      .el-tree {
        margin-bottom: 10px;
      }
    }
  }

  .right-container {
    border-radius: 4px;
    min-height: 100%;
    background-color: white;
    padding: 0 10px;
  }
}
</style>
