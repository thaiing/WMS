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
                <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="(node:any, resolve:any) => loadTreeNode(node, resolve)" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="tableId" @node-click="nodeClick">
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
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-detail-change="onDetailChange" @on-save-after="onSaveAfter">
            <!--自定义按钮插槽-->
            <template #footer-button-region="{ formData, details, eHook }">
              <el-button type="primary" @click="openImportTable()"> <i class="yrt-addplus mr-2"></i> 提取表结构 </el-button>
              <el-button type="primary" @click="createFile(formData, details)"> <i class="yrt-zhuanyi"></i> 生成实体 </el-button>
              <el-button type="primary" @click="handleSynchDb(formData)"><i class="yrt-shuaxin mr-5"></i> 重新同步表结构</el-button>
              <el-button type="success" @click="createBrotherNode(formData, details, eHook)"> <i class="yrt-tianjia mr-2"></i> 添加同级 </el-button>
              <el-button type="success" @click="createSonNode(formData, details, eHook)"> <i class="yrt-addplus mr-2"></i> 添加下级 </el-button>
              <el-button type="success" @click="copyNode(formData, details)"> <i class="yrt-fuzhi2 mr-2"></i> 复制 </el-button>
              <el-button type="success" @click="deleteNode(formData, details)"> <i class="yrt-shanchu1 mr-2"></i> 删除 </el-button>
            </template>
          </yrt-editor>
        </div>
      </template>
    </split-pane>

    <import-table ref="importRef" :on-import-save-after="onImportSaveAfter" @ok="handleQuery" />
  </div>
</template>

<script setup lang="ts" name="system-dev-gen">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import { postData, getData } from '/@/api/common/baseApi';
import { listTable, synchDb } from '/@/api/tool/gen';
import { TableQuery, TableVO } from '/@/api/tool/gen/types';
import { ElForm, DateModelType } from 'element-plus';

const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { to } from 'await-to-js';
import importTable from '/@/views/system/dev-tool/gen/importTable.vue';

const base = baseHook();
const { baseState, dataListRefName, editorRef, buttonClick, detailButtonClick, editorInfo, masterData } = base;
const importRef = ref(importTable);
const loading = ref(true);
const tableList = ref<TableVO[]>([]);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);

