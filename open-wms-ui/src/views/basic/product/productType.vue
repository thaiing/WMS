<template>
  <div ref="container" class="biz-container">
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
                <el-tree ref="tree" :load="(node, resolve) => loadTreeNode(node, resolve)" :expand-on-click-node="false"
                  :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false"
                  node-key="treeKey" highlight-current lazy @node-click="nodeClick">
                  <template #default="{ node, data }">
                    <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)"
                      @mouseout="() => treeNodeOut(node, data)">
                      <span>
                        <i v-if="data.hasChild" class="el-icon-menu"></i>
                        <i v-else class="el-icon-tickets"></i>
                        {{ node.label }}
                      </span>
                      <span v-show="data.value == state.treeNodeOverId">
                        <el-button link size="small" @click.stop="() => treeNodeAppend(node, data)">
                          <i class="yrt-addplus"></i>
                        </el-button>
                        <el-button link size="small" @click.stop="() => treeNodeEdit(node, data)">
                          <i class="icon-edit"></i>
                        </el-button>
                        <el-button link size="small" @click.stop="() => treeNodeRemove(node, data)">
                          <i class="icon-shanchu5"></i>
                        </el-button>
                      </span>
                    </span>
                  </template>
                </el-tree>
                <el-button v-if="!state.hasDataTree" link @click="() => treeNodeAppend()">添加类别</el-button>
              </el-scrollbar>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!--右侧主区-->
      <template #paneR>
        <div class="biz-container">
          <transition name="slide-right" mode="out-in">
            <!--数据Table-->
            <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName"
              :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields"
              :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick"
              v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"
              :loadDataBefore="loadDataBefore">
              <template #common-column-slot="{ row, col }">
                <template v-if="col.prop == state.dataOptions.linkColumn">
                  <el-link type="primary" @click="base.linkEditor(row[state.dataOptions.idField], row)">
                    {{ common.formatData(row, col) }}
                  </el-link>
                </template>
                <!--自定义显示图片-->
                <template v-else-if="col.prop === 'images'">
                  <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)"
                    class="pic-small" fit="contain" preview-teleported
                    :preview-src-list="base.getPicList(row[col.prop])" />
                </template>
                <template v-else>
                  <!-- 通用标签颜色着色 -->
                  <template v-if="col.tagColorList && col.tagColorList.length && row[col.prop] !== undefined">
                    <el-tag :color="common.getTagBgColor(row, col, row[col.prop])"
                      :style="common.getTagColor(row, col, row[col.prop])">
                      {{ common.formatData(row, col) }}
                    </el-tag>
                  </template>
                  <template v-else>
                    {{ common.formatData(row, col) }}
                  </template>
                </template>
              </template>
            </yrt-data-list>
          </transition>

          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType"
            v-model:action="editorInfo.action" :data-list-ref="dataListRefName"
            v-model:config="state.editorOptions.config" :data-options="state.dataOptions"
            :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick"
            :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter"
            @on-change="base.onChange" @on-detail-change="base.onDetailChange"
            @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"
            @on-focus="onFocus"></yrt-editor>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script setup lang="ts" name="basic-product-productType">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { BaseProperties } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType, PageListBo, SearchField } from '/@/types/common';

const base = baseHook();
const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo, editorRef, dataListRef } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  filterText: '',
  hasDataTree: false,
  // 鼠标滑过的ID
  treeNodeOverId: 0,
  props: {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  },
  // 编辑级联是否加载完毕
  isTreeLoaded: false,
  // 所有类目树
  treeNodes: [] as any[],
  // 当前选中项
  currentNode: null as any,
});
//#endregion

onMounted(() => {
  setTimeout(() => {
    let field = base.editorRef.value.getFieldInfo('fullTypeId');
    cascaderLoadNode(null, 0, field);
    state.isTreeLoaded = true;
  }, 3000);
});

watch(
  () => state.filterText,
  (val) => {
    proxy.$refs.tree.filter(val);
  }
);

base.buttonClick = (authNode: string) => {
  switch (authNode) {
  }
};

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
    tableName: 'base_product_type',
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
      state.hasDataTree = true;
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
const nodeClick = (data: any, node: any, el: any) => {
  if (editorRef) {
    state.currentNode = proxy.$refs.tree.currentNode;
    dataListRef.value.loadData();

    // editorRef.value.loadEditData(data.menuId);
  } else {
    proxy.$message.error('编辑器正在初始化');
  }
};

// 加载前事件
const loadDataBefore = (pageParams: PageListBo, searchFields: Array<SearchField>) => {
  let currentNode = state.currentNode;
  if (currentNode) {
    pageParams.otherParams = {
      currentTypeId: currentNode.data.typeId,
    };
  } else {
    pageParams.otherParams = {
      currentTypeId: null,
    };
  }

  return true;
};

// 刷新tree
const treeRefresh = () => {
  state.currentNode = null;
  state.filterText = '';
  dataListRef.value.loadData(); // 重新加载数据

  var root = proxy.$refs.tree.store.root;
  while (root.childNodes.length) {
    proxy.$refs.tree.remove(root.childNodes[0]);
  }

  loadTreeNode(root, (data: any) => {
    root.doCreateChildren(data);
  });

  state.isTreeLoaded = false;
};
// 新建节点
const treeNodeAppend = (node?: any, data?: any) => {
  base.editorRef.value.addData();
};
// 编辑节点
const treeNodeEdit = (node: any, data: any) => {
  base.editorRef.value.loadEditData(data.typeId);
};
// 删除
const treeNodeRemove = (node: any, data: any) => {
  base.dataListRef.value.deleteData([data], () => {
    treeRefresh();
  });
};
const treeNodeOver = (node: any, data: any) => {
  state.treeNodeOverId = data.value;
};
const treeNodeOut = (node: any, data: any) => {
  state.treeNodeOverId = -1;
};
// 编辑获得焦点
const onFocus = (ref: any, val: any, event: any, field: any) => {
  if (!state.isTreeLoaded && field.options.prop === 'fullTypeId') {
    cascaderLoadNode(ref, 0, field);
    state.isTreeLoaded = true;
  }
};
// 编辑改变数据
base.onChange = (ref: any, val: any, field: any) => {
  debugger;
  if (field.options.prop === 'fullTypeId') {
    // 设置表单数据
    base.masterData.value.parentId = val[val.length - 1];
    let fullTypeName = [];
    let currentNodes = state.treeNodes;
    for (let id of val) {
      let currentNode = currentNodes.find((item) => item.value === id);
      fullTypeName.push(currentNode.label);
      currentNodes = currentNode.children;
    }
    base.masterData.value.fullTypeName = fullTypeName.join('/');
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

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNodeAll';
  let params = {
    tableName: 'base_product_type',
    keyName: 'typeId',
    nodeName: 'typeName',
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
  proxy.common.showMsg(res);
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
// 删除节点后刷新数据
const onDeleteAfter = () => {
  treeRefresh();
};
</script>

<style lang="scss" scoped>
.pic-small {
  height: 50px;
}

.el-button+.el-button {
  margin-left: 5px;
}
</style>
