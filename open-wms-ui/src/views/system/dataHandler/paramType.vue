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
                <div v-for="item in state.filterDataList" class="filter-box" :class="item.typeId === state.currentNode.typeId ? 'active' : ''" @click="nodeClick(item)">
                  <div class="filter-title">{{ item.typeName }}</div>
                  <div class="sub-path" v-html="item.parentNameAll"></div>
                </div>
                <el-result v-if="!state.filterDataList.length" icon="warning" title="没有查询到数据"></el-result>
              </template>
              <el-scrollbar v-else :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
                <!--数据tree-->
                <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="(node:any, resolve:any) => loadTreeNode(node, resolve)" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="typeId" @node-click="nodeClick">
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
          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-save-after="onSaveAfter">
            <!--自定义按钮插槽-->
            <template #footer-button-region="{ formData, details }">
              <el-button type="success" @click="createBrotherNode(formData, details)"> <i class="yrt-tianjia mr-2"></i> 添加同级 </el-button>
              <el-button type="success" @click="createSonNode(formData, details)"> <i class="yrt-addplus mr-2"></i> 添加下级 </el-button>
              <el-button type="success" @click="copyNode(formData, details)"> <i class="yrt-fuzhi2 mr-2"></i> 复制 </el-button>
              <el-button type="success" @click="deleteNode(formData, details)"> <i class="yrt-shanchu1 mr-2"></i> 删除 </el-button>
            </template>
          </yrt-editor>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script setup lang="ts" name="system-dataHandler-paramType">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, ResultInfo } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';

const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const base = baseHook();

const { baseState, dataListRefName, editorRef, buttonClick, detailButtonClick, editorInfo } = base;

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
  currentNode: {
    typeId: 0,
  },
  addLevel: 'brother',
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
      values: node.data.typeId,
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
    tableName: 'sysParamType',
    keyName: 'typeId',
    nodeName: 'typeName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let res = await postData(url, params);

  if (res.result) {
    if (node.level === 0) {
      res.data.push({
        typeId: -1,
        hasChild: 1,
        typeName: '[未使用节点]',
      });
    }
    res.data.forEach((element: any) => {
      element.label = element['typeName'];
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
const nodeClick = (data: any, node?: any, el?: any) => {
  if (editorRef) {
    state.currentNode = data;
    editorRef.value.loadEditData(data.typeId);
  } else {
    proxy.$message.error('编辑器正在初始化');
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
  let url = '/system/dataHandler/paramType/searchTree/' + encodeURI(state.filterText);
  let params = {};
  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    state.filterDataList = res.data;
  }
};

// 保存后事件
const onSaveAfter = (formData: any) => {
  let node = proxy.$refs.tree.getCurrentNode();
  if (node.typeId !== formData.typeId) {
    let parentNode = proxy.$refs.tree.getNode(node.parentId);
    if (state.addLevel === 'son') {
      parentNode = proxy.$refs.tree.getNode(node.typeId);
    } else {
      node.typeName = formData.typeName;
      node.label = formData.typeName;
    }
    proxy.$refs.tree.append(
      {
        hasChild: '0',
        isLeaf: true,
        typeId: formData.typeId,
        sql: formData.sql,
        typeName: formData.typeName,
        label: formData.typeName,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(formData.typeId);
    nodeClick(formData);
  } else {
    node.typeName = formData.typeName;
    node.label = formData.typeName;
  }
};

// 创建同级
const createBrotherNode = (formData: any, details: any) => {
  formData.typeId = 0;
  formData.typeName = null;
  formData.sql = null;
  state.addLevel = 'brother';
};

// 创建子级同级
const createSonNode = (formData: any, details: any) => {
  formData.parentId = formData.typeId;
  formData.typeId = 0;
  formData.typeName = null;
  state.addLevel = 'son';
};

// 删除节点
const deleteNode = async (formData: any, details: any) => {
  const _deleteNode = async () => {
    let url = '/system/dataHandler/paramType/deleteTreeNode';
    let params = {
      tableName: 'sysParamType',
      keyName: 'typeId',
      keyValue: formData.typeId,
      nodeName: 'typeName',
      parentName: 'parentId',
      extendColumns: '',
    };
    let res = await postData(url, params);
    proxy.common.showMsg(res);
    if (res.result) {
      let currentNode = proxy.$refs.tree.currentNode;
      let nextNode = getAfterNode(currentNode.parent.childNodes, currentNode);
      proxy.$refs.tree.remove(formData.typeId);
      if (nextNode) {
        proxy.$refs.tree.setCurrentKey(nextNode.data.typeId);
        nodeClick(nextNode.data);
      }
    }
  };
  proxy
    .$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await _deleteNode();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
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

// 复制节点
const copyNode = (formData: any, details: any) => {
  // 调用editor中的复制方法
  editorRef.value.copy((res: any) => {
    let node = proxy.$refs.tree.currentNode;
    let parentNode = node.parent;
    let dataInfo = res.data;
    proxy.$refs.tree.append(
      {
        hasChild: false,
        isLeaf: true,
        typeId: dataInfo.typeId,
        sql: formData.sql,
        typeName: dataInfo.typeName,
        label: dataInfo.typeName,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(dataInfo.typeId);
    nodeClick(dataInfo);
  });
};

// 字段值改变事件
const onChange = (ref: any, val: any, field: any, formData: any) => {
  if (field.options.prop === 'vueUrl' && val) {
    formData.vueFilePath = '@/views' + val;
    formData.vueName = val.replace(/\//gi, '-').replace(/^-/gi, '');
  }
};
</script>

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