const queryParams = ref<TableQuery>({
  pageIndex: 1,
  pageSize: 10,
  tableName: '',
  tableComment: '',
  dataName: 'master',
});

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
    hasChild: 0,
    isLeaf: true,
    label: '',
    tableComment: '',
    tableId: 0,
    value: 0,
  },
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
    extendColumns: '',
  };
  let res = await postData(url, params);

  if (res.result) {
    if (node.level === 0) {
      res.data.push({
        tableId: -1,
        hasChild: 1,
        tableComment: '[未使用节点]',
      });
    }
    res.data.forEach((element: any) => {
      element.label = element['tableComment'];
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
  state.currentNode = data;
  if (editorRef) {
    editorRef.value.loadEditData(data.tableId);
  } else {
    proxy.$message.error('编辑器正在初始化');
  }
};

// 刷新tree
const treeRefresh = () => {
  state.filterText = '';
  let root = proxy.$refs.tree.store.root;
  while (root.childNodes.length) {
    proxy.$refs.tree.remove(root.childNodes[0]);
  }
  loadTreeNode(root, (data: any) => {
    root.doCreateChildren(data);
  });
};

// 保存后事件
const onSaveAfter = (master: any) => {
  let node = proxy.$refs.tree.getCurrentNode();
  if (node.tableId !== master.tableId) {
    let parentNode = proxy.$refs.tree.getNode(master.parentId);
    if (state.addLevel === 'son') {
      parentNode = proxy.$refs.tree.getNode(node.tableId);
    }
    proxy.$refs.tree.append(
      {
        hasChild: 0,
        isLeaf: true,
        tableId: master.tableId,
        sql: master.sql,
        tableComment: master.tableComment,
        label: master.tableComment,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(master.tableId);
    nodeClick(master);
  } else {
    node.tableComment = master.tableComment;
    node.label = master.tableComment;
  }
};

// 创建同级
const createBrotherNode = (formData: any, details: any, eHook: any) => {
  let parentId = formData.parentId;
  eHook.reset();
  formData.parentId = parentId;
  formData.tableId = 0;
  formData.addLevel = 'brother';
};

// 创建子级同级
const createSonNode = (formData: any, details: any, eHook: any) => {
  let tableId = formData.tableId;
  eHook.reset();
  formData.parentId = tableId;
  formData.tableId = 0;
  formData.addLevel = 'son';
};

// 删除节点
const deleteNode = async (formData: any, details: any) => {
  const _deleteNode = async () => {
    let url = '/tool/gen/deleteTreeNode';
    let params = {
      tableName: 'genTable',
      keyName: 'tableId',
      keyValue: formData.tableId,
      nodeName: 'tableName',
      parentName: 'parentId',
      extendColumns: '',
    };
    let res = await postData(url, params);
    proxy.common.showMsg(res);
    if (res.result) {
      let currentNode = proxy.$refs.tree.currentNode;
      let nextNode = getAfterNode(currentNode.parent.childNodes, currentNode);
      proxy.$refs.tree.remove(formData.tableId);
      if (nextNode) {
        proxy.$refs.tree.setCurrentKey(nextNode.data.tableId);
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
        tableId: dataInfo.tableId,
        sql: formData.sql,
        tableComment: dataInfo.tableComment,
        label: dataInfo.tableComment,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(dataInfo.tableId);
    nodeClick(dataInfo);
  });
};

// 生成实体
const createFile = async (formData: any, details: any) => {
  // 调用editor中的复制方法
  let url = '/tool/gen/createFile/' + formData.tableId;
  let params = {};
  const [err, res] = await to(getData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  proxy.common.showMsg(res);
};

/** 同步数据库操作 */
const handleSynchDb = async (row: any) => {
  const tableName = row.tableName;
  await proxy?.$modal.confirm('确认要强制同步"' + tableName + '"表结构吗？');
  await synchDb(row.tableId);
  proxy?.$modal.msgSuccess('同步成功');
  editorRef.value.loadEditData(row.tableId);
};

/** 打开导入表弹窗 */
const openImportTable = () => {
  importRef.value.show(masterData.value);
};

/** 查询表集合 */
const getList = async () => {
  loading.value = true;
  const res: any = await listTable(proxy?.addDateRange(queryParams.value, dateRange.value));
  tableList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
/** 搜索按钮操作 */
const handleQuery = () => {
  localStorage.setItem('dataName', queryParams.value.dataName);
  queryParams.value.pageIndex = 1;
  getList();
};

// 提取字段保存后事件
const onImportSaveAfter = async (dataList: Array<any>) => {
  let lastDataInfo: any = null;
  for (let dataInfo of dataList) {
    let findNode = proxy.$refs.tree.getNode(dataInfo.tableId);
    if (findNode) {
      nodeClick(dataInfo.tableId); // 选中
      return;
    }

    let parentNode = proxy.$refs.tree.getNode(dataInfo.parentId);
    proxy.$refs.tree.append(
      {
        hasChild: 0,
        isLeaf: true,
        tableId: dataInfo.tableId,
        value: dataInfo.tableId,
        tableComment: dataInfo.tableComment,
        label: dataInfo.tableComment,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(dataInfo.tableId);
    lastDataInfo = dataInfo;
  }
  if (lastDataInfo) {
    setTimeout(() => {
      nodeClick(lastDataInfo); // 选中最后一个节点
    }, 500);
  }
};

// 明细改变事件
const onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  if (field.prop === 'columnName') {
    if (!row.javaField) {
      row.javaType = 'String';
      row.columnType = 'varchar(50)';
      row.isPk = 0;
      row.isIncrement = 0;
      row.isRequired = 1;
      row.isInsert = 1;
      row.isEdit = 1;
      row.isList = 1;
      row.isQuery = 0;
      row.orderNum = 0;
    }
    row.javaField = proxy.common.toCamelCase(row.columnName);
  } else if (field.prop === 'columnType') {
    if (row.columnType.indexOf('decimal') >= 0) {
      row.javaType = 'BigDecimal';
    } else if (row.columnType.indexOf('tinyint') >= 0) {
      row.javaType = 'Byte';
    } else if (row.columnType.indexOf('varchar') >= 0) {
      row.javaType = 'String';
    } else if (['datetime'].indexOf(row.columnType) >= 0) {
      row.javaType = 'Date';
    } else if (['int', 'bigint'].indexOf(row.columnType) >= 0) {
      row.javaType = 'Long';
    } else if (row.columnType.indexOf('json') >= 0) {
      row.javaType = 'Map<String, Object>';
    }
  }
};
</script>

<style lang="scss" scoped>
.biz-container {
  margin: 0px;
}
</style>
